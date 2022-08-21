<template>
  <div>
    <p class="welcome">{{userInfo.username}}用户，欢迎回来</p>
    <span class="tips">Tips: {{tips}}</span>
  </div>
</template>

<script setup>
  import { getHourTips } from '@utils/index'
  import { userStore } from '@store/user'

  const { userInfo } = userStore()
  const tips = getHourTips()
</script>

<style scoped lang="less">
  .welcome {
    font-size: 24px;
    margin-bottom: 20px;
  }
  .tips {
    background-image: -webkit-linear-gradient(top, red, #fd8403, #0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
