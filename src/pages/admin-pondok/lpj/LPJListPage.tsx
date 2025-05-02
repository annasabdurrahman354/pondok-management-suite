
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePeriode } from '@/contexts/PeriodeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getLPJByPondokAndPeriode } from '@/services/lpj.service';
import { Link } from 'react-router-dom';
import { formatDateTime } from '@/utils/date-formatter';
import { formatCurrency } from '@/utils/currency-formatter';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';

const LPJListPage = () => {
  const { user } = useAuth();
  const { currentPeriode, isLPJSubmissionTime, loading: periodeLoading } = usePeriode();
  const [loading, setLoading] = useState(true);
  const [lpj, setLPJ] = useState<any>(null);
  const [rabApproved, setRABApproved] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.pondok_id || !currentPeriode) return;
      
      try {
        setLoading(true);
        const data = await getLPJByPondokAndPeriode(user.pondok_id, currentPeriode.id);
        setLPJ(data);
        
        // Check if RAB is approved for this period
        const { getRABByPondokAndPeriode } = await import('@/services/rab.service');
        const rabData = await getRABByPondokAndPeriode(user.pondok_id, currentPeriode.id);
        setRABApproved(rabData?.status === 'diterima');
      } catch (error) {
        console.error('Error loading LPJ data:', error);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Laporan Pertanggung Jawaban</h1>
          <p className="text-muted-foreground">
            Periode: {currentPeriode.month}/{currentPeriode.year}
          </p>
        </div>

        {!lpj && isLPJSubmissionTime && rabApproved && (
          <Link to="/admin-pondok/lpj/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Buat LPJ
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status LPJ</CardTitle>
          <CardDescription>
            Informasi pengajuan LPJ periode ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!lpj ? (
            <div className="text-center py-8">
              {isLPJSubmissionTime ? (
                rabApproved ? (
                  <div className="space-y-4">
                    <p>Belum ada pengajuan LPJ untuk periode ini.</p>
                    <Link to="/admin-pondok/lpj/new">
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Buat LPJ
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    RAB untuk periode ini belum disetujui. LPJ hanya dapat dibuat setelah RAB disetujui.
                  </p>
                )
              ) : (
                <p className="text-muted-foreground">
                  Periode pengajuan LPJ tidak dalam rentang waktu yang diizinkan 
                  ({formatDateTime(currentPeriode.lpj_start)} - {formatDateTime(currentPeriode.lpj_end)}).
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    <TableCell><StatusBadge status={lpj.status} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tanggal Pengajuan</TableCell>
                    <TableCell>{lpj.submit_at ? formatDateTime(lpj.submit_at) : '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tanggal Persetujuan</TableCell>
                    <TableCell>{lpj.accepted_at ? formatDateTime(lpj.accepted_at) : '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Saldo Awal</TableCell>
                    <TableCell>{formatCurrency(lpj.saldo_awal)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Pemasukan</TableCell>
                    <TableCell>{formatCurrency(lpj.total_pemasukan)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Pengeluaran</TableCell>
                    <TableCell>{formatCurrency(lpj.total_pengeluaran)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sisa Saldo</TableCell>
                    <TableCell>{formatCurrency(lpj.sisa_saldo)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {lpj.status === 'revisi' && lpj.pesan_revisi && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <h4 className="font-medium mb-1">Catatan Revisi:</h4>
                  <p className="text-amber-800">{lpj.pesan_revisi}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Link to={`/admin-pondok/lpj/${lpj.id}`}>
                  <Button variant="outline">Lihat Detail</Button>
                </Link>
                
                {(lpj.status === 'revisi' && isLPJSubmissionTime) && (
                  <Link to={`/admin-pondok/lpj/${lpj.id}`}>
                    <Button>Edit LPJ</Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LPJListPage;
