<template>
  <a-skeleton :loading="loading" active>
    <a-descriptions v-if="albumInfo" :column="1" class="comic-card">
      <a-descriptions-item label="禁漫号">
        JM{{ albumInfo.id }}
      </a-descriptions-item>
      <a-descriptions-item label="作者">
        <span v-if="albumInfo.author.length === 0">没有作者信息~</span>
        <span v-else>
          <a-tag
            v-for="author in albumInfo.author"
            :key="author"
            color="#39c5bb"
          >
            {{ author }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="标签">
        <div class="tag-wrapper">
          <a-tag v-for="tag in albumInfo.tags" :key="tag" color="blue">
            {{ tag }}
          </a-tag>
        </div>
      </a-descriptions-item>
      <a-descriptions-item label="简介">
        <span
          v-if="!albumInfo.description || albumInfo.description.length === 0"
        >
          作品没有简介~
        </span>
        <span v-else>{{ albumInfo.description }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="统计">
        <a-tag color="green">{{ albumInfo.total_views }}</a-tag>
        <span>次浏览，</span>
        <a-tag color="red">{{ albumInfo.likes }}</a-tag>
        <span>人喜欢，</span>
        <a-tag color="orange">{{ albumInfo.comment_total }}</a-tag>
        <span>条评论</span>
      </a-descriptions-item>
    </a-descriptions>
  </a-skeleton>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import album from "@/apis/utils/album";
import type { AlbumInfo } from "@/models/albums";

const props = defineProps({
  id: String,
});

const loading = ref(true);
const albumInfo = ref<AlbumInfo | null>(null);

const setAlbumInfo = async () => {
  try {
    const data = await album.getAlbumInfo(props.id as string);
    albumInfo.value = data;
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  setAlbumInfo();
});
</script>

<style lang="css" scoped>
.comic-card {
  max-width: 400px;
}

.tag-wrapper {
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
}
</style>
