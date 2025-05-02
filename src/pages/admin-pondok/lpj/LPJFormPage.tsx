
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePeriode } from '@/contexts/PeriodeContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { AlertCircle, Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  createLPJ, updateLPJ, getLPJById, getLPJItems, createLPJItem, updateLPJItem, deleteLPJItem 
} from '@/services/lpj.service';
import { getRABByPondokAndPeriode } from '@/services/rab.service';
import { formatCurrency } from '@/utils/currency-formatter';

const formSchema = z.object({
  saldo_awal: z.number().min(0),
  total_pemasukan: z.number().min(0),
  total_pengeluaran: z.number().min(0),
  sisa_saldo: z.number(),
  bukti_url: z.string().optional()
});

const itemFormSchema = z.object({
  kategori: z.string().min(1, "Kategori harus diisi"),
  deskripsi: z.string().min(3, "Deskripsi terlalu pendek"),
  anggaran: z.number().min(0, "Anggaran harus minimal 0"),
  realisasi: z.number().min(0, "Realisasi harus minimal 0")
});

type FormValues = z.infer<typeof formSchema>;
type ItemFormValues = z.infer<typeof itemFormSchema>;

const LPJFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentPeriode, isLPJSubmissionTime } = usePeriode();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any | null>(null);
  const [rabData, setRabData] = useState<any | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      saldo_awal: 0,
      total_pemasukan: 0,
      total_pengeluaran: 0,
      sisa_saldo: 0,
      bukti_url: ''
    }
  });

  const itemForm = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      kategori: '',
      deskripsi: '',
      anggaran: 0,
      realisasi: 0
    }
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user?.pondok_id || !currentPeriode) return;
      
      try {
        setLoading(true);

        // Load RAB data first to get initial values
        const rab = await getRABByPondokAndPeriode(user.pondok_id, currentPeriode.id);
        setRabData(rab);

        if (isEditing && id) {
          // If editing, load LPJ data
          const lpjData = await getLPJById(id);
          
          if (lpjData) {
            form.reset({
              saldo_awal: lpjData.saldo_awal,
              total_pemasukan: lpjData.total_pemasukan,
              total_pengeluaran: lpjData.total_pengeluaran,
              sisa_saldo: lpjData.sisa_saldo,
              bukti_url: lpjData.bukti_url || ''
            });
            
            // Load LPJ items
            const lpjItems = await getLPJItems(id);
            setItems(lpjItems);
          }
        } else if (rab) {
          // For new LPJ, use RAB values as defaults
          form.reset({
            saldo_awal: rab.saldo_awal,
            total_pemasukan: rab.total_pemasukan,
            total_pengeluaran: rab.total_pengeluaran,
            sisa_saldo: 0,
            bukti_url: ''
          });
        }
      } catch (error) {
        console.error('Error loading form data:', error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, currentPeriode, id, form, isEditing]);

  // Calculate sisa_saldo whenever related fields change
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === 'saldo_awal' || name === 'total_pemasukan' || name === 'total_pengeluaran') {
        const saldoAwal = values.saldo_awal || 0;
        const pemasukan = values.total_pemasukan || 0;
        const pengeluaran = values.total_pengeluaran || 0;
        
        const sisaSaldo = saldoAwal + pemasukan - pengeluaran;
        form.setValue('sisa_saldo', sisaSaldo);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    if (!user?.pondok_id || !currentPeriode) {
      toast({
        title: "Error",
        description: "Data pondok atau periode tidak ditemukan",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // Ensure all required fields exist
      const formData = {
        saldo_awal: values.saldo_awal,
        total_pemasukan: values.total_pemasukan,
        total_pengeluaran: values.total_pengeluaran,
        sisa_saldo: values.sisa_saldo,
        bukti_url: values.bukti_url || ''
      };
      
      if (isEditing && id) {
        await updateLPJ(id, formData);
        toast({
          title: "Berhasil",
          description: "LPJ berhasil diperbarui"
        });
      } else {
        const result = await createLPJ(user.pondok_id, currentPeriode.id, formData);
        if (result) {
          toast({
            title: "Berhasil",
            description: "LPJ berhasil dibuat"
          });
          navigate(`/admin-pondok/lpj/${result.id}`);
        }
      }
    } catch (error) {
      console.error('Error saving LPJ:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan LPJ",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async (values: ItemFormValues) => {
    if (!id) {
      toast({
        title: "Error",
        description: "LPJ harus disimpan terlebih dahulu sebelum menambahkan item",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Ensure all required fields exist
      const itemData = {
        kategori: values.kategori,
        deskripsi: values.deskripsi,
        anggaran: values.anggaran,
        realisasi: values.realisasi
      };
      
      if (currentItem) {
        // Update existing item
        await updateLPJItem(currentItem.id, itemData);
        setItems(items.map(item => 
          item.id === currentItem.id ? { ...item, ...itemData } : item
        ));
        toast({ title: "Item berhasil diperbarui" });
      } else {
        // Add new item
        const newItem = await createLPJItem(id, itemData);
        if (newItem) {
          setItems([...items, newItem]);
          toast({ title: "Item berhasil ditambahkan" });
        }
      }
      
      setIsItemDialogOpen(false);
      itemForm.reset();
      setCurrentItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan item",
        variant: "destructive"
      });
    }
  };

  const handleEditItem = (item: any) => {
    itemForm.reset({
      kategori: item.kategori,
      deskripsi: item.deskripsi,
      anggaran: item.anggaran,
      realisasi: item.realisasi
    });
    setCurrentItem(item);
    setIsItemDialogOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('Yakin ingin menghapus item ini?')) return;
    
    try {
      await deleteLPJItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
      toast({ title: "Item berhasil dihapus" });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus item",
        variant: "destructive"
      });
    }
  };

  const openNewItemDialog = () => {
    itemForm.reset({
      kategori: '',
      deskripsi: '',
      anggaran: 0,
      realisasi: 0
    });
    setCurrentItem(null);
    setIsItemDialogOpen(true);
  };

  if (loading) {
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

  if (!isLPJSubmissionTime && !isEditing) {
    return (
      <EmptyState 
        title="Periode pengajuan LPJ tidak aktif"
        description={`Periode pengajuan LPJ: ${currentPeriode.lpj_start} - ${currentPeriode.lpj_end}`}
        actionLabel="Kembali"
        onAction={() => navigate('/admin-pondok/lpj')}
        icon={AlertCircle}
      />
    );
  }

  if (!rabData || rabData.status !== 'diterima') {
    return (
      <EmptyState 
        title="RAB belum disetujui"
        description="RAB harus disetujui terlebih dahulu sebelum dapat membuat LPJ"
        actionLabel="Kembali"
        onAction={() => navigate('/admin-pondok/rab')}
        icon={AlertCircle}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit LPJ' : 'Buat LPJ Baru'}</h1>
        <p className="text-muted-foreground">
          Periode: {currentPeriode.month}/{currentPeriode.year}
        </p>
      </div>

      <Tabs defaultValue="form">
        <TabsList>
          <TabsTrigger value="form">Formulir LPJ</TabsTrigger>
          {isEditing && <TabsTrigger value="items">Detail LPJ</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Formulir LPJ</CardTitle>
              <CardDescription>
                Isi detail LPJ untuk periode ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="saldo_awal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Saldo Awal</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              disabled={true} // Locked to RAB value
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="total_pemasukan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Pemasukan</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="total_pengeluaran"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Pengeluaran</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sisa_saldo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sisa Saldo</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              disabled
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bukti_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link Dokumen Bukti</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            placeholder="URL dokumen bukti (opsional)" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Simpan LPJ
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="items">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Detail LPJ</CardTitle>
                <CardDescription>
                  Rincian item pengeluaran dan realisasi anggaran
                </CardDescription>
              </div>
              <Button onClick={openNewItemDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Item
              </Button>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Belum ada item yang ditambahkan</p>
                  <Button className="mt-4" variant="outline" onClick={openNewItemDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Item Pertama
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead className="text-right">Anggaran</TableHead>
                      <TableHead className="text-right">Realisasi</TableHead>
                      <TableHead className="text-right">Selisih</TableHead>
                      <TableHead className="w-[100px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.kategori}</TableCell>
                        <TableCell>{item.deskripsi}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.anggaran)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.realisasi)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.anggaran - item.realisasi)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
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
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentItem ? 'Edit Item' : 'Tambah Item LPJ'}</DialogTitle>
          </DialogHeader>
          
          <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(handleAddItem)} className="space-y-4">
              <FormField
                control={itemForm.control}
                name="kategori"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Kategori" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={itemForm.control}
                name="deskripsi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Deskripsi item" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={itemForm.control}
                  name="anggaran"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anggaran</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={itemForm.control}
                  name="realisasi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Realisasi</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="submit">
                  {currentItem ? 'Update Item' : 'Tambah Item'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LPJFormPage;
