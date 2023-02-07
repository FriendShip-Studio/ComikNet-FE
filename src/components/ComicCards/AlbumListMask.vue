<template>
  <div class="album-list">
    <a-popover
      :mouseEnterDelay="0.5"
      v-for="item in props.albumList"
      :key="item.id"
      :placement="((props.albumList?.indexOf(item)!) % 6) >= 3 ? 'left' : 'right'"
    >
      <template #content>
        <AlbumCard :id="item.id" />
      </template>
      <template #title>
        <div class="comic-title">{{ item.name }}</div>
      </template>
      <div class="comic-item">
        <img
          :src="parseCoverURL(item.id)"
          @click="$router.push(`/album/${item.id}`)"
          class="comic-cover"
        />'
        <div class="comic-overlay">
          <div class="comic-overlay-title">
            [龍蓮個人漢化] [Nagi] キョンシー催眠
          </div>
        </div>
        <div class="comic-mask">
          <div>上次观看到</div>
          <div>第2023章</div>
        </div>
      </div>
    </a-popover>
  </div>
</template>

<script lang="ts" setup>
import useMirrorStore from "@/store/mirror";
import AlbumCard from "@/components/ComicCards/AlbumCard.vue";
import type { AlbumInfo } from "@/models/albums";

const mirrorStore = useMirrorStore();

const props = defineProps({
  albumList: Array<AlbumInfo>,
});

const parseCoverURL = (id: string) => {
  return `https://${mirrorStore.pic_url}/media/albums/${id}_3x4.jpg`;
};
</script>

<style scoped>
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

.comic-overlay-title {
  padding: 0 4px 0 4px;
  background-color: rgba(0, 0, 0, 0.5);
}

.comic-overlay {
  opacity: 1;
  transition-delay: 0s;
  justify-content: flex-end;
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
.comic-item:hover .comic-cover{
  transform: scale(1.1, 1.1);
}
.comic-item:hover .comic-overlay {
  opacity: 0;
}
.comic-item:hover .comic-mask {
  opacity: 1;
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
</style>
