// Lightweight static translation shim: Russian only, no i18n libs
// Import the previously defined Russian dictionary
import React from 'react';
import ru from '../../public/locales/ru/common.json';

export const useTranslation = () => {
  // Get current language from localStorage or default to 'ru'
  const getCurrentLanguage = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'ru';
    }
    return 'ru';
  };

  const [currentLanguage, setCurrentLanguageState] = React.useState(getCurrentLanguage);

  // Change language
  const changeLanguage = (lang) => {
    setCurrentLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key) => {
    // Support nested keys like "navigation.dashboard"
    const parts = String(key).split('.');
    let node = ru;
    for (const part of parts) {
      if (node && Object.prototype.hasOwnProperty.call(node, part)) {
        node = node[part];
      } else {
        return key; // fallback to key if missing
      }
    }
    return typeof node === 'string' ? node : key;
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
  };
};