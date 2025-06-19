import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Language, LanguageContextType, Translations } from '../types';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Translations = {
  en: {
    'site.title': 'BioCryptor',
    'nav.home': 'Home',
    'nav.about': 'About',
    'chat.placeholder': 'Enter your message for encryption...',
    'chat.title': 'BioCryptor',
    'chat.subtitle': 'Genetic Encryption AI',
    'chat.you': 'You',
    'chat.assistant': 'BioCryptor AI',
    'chat.thinking': 'Thinking...',
    'chat.start_message': 'Type a message to start a conversation',
    'chat.send': 'Send',
    'chat.new': 'New',
    'chat.new_chat': 'Start New Chat',
    'features.title': 'GENETIC ENCRYPTION ALGORITHM',
    'features.private.title': 'Advanced Cryptographic Security',
    'features.private.description': 'BioCryptor employs a sophisticated genetic encryption algorithm that converts data into DNA-like sequences using a quaternary base system (A, C, G, T nucleotides). This biomimetic approach creates multiple layers of obfuscation by transforming ASCII values through temporal integration, base-4 conversion, and genetic mapping, resulting in cryptographically secure ciphertext that mimics natural biological complexity.',
    'features.uncensored.title': 'Bioinspired Key Generation',
    'features.uncensored.description': 'Our proprietary key derivation function combines user-provided open keys with system timestamps to generate dynamic encryption keys. The algorithm processes ASCII character values, integrates temporal data (day, month, year, hour, minute), and applies modular arithmetic operations before mapping to genetic codons. This creates a unique, time-dependent encryption matrix that ensures perfect forward secrecy.',
    'algorithm.title': 'ALGORITHM IMPLEMENTATION DETAILS',
    'algorithm.step1': 'ASCII Conversion: Input string characters are converted to their corresponding ASCII decimal values for numerical processing',
    'algorithm.step2': 'Temporal Integration: System timestamp components (day, month, year, hour, minute) are mathematically combined with ASCII values',
    'algorithm.step3': 'Base-4 Transformation: Combined values undergo base-4 conversion with zero-padding to ensure consistent 4-digit quaternary representation',
    'algorithm.step4': 'Genetic Mapping: Quaternary digits (0,1,2,3) are mapped to DNA nucleotides (A,C,G,T) creating biologically-inspired sequences',
    'algorithm.step5': 'Codon Formation: DNA sequences are segmented into 3-nucleotide codons, mimicking genetic triplet codes used in protein synthesis',
    'algorithm.step6': 'XOR Encryption: Final encryption applies XOR operations using generated genetic keys with random initialization vectors (IV) and Base64 encoding',
    'learn.more': 'LEARN MORE',
    'error.api_connection': 'Sorry, an error occurred. Please try again.',
    'error.network': 'Network error. Please check your connection.',
    'error.unknown': 'An unknown error occurred.'
  },
  tr: {
    'site.title': 'BioCryptor',
    'nav.home': 'Ana Sayfa',
    'nav.about': 'Hakkında',
    'chat.placeholder': 'Şifreleme için mesajınızı girin...',
    'chat.title': 'BioCryptor',
    'chat.subtitle': 'Genetik Şifreleme Yapay Zekası',
    'chat.you': 'Sen',
    'chat.assistant': 'BioCryptor AI',
    'chat.thinking': 'Düşünüyor...',
    'chat.start_message': 'Bir konuşma başlatmak için mesaj yazın',
    'chat.send': 'Gönder',
    'chat.new': 'Yeni',
    'chat.new_chat': 'Yeni Sohbet Başlat',
    'features.title': 'GENETİK ŞİFRELEME ALGORİTMASI',
    'features.private.title': 'Gelişmiş Kriptografik Güvenlik',
    'features.private.description': 'BioCryptor, verileri quaternary taban sistemi (A, C, G, T nükleotidleri) kullanarak DNA benzeri dizilere dönüştüren sofistike bir genetik şifreleme algoritması kullanır. Bu biyomimetik yaklaşım, ASCII değerlerini zamansal entegrasyon, base-4 dönüşümü ve genetik haritalama yoluyla dönüştürerek doğal biyolojik karmaşıklığı taklit eden kriptografik güvenli şifreli metinler oluşturan çoklu gizleme katmanları yaratır.',
    'features.uncensored.title': 'Biyo-İlhamlı Anahtar Üretimi',
    'features.uncensored.description': 'Özel anahtar türetme fonksiyonumuz, dinamik şifreleme anahtarları oluşturmak için kullanıcı tarafından sağlanan açık anahtarları sistem zaman damgalarıyla birleştirir. Algoritma ASCII karakter değerlerini işler, zamansal verileri (gün, ay, yıl, saat, dakika) entegre eder ve genetik kodonlara haritalamadan önce modüler aritmetik işlemler uygular. Bu, mükemmel ileriye dönük gizlilik sağlayan benzersiz, zamana bağlı bir şifreleme matrisi oluşturur.',
    'algorithm.title': 'ALGORİTMA UYGULAMA DETAYLARI',
    'algorithm.step1': 'ASCII Dönüşümü: Giriş dizesi karakterleri sayısal işleme için karşılık gelen ASCII ondalık değerlerine dönüştürülür',
    'algorithm.step2': 'Zamansal Entegrasyon: Sistem zaman damgası bileşenleri (gün, ay, yıl, saat, dakika) ASCII değerleriyle matematiksel olarak birleştirilir',
    'algorithm.step3': 'Base-4 Dönüşümü: Birleştirilmiş değerler tutarlı 4 haneli quaternary gösterim sağlamak için sıfır dolgusuyla base-4 dönüşümüne tabi tutulur',
    'algorithm.step4': 'Genetik Haritalama: Quaternary rakamlar (0,1,2,3) DNA nükleotidlerine (A,C,G,T) haritalanarak biyolojik ilhamlı diziler oluşturulur',
    'algorithm.step5': 'Kodon Oluşumu: DNA dizileri protein sentezinde kullanılan genetik triplet kodları taklit ederek 3-nücleotid kodonlara bölünür',
    'algorithm.step6': 'XOR Şifreleme: Final şifreleme rastgele başlatma vektörleri (IV) ve Base64 kodlaması ile üretilen genetik anahtarları kullanarak XOR işlemleri uygular',
    'learn.more': 'DAHA FAZLA BİLGİ',
    'error.api_connection': 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
    'error.network': 'Ağ hatası. Lütfen bağlantınızı kontrol edin.',
    'error.unknown': 'Bilinmeyen bir hata oluştu.'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'tr' ? 'tr' : 'en';
  };

  const [language, setLanguage] = useState<Language>(() => {
    try {
      return getBrowserLanguage();
    } catch {
      return 'en';
    }
  });

  const t = useMemo(() => {
    return (key: string): string => {
      if (!translations[language]) {
        console.warn(`Missing translations for language: ${language}`);
        return key;
      }
      
      if (!translations[language][key]) {
        console.warn(`Missing translation key: ${key} in language ${language}`);
        return key;
      }
      
      return translations[language][key];
    };
  }, [language]);

  const contextValue = useMemo(() => {
    return { language, setLanguage, t };
  }, [language, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};