<template>
  <div class="box-wrapper">
    <p class="title">elm-admin登录</p>

    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit">

      <a-form-item
        field="username"
        :rules="[{ required: true, message: '用户名不能为空'}]"
        :validate-trigger="['change', 'blur']"
        hide-label>
        <a-input
          v-model="userInfo.username"
          placeholder="请输入用户名"
          :max-length="11">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        field="password"
        :rules="[{ required: true, message: '密码不能为空' }]"
        :validate-trigger="['change', 'blur']"
        hide-label>
        <a-input-password
          v-model="userInfo.password"
          placeholder="请输入密码"
          :max-length="6"
          allow-clear>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>

      <a-button type="primary" html-type="submit">登录</a-button>
    </a-form>

    <p class="tips">新用户首次登录会自动完成注册</p>
  </div>
</template>

<script setup>
  import { reactive } from 'vue';
  import { useRouter } from "vue-router"
  import { userStore } from '@store/user'
  import { Message } from '@arco-design/web-vue';

  const router = useRouter()
  const store = userStore()
  const userInfo = reactive({
    username: '',
    password: '',
  })

  const handleSubmit = ({ values, errors }) => {
    if (!errors) {
      store.login(values)
        .then(() => {
          // 跳转到dashboard页
          Message.success('登录成功！')
          router.push('/')
        })
        .catch(err => {
          Message.error(err?.data?.msg || err.message)
        })
    }
  }
</script>

<style scoped lang="less">
  .box-wrapper {
    height: 100vh;
    min-width: 1100px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #FFF;
    .title {
      font-size: 36px;
      margin-bottom: 36px;
    }
    .login-form {
      width: 400px;
    }
    .tips {
      font-size: 13px;
      margin-top: 16px;
      color: rgba(255, 0, 0, 0.8);
    }
  }
</style>
