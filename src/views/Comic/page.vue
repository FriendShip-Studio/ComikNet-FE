<template>
  <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
    <div class="content">
      <div class="content-title">漫画阅读</div>
      <div class="content-body">
        <div class="album-wrapper">
          <JMImage
            v-for="image in imgList?.images"
            :key="image"
            :imageSrc="parseImgURL(image)"
            :scramble_id="imgList?.scramble_id"
          />
        </div>
        <a-back-top />
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import JMImage from "@/components/JMImage/index.vue";
import album from "@/apis/utils/album";
import { useRouter } from "vue-router";
import useMirrorStore from "@/store/mirror";
import type { ChapterImageData } from "@/models/albums";
import { message } from "ant-design-vue";

const router = useRouter();
const mirrorStore = useMirrorStore();

const imgList = ref<ChapterImageData>();
const chapterID = router.currentRoute.value.params.id;

onMounted(() => {
  getChapterImgs();
});

const getChapterImgs = async () => {
  if (!chapterID || typeof chapterID !== "string") {
    router.push("/404");
    return;
  }
  try {
    const res = await album.getChapterImgList(chapterID);
    imgList.value = res;
    // eslint-disable-next-line
  } catch (error: any) {
    message.error("未能成功获取章节图片!");
    router.push("/404");
    return;
  }
};

const parseImgURL = (pid: string) => {
  return `https://${mirrorStore.pic_url}/media/photos/${chapterID}/${pid}`;
};
</script>

<style lang="css" scoped>
.content-body {
  padding: 24px;
}
</style>
