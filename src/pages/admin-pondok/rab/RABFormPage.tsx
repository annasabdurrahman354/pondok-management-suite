
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePeriode } from '@/contexts/PeriodeContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { getRABById, createRAB, updateRAB, getRABItems, createRABItem, updateRABItem, deleteRABItem } from '@/services/rab.service';
import { RAB, RABItem, RABFormData, RABItemFormData } from '@/types/rab.types';
import { formatCurrency } from '@/utils/currency-formatter';
import { EmptyState } from '@/components/common/EmptyState';

const RABFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPeriode, isRABSubmissionTime } = usePeriode();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rab, setRAB] = useState<RAB | null>(null);
  const [rabItems, setRABItems] = useState<RABItem[]>([]);
  const [formData, setFormData] = useState<RABFormData>({
    saldo_awal: 0,
    total_pemasukan: 0,
    total_pengeluaran: 0
  });
  const [itemFormData, setItemFormData] = useState<RABItemFormData>({
    kategori: '',
    deskripsi: '',
    jumlah: 0
  });
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Load RAB data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        if (id) {
          // Edit mode - load existing RAB
          const rabData = await getRABById(id);
          setRAB(rabData);
          
          if (rabData) {
            setFormData({
              saldo_awal: rabData.saldo_awal || 0,
              total_pemasukan: rabData.total_pemasukan || 0,
              total_pengeluaran: rabData.total_pengeluaran || 0,
              bukti_url: rabData.bukti_url
            });
            
            // Load RAB items
            const items = await getRABItems(id);
            setRABItems(items);
          }
        }
      } catch (error) {
        console.error('Error loading RAB data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Gagal memuat data RAB'
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'saldo_awal' || name === 'total_pemasukan' || name === 'total_pengeluaran'  
        ? parseFloat(value) || 0 
        : value 
    }));
  };

  // Handle item form input changes
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItemFormData(prev => ({ 
      ...prev, 
      [name]: name === 'jumlah' ? parseFloat(value) || 0 : value 
    }));
  };

  // Calculate total from items
  useEffect(() => {
    if (rabItems.length > 0) {
      const total = rabItems.reduce((sum, item) => sum + (item.jumlah || 0), 0);
      setFormData(prev => ({ ...prev, total_pengeluaran: total }));
    }
  }, [rabItems]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.pondok_id || !currentPeriode) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Data tidak lengkap'
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (id) {
        // Update existing RAB
        await updateRAB(id, formData);
        toast({
          title: 'Berhasil',
          description: 'RAB berhasil diperbarui'
        });
      } else {
        // Create new RAB
        const newRAB = await createRAB(user.pondok_id, currentPeriode.id, formData);
        if (newRAB) {
          toast({
            title: 'Berhasil',
            description: 'RAB berhasil dibuat'
          });
          
          // Redirect to the new RAB
          navigate(`/admin-pondok/rab/${newRAB.id}`);
        }
      }
    } catch (error) {
      console.error('Error saving RAB:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menyimpan RAB'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle item form submission
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id && !rab) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Silakan simpan RAB terlebih dahulu'
      });
      return;
    }
    
    try {
      const rabId = id || rab?.id;
      if (!rabId) return;
      
      if (editingItemId) {
        // Update existing item
        await updateRABItem(editingItemId, itemFormData);
        toast({
          title: 'Berhasil',
          description: 'Item berhasil diperbarui'
        });
      } else {
        // Create new item
        await createRABItem(rabId, itemFormData);
        toast({
          title: 'Berhasil',
          description: 'Item berhasil ditambahkan'
        });
      }
      
      // Reset and close dialog
      setItemFormData({ kategori: '', deskripsi: '', jumlah: 0 });
      setEditingItemId(null);
      setIsItemDialogOpen(false);
      
      // Refresh items
      const items = await getRABItems(rabId);
      setRABItems(items);
    } catch (error) {
      console.error('Error saving RAB item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menyimpan item RAB'
      });
    }
  };

  // Handle item edit
  const handleEditItem = (item: RABItem) => {
    setEditingItemId(item.id);
    setItemFormData({
      kategori: item.kategori,
      deskripsi: item.deskripsi,
      jumlah: item.jumlah
    });
    setIsItemDialogOpen(true);
  };

  // Handle item delete
  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Yakin ingin menghapus item ini?')) return;
    
    try {
      await deleteRABItem(itemId);
      toast({
        title: 'Berhasil',
        description: 'Item berhasil dihapus'
      });
      
      // Refresh items
      if (id || rab?.id) {
        const items = await getRABItems(id || rab?.id!);
        setRABItems(items);
      }
    } catch (error) {
      console.error('Error deleting RAB item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menghapus item RAB'
      });
    }
  };

  if (!currentPeriode || !isRABSubmissionTime) {
    return (
      <EmptyState 
        title="Periode pengajuan RAB tidak aktif"
        description={`Periode pengajuan RAB: ${currentPeriode?.rab_start} - ${currentPeriode?.rab_end}`}
        action={
          <Button variant="outline" onClick={() => navigate('/admin-pondok/rab')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        }
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-pondok" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{id ? 'Edit RAB' : 'Buat RAB Baru'}</h1>
          <p className="text-muted-foreground">
            Periode: {currentPeriode?.month}/{currentPeriode?.year}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin-pondok/rab')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* RAB Details */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi RAB</CardTitle>
              <CardDescription>
                Masukkan informasi RAB untuk periode ini
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="saldo_awal">Saldo Awal</Label>
                  <Input 
                    id="saldo_awal"
                    name="saldo_awal"
                    type="number"
                    value={formData.saldo_awal}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="total_pemasukan">Total Pemasukan</Label>
                  <Input 
                    id="total_pemasukan"
                    name="total_pemasukan"
                    type="number"
                    value={formData.total_pemasukan}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="total_pengeluaran">Total Pengeluaran</Label>
                  <Input 
                    id="total_pengeluaran"
                    name="total_pengeluaran"
                    type="number"
                    value={formData.total_pengeluaran}
                    disabled={rabItems.length > 0}
                    onChange={handleChange}
                    required
                  />
                  {rabItems.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Total dihitung otomatis dari item
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bukti_url">Bukti Dokumen (Link)</Label>
                <Input 
                  id="bukti_url"
                  name="bukti_url"
                  type="url"
                  placeholder="https://..."
                  value={formData.bukti_url || ''}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* RAB Items - shown only if RAB is created/loaded */}
          {(id || rab) && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Rincian Anggaran</CardTitle>
                    <CardDescription>
                      Daftar rincian anggaran RAB
                    </CardDescription>
                  </div>
                  <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingItemId(null);
                        setItemFormData({ kategori: '', deskripsi: '', jumlah: 0 });
                      }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleItemSubmit}>
                        <DialogHeader>
                          <DialogTitle>
                            {editingItemId ? 'Edit Item' : 'Tambah Item Baru'}
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="kategori">Kategori</Label>
                            <select
                              id="kategori"
                              name="kategori"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              value={itemFormData.kategori}
                              onChange={handleItemChange}
                              required
                            >
                              <option value="" disabled>Pilih kategori</option>
                              <option value="pemasukan">Pemasukan</option>
                              <option value="pengeluaran">Pengeluaran</option>
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea 
                              id="deskripsi"
                              name="deskripsi"
                              value={itemFormData.deskripsi}
                              onChange={handleItemChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="jumlah">Jumlah</Label>
                            <Input 
                              id="jumlah"
                              name="jumlah"
                              type="number"
                              value={itemFormData.jumlah}
                              onChange={handleItemChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button type="submit">
                            {editingItemId ? 'Simpan Perubahan' : 'Tambahkan'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {rabItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Belum ada item. Silakan tambahkan item baru.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rabItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="capitalize">{item.kategori}</TableCell>
                          <TableCell>{item.deskripsi}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.jumlah)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditItem(item)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Total Row */}
                      <TableRow className="font-medium">
                        <TableCell colSpan={2} className="text-right">Total</TableCell>
                        <TableCell className="text-right">{formatCurrency(formData.total_pengeluaran)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          <CardFooter className="flex justify-end px-0">
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {id ? 'Simpan Perubahan' : 'Buat RAB'}
            </Button>
          </CardFooter>
        </div>
      </form>
    </div>
  );
};

export default RABFormPage;
