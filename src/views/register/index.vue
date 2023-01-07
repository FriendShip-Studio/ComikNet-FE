<template>
  <div id="register">
    <a-form
      :model="registerState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="handleRegister"
    >
      <a-form-item
        label="邮箱"
        name="email"
        :rules="[{ required: true, message: '邮箱不能为空!' }]"
      >
        <a-input v-model:value="registerState.email" />
      </a-form-item>

      <a-form-item
        label="用户名"
        name="username"
        :rules="[{ required: true, message: '用户名不能为空!' }]"
      >
        <a-input v-model:value="registerState.username" />
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '密码不能为空!' }]"
      >
        <a-input-password v-model:value="registerState.password" />
      </a-form-item>

      <a-form-item
        label="确认密码"
        name="confirm_password"
        :rules="[{ required: true, message: '确认密码不能为空!' }]"
      >
        <a-input-password v-model:value="registerState.confirm_password" />
      </a-form-item>

      <a-form-item
        label="性别"
        name="sex"
        :rules="[{ required: true, message: '必须选择一个性别!' }]"
      >
        <a-radio-group v-model:value="registerState.sex">
          <a-radio value="Male">男</a-radio>
          <a-radio value="Female">女</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        label="验证码"
        name="captcha"
        :rules="[{ required: true, message: '验证码不能为空!' }]"
      >
        <img src="http://localhost:8000/captcha" alt="验证码" />
        <a-input v-model:value="registerState.captcha" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">注册</a-button>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8 }">
        <a-button html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import type { RegisterForm } from "@/models/form";
import { message } from "ant-design-vue";
import { reactive } from "vue";
import axios from "@/api"

const registerState = reactive<RegisterForm>({
  username: "",
  password: "",
  confirm_password: "",
  email: "",
  captcha: "",
  sex: "",
});

const handleRegister = async (values: RegisterForm) => {
  if (values.password !== values.confirm_password) {
    message.error("两次输入的密码不一致!");
    return;
  }
  try {
    const resp = await axios.post("http://localhost:8000/register", {
      username: values.username,
      password: values.password,
      email: values.email,
      captcha: values.captcha,
      sex: values.sex,
    })
    for (let msg of resp.data.data) {
        if (msg["type"] == "error") {
          message.error(msg["msg"]);
        } else {
          message.success(msg["msg"]);
        }
      }
  } catch (error) {
    console.log(error);
  }
};
</script>
<style scoped></style>
