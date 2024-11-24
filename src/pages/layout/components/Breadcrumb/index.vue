<template>
  <a-breadcrumb class="breadcrum">
    <a-breadcrumb-item v-for="item in breadcrumbList" :key="item">{{ item }}</a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup>
  import { computed } from "vue"
  import { useRouter } from "vue-router"

  const router = useRouter()
  let breadcrumbList = computed(() => {
    const list = []
    const matchList = router.currentRoute.value.matched
    matchList.forEach(item => {
      const title = item.meta?.title
      title ? list.push(item.meta?.title) : ''
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