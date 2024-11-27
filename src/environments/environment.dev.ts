import { locale } from "moment";

export const environment = {
  production: false,
  ENV_TYPE: 1,
  apiBaseUrl: 'https://redefine-api.azurewebsites.net/api',
  apiToken: 'SBDBDJBDJKSB^*DBDU*797979DKDBDDDKK',
  encryptionKey: 'aR6TqW2xYzPvXcFnG9HjK4bN5mL8sD7E',
  AZURE_FILE_PATH: 'https://redefinestorage.blob.core.windows.net/documents',
  RECAPTCHA: {
    enabled: false,
    siteKey: '6Ld7aa8oAAAAAAEIBiyvuo-GJmKsAgtZQZkF_s0b',
  },
  FILE_SIZE: {
    // size must be in MB
    DEFAULT: 25,
    CV: 1,
    QualificationCertificate: 1,
    ID: 1,
    MOTIVATION: 1,
  },
  CUSTOM_COMPONENT_SEARCH: true,
  // DASHBOARD : false,
  BROKER_PROFILE_SUBRUB_CHANGES: true,
  PREVIEW_CHANGES: false,
  PAGE_BUILDER_ANCHOR: true,
  CUSTOM_SLIDER_CAROUSEL: true,
  CUSTOM_VACANCY_DOWNLOAD: false,
  CUSTOM_GTAG: false,
  DASHBOARD_TAB_VIEW: true,
  LAZY_LOADING : true
};
