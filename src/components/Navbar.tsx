import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, RefreshCw, User, Home, TrendingUp, Wallet, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (user) {
      navigate(user.role === 'BORROWER' ? '/dashboard' : '/marketplace');
    } else {
      navigate('/');
    }
  };

  const getNavItems = () => {
    if (!user) return [];
    
    if (user.role === 'BORROWER') {
      return [
        { label: t('navigation.dashboard'), path: '/dashboard', icon: Home },
        { label: t('navigation.marketplace'), path: '/marketplace', icon: TrendingUp },
        { label: 'Kshetra Wallet', path: '/wallet', icon: CreditCard },
      ];
    } else {
      return [
        { label: t('navigation.marketplace'), path: '/marketplace', icon: TrendingUp },
        { label: t('navigation.investments'), path: '/investments', icon: Wallet },
        { label: 'Kshetra Wallet', path: '/wallet', icon: CreditCard },
      ];
    }
  };

  return (
    <motion.nav 
      className="bg-card/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={handleLogoClick}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-foreground">Kshetra Kredit</span>
            </div>
          </motion.div>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex space-x-8">
              {getNavItems().map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Language Toggle */}
            <LanguageToggle />
            
            {user ? (
              <>
                {/* Role Badge */}
                <div className="hidden sm:block">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'BORROWER' 
                      ? 'bg-secondary/10 text-secondary' 
                      : 'bg-accent/10 text-accent'
                  }`}>
                    {user.role}
                  </span>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={switchRole}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Switch to {user.role === 'BORROWER' ? 'Lender' : 'Borrower'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('navigation.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">{t('navigation.login')}</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">{t('navigation.register')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};