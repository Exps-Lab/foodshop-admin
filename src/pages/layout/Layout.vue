<template>
  <div class="app-wrapper">
    <Sidebar :list="menus"/>
    <div class="main-container">
      <Navbar :user="userInfo"/>
      <Breadcrumb/>
      <AppMain/>
    </div>
  </div>
</template>

<script setup>
  import { Navbar, Sidebar, Breadcrumb, AppMain } from './components'
  import { authStore } from '@store/auth'
  import { userStore } from '@store/user'

  const { menus } = authStore()
  const { userInfo } = userStore()
</script>

<style lang="less" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  overflow-x: hidden;
  // 主体区域
  .main-container {
    position: relative;
    min-height: 100%;
    padding-bottom: 56px;
    flex: 1;
  }
}
</style>
