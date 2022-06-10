<template>
  <div class="menu-item">
    <router-link v-if="!hasChild" :to="route.path">
      <a-menu-item :key="route.path">
        <icon-bug></icon-bug>{{ route.label }}
      </a-menu-item>
    </router-link>
    <a-sub-menu v-else>
      <template #icon>
        <icon-apps></icon-apps>
      </template>
      <template #title>{{ route.label }}</template>
      <item v-for="child in route.children" :key="child.label + child.path" :route="child"></item>
    </a-sub-menu>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  route: Object
})
const { route } = props
let hasChild = computed(() => route.children?.length > 0)
</script>

<style lang="less" scoped>

</style>