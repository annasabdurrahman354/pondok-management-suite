
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePeriode } from '@/contexts/PeriodeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getRABByPondokAndPeriode } from '@/services/rab.service';
import { Link } from 'react-router-dom';
import { formatDateTime } from '@/utils/date-formatter';
import { formatCurrency } from '@/utils/currency-formatter';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';

const RABListPage = () => {
  const { user } = useAuth();
  const { currentPeriode, isRABSubmissionTime, loading: periodeLoading } = usePeriode();
  const [loading, setLoading] = useState(true);
  const [rab, setRAB] = useState<any>(null);

  useEffect(() => {
    const loadRAB = async () => {
      if (!user?.pondok_id || !currentPeriode) return;
      
      try {
        setLoading(true);
        const data = await getRABByPondokAndPeriode(user.pondok_id, currentPeriode.id);
        setRAB(data);
      } catch (error) {
        console.error('Error loading RAB data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.pondok_id && currentPeriode) {
      loadRAB();
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
          <h1 className="text-2xl font-bold">Rencana Anggaran Belanja</h1>
          <p className="text-muted-foreground">
            Periode: {currentPeriode.month}/{currentPeriode.year}
          </p>
        </div>

        {!rab && isRABSubmissionTime && (
          <Link to="/admin-pondok/rab/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Buat RAB
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status RAB</CardTitle>
          <CardDescription>
            Informasi pengajuan RAB periode ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!rab ? (
            <div className="text-center py-8">
              {isRABSubmissionTime ? (
                <div className="space-y-4">
                  <p>Belum ada pengajuan RAB untuk periode ini.</p>
                  <Link to="/admin-pondok/rab/new">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Buat RAB
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Periode pengajuan RAB tidak dalam rentang waktu yang diizinkan 
                  ({formatDateTime(currentPeriode.rab_start)} - {formatDateTime(currentPeriode.rab_end)}).
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    <TableCell><StatusBadge status={rab.status} /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tanggal Pengajuan</TableCell>
                    <TableCell>{rab.submit_at ? formatDateTime(rab.submit_at) : '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tanggal Persetujuan</TableCell>
                    <TableCell>{rab.accepted_at ? formatDateTime(rab.accepted_at) : '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Saldo Awal</TableCell>
                    <TableCell>{formatCurrency(rab.saldo_awal)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Pemasukan</TableCell>
                    <TableCell>{formatCurrency(rab.total_pemasukan)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Pengeluaran</TableCell>
                    <TableCell>{formatCurrency(rab.total_pengeluaran)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {rab.status === 'revisi' && rab.pesan_revisi && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <h4 className="font-medium mb-1">Catatan Revisi:</h4>
                  <p className="text-amber-800">{rab.pesan_revisi}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Link to={`/admin-pondok/rab/${rab.id}`}>
                  <Button variant="outline">Lihat Detail</Button>
                </Link>
                
                {(rab.status === 'revisi' && isRABSubmissionTime) && (
                  <Link to={`/admin-pondok/rab/${rab.id}`}>
                    <Button>Edit RAB</Button>
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

export default RABListPage;
