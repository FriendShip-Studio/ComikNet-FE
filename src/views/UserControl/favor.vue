<template>
  <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
    <div class="content">
      <div class="content-title">收藏夹</div>
      <a-spin tip="再等会，要出来了" :spinning="!loaded" class="content-spin">
      </a-spin>
      <Albums :album-list="favList" id="fav-list" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import user from "@/apis/utils/userControl";
import Albums from "@/components/ComicCards/AlbumList.vue";
import type { AlbumInfo } from "@/models/albums";
import useToggle from "@/utils/useToggle";

const router = useRouter();
const { val: loaded, set: setLoaded } = useToggle(false);
const favList = ref<Array<AlbumInfo>>();

const getFavourite = async () => {
  try {
    setLoaded(false);
    const data = await user.getFavor();
    favList.value = data.list;
    // eslint-disable-next-line
  } catch (error: any) {
    router.push("/login");
  } finally {
    setLoaded(true);
  }
};

onMounted(() => {
  getFavourite();
});
</script>

<style scoped></style>
