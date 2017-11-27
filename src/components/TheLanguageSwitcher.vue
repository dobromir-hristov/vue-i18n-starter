<template>
  <select name="language" @change="changeLanguage">
    <option v-for="lang in supportedLanguages" :selected="lang === currentLanguage" :value="lang">{{lang}}</option>
  </select>
</template>
<script>
  import Trans from '@/plugins/Translation'

  export default {
    computed: {
      supportedLanguages () {
        return Trans.supportedLanguages
      },
      currentLanguage () {
        return Trans.currentLanguage
      }
    },
    methods: {
      changeLanguage (e) {
        const lang = e.target.value
        const to = this.$router.resolve({ params: { lang } })
        Trans.changeLanguage(lang).then(() => {
          this.$router.push(to.location)
        })
      }
    }
  }
</script>
