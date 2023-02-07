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
      <div class="comic-item-box">
        <div class="comic-item">
          <img
            :src="parseCoverURL(item.id)"
            @click="$router.push(`/album/${item.id}`)"
            class="comic-cover"
          />
          <div class="comic-glass"></div>
          <div class="comic-overlay">
            <div class="comic-overlay-title">
              [龍蓮個人漢化] [Nagi] キョンシー催眠
            </div>
          </div>
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
  background: linear-gradient(
    to bottom,
    rgba(235, 245, 255, 0) 0%,
    rgba(235, 245, 255, 0.85) 12px,
    rgba(235, 245, 255, 0.75) 20%,
    rgba(210, 210, 210, 0) 60%,
    rgba(10, 10, 10, 0) 85%,
    rgba(10, 10, 10, 0.8) 100%
  );
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
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  color: white;
  justify-content: flex-end;
}

.comic-overlay-title {
  padding: 0 4px 0 4px;
  background-color: rgba(0, 0, 0, 0.5);
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
</style>
