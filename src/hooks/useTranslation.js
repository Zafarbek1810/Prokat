import { useTranslation as useI18nTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation('common');
  const router = useRouter();
  
  const changeLanguage = (locale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale });
  };

  return {
    t,
    changeLanguage,
    currentLanguage: i18n.language,
    isRTL: i18n.language === 'ar'
  };
};