<template>
  <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
    <div class="content">
      <div class="content-title">收藏夹</div>
      <a-spin tip="正在加载，请稍候..." :spinning="!loaded" class="absoulte-spin" />
      <div v-if="favList && favList.length > 0">
        <Albums :album-list="favList" :is-direct="false" id="fav-list" />
      </div>
      <div v-else-if="favList && favList.length === 0" class="absoulte-spin">
        <question-outlined class="empty-icon" />
        <h1>你还没有收藏任何漫画</h1>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import user from "@/apis/utils/userControl";
import Albums from "@/components/ComicCards/AlbumList.vue";
import type { AlbumInfo } from "@/models/albums";
import { QuestionOutlined } from "@ant-design/icons-vue";
import useToggle from "@/utils/useToggle";

const router = useRouter();
const { val: loaded, set: setLoaded } = useToggle(false);
const favList = ref<AlbumInfo[]>();

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

<style scoped>
.empty-icon {
  font-size: 48px;
  position: relative !important;
  left: 50%;
  transform: translateX(-50%);
}
</style>
