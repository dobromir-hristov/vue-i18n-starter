let Trans = null
let i18n = null
const mockDefaultLanguage = 'en'
const mockFallbackLanguage = 'en'
const mockSupportedLanguages = ['en', 'de']
const mockApi = {
  service: {
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}
/* Mock i18n instance */
jest.mock('@/plugins/i18n', () => {
  const mockedI18n = {
    locale: 'en',
    setLocaleMessage: jest.fn(function (locale, messages) {
      mockedI18n.locale = locale
      mockedI18n.messages[locale] = messages
    }),
    messages: {},
    t: jest.fn(function (message, locale = mockedI18n.locale) {
      return mockedI18n.messages[locale][message]
    })
  }
  return { i18n: mockedI18n }
})
jest.mock('@/constants/trans', () => {
  return {
    DEFAULT_LANGUAGE: mockDefaultLanguage,
    FALLBACK_LANGUAGE: mockFallbackLanguage,
    SUPPORTED_LANGUAGES: mockSupportedLanguages
  }
})
jest.mock('axios', () => mockApi)
beforeEach(() => {
  Trans = require('@/plugins/Translation').Trans
  // stop service from loading Async files
  Trans.loadLanguageFile = jest.fn(() => Promise.resolve())
  i18n = require('@/plugins/i18n').i18n
})

afterEach(() => {
  jest.resetModules()
})

let defineNavigatorLanguage = function (lang) {
  navigator.__defineGetter__('language', function () {
    return lang // customized user agent
  })
}
describe('TranslationService', () => {
  it('should get default language', () => {
    expect(Trans.defaultLanguage).toEqual(mockDefaultLanguage)
  })

  it('should return supported languages', () => {
    expect(Trans.supportedLanguages).toEqual(mockSupportedLanguages)
  })

  it('should return the current language', () => {
    expect(Trans.currentLanguage).toEqual(i18n.locale)
  })

  it('should set language in vue-i18n', () => {
    Trans.currentLanguage = 'bg'
    expect(i18n.locale).toEqual('bg')
    expect(i18n.locale).toEqual(Trans.currentLanguage)
  })

  it('should return preferred language', () => {
    defineNavigatorLanguage('en-US')
    // global.navigator.language = 'en-US'
    expect(Trans.getUserLang()).toEqual({
      lang: 'en-US',
      langNoISO: 'en'
    })
  })

  it('should return a supported language', () => {
    defineNavigatorLanguage('de')
    expect(Trans.getUserSupportedLang()).toBe('de')
  })

  it('should return first supported language if actually supported', () => {
    jest.resetModules()
    jest.doMock('@/constants/trans', () => ({
      SUPPORTED_LANGUAGES: ['bg-BG', 'bg', 'en'],
      DEFAULT_LANGUAGE: 'en',
      FALLBACK_LANGUAGE: 'en'
    }))
    Trans = require('@/services/TranslationService').Trans
    defineNavigatorLanguage('bg-BG')
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
    expect(mockApi.service.defaults.headers.common['Accept-Language']).toBe(setLanguage)
    expect(langHTMLTag).toBe(setLanguage)
  })

  it('resolves if new lang is the same as the old one', async () => {
    expect(Trans.currentLanguage).toBe(mockDefaultLanguage)
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
    const mockedLanguageFile = { welcome_message: 'Welcome' }
    Trans.loadLanguageFile.mockImplementation(() => Promise.resolve(mockedLanguageFile))
    const changedLang = await Trans.changeLanguage(newLang)
    expect(changedLang).toBe(newLang)
    expect(Trans.currentLanguage).toBe(newLang)
    expect(i18n.t('welcome_message')).toBe(mockedLanguageFile.welcome_message)
  })
})
