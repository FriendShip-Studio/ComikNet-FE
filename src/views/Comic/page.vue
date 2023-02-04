<template>
  <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
    <div class="content">
      <div class="content-title">漫画阅读</div>
      <div class="content-body">
        <div class="image-container">
          <JMImage v-for="image in imgList?.img_list" :key="image" :imageSrc="parseImgURL(image)"
            :scramble_id="imgList?.scramble_id" />
        </div>
        <a-back-top />
      </div>
      <a-button key="return" @click="$router.push(`/album/${chapterID}`)" type="primary" block>返回章节目录</a-button>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import JMImage from "@/components/JMImage/index.vue";
import album from "@/apis/utils/album";
import { useRouter } from "vue-router";
import useMirrorStore from "@/store/mirror";
import ComikNetCore from "@/database/index"
import type { ChapterImageData } from "@/models/albums";
import { message } from "ant-design-vue";
import useUserStore from "@/store/user";

const router = useRouter();
const userStore = useUserStore();
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
    if (typeof (userStore.uid) == "string") {
      ComikNetCore.recordHistory(userStore.uid, chapterID);
    } else {
      console.log("历史记录设置失败！");
    }
  } catch (error) {
    console.log("历史记录设置失败！");
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

.image-container {
  display: flex;
  flex-direction: column;
  column-gap: 16px;
  align-items: center;
  align-content: center;
}
</style>
