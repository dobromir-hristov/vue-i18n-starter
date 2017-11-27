<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>
      Change Language to: <TheLanguageSwitcher/>
    </div>
    <router-view/>
  </div>
</template>

<script>
  import TheLanguageSwitcher from '@/components/TheLanguageSwitcher'

  export default {
    name: 'app',
    components: {
      TheLanguageSwitcher
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
