import Trans from '@/plugins/Translation'
import { i18n } from '@/plugins/i18n'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/constants/trans'
import axios from 'axios'
jest.mock('@/constants/trans', () => ({
  SUPPORTED_LANGUAGES: ['bg-BG', 'bg', 'en'],
  DEFAULT_LANGUAGE: 'en'
}))

jest.mock('@/plugins/i18n', () => {
  return {
    i18n: {
      locale: 'en',
      setLocaleMessage (locale, messages) {
        this.locale = locale
        this.messages[locale] = messages
      },
      messages: {},
      t (message, locale = this.locale) {
        return this.messages[locale][message]
      }
    }
  }
})
const mockedBGLang = {
  welcome_message: 'Добре дошли'
}
jest.mock('@/lang/bg.js', () => {
  return mockedBGLang
})

describe('Trans.js service', () => {
  it('should get default language', () => {
    expect(Trans.defaultLanguage).toEqual(DEFAULT_LANGUAGE)
  })

  it('should return supported languages', () => {
    expect(Trans.supportedLanguages).toEqual(SUPPORTED_LANGUAGES)
  })

  it('should return the current language', () => {
    expect(Trans.defaultLanguage).toEqual(i18n.locale)
  })

  it('should set language in vue-i18n', () => {
    Trans.currentLanguage = 'bg'
    expect(i18n.locale).toEqual('bg')
    expect(i18n.locale).toEqual(Trans.currentLanguage)
  })

  it('should return preferred language', () => {
    navigator.__defineGetter__('language', function () {
      return 'en-US' // customized user agent
    });
    // global.navigator.language = 'en-US'
    expect(Trans.getUserLang()).toEqual({
      lang: 'en-US',
      langNoISO: 'en'
    })
  })

  it('should return a supported language', () => {
    navigator.__defineGetter__('language', function () {
      return 'bg' // customized user agent
    });
    expect(Trans.getUserSupportedLang()).toBe('bg')
  })

  it('should return first supported langauge if actually supported', () => {
    navigator.__defineGetter__('language', function () {
      return 'bg-BG' // customized user agent
    });
    expect(Trans.getUserSupportedLang()).toBe('bg-BG')
  })

  it('should test if a language is supported', () => {
    expect(Trans.isLangSupported('en')).toBeTruthy()
  })

  it('should set language in services', () => {
    const setLanguage = Trans.setI18nLanguageInServices('en')
    const langHTMLTag = document.querySelector('html').getAttribute('lang')
    expect(setLanguage).toBe('en')
    expect(Trans.currentLanguage).toEqual(setLanguage)
    expect(axios.defaults.headers.common['Accept-Language']).toBe(setLanguage)
    expect(langHTMLTag).toBe(setLanguage)
  })

  it('resolves if new lang is the same as the old one', async () => {
    expect(Trans.currentLanguage).toBe(DEFAULT_LANGUAGE)
    const newLang = 'en'
    const changedLang = await Trans.changeLanguage(newLang)
    expect(changedLang).toBe(newLang)
  })

  it('rejects a promise if the new lang is not supported', async () => {
    const newLang = 'de'
    expect.assertions(1)
    try {
      await Trans.changeLanguage(newLang)
    } catch (error) {
      expect(error.message).toBe('Language not supported')
    }
  })

  it('downloads new language messages and sets the current language', async () => {
    const newLang = 'bg'
    const changedLang = await Trans.changeLanguage(newLang)
    expect(changedLang).toBe(newLang)
    expect(Trans.currentLanguage).toBe(newLang)
    expect(i18n.t('welcome_message')).toBe(mockedBGLang.welcome_message)
  })
})
