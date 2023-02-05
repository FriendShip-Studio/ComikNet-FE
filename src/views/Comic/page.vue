<template>
  <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
    <div class="content">
      <div class="content-title">{{ albumInfo?.name? albumInfo.name + " - " + relativeCID : "漫画阅读"}}</div>
      <a-spin :spinning="isLoading" tip="请稍候，正在加载漫画信息..." />
      <div class="content-body">
        <a-button key="returnTop" type="primary" @click="$router.push(`/album/${albumID}`)" block>返回章节目录</a-button>
        <div class="image-container" v-if="!isLoading">
          <JMImage v-for="image in imgList?.img_list" :key="image" :imageSrc="parseImgURL(image)"
            :scramble_id="imgList?.scramble_id" />
        </div>
        <a-back-top />
      </div>
      <a-affix :offset-bottom="0" @change="setIsScrolling(!isScrolling)">
        <div class="chapter-panel" v-if="!isLoading">
          <a-button v-if="Number(relativeCID) > 1" key="prev"
            @click="router.push(`/comic/${albumID}/${Number(relativeCID) - 1}`)" type="primary">
            <left-outlined />上一章</a-button>
          <a-button v-if="!isScrolling" class="return-btn" key="return"
            @click="$router.push(`/album/${albumID}`)">返回章节目录</a-button>
          <span v-else class="return-btn" />
          <a-button v-if="Number(relativeCID) < chapterInfo?.length" key="next"
            @click="router.push(`/comic/${albumID}/${Number(relativeCID) + 1}`)" type="primary">
            下一章<right-outlined /></a-button>
        </div>
      </a-affix>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import JMImage from "@/components/JMImage/index.vue";
import album from "@/apis/utils/album";
import { useRouter } from "vue-router";
import useMirrorStore from "@/store/mirror";
import ComikNetCore from "@/database/index"
import type { AlbumInfo, ChapterImageData, ChapterInfo } from "@/models/albums";
import { message } from "ant-design-vue";
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import useToggle from "@/utils/useToggle";
import useUserStore from "@/store/user";

const router = useRouter();
const userStore = useUserStore();
const mirrorStore = useMirrorStore();

const { val: isLoading, set: setIsLoading } = useToggle(false);
const { val: isScrolling, set: setIsScrolling } = useToggle(false);

const imgList = ref<ChapterImageData>();
const albumInfo = ref<AlbumInfo>();
const chapterInfo = ref<ChapterInfo[]>([]);
const albumID = ref(router.currentRoute.value.params.aid);
const relativeCID = ref(router.currentRoute.value.params.cid);
const absoluteCID = ref<string>();

onMounted(() => {
  getChapterImgs();
});

watch(
  () => router.currentRoute.value.params.cid,
  async (cid) => {
    if (router.currentRoute.value.path.startsWith("/comic")) {
      relativeCID.value = cid;
      await getChapterImgs();
    }
  }
)

const getChapterImgs = async () => {

  setIsLoading(true);
  if (!albumID.value || typeof albumID.value !== "string") {
    router.push("/404");
    return;
  }

  if (!relativeCID.value || typeof relativeCID.value !== "string") {
    router.push("/404");
    return;
  }

  try {
    albumInfo.value = await album.getAlbumInfo(albumID.value);
    chapterInfo.value = await album.getChapterInfo(albumID.value);
    const cInfo = chapterInfo.value.find((item) => item.id === relativeCID.value);
    absoluteCID.value = cInfo?.cid;
    if (typeof (absoluteCID.value) !== "string") {
      throw new Error("未能成功获取章节信息!");
    }
  } catch (error: any) {
    message.error("未能成功获取章节信息!");
    router.push("/404");
    return;
  }

  try {
    if (typeof (userStore.uid) == "string") {
      ComikNetCore.recordHistory(userStore.uid, albumID.value, relativeCID.value);
    } else {
      console.log("历史记录设置失败！");
    }
  } catch (error) {
    console.log("历史记录设置失败！");
  }

  try {
    const res = await album.getChapterImgList(absoluteCID.value);
    imgList.value = res;
    // eslint-disable-next-line
  } catch (error: any) {
    message.error("未能成功获取章节图片!");
    router.push("/404");
    return;
  }
  setIsLoading(false);
};

const parseImgURL = (pid: string) => {
  return `https://${mirrorStore.pic_url}/media/photos/${absoluteCID.value}/${pid}`;
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

.chapter-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 16px;
  padding: 24px;
}

.return-btn {
  flex-grow: 1;
}
</style>
