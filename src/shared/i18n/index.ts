import { createI18n } from 'vue-i18n'
import enCommon from '@/shared/i18n/locales/en/common.json'

export const defaultLocale = 'en'

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages: {
    en: {
      common: enCommon,
    },
  },
})
