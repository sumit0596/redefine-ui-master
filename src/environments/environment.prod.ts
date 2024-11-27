export const environment = {
  production: true,
  ENV_TYPE: 3,
  apiBaseUrl: 'https://redefine-api.azurewebsites.net/api',
  apiToken: 'SBDBDJBDJKSB^*DBDU*797979DKDBDDDKK',
  AZURE_FILE_PATH: 'https://redefinestorage.blob.core.windows.net/documents',
  encryptionKey: 'aR6TqW2xYzPvXcFnG9HjK4bN5mL8sD7E', // temporary encryptionKey
  RECAPTCHA: {
    enabled: true,
    siteKey: '6Ld7aa8oAAAAAAEIBiyvuo-GJmKsAgtZQZkF_s0b',
  },
  FILE_SIZE: {
    // size must be in MB
    DEFAULT: 25,
    CV: 5,
    QualificationCertificate: 1,
    ID: 1,
    MOTIVATION: 1,
  },
  CUSTOM_COMPONENT_SEARCH: true,
  // DASHBOARD: true,
  PREVIEW_CHANGES: true,
  PAGE_BUILDER_ANCHOR: true,
  CUSTOM_SLIDER_CAROUSEL: true,
  BROKER_PROFILE_SUBRUB_CHANGES: true,
  CUSTOM_VACANCY_DOWNLOAD: true,
  CUSTOM_GTAG: false,
  DASHBOARD_TAB_VIEW: true,
};
