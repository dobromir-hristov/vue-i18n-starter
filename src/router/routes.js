import {Trans} from '@/plugins/Translation'

function load (component) {
  // '@' is aliased to src/components
  return () => import(/* webpackChunkName: "[request]" */ `@/pages/${component}.vue`)
}

export default [
  {
    path: '/:lang',
    component: {
      template: '<router-view></router-view>'
    },
    beforeEnter (to, from, next) {
      // Load async message files here
      const lang = to.params.lang
      if (!Trans.isLangSupported(lang)) return next(Trans.getUserSupportedLang())
      Trans.changeLanguage(lang).then(() => next())
    },
    children: [
      {
        path: '',
        name: 'HelloWorld',
        component: load('HelloWorld')
      },
      {
        path: '*',
        component: load('404')
      }
    ]
  },
  {
    // Redirect user to supported lang version.
    path: '*',
    redirect (to) {
      return Trans.getUserSupportedLang()
    }
  }
]
