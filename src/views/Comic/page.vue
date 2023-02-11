<template>
  <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
    <div class="content">
      <div class="content-title">{{ albumInfo?.name? albumInfo.name + " - " + relativeCID : "漫画阅读"}}</div>
      <a-spin :spinning="isLoading" tip="请稍候，正在加载漫画信息..." />
      <div class="content-body">
        <div class="settings-container">
          <a-affix :offset-top="110">
            <a-button key="settingsPanel" id="settings-btn" shape="circle" size="large"
              @click="setShowReadingPanel(!showReadingPanel)" v-if="!isLoading"
              :type="showReadingPanel ? 'primary' : 'default'">
              <template #icon>
                <setting-outlined />
              </template>
            </a-button>
          </a-affix>
        </div>
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
      <a-drawer :visible="showReadingPanel" placement="right" @close="setShowReadingPanel(false)">
        <template #title>
          <setting-outlined />
          阅读设置
        </template>
        <a-divider>页面控制</a-divider>
        <div>
          <label>页面跳转到：</label>
          <a-row class="drawer-inner-items">
            <a-col :span="12">
              <a-slider v-model:value="readingPage" :min="1" :max="imgList?.img_list.length" />
            </a-col>
            <a-col :span="4">
              <a-input-number v-model:value="readingPage" :min="1" :max="imgList?.img_list.length"
                style="margin-left: 16px" />
            </a-col>
          </a-row>
          <a-button class="drawer-inner-items" type="primary" :href="anchorHref"
            @click="message.info(`已跳转至第${readingPage}页`)">跳转</a-button>
        </div>
        <a-divider>快速导航</a-divider>
        <div>
          <label>章节跳转到：</label>
          <a-select v-model:value="relativeCID" class="drawer-inner-items"
            @change="router.push(`/comic/${albumID}/${relativeCID}`)">
            <a-select-option v-for="chapter in chapterInfo" :key="chapter.id" :value="chapter.id">
              {{ chapter.id }}
            </a-select-option>
          </a-select>
        </div>
        <div>
          <a-button class="drawer-inner-items" key="return" type="primary"
            @click="$router.push(`/album/${albumID}`)" block>返回章节目录</a-button>
        </div>
      </a-drawer>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, onUnmounted } from "vue";
import JMImage from "@/components/JMImage/index.vue";
import album from "@/apis/utils/album";
import { useRouter } from "vue-router";
import useMirrorStore from "@/store/mirror";
import ComikNetCore from "@/database/index"
import type { AlbumInfo, ChapterImageData, ChapterInfo } from "@/models/albums";
import { message } from "ant-design-vue";
import { LeftOutlined, RightOutlined, SettingOutlined } from "@ant-design/icons-vue";
import useToggle from "@/utils/useToggle";
import useUserStore from "@/store/user";
import usePageStore from "@/store/page";

const router = useRouter();
const userStore = useUserStore();
const mirrorStore = useMirrorStore();
const pageStore = usePageStore();

const { val: isLoading, set: setIsLoading } = useToggle(false);
const { val: isScrolling, set: setIsScrolling } = useToggle(false);
const { val: showReadingPanel, set: setShowReadingPanel } = useToggle(false);

const imgList = ref<ChapterImageData>();
const albumInfo = ref<AlbumInfo>();
const chapterInfo = ref<ChapterInfo[]>([]);
const readingPage = ref<number>();
const anchorHref = ref("/");
const albumID = ref(router.currentRoute.value.params.aid);
const relativeCID = ref(router.currentRoute.value.params.cid);
const absoluteCID = ref<string>();

onMounted(() => {
  getChapterImgs();
  readingPage.value = pageStore.page.nowPage;
});

const parseImgURL = (pid: string) => {
  if (typeof (pid) !== "string") {
    return "";
  }

  return `https://${mirrorStore.pic_url}/media/photos/${absoluteCID.value}/${pid}`;
};

watch(
  () => readingPage.value,
  (page: number | undefined) => {
    if (page && imgList.value) {
      anchorHref.value = `#${page}`;
    }
  }
)

watch(
  () => router.currentRoute.value.params.aid,
  async (aid) => {
    if (router.currentRoute.value.path.startsWith("/comic")) {
      albumID.value = aid;
      await getChapterImgs();
    }
  }
)

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

onUnmounted(
  () => {
    pageStore.reset();
  }
)

</script>

<style scoped>
.content-body {
  padding: 24px;
}


.settings-container {
  float: right;
  justify-items: right;
  justify-content: right;
  align-items: center;
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

.drawer-inner-items {
  margin-top: 14px;
}

.return-btn {
  flex-grow: 1;
}
</style>
