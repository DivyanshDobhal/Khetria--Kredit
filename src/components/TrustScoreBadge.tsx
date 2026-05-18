import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrustScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const TrustScoreBadge: React.FC<TrustScoreBadgeProps> = ({ 
  score, 
  size = 'md', 
  showIcon = true 
}) => {
  const getTrustLevel = (score: number) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  const getTrustLabel = (score: number) => {
    const level = getTrustLevel(score);
    return {
      high: 'High Trust',
      medium: 'Medium Trust',
      low: 'Low Trust'
    }[level];
  };

  const getTrustIcon = (score: number) => {
    const level = getTrustLevel(score);
    const iconProps = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    }[size];

    return {
      high: <ShieldCheck className={iconProps} />,
      medium: <Shield className={iconProps} />,
      low: <ShieldAlert className={iconProps} />
    }[level];
  };

  const getTrustColor = (score: number) => {
    const level = getTrustLevel(score);
    return {
      high: 'trust-high',
      medium: 'trust-medium',
      low: 'trust-low'
    }[level];
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Badge 
        className={`${getTrustColor(score)} ${sizeClasses[size]} font-medium flex items-center gap-1.5 border-0`}
      >
        {showIcon && getTrustIcon(score)}
        <span>{getTrustLabel(score)}</span>
        <span className="opacity-90">({score})</span>
      </Badge>
    </motion.div>
  );
};