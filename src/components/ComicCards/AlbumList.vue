<template>
    <div id="album-list">
        <a-popover placement="right" :mouseEnterDelay="0.75" v-for="item in albumList" :key="item.id">
            <template #content>
                <AlbumCard :id="item.id" />
            </template>
            <template #title>
                <div class="comic-title">{{ item.name }}</div>
            </template>
            <div class="comic-item">
                <a-image :src="parseCoverURL(item.id)" fallback="" class="comic-cover" />
            </div>
        </a-popover>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import mirror from "@/apis/utils/mirror";
import AlbumCard from "@/components/ComicCards/AlbumCard.vue";
import type { AlbumInfo } from "@/models/albums";

const picMirrorURL = ref("");

const { albumList } = defineProps({
    albumList: Array<AlbumInfo>
});

const savePicMirrorURL = async () => {
    picMirrorURL.value= await mirror.getPicMirror();
}

const parseCoverURL = (id: string) => {
    return `${picMirrorURL}/media/albums/${id}_3x4.jpg`
}

onMounted(() => {
    savePicMirrorURL();
});

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

@media (max-width: 512px) {
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