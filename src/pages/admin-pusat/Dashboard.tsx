
import { useEffect, useState } from 'react';
import { DashboardStats } from '@/components/admin-pusat/dashboard/DashboardStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePeriode } from '@/contexts/PeriodeContext';
import { formatPeriodeId } from '@/utils/date-formatter';
import { getAllPondok } from '@/services/pondok.service';
import { getRABsByPeriodeId } from '@/services/rab.service';
import { getLPJsByPeriodeId } from '@/services/lpj.service';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FilePenLine, FileText } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';

export default function Dashboard() {
  const { currentPeriode } = usePeriode();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pondokCount: 0,
    rabSubmitted: 0,
    rabTotal: 0,
    lpjSubmitted: 0,
    lpjTotal: 0,
    rabAmount: 0,
    lpjAmount: 0
  });
  const [recentRAB, setRecentRAB] = useState<any[]>([]);
  const [recentLPJ, setRecentLPJ] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        if (currentPeriode) {
          const [pondoks, rabs, lpjs] = await Promise.all([
            getAllPondok(),
            getRABsByPeriodeId(currentPeriode.id),
            getLPJsByPeriodeId(currentPeriode.id)
          ]);

          setStats({
            pondokCount: pondoks.length,
            rabSubmitted: rabs.length,
            rabTotal: pondoks.length,
            lpjSubmitted: lpjs.length,
            lpjTotal: pondoks.length,
            rabAmount: rabs.reduce((sum, rab) => sum + (rab.total_pemasukan || 0), 0),
            lpjAmount: lpjs.reduce((sum, lpj) => sum + (lpj.total_pemasukan || 0), 0)
          });

          // Get 5 most recent RAB submissions
          setRecentRAB(
            rabs
              .sort((a, b) => new Date(b.submit_at || '').getTime() - new Date(a.submit_at || '').getTime())
              .slice(0, 5)
          );

          // Get 5 most recent LPJ submissions
          setRecentLPJ(
            lpjs
              .sort((a, b) => new Date(b.submit_at || '').getTime() - new Date(a.submit_at || '').getTime())
              .slice(0, 5)
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPeriode]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin Pusat</h1>
      
      <DashboardStats 
        pondokCount={stats.pondokCount}
        activePeriod={currentPeriode ? formatPeriodeId(currentPeriode.id) : 'Tidak ada periode aktif'}
        rabSubmitted={stats.rabSubmitted}
        rabTotal={stats.rabTotal}
        lpjSubmitted={stats.lpjSubmitted}
        lpjTotal={stats.lpjTotal}
        rabAmount={stats.rabAmount}
        lpjAmount={stats.lpjAmount}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              RAB Terbaru
            </CardTitle>
            <CardDescription>
              {currentPeriode ? formatPeriodeId(currentPeriode.id) : 'Tidak ada periode aktif'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentRAB.length > 0 ? (
              <div className="space-y-4">
                {recentRAB.map((rab) => (
                  <div key={rab.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{rab.pondok.name}</p>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          rab.status === 'diajukan' ? 'bg-status-diajukan' : 
                          rab.status === 'revisi' ? 'bg-status-revisi' : 'bg-status-diterima'
                        }`}></div>
                        <p className="text-sm text-muted-foreground">
                          {rab.status === 'diajukan' ? 'Diajukan' : 
                          rab.status === 'revisi' ? 'Perlu Revisi' : 'Diterima'}
                        </p>
                      </div>
                    </div>
                    <Link to={`/admin-pusat/rab/${rab.id}`}>
                      <Button size="sm" variant="outline">
                        <FilePenLine className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Belum Ada RAB"
                description="Belum ada pengajuan RAB pada periode ini"
                icon={<FileText className="h-12 w-12 text-muted-foreground" />}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FilePenLine className="h-5 w-5 mr-2" />
              LPJ Terbaru
            </CardTitle>
            <CardDescription>
              {currentPeriode ? formatPeriodeId(currentPeriode.id) : 'Tidak ada periode aktif'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentLPJ.length > 0 ? (
              <div className="space-y-4">
                {recentLPJ.map((lpj) => (
                  <div key={lpj.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{lpj.pondok.name}</p>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          lpj.status === 'diajukan' ? 'bg-status-diajukan' : 
                          lpj.status === 'revisi' ? 'bg-status-revisi' : 'bg-status-diterima'
                        }`}></div>
                        <p className="text-sm text-muted-foreground">
                          {lpj.status === 'diajukan' ? 'Diajukan' : 
                          lpj.status === 'revisi' ? 'Perlu Revisi' : 'Diterima'}
                        </p>
                      </div>
                    </div>
                    <Link to={`/admin-pusat/lpj/${lpj.id}`}>
                      <Button size="sm" variant="outline">
                        <FilePenLine className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Belum Ada LPJ"
                description="Belum ada pengajuan LPJ pada periode ini"
                icon={<FilePenLine className="h-12 w-12 text-muted-foreground" />}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
