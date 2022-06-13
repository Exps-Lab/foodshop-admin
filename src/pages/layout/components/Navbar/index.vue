<template>
  <div class="navbar">
    <a-dropdown position="br" @select="handleSelect">
      <a-button type="text">
        <span class="user-name">{{ user.username || '未知' }}</span>
        <icon-down class="icon" />
      </a-button>
      <template #content>
        <!-- <a-doption>个人信息</a-doption> -->
        <a-doption value="logout">退出</a-doption>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup>
  import { userStore } from '@store/user'
  import { useRouter } from 'vue-router'

  const store = userStore()
  const router = useRouter()
  const props = defineProps({
    user: Object
  })
  const { user } = props
  const handleSelect = (type) => {
    if (type === 'logout') {
      store.logout()
        .then(() => {
          router.push('/login')
        })
    }
  }
</script>

<style lang="less" scoped>
  .navbar {
    height: 56px;
    border-radius: 0 !important;
    padding-right: 24px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: black;
    background-color: #FFF;
    :deep(.arco-btn-text) {
      font-size: 16px;
      color:#4E5969;
      padding: 5px 0;
      min-width: unset;
      &:hover {
        color: #4E5969;
        background-color: transparent;
      }

      .user-name {
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
        vertical-align: middle;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 300px;
        font-family: PingFangSC-Regular, PingFang SC;
      }

      .icon {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
      }
    }
  }

  :deep(.arco-btn-text) {
    font-size: 16px;
    color:#4E5969;
    padding: 5px 0;
    min-width: unset;
    &:hover {
      color: #4E5969;
      background-color: transparent;
    }
  }
  :deep(.arco-trigger-popup) {
    .arco-dropdown-option {
      min-width: 174px;
      height: 36px;
      line-height: 36px;
      padding: 0 12px;
      color: #1D2129;
    }
  }
</style>
