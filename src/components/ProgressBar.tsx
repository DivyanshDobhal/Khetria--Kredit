import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  target: number;
  className?: string;
  showLabels?: boolean;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  target, 
  className = '', 
  showLabels = true,
  animated = true 
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  const isFullyFunded = percentage >= 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabels && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Funded: {formatCurrency(current)}
          </span>
          <span className="text-muted-foreground">
            Goal: {formatCurrency(target)}
          </span>
        </div>
      )}
      
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full transition-colors ${
            isFullyFunded 
              ? 'bg-gradient-success' 
              : 'bg-gradient-primary'
          }`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 1.2 : 0,
            ease: "easeOut",
            delay: animated ? 0.3 : 0
          }}
        />
        
        {/* Glow effect for active funding */}
        {!isFullyFunded && percentage > 0 && (
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary/20 rounded-full animate-pulse-glow"
            style={{ width: `${Math.min(percentage + 10, 100)}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          />
        )}
      </div>

      {showLabels && (
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${
            isFullyFunded ? 'text-success' : 'text-foreground'
          }`}>
            {percentage.toFixed(1)}% funded
          </span>
          
          {isFullyFunded && (
            <motion.span
              className="text-sm font-medium text-success flex items-center gap-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, type: "spring" }}
            >
              ✓ Fully Funded
            </motion.span>
          )}
        </div>
      )}
    </div>
  );
};