
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePeriode } from '@/contexts/PeriodeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDateTime } from '@/utils/date-formatter';
import { formatCurrency } from '@/utils/currency-formatter';
import { getPondokById } from '@/services/pondok.service';
import { getRABByPondokAndPeriode } from '@/services/rab.service';
import { getLPJByPondokAndPeriode } from '@/services/lpj.service';
import { Link } from 'react-router-dom';
import { Pondok } from '@/types/pondok.types';
import { RAB } from '@/types/rab.types';
import { LPJ } from '@/types/lpj.types';
import { EmptyState } from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/StatusBadge';

const AdminPondokDashboard = () => {
  const { user } = useAuth();
  const { currentPeriode, isRABSubmissionTime, isLPJSubmissionTime, loading: periodeLoading } = usePeriode();
  const [pondok, setPondok] = useState<Pondok | null>(null);
  const [rab, setRAB] = useState<RAB | null>(null);
  const [lpj, setLPJ] = useState<LPJ | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.pondok_id || !currentPeriode) return;
      
      setLoading(true);
      try {
        const [pondokData, rabData, lpjData] = await Promise.all([
          getPondokById(user.pondok_id),
          getRABByPondokAndPeriode(user.pondok_id, currentPeriode.id),
          getLPJByPondokAndPeriode(user.pondok_id, currentPeriode.id)
        ]);
        
        setPondok(pondokData);
        setRAB(rabData);
        setLPJ(lpjData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.pondok_id && currentPeriode) {
      loadData();
    }
  }, [user, currentPeriode]);

  if (periodeLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-pondok" />
      </div>
    );
  }

  if (!currentPeriode) {
    return (
      <EmptyState 
        title="Tidak ada periode aktif"
        description="Hubungi Admin Pusat untuk informasi lebih lanjut."
        icon={AlertCircle}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold">Selamat Datang{pondok ? `, ${pondok.name}` : ''}</h1>
        <p className="text-muted-foreground">
          Periode aktif: {currentPeriode.month}/{currentPeriode.year}
        </p>
      </div>

      {/* RAB & LPJ Status */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* RAB Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>RAB Status</CardTitle>
            <CardDescription>
              Periode: {currentPeriode.month}/{currentPeriode.year}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rab ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <StatusBadge status={rab.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Tanggal Pengajuan:</span>
                  <span>{rab.submit_at ? formatDateTime(rab.submit_at) : '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Anggaran:</span>
                  <span className="font-medium">{formatCurrency(rab.total_pengeluaran)}</span>
                </div>
                
                <div className="pt-2">
                  <Link to={`/admin-pondok/rab/${rab.id}`}>
                    <Button variant="outline" className="w-full">Lihat Detail</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p>Belum ada pengajuan RAB untuk periode ini.</p>
                {isRABSubmissionTime ? (
                  <Link to="/admin-pondok/rab/new">
                    <Button className="w-full">Buat RAB</Button>
                  </Link>
                ) : (
                  <Alert variant="default">
                    <AlertDescription>
                      Pengajuan RAB tidak dalam periode yang diizinkan.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* LPJ Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>LPJ Status</CardTitle>
            <CardDescription>
              Periode: {currentPeriode.month}/{currentPeriode.year}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lpj ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <StatusBadge status={lpj.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Tanggal Pengajuan:</span>
                  <span>{lpj.submit_at ? formatDateTime(lpj.submit_at) : '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Realisasi:</span>
                  <span className="font-medium">{formatCurrency(lpj.total_pengeluaran)}</span>
                </div>
                
                <div className="pt-2">
                  <Link to={`/admin-pondok/lpj/${lpj.id}`}>
                    <Button variant="outline" className="w-full">Lihat Detail</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p>Belum ada pengajuan LPJ untuk periode ini.</p>
                {isLPJSubmissionTime ? (
                  rab && rab.status === 'diterima' ? (
                    <Link to="/admin-pondok/lpj/new">
                      <Button className="w-full">Buat LPJ</Button>
                    </Link>
                  ) : (
                    <Alert variant="default">
                      <AlertDescription>
                        RAB harus disetujui sebelum dapat mengajukan LPJ.
                      </AlertDescription>
                    </Alert>
                  )
                ) : (
                  <Alert variant="default">
                    <AlertDescription>
                      Pengajuan LPJ tidak dalam periode yang diizinkan.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Keuangan</CardTitle>
          <CardDescription>Periode: {currentPeriode.month}/{currentPeriode.year}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-800">Saldo Awal</p>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(rab?.saldo_awal || 0)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Pemasukan</p>
              <p className="text-2xl font-bold text-blue-800">{formatCurrency(rab?.total_pemasukan || 0)}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-red-800">Pengeluaran</p>
              <p className="text-2xl font-bold text-red-800">{formatCurrency(lpj?.total_pengeluaran || rab?.total_pengeluaran || 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPondokDashboard;
