
import { useEffect, useState } from 'react';
import { usePeriode } from '@/contexts/PeriodeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/currency-formatter';
import { Link } from 'react-router-dom';
import { getRABsByPeriodeId } from '@/services/rab.service';
import { getLPJsByPeriodeId } from '@/services/lpj.service';
import { RAB } from '@/types/rab.types';
import { LPJ } from '@/types/lpj.types';
import { EmptyState } from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminPusatDashboard = () => {
  const { currentPeriode, loading: periodeLoading } = usePeriode();
  const [rabs, setRABs] = useState<RAB[]>([]);
  const [lpjs, setLPJs] = useState<LPJ[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rab');

  useEffect(() => {
    const loadData = async () => {
      if (!currentPeriode) return;
      
      setLoading(true);
      try {
        const [rabsData, lpjsData] = await Promise.all([
          getRABsByPeriodeId(currentPeriode.id),
          getLPJsByPeriodeId(currentPeriode.id)
        ]);
        
        setRABs(rabsData);
        setLPJs(lpjsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentPeriode) {
      loadData();
    }
  }, [currentPeriode]);

  // Calculate statistics
  const getRABStats = () => {
    if (!rabs.length) return { diajukan: 0, revisi: 0, diterima: 0, total: 0 };
    
    return {
      diajukan: rabs.filter(r => r.status === 'diajukan').length,
      revisi: rabs.filter(r => r.status === 'revisi').length,
      diterima: rabs.filter(r => r.status === 'diterima').length,
      total: rabs.reduce((sum, rab) => sum + (rab.total_pengeluaran || 0), 0)
    };
  };
  
  const getLPJStats = () => {
    if (!lpjs.length) return { diajukan: 0, revisi: 0, diterima: 0, total: 0 };
    
    return {
      diajukan: lpjs.filter(l => l.status === 'diajukan').length,
      revisi: lpjs.filter(l => l.status === 'revisi').length,
      diterima: lpjs.filter(l => l.status === 'diterima').length,
      total: lpjs.reduce((sum, lpj) => sum + (lpj.total_pengeluaran || 0), 0)
    };
  };

  const rabStats = getRABStats();
  const lpjStats = getLPJStats();

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
        description="Silahkan buat periode baru terlebih dahulu."
        icon={AlertCircle}
        action={
          <Link to="/admin-pusat/management/periode">
            <Button>Kelola Periode</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard Admin Pusat</h1>
        <p className="text-muted-foreground">
          Periode aktif: {currentPeriode.month}/{currentPeriode.year}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total RAB Diajukan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rabStats.diajukan}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total RAB Diterima</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rabStats.diterima}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total LPJ Diajukan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lpjStats.diajukan}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total LPJ Diterima</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lpjStats.diterima}</div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total RAB</CardTitle>
            <CardDescription>Periode: {currentPeriode.month}/{currentPeriode.year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(rabStats.total)}</div>
            <div className="mt-4">
              <Link to="/admin-pusat/rab">
                <Button variant="outline">Kelola RAB</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Realisasi (LPJ)</CardTitle>
            <CardDescription>Periode: {currentPeriode.month}/{currentPeriode.year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(lpjStats.total)}</div>
            <div className="mt-4">
              <Link to="/admin-pusat/lpj">
                <Button variant="outline">Kelola LPJ</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Pengajuan Terbaru</CardTitle>
          <CardDescription>Daftar pengajuan RAB dan LPJ terbaru</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rab">RAB</TabsTrigger>
              <TabsTrigger value="lpj">LPJ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rab" className="mt-4">
              {rabs.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Belum ada pengajuan RAB</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pondok</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rabs.slice(0, 5).map((rab) => (
                      <TableRow key={rab.id}>
                        <TableCell>{rab.pondok?.name || '-'}</TableCell>
                        <TableCell><StatusBadge status={rab.status} /></TableCell>
                        <TableCell>{formatCurrency(rab.total_pengeluaran)}</TableCell>
                        <TableCell className="text-right">
                          <Link to={`/admin-pusat/rab/${rab.id}`}>
                            <Button variant="outline" size="sm">Detail</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              <div className="mt-4 text-center">
                <Link to="/admin-pusat/rab">
                  <Button variant="link">Lihat Semua</Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="lpj" className="mt-4">
              {lpjs.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Belum ada pengajuan LPJ</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pondok</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lpjs.slice(0, 5).map((lpj) => (
                      <TableRow key={lpj.id}>
                        <TableCell>{lpj.pondok?.name || '-'}</TableCell>
                        <TableCell><StatusBadge status={lpj.status} /></TableCell>
                        <TableCell>{formatCurrency(lpj.total_pengeluaran)}</TableCell>
                        <TableCell className="text-right">
                          <Link to={`/admin-pusat/lpj/${lpj.id}`}>
                            <Button variant="outline" size="sm">Detail</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              <div className="mt-4 text-center">
                <Link to="/admin-pusat/lpj">
                  <Button variant="link">Lihat Semua</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPusatDashboard;
