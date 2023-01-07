<template>
  <div id="card-wrapper">
    <div id="register-card">
      <div id="card-content">
        <div id="card-title">
          <span class="title gray" @click="$router.push('/login')">登录</span>
          <span class="gray">丨</span>
          <span class="title">注册</span>
        </div>
        <a-form
          :model="registerForm"
          name="basic"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          autocomplete="off"
          @finish="handleRegister"
        >
          <a-form-item
            label="邮箱"
            name="email"
            :rules="[{ required: true, message: '邮箱不能为空!' }]"
          >
            <a-input v-model:value="registerForm.email"/>
          </a-form-item>
          <a-form-item
            label="用户名"
            name="username"
            :rules="[{ required: true, message: '用户名不能为空!' }]"
          >
            <a-input v-model:value="registerForm.username"/>
          </a-form-item>
          <a-form-item
            label="密码"
            name="password"
            :rules="[{ required: true, message: '密码不能为空!' }]"
          >
            <a-input-password v-model:value="registerForm.password"/>
          </a-form-item>
          <a-form-item
            label="确认密码"
            name="confirm_password"
            :rules="[{ required: true, message: '确认密码不能为空!' }]"
          >
            <a-input-password v-model:value="registerForm.confirm_password"/>
          </a-form-item>
          <a-form-item
            label="性别"
            name="sex"
            :rules="[{ required: true, message: '必须选择一个性别!' }]"
          >
            <a-radio-group v-model:value="registerForm.sex">
              <a-radio value="Male">男</a-radio>
              <a-radio value="Female">女</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="验证码"
            name="captcha"
            :rules="[{ required: true, message: '验证码不能为空!' }]"
          >
            <a-input v-model:value="registerForm.captcha"/>
            <img src="http://localhost:8000/captcha" alt="验证码"/>
          </a-form-item>
          <div id="btn-wrapper">
            <a-button type="link">已有账号？登录</a-button>
            <a-button type="primary" html-type="submit">注册</a-button>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import type { RegisterForm } from '@/models/form';
  import { message } from 'ant-design-vue';
  import { reactive } from 'vue';
  import useUserStore from '@/store/user';

  const userStore = useUserStore();
  const registerForm = reactive<RegisterForm>({
    username: '',
    password: '',
    confirm_password: '',
    email: '',
    captcha: '',
    sex: ''
  });

  const handleRegister = async (registerForm: RegisterForm) => {
    if (registerForm.password !== registerForm.confirm_password) {
      message.error('两次输入的密码不一致!');
      return;
    }
    try {
      await userStore.register(registerForm);
    } catch (error) {
      console.log(error);
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

  #register-card {
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
