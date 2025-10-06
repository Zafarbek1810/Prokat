import React from 'react';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from '../../hooks/useTranslation';

const LanguageSwitcher = () => {
  const { changeLanguage, currentLanguage } = useTranslation();

  const languages = [
    { value: 'uz', label: 'O\'zbekcha', flag: '🇺🇿' },
    { value: 'ru', label: 'Русский', flag: '🇷🇺' }
  ];

  const handleLanguageChange = (value) => {
    changeLanguage(value);
  };

  const currentLang = languages.find(lang => lang.value === currentLanguage);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <GlobalOutlined />
      <Select
        value={currentLanguage}
        onChange={handleLanguageChange}
        style={{ minWidth: 120 }}
        size="small"
        options={languages.map(lang => ({
          value: lang.value,
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </div>
          )
        }))}
      />
    </div>
  );
};

export default LanguageSwitcher;