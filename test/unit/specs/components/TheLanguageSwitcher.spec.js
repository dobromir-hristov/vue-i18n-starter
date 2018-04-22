import TheLanguageSwitcher from '@/components/TheLanguageSwitcher.vue'
import { i18n } from '@/plugins/i18n'
import { mount } from 'vue-test-utils'
import { SUPPORTED_LANGUAGES } from '@/constants/trans'
import {Trans} from '@/plugins/Translation'

describe('TheLanguageSwitcher.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(TheLanguageSwitcher, { i18n })
  })

  it('renders properly', () => {
    expect(wrapper.find('.LanguageSwitcher')).toBeTruthy()
  })

  it('has the right amount of options to select', () => {
    const options = wrapper.findAll('.LanguageSwitcher option')
    expect(options).toHaveLength(SUPPORTED_LANGUAGES.length)
  })

  it('sets the current language as current option', () => {
    const currentOption = wrapper.find('.LanguageSwitcher .is-selected')

    expect(currentOption.element.value).toBe(Trans.currentLanguage)
  })

  it('checks that isCurrentLanguage checks if supplied language is current', () => {
    expect(wrapper.vm.isCurrentLanguage('bg')).toBeFalsy()
    expect(wrapper.vm.isCurrentLanguage('en')).toBeTruthy()
  })

  it('calls changeLanguage when an option is clicked', async () => {
    const changeLanguageMethod = jest.fn()
    const changeLanguageTo = 'bg'
    wrapper.setMethods({
      changeLanguage: changeLanguageMethod
    })
    const option = wrapper.find('option[value="bg"]')

    option.trigger('change')

    expect(changeLanguageMethod).toHaveBeenCalled()
  })
})
