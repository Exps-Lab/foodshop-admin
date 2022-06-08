<template>
  <div class="menu-demo">
    <a-menu
      :style="{ width: '200px', height: '100%' }"
      :default-open-keys="['0']"
      :default-selected-keys="['0_2']"
      show-collapse-button
      breakpoint="xl"
      @collapse="onCollapse"
    >
      <a-menu-item v-for="route in list" :key="route.label+route.url">
        <icon-bug></icon-bug>{{ route.label }}
      </a-menu-item>
      <!-- <a-menu-item key="1">
        <icon-apps></icon-apps>Menu 1
      </a-menu-item>
      <a-menu-item key="2">
        <icon-bug></icon-bug>Menu 2
      </a-menu-item> -->
    </a-menu>
  </div>
</template>

<script setup>
const props = defineProps({
  list: Array
})
const { list } = props
const onCollapse = (val, type) => {}
</script>

<style>
.menu-demo {
  height: 100%;
  background-color: #FFF;
  z-index: 1001;
}
</style>