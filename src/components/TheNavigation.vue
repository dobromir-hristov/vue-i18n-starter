<template>
  <div class="TheNavigation">
    <router-link :to="$i18nRoute({ name: 'HelloWorld'})">
      HelloWorld Page
    </router-link>
    <router-link :to="$i18nRoute({ name: 'about'})">
      About Page
    </router-link>
  </div>
</template>

<style>
.TheNavigation {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.TheNavigation a {
  text-decoration: none;
  font-weight: bold;
  color: #535353;
  margin: 0 .5rem;
}

.TheNavigation a:hover {
  color: #333;
}
</style>
