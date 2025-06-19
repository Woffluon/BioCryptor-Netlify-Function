import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSelector from './LanguageSelector';

const Navigation = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-venice-stone/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-playfair text-2xl italic text-venice-dark hover:text-venice-coral transition-colors">
            {t('site.title')}
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-venice-coral ${
                  location.pathname === item.path ? 'text-venice-coral' : 'text-venice-dark'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;