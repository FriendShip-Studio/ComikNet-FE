<template>
  <div id="card-wrapper">
    <div id="login-card">
      <div id="card-content">
        <div id="card-title">
          <span class="title">登录</span>
          <span class="gray">丨</span>
          <span class="title gray" @click="$router.push('/register')">注册</span>
        </div>
        <a-form
          :model="loginForm"
          name="basic"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          autocomplete="on"
          @finish="handleLogin"
        >
          <a-form-item
            label="用户名"
            name="username"
            :rules="[{ required: true, message: '用户名不能为空!' }]"
          >
            <a-input v-model:value="loginForm.username"/>
          </a-form-item>
          <a-form-item
            label="密码"
            name="password"
            :rules="[{ required: true, message: '密码不能为空!' }]"
          >
            <a-input-password v-model:value="loginForm.password"/>
          </a-form-item>
          <a-form-item name="remember" :wrapper-col="{ offset: 6, span: 18 }">
            <a-checkbox v-model:checked="loginForm.isRemember">
              保持登录
            </a-checkbox>
          </a-form-item>
          <div id="btn-wrapper">
            <a-button type="link">忘记密码</a-button>
            <a-button type="primary" html-type="submit">登录</a-button>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import type { LoginForm } from '@/models/form';
  import { router } from '@/router';
  import { message } from 'ant-design-vue';
  import { reactive } from 'vue';
  import useUserStore from '@/store/user';

  const userStore = useUserStore();

  const loginForm = reactive<LoginForm>({
    username: '',
    password: '',
    isRemember: false
  });

  const handleLogin = async (loginForm: LoginForm) => {
    if (await userStore.login(loginForm)) {
      localStorage.setItem('remember', loginForm.isRemember.toString());
      if (loginForm.isRemember) {
        localStorage.setItem('login_form', JSON.stringify(loginForm));
      }
      await router.push('/');
    }
  };
</script>
<style scoped>
  #card-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  #login-card {
    background-color: #ffffff;
    border-radius: 12px;
    width: 400px;
  }

  #card-content {
    padding: 24px 24px 36px 24px;
  }

  #card-title {
    font-size: 2em;
    margin-bottom: 24px;
  }

  .gray {
    color: #CCCCCC;
  }

  .title {
    cursor: pointer;
  }

  #btn-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
