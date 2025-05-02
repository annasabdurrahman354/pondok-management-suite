
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePeriode } from '@/contexts/PeriodeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Periode, PeriodeFormData } from '@/types/periode.types';
import { getAllPeriodes, createPeriode, updatePeriode } from '@/services/periode.service';
import { formatDate } from '@/utils/date-formatter';

const MONTHS = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' }
];

const getMonthName = (month: number): string => {
  return MONTHS.find(m => m.value === month)?.label || '';
};

const defaultFormData: PeriodeFormData = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  rab_start: '',
  rab_end: '',
  lpj_start: '',
  lpj_end: ''
};

const PeriodManagementPage = () => {
  const { toast } = useToast();
  const { refreshPeriode } = usePeriode();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [periods, setPeriods] = useState<Periode[]>([]);
  const [formData, setFormData] = useState<PeriodeFormData>(defaultFormData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      const data = await getAllPeriodes();
      setPeriods(data);
    } catch (error) {
      console.error('Error loading periods:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat data periode'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeriods();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'year' || name === 'month' ? parseInt(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (editingId) {
        await updatePeriode(editingId, formData);
        toast({
          title: 'Berhasil',
          description: 'Periode berhasil diperbarui',
        });
      } else {
        await createPeriode(formData);
        toast({
          title: 'Berhasil',
          description: 'Periode baru berhasil dibuat',
        });
      }
      
      // Reset and close dialog
      setFormData(defaultFormData);
      setEditingId(null);
      setIsDialogOpen(false);
      
      // Refresh periods
      await loadPeriods();
      // Refresh current period context
      await refreshPeriode();
    } catch (error) {
      console.error('Error saving period:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menyimpan periode'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (periode: Periode) => {
    setEditingId(periode.id);
    setFormData({
      year: periode.year,
      month: periode.month,
      rab_start: periode.rab_start,
      rab_end: periode.rab_end,
      lpj_start: periode.lpj_start,
      lpj_end: periode.lpj_end
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Periode</h1>
          <p className="text-muted-foreground">
            Kelola periode RAB dan LPJ
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Daftar Periode</CardTitle>
              <CardDescription>
                Semua periode RAB dan LPJ
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingId(null);
                  setFormData(defaultFormData);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Periode
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? 'Edit Periode' : 'Tambah Periode Baru'}
                    </DialogTitle>
                    <DialogDescription>
                      Atur tanggal pengajuan RAB dan LPJ untuk periode ini.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="month">Bulan</Label>
                        <select
                          id="month"
                          name="month"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={formData.month}
                          onChange={handleChange}
                          required
                        >
                          {MONTHS.map(month => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="year">Tahun</Label>
                        <Input 
                          id="year"
                          name="year"
                          type="number"
                          min="2000"
                          max="2100"
                          value={formData.year}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rab_start">Tanggal Mulai Pengajuan RAB</Label>
                      <Input 
                        id="rab_start"
                        name="rab_start"
                        type="date"
                        value={formData.rab_start}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rab_end">Tanggal Selesai Pengajuan RAB</Label>
                      <Input 
                        id="rab_end"
                        name="rab_end"
                        type="date"
                        value={formData.rab_end}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lpj_start">Tanggal Mulai Pengajuan LPJ</Label>
                      <Input 
                        id="lpj_start"
                        name="lpj_start"
                        type="date"
                        value={formData.lpj_start}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lpj_end">Tanggal Selesai Pengajuan LPJ</Label>
                      <Input 
                        id="lpj_end"
                        name="lpj_end"
                        type="date"
                        value={formData.lpj_end}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" disabled={submitting}>
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingId ? 'Simpan Perubahan' : 'Tambahkan'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : periods.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Belum ada data periode. Silakan tambahkan periode baru.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Periode</TableHead>
                  <TableHead>RAB</TableHead>
                  <TableHead>LPJ</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periods.map((period) => (
                  <TableRow key={period.id}>
                    <TableCell className="font-medium">
                      {getMonthName(period.month)} {period.year}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Mulai:</div>
                        <div>{formatDate(period.rab_start)}</div>
                        <div className="text-xs text-muted-foreground mt-2">Selesai:</div>
                        <div>{formatDate(period.rab_end)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Mulai:</div>
                        <div>{formatDate(period.lpj_start)}</div>
                        <div className="text-xs text-muted-foreground mt-2">Selesai:</div>
                        <div>{formatDate(period.lpj_end)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(period)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PeriodManagementPage;
