<template>
  <section class="app-main">
    <router-view #default="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<script setup>

</script>

<style lang="less" scoped>
.app-main {
  /* navbar = 56px; breadcrumb = 68px; bottom-space = 56px;  */
  min-height: calc(100vh - 56px - 68px - 56px);
  max-width: calc(100vw - 200px - 48px);
  position: relative;
  margin: 0 24px;
  padding: 24px;
  border-radius: 4px;
  background-color: #FFF;
}
/*fade-transform*/
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
