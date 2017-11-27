import axios from 'axios'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/constants/trans'
import { i18n } from '@/plugins/i18n'

const Trans = {
  get defaultLanguage () {
    return DEFAULT_LANGUAGE
  },
  get supportedLanguages () {
    return SUPPORTED_LANGUAGES
  },
  get currentLanguage () {
    return i18n.locale
  },
  set currentLanguage (lang) {
    i18n.locale = lang
  },
  getUserSupportedLang () {
    const userPreferredLang = Trans.getUserLang()

    // Check if user preferred browser lang is supported
    if (Trans.isLangSupported(userPreferredLang.lang)) {
      return userPreferredLang.lang
    }
    // Check if user preferred lang without the ISO is supported
    if (Trans.isLangSupported(userPreferredLang.langNoISO)) {
      return userPreferredLang.langNoISO
    }
    return Trans.defaultLanguage
  },
  /**
   * Returns the users preferred language
   */
  getUserLang () {
    const lang = window.navigator.language || window.navigator.userLanguage || Trans.defaultLanguage
    return {
      lang: lang.toLowerCase(),
      langNoISO: lang.split('-')[0]
    }
  },
  setI18nLanguageInServices (lang) {
    Trans.currentLanguage = lang
    axios.defaults.headers.common['Accept-Language'] = lang
    document.querySelector('html').setAttribute('lang', lang)
    return lang
  },
  /**
   * Loads new translation messages and changes the language when finished
   * @param lang
   * @return {Promise<any>}
   */
  changeLanguage (lang) {
    if (!Trans.isLangSupported(lang)) return Promise.reject(new Error('Language not supported'))
    if (i18n.locale === lang) return Promise.resolve() // has been loaded prior
    return import(/* webpackChunkName: "lang-[request]" */ `@/lang/${lang}.js`).then(msgs => {
      i18n.setLocaleMessage(lang, msgs.default || msgs)
      return Trans.setI18nLanguageInServices(lang)
    })
  },
  isLangSupported (lang) {
    return Trans.supportedLanguages.includes(lang)
  }
}

export default Trans
