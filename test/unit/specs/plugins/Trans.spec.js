import Trans from '@/plugins/Translation'
import { i18n } from '@/plugins/i18n'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/constants/trans'

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
  })

  describe('should return the users preferred language', () => {
    Object.defineProperty(window.navigator, 'language', { value: 'en-US' })
    // expect(i18n.locale).toBe('en')
    it('should return preferred language', () => {
      expect(Trans.getUserLang()).toEqual({
        lang: 'en-us',
        langNoISO: 'en'
      })
    })

    it('should get first supported language', () => {
      expect(Trans.getUserSupportedLang()).toBe('en')
    })
  })

  it('should test if a language is supported', () => {
    expect(Trans.isLangSupported('en')).toBeTruthy()
  })
})
