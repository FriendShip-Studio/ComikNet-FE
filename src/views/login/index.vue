<template>
  <div id="login">
    <a-form
      :model="loginState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="handleLogin"
    >
      <a-form-item
        label="用户名"
        name="username"
        :rules="[{ required: true, message: '用户名不能为空!' }]"
      >
        <a-input v-model:value="loginState.username" />
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '密码不能为空!' }]"
      >
        <a-input-password v-model:value="loginState.password" />
      </a-form-item>

      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
        <a-checkbox v-model:checked="loginState.isRemember"
          >保持登录180天</a-checkbox
        >
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
    <a-button @click="$router.push('/register')">注册</a-button>
  </div>
</template>
<script lang="ts" setup>
import type { LoginForm } from "@/models/form";
import { router } from "@/router";
import { message } from "ant-design-vue";
import { reactive } from "vue";
import useUserStore from "@/store/user";

const userStore = useUserStore();

const loginState = reactive<LoginForm>({
  username: "",
  password: "",
  isRemember: false,
});

const handleLogin = async (values: LoginForm) => {
  if (await userStore.login(values)) {
    router.push("/favor");
  }
};
</script>
<style scoped></style>
