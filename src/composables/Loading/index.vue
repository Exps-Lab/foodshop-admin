<template>
  <div class="spin-box">
    <Spin :tip="text"/>
  </div>
</template>

<script setup lang="ts">
import { Spin } from '@arco-design/web-vue'

withDefaults(defineProps<{
  text?: string
}>(), {
  text: 'loading...'
})
</script>

<style scoped lang="less">
.spin-box {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>