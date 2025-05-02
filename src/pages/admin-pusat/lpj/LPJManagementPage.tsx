
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePeriode } from '@/contexts/PeriodeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLPJsByPeriodeId } from '@/services/lpj.service';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDateTime } from '@/utils/date-formatter';
import { formatCurrency } from '@/utils/currency-formatter';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader2, Search, AlertCircle, Eye } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';

const LPJManagementPage = () => {
  const { currentPeriode, loading: periodeLoading } = usePeriode();
  const [loading, setLoading] = useState(true);
  const [lpjs, setLPJs] = useState<any[]>([]);
  const [filteredLPJs, setFilteredLPJs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadLPJs = async () => {
      if (!currentPeriode) return;
      
      try {
        setLoading(true);
        const data = await getLPJsByPeriodeId(currentPeriode.id);
        setLPJs(data);
        setFilteredLPJs(data);
      } catch (error) {
        console.error('Error loading LPJs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentPeriode) {
      loadLPJs();
    }
  }, [currentPeriode]);

  // Filter LPJs based on search query and active tab
  useEffect(() => {
    if (!lpjs.length) return;
    
    let filtered = lpjs;
    
    // Filter by search query (pondok name)
    if (searchQuery) {
      filtered = filtered.filter(lpj => 
        lpj.pondok?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(lpj => lpj.status === activeTab);
    }
    
    setFilteredLPJs(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchQuery, activeTab, lpjs]);

  // Pagination logic
  const totalPages = Math.ceil(filteredLPJs.length / itemsPerPage);
  const paginatedLPJs = filteredLPJs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        description="Aktifkan periode terlebih dahulu untuk mengelola LPJ."
        icon={AlertCircle}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manajemen LPJ</h1>
        <p className="text-muted-foreground">
          Periode: {currentPeriode.month}/{currentPeriode.year}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengajuan LPJ</CardTitle>
          <CardDescription>
            Kelola pengajuan LPJ dari semua pondok
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pondok..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="diajukan">Diajukan</TabsTrigger>
                <TabsTrigger value="diterima">Diterima</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filteredLPJs.length === 0 ? (
            <EmptyState 
              title="Tidak ada pengajuan LPJ"
              description={searchQuery ? "Coba ubah filter pencarian" : "Belum ada pengajuan LPJ untuk periode ini"}
              icon={AlertCircle}
            />
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pondok</TableHead>
                      <TableHead>Tanggal Pengajuan</TableHead>
                      <TableHead>Realisasi</TableHead>
                      <TableHead>Sisa Saldo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLPJs.map((lpj) => (
                      <TableRow key={lpj.id}>
                        <TableCell className="font-medium">{lpj.pondok?.name || '-'}</TableCell>
                        <TableCell>{formatDateTime(lpj.submit_at)}</TableCell>
                        <TableCell>{formatCurrency(lpj.total_pengeluaran)}</TableCell>
                        <TableCell>{formatCurrency(lpj.sisa_saldo)}</TableCell>
                        <TableCell><StatusBadge status={lpj.status} /></TableCell>
                        <TableCell>
                          <Link to={`/admin-pusat/lpj/${lpj.id}`}>
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
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                          disabled={currentPage === 1}
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
                                isActive={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })
                      }
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                          disabled={currentPage === totalPages}
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

export default LPJManagementPage;
