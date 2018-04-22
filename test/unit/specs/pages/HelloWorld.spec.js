import HelloWorld from '@/pages/HelloWorld'
import { i18n } from '@/plugins/i18n'
import { mount } from 'vue-test-utils'
import {Trans} from '@/plugins/Translation'

describe('HelloWorld.vue', () => {
  const vm = mount(HelloWorld, { i18n })
  it('renders proper welcome message', () => {
    expect(vm.find('.hello h1').text())
      .toEqual(i18n.t('welcome_message'))
  })

  it('renders a proper popular links text', () => {
    expect(vm.find('.hello h2').text())
      .toEqual(i18n.t('popular_links'))
  })

  it('changes languages', async () => {
    await Trans.changeLanguage('bg')

    expect(i18n.locale).toBe('bg')

    expect(vm.find('.hello h1').text())
      .toEqual(i18n.t('welcome_message'))
  })
})
