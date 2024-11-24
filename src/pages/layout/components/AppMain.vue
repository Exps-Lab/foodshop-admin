<template>
  <section class="app-main">
    <router-view #default="{ Component, route }">
      <transition-group name="fade-transform">
        <div :key="route.fullPath">
          <component :is="Component" />
        </div>
      </transition-group>
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
  transition: max-width 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
}
/*fade-transform*/
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}
.fade-transform-enter-active {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
/* 使进入的元素处于顶部 */
.fade-transform-enter-active {
  position: absolute;
  top: 0;
}
</style>
