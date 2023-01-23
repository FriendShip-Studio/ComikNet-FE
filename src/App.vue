<script setup lang="ts">
</script>

<template>
  <RouterView />
</template>

<style>
* {
  box-sizing: border-box;
  font-family: Roboto, sans-serif;
}

html {
  transform: none;
}

body {
  height: 100vh;
  transform: none;
}

#app {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  transform: none;
  min-height: 100vh;
}

#app::before {
  content: "";
  position: fixed;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background-image: url("https://cdn.friendship.org.cn/LightPicture/2022/12/9ea252d45fd6c0ba.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(6px);
  z-index: -1;
}
</style>
