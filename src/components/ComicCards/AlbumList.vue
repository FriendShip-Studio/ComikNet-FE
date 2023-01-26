<template>
  <div class="album-list">
    <a-popover
      placement="right"
      :mouseEnterDelay="0.5"
      v-for="item in props.albumList"
      :key="item.id"
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
        />
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
  transition: transform 0.2s cubic-bezier(0.06, 0.45, 0.35, 0.85);
  transform-origin: top;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: grid;
  place-items: center;
}

.comic-cover {
  height: 280px;
  width: 210px;
  object-fit: cover;
}

.comic-item:hover {
  transform: perspective(280px) rotateX(1deg);
  box-shadow: 0 0 10px 0 purple;
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
