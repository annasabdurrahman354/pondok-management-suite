
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { getPondokById, updatePondok } from '@/services/pondok.service';
import { Link } from 'react-router-dom';
import { Pondok, PondokFormData } from '@/types/pondok.types';

const BranchProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pondok, setPondok] = useState<Pondok | null>(null);
  const [formData, setFormData] = useState<PondokFormData>({
    name: '',
    address: '',
    phone: '',
    provinsi_id: null,
    kota_id: null,
    kecamatan_id: null,
    kelurahan_id: null,
    kode_pos: '',
    daerah_sambung_id: null
  });

  useEffect(() => {
    const loadPondok = async () => {
      if (!user?.pondok_id) return;
      
      try {
        setLoading(true);
        const data = await getPondokById(user.pondok_id);
        setPondok(data);
        
        if (data) {
          setFormData({
            name: data.name,
            address: data.address || '',
            phone: data.phone || '',
            provinsi_id: data.provinsi_id,
            kota_id: data.kota_id,
            kecamatan_id: data.kecamatan_id,
            kelurahan_id: data.kelurahan_id,
            kode_pos: data.kode_pos || '',
            daerah_sambung_id: data.daerah_sambung_id
          });
        }
      } catch (error) {
        console.error('Error loading pondok data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Gagal memuat data pondok'
        });
      } finally {
        setLoading(false);
      }
    };

    loadPondok();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.pondok_id || !pondok) return;
    
    try {
      setSubmitting(true);
      
      await updatePondok(user.pondok_id, formData);
      
      // Refresh pondok data
      const updatedPondok = await getPondokById(user.pondok_id);
      setPondok(updatedPondok);
      
      toast({
        title: 'Berhasil',
        description: 'Data pondok berhasil diperbarui',
      });
    } catch (error) {
      console.error('Error updating pondok data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memperbarui data pondok'
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil Pondok</h1>
        <p className="text-muted-foreground">
          Kelola informasi pondok Anda
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Informasi Pondok</CardTitle>
              <CardDescription>
                Perbarui informasi pondok Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Pondok</Label>
                <Input 
                  id="name"
                  name="name"
                  value={formData.name}
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

              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea 
                  id="address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kode_pos">Kode Pos</Label>
                <Input 
                  id="kode_pos"
                  name="kode_pos"
                  value={formData.kode_pos || ''}
                  onChange={handleChange}
                />
              </div>

              {/* You can add more fields for provinsi, kota, etc. */}
              
              {pondok && !pondok.accepted_at && (
                <div className="rounded-md bg-amber-50 p-4 border border-amber-100">
                  <p className="text-amber-800 text-sm">
                    Perubahan data pondok Anda menunggu persetujuan dari Admin Pusat.
                  </p>
                </div>
              )}
              
              {pondok && pondok.accepted_at && (
                <div className="rounded-md bg-green-50 p-4 border border-green-100 flex items-center gap-2">
                  <CheckCircle className="text-green-600 h-5 w-5" />
                  <p className="text-green-800 text-sm">
                    Data pondok Anda telah disetujui.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link to="/admin-pondok/profile/personnel">
                <Button type="button" variant="outline">
                  Kelola Pengurus
                </Button>
              </Link>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BranchProfilePage;
