import React from 'react';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectorProps {
  currentLanguage: 'tr' | 'en';
  onLanguageChange: (language: 'tr' | 'en') => void;
}

const LanguageSelector = ({ currentLanguage, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-venice-dark" />
      <Select value={currentLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-24 h-8 border-venice-stone/30 bg-white/80 backdrop-blur-sm text-venice-dark text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="tr">Türkçe</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;