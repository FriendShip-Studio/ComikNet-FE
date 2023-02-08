<template>
  <div class="album-list" v-if="isRibbon">
    <a-badge-ribbon :text="ribbon_parser(item)" color="cyan" v-for="item in props.albumList">
      <a-popover :mouseEnterDelay="0.5" :placement="((props.albumList?.indexOf(item)!) % 6) >= 3 ? 'left' : 'right'">
        <template #content>
          <AlbumCard :id="item.id" />
        </template>
        <template #title>
          <div class="comic-title">{{ item.name }}</div>
        </template>
        <div class="comic-item" @click="$router.push(`/album/${item.id}`)">
          <img :src="parseCoverURL(item.id)" class="comic-cover" />
          <div class="comic-overlay">
            <div class="comic-overlay-title">
              {{ item.name }}
            </div>
          </div>
          <div class="comic-mask" v-if="isHistory" @mouseover="getLastViewedChapter(item.id)">
            <div>{{ lastViewedChapter }}</div>
          </div>
          <div class="comic-glass" v-else />
        </div>
      </a-popover>
    </a-badge-ribbon>
  </div>
  <div class="album-list" v-else>
    <a-popover v-for="item in props.albumList" :mouseEnterDelay="0.5"
      :placement="((props.albumList?.indexOf(item)!) % 6) >= 3 ? 'left' : 'right'">
      <template #content>
        <AlbumCard :id="item.id" />
      </template>
      <template #title>
        <div class="comic-title">{{ item.name }}</div>
      </template>
      <div class="comic-item" @click="$router.push(`/album/${item.id}`)">
        <img :src="parseCoverURL(item.id)" class="comic-cover" />
        <div class="comic-overlay">
          <div class="comic-overlay-title">
            {{ item.name }}
          </div>
        </div>
        <div class="comic-mask" v-if="isHistory" @mouseover="getLastViewedChapter(item.id)">
          <div>{{ lastViewedChapter }}</div>
        </div>
        <div class="comic-glass" v-else />
      </div>
    </a-popover>
  </div>
</template>

<script lang="ts" setup>
import useMirrorStore from "@/store/mirror";
import AlbumCard from "@/components/ComicCards/AlbumCard.vue";
import ComikNetCore from "@/database/index";
import type { AlbumInfo } from "@/models/albums";
import { ref } from "vue";
import useUserStore from "@/store/user";
import { datetimeFormatter } from "@/utils/timeFormatter";

const mirrorStore = useMirrorStore();
const userStore = useUserStore();

const lastViewedChapter = ref<string>("");

const props = defineProps({
  albumList: Array<AlbumInfo>,
  isHistory: Boolean,
  isRibbon: Boolean
});

const ribbon_parser = (album: AlbumInfo): string => {

  if (!album.category || !album.category_sub) return "未知分类"

  if (album.category.title == album.category_sub.title) {
    return album.category?.title;
  } else {
    if (album.category_sub.id === null || album.category_sub.title === null) {
      return album.category?.title;
    } else {
      return album.category?.title + " " + album.category_sub?.title;
    }
  }
}

const getLastViewedChapter = async (aid: string) => {
  if (!userStore.uid) {
    lastViewedChapter.value = "获取历史记录时出错";
    return;
  }
  const res = await ComikNetCore.getAlbumHistory(userStore.uid, aid);
  if (res !== null) {
    lastViewedChapter.value = datetimeFormatter(res.update_time) + "您看到第 " + String(res.cid) + " 章";
  } else {
    lastViewedChapter.value = "您还没有看过此漫画";
  }
}

const parseCoverURL = (id: string) => {
  return `https://${mirrorStore.pic_url}/media/albums/${id}_3x4.jpg`;
};
</script>

<style scoped>
.comic-item-box {
  perspective: 300px;
  perspective-origin: 50%;
}

.comic-item {
  position: relative;
  filter: brightness(1) contrast(1);
  cursor: pointer;
  transition-duration: 0.6s;
  transition-property: transform, filter, opacity, box-shadow;
  transition-timing-function: cubic-bezier(0, 0.73, 0.48, 1);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.5);
  transform-style: preserve-3d;
  transform-origin: 50% 50%;
  overflow: hidden;
}

.comic-cover {
  height: 280px;
  width: 210px;
  object-fit: cover;
  transition-duration: 0.4s;
  transition-property: transform, filter;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.comic-glass {
  opacity: 0.1;
  cursor: pointer;
  width: 220%;
  height: 100%;
  background: linear-gradient(to bottom,
      rgba(235, 245, 255, 0) 0%,
      rgba(235, 245, 255, 0.85) 12px,
      rgba(235, 245, 255, 0.75) 20%,
      rgba(210, 210, 210, 0) 60%,
      rgba(10, 10, 10, 0) 85%,
      rgba(10, 10, 10, 0.8) 100%);
  position: absolute;
  top: 0px;
  left: 0px;
  pointer-events: none;
  transform: rotateZ(212deg) translateX(12%) translateY(59%);
  z-index: 10;
  transition-property: transform, opacity;
  transition-duration: 0.6s;
  transition-timing-function: cubic-bezier(0, 0.73, 0.48, 1);
}

.comic-overlay {
  opacity: 1;
  transition-delay: 0s;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  color: white;
  justify-content: flex-end;
  pointer-events: none;
}

.comic-overlay-title {
  font-size: 13px;
  padding: 0 4px 0 4px;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: all;
}

.comic-item:hover {
  transform: rotateX(3deg) translateZ(15px);
  filter: brightness(1.1) contrast(0.95) saturate(1);
  box-shadow: 0px 14px 12px 0px rgba(0, 0, 0, 0.3);
}

.comic-item:hover .comic-glass {
  opacity: 0.2;
  transform: rotateZ(210deg) translateX(12%) translateY(32%);
}

.comic-title {
  font-size: 1.2em;
  font-weight: bold;
  max-width: 400px;
}

.album-list {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-items: center;
  gap: 24px;
}

@media (max-width: 1500px) {
  .album-list {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1250px) {
  .album-list {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1000px) {
  .album-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 750px) {
  .album-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 512px) {
  .main {
    min-width: 350px;
  }

  .comic-cover {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .comic-title {
    width: 85vw;
  }
}

.comic-item {
  height: 280px;
  width: 210px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  transition-delay: 0s;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  transition-property: all;
}

.comic-cover {
  height: 280px;
  width: 210px;
  object-fit: cover;
  transition-duration: 0.4s;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.comic-overlay,
.comic-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition-duration: 0.4s;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  display: flex;
  flex-direction: column;
  color: white;
}

.comic-mask {
  opacity: 0;
  transition-delay: 0.1s;
  text-align: center;
  padding: 24px;
  justify-content: center;
  justify-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.comic-item:hover {
  box-shadow: 0 0 10px 0 #9a9594;
}

.comic-item:hover .comic-cover {
  transform: scale(1.1, 1.1);
}

.comic-item:hover .comic-overlay {
  opacity: 0;
}

.comic-item:hover .comic-mask {
  opacity: 1;
}
</style>
