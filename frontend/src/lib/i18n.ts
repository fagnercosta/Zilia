import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar arquivos de tradução diretamente
import commonPt from '../../public/locales/pt/common.json';
import commonEn from '../../public/locales/en/common.json';
import dashboardPt from '../../public/locales/pt/dashboard.json';
import dashboardEn from '../../public/locales/en/dashboard.json';
import authPt from '../../public/locales/pt/auth.json';
import authEn from '../../public/locales/en/auth.json';
import stencilPt from '../../public/locales/pt/stencil.json';
import stencilEn from '../../public/locales/en/stencil.json';
import configurationPt from '../../public/locales/pt/configuration.json';
import configurationEn from '../../public/locales/en/configuration.json';
import reportsPt from '../../public/locales/pt/reports.json';
import reportsEn from '../../public/locales/en/reports.json';
import usersPt from '../../public/locales/pt/users.json';
import usersEn from '../../public/locales/en/users.json';
import automaticPt from '../../public/locales/pt/automatic.json';
import automaticEn from '../../public/locales/en/automatic.json';

const resources = {
  pt: {
    common: commonPt,
    dashboard: dashboardPt,
    auth: authPt,
    stencil: stencilPt,
    configuration: configurationPt,
    reports: reportsPt,
    users: usersPt,
    automatic: automaticPt,
  },
  en: {
    common: commonEn,
    dashboard: dashboardEn,
    auth: authEn,
    stencil: stencilEn,
    configuration: configurationEn,
    reports: reportsEn,
    users: usersEn,
    automatic: automaticEn,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'pt',
    debug: false,
    
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    ns: ['common', 'dashboard', 'stencil', 'auth', 'reports', 'configuration', 'users', 'automatic'],
    defaultNS: 'common',
  });

export default i18n;