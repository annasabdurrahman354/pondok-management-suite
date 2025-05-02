
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getPengurusByPondokId, createPengurus, updatePengurus, deletePengurus } from '@/services/pengurus.service';
import { Link } from 'react-router-dom';
import { Pengurus, PengurusFormData, JabatanType, JabatanLabels } from '@/types/pengurus.types';

const defaultValues = {
  name: '',
  phone: '',
  jabatan: 'ketua_pondok' as JabatanType
};

const BranchPersonnelPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [personnel, setPersonnel] = useState<Pengurus[]>([]);
  const [formData, setFormData] = useState<PengurusFormData>(defaultValues);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadPersonnel = async () => {
    if (!user?.pondok_id) return;
    
    try {
      setLoading(true);
      const data = await getPengurusByPondokId(user.pondok_id);
      setPersonnel(data);
    } catch (error) {
      console.error('Error loading personnel data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat data pengurus'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersonnel();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.pondok_id) return;
    
    try {
      setSubmitting(true);
      
      if (editingId) {
        await updatePengurus(editingId, formData);
        toast({
          title: 'Berhasil',
          description: 'Data pengurus berhasil diperbarui',
        });
      } else {
        await createPengurus(user.pondok_id, formData);
        toast({
          title: 'Berhasil',
          description: 'Pengurus baru berhasil ditambahkan',
        });
      }
      
      // Reset and close the dialog
      setFormData(defaultValues);
      setEditingId(null);
      setIsDialogOpen(false);
      
      // Refresh personnel data
      await loadPersonnel();
    } catch (error) {
      console.error('Error saving personnel data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menyimpan data pengurus'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (pengurus: Pengurus) => {
    setEditingId(pengurus.id);
    setFormData({
      name: pengurus.name,
      phone: pengurus.phone || '',
      jabatan: pengurus.jabatan
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus pengurus ini?')) return;
    
    try {
      await deletePengurus(id);
      toast({
        title: 'Berhasil',
        description: 'Pengurus berhasil dihapus',
      });
      
      // Refresh personnel data
      await loadPersonnel();
    } catch (error) {
      console.error('Error deleting personnel:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal menghapus pengurus'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Kelola Pengurus</h1>
          <p className="text-muted-foreground">
            Tambah, edit, dan hapus data pengurus pondok
          </p>
        </div>
        <Link to="/admin-pondok/profile">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Daftar Pengurus</CardTitle>
              <CardDescription>
                Pengurus yang aktif di pondok
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingId(null);
                  setFormData(defaultValues);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Pengurus
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingId ? 'Edit Pengurus' : 'Tambah Pengurus Baru'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingId 
                        ? 'Edit data pengurus pondok.' 
                        : 'Tambahkan data pengurus baru ke pondok.'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jabatan">Jabatan</Label>
                      <Input 
                        id="jabatan"
                        name="jabatan"
                        value={formData.jabatan}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone || ''}
                        onChange={handleChange}
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
          ) : personnel.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Belum ada data pengurus. Silakan tambahkan pengurus baru.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>No. Telepon</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personnel.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">{person.name}</TableCell>
                    <TableCell>{person.jabatan}</TableCell>
                    <TableCell>{person.phone || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(person)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(person.id)}
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
    </div>
  );
};

export default BranchPersonnelPage;
