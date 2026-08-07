<template>
  <a-breadcrumb class="breadcrum">
    <a-breadcrumb-item v-for="item in breadcrumbList" :key="item">{{ item }}</a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const breadcrumbList = computed(() => {
    const list: string[] = []
    const matchList = router.currentRoute.value.matched
    matchList.forEach(item => {
      const title = item.meta?.title as string
      if (title) list.push(title)
    })
    return list
  })
</script>

<style>
  .breadcrum {
    height: 56px;
    line-height: 56px;
    padding: 0 24px;
    margin-bottom: 12px;
  }
</style>