<template>
    <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
        <div class="content">
            <div class="content-title">{{ albumInfo?.name || "漫画详情" }}</div>
            <a-spin tip="请稍候，正在加载漫画信息..." :spinning="!albumLoaded" class="absoulte-spin">
                <div class="content-album" v-if="albumLoaded && albumInfo">
                    <div class="album-cover">
                        <a-image :width="400" :src="parseCoverURL(albumInfo?.id)" alt="cover" />
                    </div>
                    <div class="album-info">
                        <a-descriptions v-if="albumLoaded" :column="1" :labelStyle="{ 'font-size': '18px' }"
                            :contentStyle="{ 'font-size': '16px' }">
                            <a-descriptions-item label="禁漫号">
                                JM{{ albumInfo.id }}
                            </a-descriptions-item>
                            <a-descriptions-item label="作者">
                                <span class="gray-tip" v-if="albumInfo.author.length === 0">
                                    没有作者信息~
                                </span>
                                <span v-else>
                                    <a-tag v-for="author in albumInfo.author" :key="author" color="#39c5bb">
                                        {{ author }}
                                    </a-tag>
                                </span>
                            </a-descriptions-item>
                            <a-descriptions-item label="标签">
                                <div class="tag-wrapper">
                                    <a-tag v-for="tag in albumInfo.tags" :key="tag" color="blue">
                                        {{ tag }}
                                    </a-tag>
                                </div>
                            </a-descriptions-item>
                            <a-descriptions-item label="简介">
                                <span class="gray-tip"
                                    v-if="!albumInfo.description || albumInfo.description.length === 0">
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
                            <a-descriptions-item>
                                <a-tooltip title="此漫画已收藏，点击以取消收藏">
                                    <a-button type="primary" v-if="albumInfo.is_favorite" @click="updateFavor"
                                        :loading="isFavProcessing">
                                        已收藏
                                        <template #icon>
                                            <heart-filled />
                                        </template>
                                    </a-button>
                                </a-tooltip>
                                <a-tooltip title="尚未收藏此漫画，点击以收藏此漫画">
                                    <a-button v-if="!albumInfo.is_favorite" @click="updateFavor"
                                        :loading="isFavProcessing">
                                        未收藏
                                        <template #icon>
                                            <heart-outlined />
                                        </template>
                                    </a-button>
                                </a-tooltip>
                            </a-descriptions-item>
                            <a-descriptions-item label="章节列表">
                                <a-spin :spinning="!chapterLoaded && albumLoaded" tip="加载章节列表中" class="relative-spin" />
                                <div class="content-chapters" v-if="chapterLoaded">
                                    <span v-for="chapter in chapterList" :key="chapter.id">
                                        <a-tooltip v-if="String(lastViewedRecord?.cid) == chapter.id"
                                            :title="`您上次(${lastViewedRecord?.update_time})看到这里`">
                                            <a-button type="primary" class="last-viewed-btn"
                                                @click="router.push(`/comic/${albumID}/${chapter.id}`)">
                                                {{ chapter.id }}
                                            </a-button>
                                        </a-tooltip>
                                        <a-button v-else @click="router.push(`/comic/${albumID}/${chapter.id}`)">
                                            {{ chapter.id }}
                                        </a-button>
                                    </span>
                                </div>
                            </a-descriptions-item>
                            <a-descriptions-item v-if="chapterLoaded">
                                <a-button @click="setShowRedirectMirror(true)" type="dashed" block>前往源站点阅读</a-button>
                            </a-descriptions-item>
                        </a-descriptions>
                    </div>
                </div>
            </a-spin>
            <h2 v-if="albumLoaded">相关推荐</h2>
            <div id="related-list" v-if="albumLoaded">
                <Albums :album-list="albumInfo?.related_list" />
            </div>
            <h2 v-if="albumLoaded">评论</h2>
            <a-spin :spinning="chapterLoaded && !commentsLoaded" tip="加载评论中">
                <div class="comments" v-if="commentsLoaded">
                    <a-list class="comment-list" :header="`共 ${commentsList?.total} 条评论`" item-layout="horizontal"
                        :data-source="commentsList?.list">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-comment :author="item.username" :avatar="parseAvatarURL(item.photo)">
                                    <template #content>
                                        <p>
                                            {{ item.content }}
                                        </p>
                                    </template>
                                    <template #datetime>
                                        <a-tooltip>
                                            <span>{{ item.addtime }}</span>
                                        </a-tooltip>
                                    </template>
                                </a-comment>
                            </a-list-item>
                        </template>
                    </a-list>
                    <div v-if="commentsList?.list && Number(commentsList.total) > 10">
                        <a-pagination class="page-panel" :current="Number(commentPage)" simple :default-current="1"
                            :total="Number(commentsList.total)" :min="1" @change="commentPageChanged" />
                    </div>
                </div>
            </a-spin>
        </div>
        <a-modal :visible="isError" :closable="false" :maskClosable="false" :keyboard="false" :title="setModalTitle()">
            <api-outlined class="loading-error-icon" v-if="!showRedirectMirror" />
            <div class="loading-error-content" v-if="!showRedirectMirror">
                <h3 class="loading-error-title">很遗憾，ComikNet 在尝试加载此漫画时出现了错误。</h3>
                <p>可能是此漫画不存在或链接已经失效，也可能只是一时的服务器通讯故障。</p>
                <p>您可以选择刷新页面以再次尝试，但您也可以选择返回上一页或者尝试前往源站点阅读。</p>
                <p>您准备怎么做？</p>
            </div>
            <export-outlined class="loading-error-icon" v-if="showRedirectMirror" />
            <div class="loading-error-content" v-if="showRedirectMirror">
                <h3 class="loading-error-title">请选择重定向到源站所使用的镜像源</h3>
                <p>如果您选择前往源站点阅读，您将离开 ComikNet 站点。</p>
                <p>ComikNet 不保证每个入口都正常可用</p>
                <div>
                    <a-button :href="`https://18comic.vip/album/${albumID}`" type="primary" block>国际主线路 1</a-button>
                    <a-button class="mirror-btn" :href="`https://18comic.org/album/${albumID}`" block>国际主线路 2</a-button>
                    <a-button class="mirror-btn" :href="`https://jmcomic.me/album/${albumID}`" type="primary"
                        block>东南亚线路 1</a-button>
                    <a-button class="mirror-btn" :href="`https://jmcomic1.me/album/${albumID}`" block>东南亚线路 2</a-button>
                    <a-button class="mirror-btn" :href="`https://jmcomic.rocks/album/${albumID}`" type="primary"
                        block>内地线路 1</a-button>
                    <a-button class="mirror-btn" :href="`https://jmcomic1.rocks/album/${albumID}`" block>内地线路
                        2</a-button>
                    <a-button class="mirror-btn" :href="`https://jmcomic.group/album/${albumID}`" type="primary"
                        block>内地线路 3</a-button>
                </div>
            </div>
            <template #footer>
                <a-button v-if="!showRedirectMirror" key="refresh" @click="resetLoaded(); update(albumID as string);"
                    type="primary">刷新此页面</a-button>
                <a-button v-if="!showRedirectMirror" key="back" @click="router.back()">返回上一页</a-button>
                <a-button v-if="!showRedirectMirror" key="back" @click="setShowRedirectMirror(true)"
                    type="danger">前往源站点</a-button>
                <a-button v-if="showRedirectMirror" key="cancel" @click="setShowRedirectMirror(false)"
                    type="primary">我再想想</a-button>
            </template>
        </a-modal>
        <a-modal :visible="!isError && showRedirectMirror" :closable="false" :maskClosable="false" :keyboard="false"
            title="前往源站点阅读此漫画">
            <export-outlined class="loading-error-icon" />
            <div class="loading-error-content">
                <h3 class="loading-error-title">请选择重定向到源站所使用的镜像源</h3>
                <p>如果您选择前往源站点阅读，您将离开 ComikNet 站点。</p>
                <p>ComikNet 不保证每个入口都正常可用</p>
                <div>
                    <a-button :href="`https://18comic.vip/album/${albumID}`" type="primary" block>国际主线路 1</a-button>
                    <a-button class="mirror-btn" :href="`https://18comic.org/album/${albumID}`" block>国际主线路 2</a-button>
                    <a-button class="mirror-btn" :href="`https://jmcomic.me/album/${albumID}`" type="primary"
                        block>东南亚线路
                        1</a-button>
                    <a-button class="mirror-btn" :href="`https://jmcomic1.me/album/${albumID}`" block>东南亚线路 2</a-button>
                    <a-button class="mirror-btn" :href="`https://jmcomic.rocks/album/${albumID}`" type="primary"
                        block>内地线路
                        1</a-button>
                    <a-button class="mirror-btn" :href="`https://jmcomic1.rocks/album/${albumID}`" block>内地线路
                        2</a-button>
                    <a-button class="mirror-btn" :href="`https://jmcomic.group/album/${albumID}`" type="primary"
                        block>内地线路
                        3</a-button>
                </div>
            </div>
            <template #footer>
                <a-button key="cancel" @click="setShowRedirectMirror(false)" type="primary">返回</a-button>
            </template>
        </a-modal>
    </main>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import useMirrorStore from "@/store/mirror";
