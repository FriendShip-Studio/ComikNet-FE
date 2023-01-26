<template>
  <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
    <div class="content">
      <div class="content-title">USER</div>
      <a-spin tip="再等会，要出来了" :spinning="!loaded" class="absoulte-spin">
      </a-spin>
      <div id="lightbox"></div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import useToggle from "@/utils/useToggle";

const { val: loaded, set: setLoaded } = useToggle(false);
</script>

<style scoped></style>
