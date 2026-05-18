import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/contexts/I18nContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CreditScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showTrend?: boolean;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export const CreditScoreBadge: React.FC<CreditScoreBadgeProps> = ({
  score,
  size = 'md',
  showTrend = false,
  trend = 'stable',
  className = ''
}) => {
  const { t } = useI18n();

  const getCreditRating = (score: number) => {
    if (score >= 750) return { label: t('dashboard.excellent'), color: 'bg-green-100 text-green-800 border-green-200' };
    if (score >= 700) return { label: t('dashboard.good'), color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (score >= 650) return { label: t('dashboard.fair'), color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { label: t('dashboard.poor'), color: 'bg-red-100 text-red-800 border-red-200' };
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-sm px-4 py-2';
      default:
        return 'text-xs px-3 py-1.5';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 ml-1" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 ml-1" />;
      default:
        return <Minus className="w-3 h-3 ml-1" />;
    }
  };

  const rating = getCreditRating(score);

  return (
    <Badge 
      className={`${rating.color} ${getSizeClasses()} font-medium border ${className}`}
      variant="outline"
    >
      <span className="flex items-center">
        {t('dashboard.creditScore')}: {score}
        {showTrend && getTrendIcon()}
      </span>
    </Badge>
  );
};