import Albums from "@/components/ComicCards/AlbumList.vue";
import { ApiOutlined, ExportOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons-vue";
import album from "@/apis/utils/album";
import { message } from "ant-design-vue";
import type { AlbumInfo, ChapterInfo } from "@/models/albums";
import type { CommentsList } from "@/models/comments";
import useToggle from "@/utils/useToggle";
import ComikNetCore from "@/database/index";
import sleep from "@/utils/useSleep";
import { HistoryRecord } from "@/models/database";

const router = useRouter();
const mirrorStore = useMirrorStore();
const albumID = ref(router.currentRoute.value.params.aid);
const commentPage = ref(1);

const { val: albumLoaded, set: setAlbumLoaded } = useToggle(false);
const { val: chapterLoaded, set: setChapterLoaded } = useToggle(false);
const { val: commentsLoaded, set: setCommentsLoaded } = useToggle(false);
const { val: isError, set: setIsError } = useToggle(false);
const { val: showRedirectMirror, set: setShowRedirectMirror } = useToggle(false);
const { val: isFavProcessing, set: setIsFavProcessing } = useToggle(false);

const albumInfo = ref<AlbumInfo>();
const chapterList = ref<Array<ChapterInfo>>();
const commentsList = ref<CommentsList>();
const lastViewedRecord = ref<HistoryRecord | null>();


const parseCoverURL = (id: string | undefined) => {
    return `https://${mirrorStore.pic_url}/media/albums/${id}_3x4.jpg`;
};

const parseAvatarURL = (pic: string) => {
    return `https://${mirrorStore.pic_url}/media/users/${pic}`;
};

const commentPageChanged = (p: number) => {
    commentPage.value = p;
}

const updateFavor = async () => {
    if (typeof (albumID.value) !== "string") return;
    if (isFavProcessing.value) return;
    setIsFavProcessing(true);
    if (await album.setFavorStat(albumID.value)) {
        message.success("收藏成功");
        albumInfo.value!.is_favorite = true;
    } else {
        message.success("取消收藏成功");
        albumInfo.value!.is_favorite = false;
    }
    await sleep(1000);
    setIsFavProcessing(false);
}

const resetLoaded = () => {
    setAlbumLoaded(false);
    setChapterLoaded(false);
    setCommentsLoaded(false);
    setIsError(false);
    albumInfo.value = undefined;
    chapterList.value = undefined;
    commentsList.value = undefined;
};

const setModalTitle = () => {
    if (isError && !showRedirectMirror) {
        return "ComikNet - 加载失败";
    } else {
        if (showRedirectMirror) {
            return "前往源站点阅读本漫画";
        }
    }
};

const update = async (albumID: string) => {
    try {
        albumInfo.value = await album.getAlbumInfo(albumID);
        setAlbumLoaded(true);
        chapterList.value = await album.getChapterInfo(albumID);
        lastViewedRecord.value = await ComikNetCore.getAlbumHistory(albumID);
        setChapterLoaded(true);
        commentsList.value = await album.getAlbumComents(albumID, commentPage.value);
        setCommentsLoaded(true);
        // eslint-disable-next-line
    } catch (error: any) {
        setIsError(true);
        console.log(error);
        message.error(error.errTip);
    }
};

watch(
    () => router.currentRoute.value.params.aid,
    (newID) => {
        if (!newID || typeof newID !== "string") {
            if (router.currentRoute.value.path.startsWith("/album")) {
                message.warn("无效的漫画ID");
                router.push("/404");
                return;
            } else {
                return;
            }
        }
        albumID.value = newID;
        resetLoaded();
        update(newID);
    },
    {
        immediate: true,
    }
);

watch(
    () => commentPage.value,
    async (newPage) => {
        setCommentsLoaded(false);
        commentsList.value = await album.getAlbumComents(albumID.value as string, newPage);
        setCommentsLoaded(true);
    }
)

</script>

<style>
.content-album {
    padding: 24px;
    display: flex;
    column-gap: 24px;
}

.favor-icon {
    font-size: 24px;
}


.content-chapters {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}


.loading-error-icon {
    font-size: 58px;
    color: gray;
    position: relative !important;
    left: 50%;
    transform: translateX(-50%);
}

.loading-error-content {
    margin-top: 18px;
}

.loading-error-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
}

.mirror-btn {
    margin-top: 15px;
}

.page-panel {
    position: relative !important;
    left: 50%;
    transform: translateX(-5%);
}

.last-viewed-btn{
    box-shadow: 0 0 10px 0 #95afc0;
}
</style>
