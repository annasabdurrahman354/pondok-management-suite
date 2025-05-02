import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { getLPJById, getLPJItems, updateLPJStatus } from '@/services/lpj.service';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDateTime } from '@/utils/date-formatter';
import { formatCurrency } from '@/utils/currency-formatter';
import { CheckCircle2, XCircle, ArrowLeft, Pencil, AlertCircle, Loader2 } from 'lucide-react';

const revisionSchema = z.object({
  pesan_revisi: z
    .string()
    .min(10, { message: 'Pesan revisi minimal 10 karakter' })
});

type RevisionFormValues = z.infer<typeof revisionSchema>;

const LPJDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [lpj, setLPJ] = useState<any>(null);
  const [lpjItems, setLPJItems] = useState<any[]>([]);
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const revisionForm = useForm<RevisionFormValues>({
    resolver: zodResolver(revisionSchema),
    defaultValues: {
      pesan_revisi: ''
    }
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [lpjData, lpjItemsData] = await Promise.all([
          getLPJById(id),
          getLPJItems(id)
        ]);
        
        setLPJ(lpjData);
        setLPJItems(lpjItemsData);
      } catch (error) {
        console.error('Error loading LPJ data:', error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat data LPJ",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleRevision = async (values: RevisionFormValues) => {
    if (!id) return;
    
    try {
      setSubmitting(true);
      await updateLPJStatus(id, 'revisi', { pesan_revisi: values.pesan_revisi });
      
      toast({
        title: "Berhasil",
        description: "LPJ berhasil dikembalikan untuk revisi"
      });
      
      setShowRevisionDialog(false);
      
      // Refresh LPJ data
      const updatedLPJ = await getLPJById(id);
      setLPJ(updatedLPJ);
    } catch (error) {
      console.error('Error revising LPJ:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim revisi",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproval = async () => {
    if (!id) return;
    
    try {
      setSubmitting(true);
      await updateLPJStatus(id, 'diterima');
      
      toast({
        title: "Berhasil",
        description: "LPJ berhasil disetujui"
      });
      
      setShowApprovalDialog(false);
      
      // Refresh LPJ data
      const updatedLPJ = await getLPJById(id);
      setLPJ(updatedLPJ);
    } catch (error) {
      console.error('Error approving LPJ:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyetujui LPJ",
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

  if (!lpj) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h2 className="text-lg font-medium mt-2">LPJ tidak ditemukan</h2>
        <Button 
          variant="link" 
          onClick={() => navigate('/admin-pusat/lpj')}
          className="mt-2"
        >
          Kembali ke daftar LPJ
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
          onClick={() => navigate('/admin-pusat/lpj')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <StatusBadge status={lpj.status} />
      </div>
      
      <div>
        <h1 className="text-2xl font-bold">Detail LPJ: {lpj.pondok?.name}</h1>
        <p className="text-muted-foreground">
          Tanggal Pengajuan: {formatDateTime(lpj.submit_at)}
        </p>
      </div>

      {lpj.status === 'revisi' && lpj.pesan_revisi && (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-1">Catatan Revisi:</div>
            <p>{lpj.pesan_revisi}</p>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Ringkasan</TabsTrigger>
          <TabsTrigger value="details">Rincian</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan LPJ</CardTitle>
              <CardDescription>
                Informasi umum LPJ periode {lpj.periode_id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">Pondok</dt>
                    <dd className="text-base">{lpj.pondok?.name || '-'}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                    <dd><StatusBadge status={lpj.status} /></dd>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">Tanggal Pengajuan</dt>
                    <dd className="text-base">{formatDateTime(lpj.submit_at)}</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">Tanggal Persetujuan</dt>
                    <dd className="text-base">{lpj.accepted_at ? formatDateTime(lpj.accepted_at) : '-'}</dd>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-green-800">Saldo Awal</dt>
                    <dd className="text-xl font-bold text-green-800">{formatCurrency(lpj.saldo_awal)}</dd>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-blue-800">Total Pemasukan</dt>
                    <dd className="text-xl font-bold text-blue-800">{formatCurrency(lpj.total_pemasukan)}</dd>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-red-800">Total Pengeluaran</dt>
                    <dd className="text-xl font-bold text-red-800">{formatCurrency(lpj.total_pengeluaran)}</dd>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-purple-800">Sisa Saldo</dt>
                    <dd className="text-xl font-bold text-purple-800">{formatCurrency(lpj.sisa_saldo)}</dd>
                  </div>
                </div>

                {lpj.bukti_url && (
                  <div className="space-y-1 pt-2">
                    <dt className="text-sm font-medium text-muted-foreground">Dokumen Bukti</dt>
                    <dd className="text-base">
                      <a 
                        href={lpj.bukti_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Lihat dokumen
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
            {lpj.status === 'diajukan' && (
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRevisionDialog(true)}
                  disabled={submitting}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Minta Revisi
                </Button>
                <Button
                  onClick={() => setShowApprovalDialog(true)}
                  disabled={submitting}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Setujui LPJ
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Rincian LPJ</CardTitle>
              <CardDescription>
                Detail realisasi anggaran
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lpjItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Belum ada item yang ditambahkan</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead className="text-right">Anggaran</TableHead>
                        <TableHead className="text-right">Realisasi</TableHead>
                        <TableHead className="text-right">Selisih</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lpjItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.kategori}</TableCell>
                          <TableCell>{item.deskripsi}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.anggaran)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.realisasi)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.anggaran - item.realisasi)}
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

      {/* Revision Dialog */}
      <Dialog open={showRevisionDialog} onOpenChange={setShowRevisionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permintaan Revisi LPJ</DialogTitle>
            <DialogDescription>
              Tuliskan catatan revisi yang diperlukan
            </DialogDescription>
          </DialogHeader>
          
          <Form {...revisionForm}>
            <form onSubmit={revisionForm.handleSubmit(handleRevision)}>
              <FormField
                control={revisionForm.control}
                name="pesan_revisi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pesan Revisi</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Berikan catatan tentang apa yang perlu direvisi" 
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowRevisionDialog(false)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                  Kirim Revisi
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Persetujuan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menyetujui LPJ ini? Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel>
            <AlertDialogAction disabled={submitting} onClick={(e) => {
              e.preventDefault();
              handleApproval();
            }}>
              {submitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Ya, Setujui LPJ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LPJDetailPage;
