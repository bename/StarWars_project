<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import main_page from "./components/main_page"
export default {
  name: 'App',
  components: {main_page}
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
