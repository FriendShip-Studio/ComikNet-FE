<template>
    <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
        <div class="content">
            <div class="content-title">观看记录</div>
            <div id="history-list">
                <a-popover placement="right" :mouseEnterDelay="0.5" v-for="(item, index) in historyList" :key="item.id">
                    <template #content>
                        <AlbumInfo :albumID="item.id" />
                    </template>
                    <template #title>
                        <div class="info-title">{{ item.name }}</div>
                    </template>
                    <div class="history-item">
                        <img :src="parseCover(item.id)" class="cover" />
                    </div>
                </a-popover>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ComicItem } from "@/models/favlist";
import { useRouter } from "vue-router";
import AlbumInfo from "@/components/AlbumInfo.vue";
import user from "@/api/user";

const router = useRouter();
const historyList = ref<Array<ComicItem>>();

const getFavourite = async () => {

    let page;
    console.log(router.currentRoute.value.query.page);
    if (!Number.isInteger(Number(router.currentRoute.value.query.page))) {
        page = "0";
    } else {
        page = router.currentRoute.value.query.page as string;
    }


    try {
        const res = await user.getHistory(Number(page));
        historyList.value = res.data?.list;
    } catch (error: any) {
        router.push("/login");
    }
};

const parseCover = (id: string) => {
    return `https://cdn-msp.jmapiproxy2.cc/media/albums/` + id + `_3x4.jpg`;
};

onMounted(() => {
    getFavourite();
});
</script>

<style scoped>
#history-list {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    justify-items: center;
    gap: 24px;
}

.history-item {
    transition: transform 0.2s cubic-bezier(0.06, 0.45, 0.35, 0.85);
    transform-origin: top;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    z-index: 1;
    display: grid;
    place-items: center;
}

.cover {
    height: 280px;
    width: 210px;
    object-fit: cover;
}

.fav-item:hover {
    transform: perspective(280px) rotateX(1deg);
    box-shadow: 0 0 10px 0 purple;
}

.info-title {
    font-size: 1.2em;
    font-weight: bold;
    max-width: 400px;
}

/*.fav-item::after {*/
/*  position: absolute;*/
/*  content: "";*/
/*  height: 280px;*/
/*  width: 210px;*/
/*  transition: transform 0.2s cubic-bezier(0.06, 0.45, 0.35, 0.85);*/
/*  transform-origin: top;*/
/*  background: linear-gradient(to bottom left,*/
/*  transparent,*/
/*  rgba(255, 255, 255, 0.4) 25%,*/
/*  transparent 30%,*/
/*  transparent 100%);*/
/*  z-index: 2;*/
/*}*/

/*.fav-item:hover::after {*/
/*  !* background: linear-gradient(to bottom left , transparent, transparent 30%,rgba(255,255,255,0.6) 31%, rgba(255,255,255,0.6) 39%, transparent 40%, transparent 100% ); *!*/
/*  transform: perspective(280px) rotateX(1deg);*/
/*}*/
@media (max-width: 1500px) {
    #fav-list {
        grid-template-columns: repeat(5, 1fr);
    }
}

@media (max-width: 1250px) {
    #fav-list {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 1000px) {
    #fav-list {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 750px) {
    #fav-list {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 512px) {
    .cover {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }

    .main {
        min-width: 350px;
    }

    .info-title {
        width: 85vw;
    }
}
</style>
