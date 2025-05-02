
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/currency-formatter';

interface DashboardStatsProps {
  pondokCount: number;
  activePeriod: string;
  rabSubmitted: number;
  rabTotal: number;
  lpjSubmitted: number;
  lpjTotal: number;
  rabAmount: number;
  lpjAmount: number;
}

export function DashboardStats({ 
  pondokCount, 
  activePeriod,
  rabSubmitted,
  rabTotal,
  lpjSubmitted,
  lpjTotal,
  rabAmount,
  lpjAmount
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Periode Aktif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activePeriod}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total {pondokCount} pondok terdaftar
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            RAB Diajukan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rabSubmitted} / {rabTotal}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total {formatCurrency(rabAmount)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            LPJ Diajukan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lpjSubmitted} / {lpjTotal}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total {formatCurrency(lpjAmount)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Status Untuk Bulan Ini
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-sm">
            <span className="inline-block w-3 h-3 rounded-full bg-status-diajukan mr-2"></span>
            Diajukan: {rabSubmitted} RAB, {lpjSubmitted} LPJ
          </div>
          <div className="text-sm">
            <span className="inline-block w-3 h-3 rounded-full bg-status-revisi mr-2"></span>
            Perlu Revisi: 0 RAB, 0 LPJ
          </div>
          <div className="text-sm">
            <span className="inline-block w-3 h-3 rounded-full bg-status-diterima mr-2"></span>
            Diterima: 0 RAB, 0 LPJ
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
