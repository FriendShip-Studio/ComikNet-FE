<template>
  <a-skeleton :loading="loading" active>
    <a-descriptions v-if="albumInfo" :column="1" class="info-card">
      <a-descriptions-item label="禁漫号">{{
        albumInfo.id
      }}</a-descriptions-item>
      <a-descriptions-item label="作者">
        <span class="gray-tip" v-if="albumInfo.author.length === 0"
          >没有作者信息~</span
        >
        <span v-else>{{ albumInfo.author.join("，") }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="标签">
        <div class="tag-wrapper">
          <a-tag v-for="tag in albumInfo.tags" :key="tag" color="blue">{{
            tag
          }}</a-tag>
        </div>
      </a-descriptions-item>
      <a-descriptions-item label="简介">
        <span class="gray-tip" v-if="albumInfo.description.length === 0">
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
import { onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { apiGet } from "@/api";
import { AlbumInfo } from "@/models/album";

const { albumID } = defineProps({
  albumID: String,
});

const loading = ref(true);
const albumInfo = ref<AlbumInfo | null>(null);

const getAlbumInfo = async () => {
  try {
    const resp = await apiGet(`http://localhost:8000/album?id=${albumID}`);
    albumInfo.value = resp.data;
    loading.value = false;
  } catch (error: any) {
    message.error(error.message);
  }
};

onMounted(() => {
  getAlbumInfo();
});
</script>

<style scoped>
.info-card {
  max-width: 400px;
}

.tag-wrapper {
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
}

.gray-tip {
  color: #999999;
}
@media (max-width: 512px) {
  .info-card {
    width: 85vw;
  }
}
</style>
