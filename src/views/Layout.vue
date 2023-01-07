<template>
  <div id="wrapper">
    <Header />
    <RouterView></RouterView>
  </div>
</template>
<script lang="ts" setup>
import Header from "@/components/Header.vue";
</script>
<style>
#wrapper{
  background-color: whitesmoke;
}
</style>
