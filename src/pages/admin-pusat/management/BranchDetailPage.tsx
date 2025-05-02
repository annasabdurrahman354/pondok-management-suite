
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getPondokById, approvePondokSync } from '@/services/pondok.service';
import { getPengurusByPondokId, createPengurus, updatePengurus, deletePengurus } from '@/services/pengurus.service';
import { formatDateTime } from '@/utils/date-formatter';
import { 
  ArrowLeft, CheckCircle2, XCircle, Loader2, AlertCircle, Users, Plus, Edit, Trash2
} from 'lucide-react';
import { JabatanLabels, JabatanType } from '@/types/pengurus.types';

const pengurusSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  phone: z.string().nullable().optional(),
  jabatan: z.string().min(1, "Jabatan harus dipilih") as z.ZodType<JabatanType>
});

type PengurusFormValues = z.infer<typeof pengurusSchema>;

const BranchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [pondok, setPondok] = useState<any>(null);
  const [pengurusList, setPengurusList] = useState<any[]>([]);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPengurusDialog, setShowPengurusDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentPengurus, setCurrentPengurus] = useState<any | null>(null);

  const pengurusForm = useForm<PengurusFormValues>({
    resolver: zodResolver(pengurusSchema),
    defaultValues: {
      name: '',
      phone: '',
      jabatan: 'ketua_pondok' as JabatanType
    }
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [pondokData, pengurusData] = await Promise.all([
          getPondokById(id),
          getPengurusByPondokId(id)
        ]);
        
        setPondok(pondokData);
        setPengurusList(pengurusData);
      } catch (error) {
        console.error('Error loading pondok data:', error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat data pondok",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleApproval = async () => {
    if (!id) return;
    
    try {
      setSubmitting(true);
      await approvePondokSync(id);
      
      toast({
        title: "Berhasil",
        description: "Data pondok berhasil disetujui"
      });
      
      setShowApprovalDialog(false);
      
      // Refresh pondok data
      const updatedPondok = await getPondokById(id);
      setPondok(updatedPondok);
    } catch (error) {
      console.error('Error approving pondok:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyetujui data pondok",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenPengurusDialog = (pengurus?: any) => {
    if (pengurus) {
      // Edit mode
      pengurusForm.reset({
        name: pengurus.name,
        phone: pengurus.phone || '',
        jabatan: pengurus.jabatan
      });
      setCurrentPengurus(pengurus);
    } else {
      // Add mode
      pengurusForm.reset({
        name: '',
        phone: '',
        jabatan: 'ketua_pondok'
      });
      setCurrentPengurus(null);
    }
    setShowPengurusDialog(true);
  };

  const handleDeletePengurus = async () => {
    if (!currentPengurus) return;
    
    try {
      setSubmitting(true);
      await deletePengurus(currentPengurus.id);
      
      toast({
        title: "Berhasil",
        description: "Pengurus berhasil dihapus"
      });
      
      setShowDeleteDialog(false);
      setPengurusList(pengurusList.filter(p => p.id !== currentPengurus.id));
      setCurrentPengurus(null);
    } catch (error) {
      console.error('Error deleting pengurus:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus pengurus",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitPengurus = async (values: PengurusFormValues) => {
    if (!id) return;
    
    try {
      setSubmitting(true);
      
      if (currentPengurus) {
        // Update existing pengurus
        const updated = await updatePengurus(currentPengurus.id, values);
        setPengurusList(pengurusList.map(p => 
          p.id === currentPengurus.id ? updated : p
        ));
        toast({
          title: "Berhasil",
          description: "Data pengurus berhasil diperbarui"
        });
      } else {
        // Create new pengurus
        const newPengurus = await createPengurus(id, values);
        setPengurusList([...pengurusList, newPengurus]);
        toast({
          title: "Berhasil",
          description: "Pengurus baru berhasil ditambahkan"
        });
      }
      
      setShowPengurusDialog(false);
      setCurrentPengurus(null);
    } catch (error) {
      console.error('Error saving pengurus:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data pengurus",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-pondok" />
      </div>
    );
  }

  if (!pondok) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h2 className="text-lg font-medium mt-2">Pondok tidak ditemukan</h2>
        <Button 
          variant="link" 
          onClick={() => navigate('/admin-pusat/management/pondok')}
          className="mt-2"
        >
          Kembali ke daftar pondok
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/admin-pusat/management/pondok')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali
        </Button>
        <Separator orientation="vertical" className="h-6" />
        {pondok.accepted_at ? (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Terverifikasi
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-amber-50 text-amber-700">
            Menunggu Verifikasi
          </Badge>
        )}
      </div>
      
      <div>
        <h1 className="text-2xl font-bold">{pondok.name}</h1>
        <p className="text-muted-foreground">
          Update terakhir: {formatDateTime(pondok.updated_at)}
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="personnel">Personil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil Pondok</CardTitle>
              <CardDescription>
                Informasi detail tentang pondok
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">Nama Pondok</dt>
                    <dd className="text-base">{pondok.name}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">No. Telepon</dt>
                    <dd className="text-base">{pondok.phone || '-'}</dd>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">Alamat</dt>
                  <dd className="text-base">{pondok.address || '-'}</dd>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">Kode Pos</dt>
                    <dd className="text-base">{pondok.kode_pos || '-'}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">Status Verifikasi</dt>
                    <dd className="text-base">
                      {pondok.accepted_at ? (
                        <span className="text-green-600">Terverifikasi pada {formatDateTime(pondok.accepted_at)}</span>
                      ) : (
                        <span className="text-amber-600">Menunggu verifikasi</span>
                      )}
                    </dd>
                  </div>
                </div>
              </dl>
            </CardContent>
            {!pondok.accepted_at && (
              <CardFooter className="flex justify-end">
                <Button
                  onClick={() => setShowApprovalDialog(true)}
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verifikasi Data
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="personnel">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personil Pondok</CardTitle>
                <CardDescription>
                  Daftar pengurus di pondok ini
                </CardDescription>
              </div>
              <Button onClick={() => handleOpenPengurusDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pengurus
              </Button>
            </CardHeader>
            <CardContent>
              {pengurusList.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-muted-foreground">Belum ada pengurus yang terdaftar</p>
                    <Button 
                      variant="outline" 
                      onClick={() => handleOpenPengurusDialog()} 
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Pengurus Pertama
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Jabatan</TableHead>
                        <TableHead>No. Telepon</TableHead>
                        <TableHead className="w-[100px]">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pengurusList.map((pengurus) => (
                        <TableRow key={pengurus.id}>
                          <TableCell className="font-medium">{pengurus.name}</TableCell>
                          <TableCell>{JabatanLabels[pengurus.jabatan as JabatanType]}</TableCell>
                          <TableCell>{pengurus.phone || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleOpenPengurusDialog(pengurus)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setCurrentPengurus(pengurus);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Verifikasi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin memverifikasi data pondok ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel>
            <AlertDialogAction disabled={submitting} onClick={(e) => {
              e.preventDefault();
              handleApproval();
            }}>
              {submitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Ya, Verifikasi Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pengurus Form Dialog */}
      <Dialog open={showPengurusDialog} onOpenChange={setShowPengurusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentPengurus ? 'Edit Pengurus' : 'Tambah Pengurus'}</DialogTitle>
            <DialogDescription>
              {currentPengurus 
                ? 'Edit data pengurus yang sudah ada' 
                : 'Tambahkan pengurus baru untuk pondok ini'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...pengurusForm}>
            <form onSubmit={pengurusForm.handleSubmit(onSubmitPengurus)} className="space-y-4">
              <FormField
                control={pengurusForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={pengurusForm.control}
                name="jabatan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jabatan</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        {Object.entries(JabatanLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={pengurusForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nomor telepon (opsional)" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowPengurusDialog(false)}
                  disabled={submitting}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                  {currentPengurus ? 'Perbarui' : 'Tambah'} Pengurus
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Pengurus Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengurus ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-700"
              disabled={submitting} 
              onClick={(e) => {
                e.preventDefault();
                handleDeletePengurus();
              }}
            >
              {submitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Ya, Hapus Pengurus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BranchDetailPage;
