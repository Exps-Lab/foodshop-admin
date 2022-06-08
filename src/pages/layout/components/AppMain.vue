<template>
  <section class="app-main">
    <router-view :key="key" #default="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.fullPath;
    }
  }
};
</script>

<style scoped>
.app-main {
  /* navbar = 56px; breadcrumb = 68px; bottom-space = 56px;  */
  min-height: calc(100vh - 56px - 68px - 56px);
  position: relative;
  margin: 24px 24px 0;
  padding: 24px;
  border-radius: 4px;
  background-color: #FFF;
}
</style>
