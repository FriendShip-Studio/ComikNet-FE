<template>
    <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
        <div class="content">
            <div class="content-title">{{ albumInfo?.name }}</div>
            <div class="content-cover">
                <img :src="parseCoverURL(albumInfo?.id)" alt="cover" />
            </div>
            <div class="content-info">
                <a-descriptions v-if="albumInfo" :column="1" class="comic-card">
                    <a-descriptions-item label="禁漫号">
                        JM{{ albumInfo.id }}
                    </a-descriptions-item>
                    <a-descriptions-item label="作者">
                        <span class="gray-tip" v-if="albumInfo.author.length === 0">没有作者信息~</span>
                        <span v-else><a-tag v-for="author in albumInfo.author" :key="author" color="#39c5bb">{{
                            author
                        }}</a-tag></span>
                    </a-descriptions-item>
                    <a-descriptions-item label="标签">
                        <div class="tag-wrapper">
                            <a-tag v-for="tag in albumInfo.tags" :key="tag" color="blue">{{
                                tag
                            }}</a-tag>
                        </div>
                    </a-descriptions-item>
                    <a-descriptions-item label="简介">
                        <span class="gray-tip" v-if="!albumInfo.description || albumInfo.description.length === 0">
                            作品没有简介~
                        </span>
                        <span v-else>{{ albumInfo.description }}</span>
                    </a-descriptions-item>
                    <a-descriptions-item label="统计">
                        <a-tag color="green">{{ albumInfo.total_views }}</a-tag>
                        <span>次浏览，</span>
                        <a-tag color="red">{{ albumInfo.likes }}</a-tag>
                        <span>人喜欢，</span>
                        <a-tag color="orange">{{ albumInfo.comment_total }}</a-tag>
                        <span>条评论</span>
                    </a-descriptions-item>
                </a-descriptions>
            </div>
            <div class="chapters">
                <a-button v-for="chapter in chapterList" :key="chapter.id"
                    @click="router.push(`/comic/${chapter.cid}`)">{{ chapter.id }}</a-button>
            </div>
            <div id="related-list" label="相关推荐: ">
                <Albums :album-list="albumInfo?.related_list" id="fav-list" />
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import useMirrorStore from "@/store/mirror";
import Albums from "@/components/ComicCards/AlbumList.vue";
import album from "@/apis/utils/album";
import { message } from "ant-design-vue";
import { AlbumInfo, ChapterInfo } from "@/models/albums";

const router = useRouter();
const mirrorStore = useMirrorStore();

const albumID = router.currentRoute.value.params.id;

const albumInfo = ref<AlbumInfo>();
const chapterList = ref<Array<ChapterInfo>>();

const parseCoverURL = (id: string | undefined) => {
    return `https://${mirrorStore.pic_url}/media/albums/${id}_3x4.jpg`
}

const getAlbumInfo = async () => {
    if (!albumID || typeof albumID !== "string") {
        router.push("/404");
        return;
    }
    try {
        const res = await album.getAlbumInfo(albumID);
        if (res === null) {
            message.error("未能成功获取漫画信息!");
            router.push("/404");
            return;
        } else {
            albumInfo.value = res;
        }
    } catch (error: any) {
        message.error("未能成功获取漫画信息!");
        router.push("/404");
        return;
    }
}

const getChapterInfo = async () => {
    if (!albumID || typeof albumID !== "string") {
        router.push("/404");
        return;
    }
    try {
        const res = await album.getChapterInfo(albumID);
        if (res === null) {
            message.error("未能成功获取章节信息!");
            router.push("/404");
            return;
        } else {
            chapterList.value = res;
        }
    } catch (error: any) {
        message.error("未能成功获取章节信息!");
        router.push("/404");
        return;
    }

}

onMounted(() => {
    getAlbumInfo();
    getChapterInfo();
})
</script>

<style scoped>
#related-list {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    justify-items: center;
    gap: 24px;
}
</style>