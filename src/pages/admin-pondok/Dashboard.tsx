
import { useEffect, useState } from 'react';
import { DashboardStats } from '@/components/admin-pondok/dashboard/DashboardStats';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, FileClock, AlertCircle, CheckCircle } from 'lucide-react';
import { usePeriode } from '@/contexts/PeriodeContext';
import { useAuth } from '@/contexts/AuthContext';
import { getPondokById } from '@/services/pondok.service';
import { getRABByPondokAndPeriode } from '@/services/rab.service';
import { getLPJByPondokAndPeriode } from '@/services/lpj.service';
import { StatusType } from '@/types/rab.types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Dashboard() {
  const { currentPeriode, isRABSubmissionTime, isLPJSubmissionTime } = usePeriode();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pondokName, setPondokName] = useState('');
  const [rabStatus, setRabStatus] = useState<'belum' | StatusType>('belum');
  const [lpjStatus, setLpjStatus] = useState<'belum' | StatusType>('belum');
  const [rabAmount, setRabAmount] = useState(0);
  const [lpjAmount, setLpjAmount] = useState(0);
  const [isDataCompleted, setIsDataCompleted] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.pondok_id || !currentPeriode) {
        setLoading(false);
        return;
      }

      try {
        const [pondok, rab, lpj] = await Promise.all([
          getPondokById(user.pondok_id),
          getRABByPondokAndPeriode(user.pondok_id, currentPeriode.id),
          getLPJByPondokAndPeriode(user.pondok_id, currentPeriode.id)
        ]);

        if (pondok) {
          setPondokName(pondok.name);
          
          // Check if data is complete
          setIsDataCompleted(
            pondok.accepted_at !== null && 
            !!pondok.provinsi_id && 
            !!pondok.kota_id && 
            !!pondok.address
          );
        }

        if (rab) {
          setRabStatus(rab.status);
          setRabAmount(rab.total_pemasukan);
        }

        if (lpj) {
          setLpjStatus(lpj.status);
          setLpjAmount(lpj.total_pemasukan);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, currentPeriode]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Pondok</h1>
      
      {!isDataCompleted && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Pondok Belum Lengkap</AlertTitle>
          <AlertDescription>
            Silakan lengkapi data pondok Anda terlebih dahulu.
            <Link to="/admin-pondok/account/pondok-sync">
              <Button variant="link" className="p-0 h-auto ml-2">
                Lengkapi Data
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}
      
      <DashboardStats 
        pondokName={pondokName}
        currentPeriode={currentPeriode}
        rabStatus={rabStatus}
        lpjStatus={lpjStatus}
        rabAmount={rabAmount}
        lpjAmount={lpjAmount}
      />
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-pondok mr-2" />
            <h2 className="text-xl font-semibold">Rencana Anggaran Biaya</h2>
          </div>
          
          {rabStatus === 'belum' ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Anda belum mengajukan RAB untuk periode ini.
              </p>
              <Link to="/admin-pondok/rab/create">
                <Button disabled={!isRABSubmissionTime || !isDataCompleted}>
                  Buat RAB
                </Button>
              </Link>
              {!isRABSubmissionTime && (
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Periode pengajuan RAB belum dimulai atau sudah selesai.
                </div>
              )}
            </div>
          ) : rabStatus === 'revisi' ? (
            <div className="space-y-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-status-revisi shrink-0 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">RAB Perlu Direvisi</p>
                  <p className="text-muted-foreground text-sm">
                    RAB Anda perlu direvisi. Silakan periksa detail RAB.
                  </p>
                </div>
              </div>
              <Link to="/admin-pondok/rab">
                <Button>Lihat Detail</Button>
              </Link>
            </div>
          ) : rabStatus === 'diterima' ? (
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-status-diterima shrink-0 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">RAB Diterima</p>
                  <p className="text-muted-foreground text-sm">
                    RAB Anda untuk periode ini telah disetujui.
                  </p>
                </div>
              </div>
              <Link to="/admin-pondok/rab">
                <Button variant="outline">Lihat Detail</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-status-diajukan shrink-0 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">RAB Sedang Diajukan</p>
                  <p className="text-muted-foreground text-sm">
                    RAB Anda sedang dalam proses review.
                  </p>
                </div>
              </div>
              <Link to="/admin-pondok/rab">
                <Button variant="outline">Lihat Detail</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <div className="flex items-center mb-4">
            <FileClock className="h-6 w-6 text-pondok mr-2" />
            <h2 className="text-xl font-semibold">Laporan Pertanggungjawaban</h2>
          </div>
          
          {lpjStatus === 'belum' ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Anda belum mengajukan LPJ untuk periode ini.
              </p>
              <Link to="/admin-pondok/lpj/create">
                <Button 
                  disabled={!isLPJSubmissionTime || !isDataCompleted || rabStatus !== 'diterima'}
                >
                  Buat LPJ
                </Button>
              </Link>
              {!isLPJSubmissionTime && (
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Periode pengajuan LPJ belum dimulai atau sudah selesai.
                </div>
              )}
              {rabStatus !== 'diterima' && (
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  RAB harus disetujui terlebih dahulu sebelum membuat LPJ.
                </div>
              )}
            </div>
          ) : lpjStatus === 'revisi' ? (
            <div className="space-y-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-status-revisi shrink-0 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">LPJ Perlu Direvisi</p>
                  <p className="text-muted-foreground text-sm">
                    LPJ Anda perlu direvisi. Silakan periksa detail LPJ.
                  </p>
                </div>
              </div>
              <Link to="/admin-pondok/lpj">
                <Button>Lihat Detail</Button>
              </Link>
            </div>
          ) : lpjStatus === 'diterima' ? (
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-status-diterima shrink-0 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">LPJ Diterima</p>
                  <p className="text-muted-foreground text-sm">
                    LPJ Anda untuk periode ini telah disetujui.
                  </p>
                </div>
              </div>
              <Link to="/admin-pondok/lpj">
                <Button variant="outline">Lihat Detail</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-status-diajukan shrink-0 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium">LPJ Sedang Diajukan</p>
                  <p className="text-muted-foreground text-sm">
                    LPJ Anda sedang dalam proses review.
                  </p>
                </div>
              </div>
              <Link to="/admin-pondok/lpj">
                <Button variant="outline">Lihat Detail</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
