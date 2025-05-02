import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { getAllPondok } from '@/services/pondok.service';
import { formatDateTime } from '@/utils/date-formatter';
import { Loader2, Search, Plus, Eye, AlertCircle } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pondok } from '@/types/pondok.types';

const BranchManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState<Pondok[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Pondok[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadBranches = async () => {
      try {
        setLoading(true);
        const data = await getAllPondok();
        setBranches(data);
        setFilteredBranches(data);
      } catch (error) {
        console.error('Error loading branches:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data pondok",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadBranches();
  }, []);

  // Filter branches based on search query
  useEffect(() => {
    if (!branches.length) return;
    
    if (searchQuery) {
      const filtered = branches.filter(branch => 
        branch.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBranches(filtered);
    } else {
      setFilteredBranches(branches);
    }
    
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchQuery, branches]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const paginatedBranches = filteredBranches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <h1 className="text-2xl font-bold">Manajemen Pondok</h1>
        <Link to="/admin-pusat/management/pondok/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pondok
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pondok</CardTitle>
          <CardDescription>
            Kelola data pondok dan pengurus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pondok..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredBranches.length === 0 ? (
            <EmptyState 
              title="Tidak ada pondok"
              description={searchQuery ? "Coba ubah filter pencarian" : "Belum ada data pondok yang terdaftar"}
              icon={AlertCircle}
            />
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Pondok</TableHead>
                      <TableHead>No. Telepon</TableHead>
                      <TableHead>Update Terakhir</TableHead>
                      <TableHead>Status Sinkronisasi</TableHead>
                      <TableHead className="w-[100px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBranches.map((branch) => (
                      <TableRow key={branch.id}>
                        <TableCell className="font-medium">{branch.name}</TableCell>
                        <TableCell>{branch.phone || '-'}</TableCell>
                        <TableCell>{formatDateTime(branch.updated_at)}</TableCell>
                        <TableCell>
                          {branch.accepted_at ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                              Terverifikasi
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                              Menunggu Verifikasi
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Link to={`/admin-pusat/management/pondok/${branch.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" /> Detail
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              setCurrentPage(p => Math.max(1, p - 1));
                            }
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => 
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, i, arr) => {
                          // Add ellipsis
                          if (i > 0 && page > arr[i-1] + 1) {
                            return (
                              <PaginationItem key={`ellipsis-${page}`}>
                                <span className="px-4 py-2">...</span>
                              </PaginationItem>
                            );
                          }
                          
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(page);
                                }}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })
                      }
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                              setCurrentPage(p => Math.min(totalPages, p + 1));
                            }
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchManagementPage;
