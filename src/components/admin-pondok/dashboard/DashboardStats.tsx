
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/currency-formatter';
import { formatPeriodeId } from '@/utils/date-formatter';
import { formatDate } from '@/utils/date-formatter';
import { Periode } from '@/types/periode.types';

interface DashboardStatsProps {
  pondokName: string;
  currentPeriode: Periode | null;
  rabStatus: 'belum' | 'diajukan' | 'revisi' | 'diterima';
  lpjStatus: 'belum' | 'diajukan' | 'revisi' | 'diterima';
  rabAmount: number;
  lpjAmount: number;
}

export function DashboardStats({
  pondokName,
  currentPeriode,
  rabStatus,
  lpjStatus,
  rabAmount,
  lpjAmount
}: DashboardStatsProps) {
  // Status indicators
  const getStatusClass = (status: 'belum' | 'diajukan' | 'revisi' | 'diterima') => {
    switch (status) {
      case 'belum': return 'bg-gray-300';
      case 'diajukan': return 'bg-status-diajukan';
      case 'revisi': return 'bg-status-revisi';
      case 'diterima': return 'bg-status-diterima';
    }
  };

  const getStatusLabel = (status: 'belum' | 'diajukan' | 'revisi' | 'diterima') => {
    switch (status) {
      case 'belum': return 'Belum Diajukan';
      case 'diajukan': return 'Diajukan';
      case 'revisi': return 'Perlu Revisi';
      case 'diterima': return 'Diterima';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-2">Selamat Datang, {pondokName}</h2>
          <p className="text-muted-foreground">
            Periode Aktif: {currentPeriode ? formatPeriodeId(currentPeriode.id) : 'Tidak ada periode aktif'}
          </p>
        </CardContent>
      </Card>

      {currentPeriode && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Batas Waktu RAB
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mulai:</span>
                <span className="font-medium">{formatDate(currentPeriode.rab_start)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Berakhir:</span>
                <span className="font-medium">{formatDate(currentPeriode.rab_end)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Batas Waktu LPJ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mulai:</span>
                <span className="font-medium">{formatDate(currentPeriode.lpj_start)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Berakhir:</span>
                <span className="font-medium">{formatDate(currentPeriode.lpj_end)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Status RAB</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full ${getStatusClass(rabStatus)} mr-2`}></span>
              <span>{getStatusLabel(rabStatus)}</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(rabAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Status LPJ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full ${getStatusClass(lpjStatus)} mr-2`}></span>
              <span>{getStatusLabel(lpjStatus)}</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(lpjAmount)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
