import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';

const Footer: React.FC = () => {
  const { language } = useI18n();
  
  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t border-border/50 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} P2P Micro-Lending Platform
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/terms-and-conditions" className="text-muted-foreground hover:text-foreground transition-colors">
              {language === 'hi' ? 'नियम और शर्तें' : 'Terms & Conditions'}
            </Link>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              {language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              {language === 'hi' ? 'सहायता' : 'Help'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;