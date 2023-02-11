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
                                    <a-tag class="tag" v-for="author in albumInfo.author" :key="author" color="#39c5bb"
                                        @click="router.push(`/search?query=${author}&page=1&sort=mr`)">
                                        {{ author }}
                                    </a-tag>
                                </span>
                            </a-descriptions-item>
                            <a-descriptions-item label="标签">
                                <div class="tag-wrapper">
                                    <a-tag class="tag" v-for="tag in albumInfo.tags" :key="tag" color="blue"
                                        @click="router.push(`/search?query=${tag}&page=1&sort=mr`)">
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
                            <a-descriptions-item class="stat-container">
                                <a-tooltip ::mouseEnterDelay=0.3 :mouseLeaveDelay=0.3 color="#39c5bb" title="此漫画被阅读的次数">
                                    <a-statistic :value="albumInfo.total_views" class="stat-item">
                                        <template #title>
                                            <eye-outlined />
                                            浏览
                                        </template>
                                    </a-statistic>
                                </a-tooltip>
                                <a-tooltip :mouseEnterDelay=0.3 :mouseLeaveDelay=0.3 color="#fdacac" title="此漫画被喜爱的次数">
                                    <a-statistic :value="albumInfo.likes" class="stat-item">
                                        <template #title>
                                            <like-outlined />
                                            喜欢
                                        </template>
                                    </a-statistic>
                                </a-tooltip>
                                <a-tooltip :mouseEnterDelay=0.3 :mouseLeaveDelay=0.3 color="gold"
                                    title="此漫画被禁漫天堂用户评论的次数">
                                    <a-statistic :value="albumInfo.comment_total" class="stat-item">
                                        <template #title>
                                            <message-outlined />
                                            评论
                                        </template>
                                    </a-statistic>
                                </a-tooltip>
                                <a-tooltip :mouseEnterDelay=0.3 :mouseLeaveDelay=0.3 color="green" title="此漫画已发布的章节数">
                                    <a-statistic
                                        :value="albumInfo.series && albumInfo.series?.length > 0 ? albumInfo.series?.length : 1"
                                        class="stat-item">
                                        <template #title>
                                            <book-outlined />
                                            章节数
                                        </template>
                                    </a-statistic>
                                </a-tooltip>
                            </a-descriptions-item>
                            <a-descriptions-item>
                                <span class="comic-btn-panel" v-if="chapterLoaded">
                                    <a-tooltip :title="albumInfo.is_favorite ? '此漫画已收藏，点击以取消收藏' : '尚未收藏此漫画，点击以收藏此漫画'">
                                        <a-button :type="albumInfo.is_favorite ? 'primary' : 'default'"
                                            @click="updateFavor" :loading="isFavProcessing">
                                            <star-filled v-if="albumInfo.is_favorite" />
                                            <star-outlined v-else />
                                            {{ albumInfo.is_favorite ? "已收藏" : "未收藏" }}
                                        </a-button>
                                    </a-tooltip>
                                    <a-tooltip :color="historyFailed ? 'orange' : 'green'">
                                        <template #title>
                                            {{
                                                historyFailed?" 历史记录功能暂不可用":
                                                    lastViewedRecord === null ? ("您还没有此漫画的浏览记录") : ("从您上次的进度开始阅读")
                                            }}
                                        </template>
                                        <a-button
                                            @click="router.push(`/comic/${albumInfo?.id}/${lastViewedRecord?.cid}`)"
                                            :type="lastViewedRecord === null && !historyFailed ? 'default' : 'primary'"
                                            :disabled="historyFailed || lastViewedRecord === null">
                                            <history-outlined />
                                            从{{
                                            lastViewedRecord?.cid!== undefined ?
                                            "第 " + lastViewedRecord?.cid + " 章" : "上次的进度"}}继续阅读
                                        </a-button>
                                    </a-tooltip>

                                    <a-tooltip color="blue" title="从漫画的第一章开始阅读">
                                        <a-button
                                            :type="lastViewedRecord !== null || historyFailed ? 'default' : 'primary'"
                                            @click="router.push(`/comic/${albumID}/1`)">
                                            <reload-outlined />从头开始阅读
                                        </a-button>
                                    </a-tooltip>
                                    <a-tooltip color="red" title="功能暂不可用，敬请期待!">
                                        <a-button disabled>
                                            <share-alt-outlined />
                                            分享到 ComikNet
                                        </a-button>
                                    </a-tooltip>
                                </span>
                            </a-descriptions-item>
                            <a-descriptions-item label="章节列表">
                                <a-spin :spinning="!chapterLoaded && albumLoaded" tip="加载章节列表中" class="relative-spin" />
                                <span class="chapters-container" v-if="chapterLoaded">
                                    <span class="content-chapters">
                                        <span v-if="chapterList && chapterList?.length <= 80"
                                            v-for="chapter in chapterList" :key="chapter.id">
                                            <a-tooltip v-if="String(lastViewedRecord?.cid) == chapter.id"
                                                :destroyTooltipOnHide="true"
                                                :title="`您 ${datetimeFormatter(lastViewedRecord?.update_time)} 看到这里`">
                                                <a-button type="primary" class="chapters-btn last-viewed-btn"
                                                    @click="router.push(`/comic/${albumID}/${chapter.id}`)">
                                                    {{ chapter.id }}
                                                </a-button>
                                            </a-tooltip>
                                            <a-button v-else @click="router.push(`/comic/${albumID}/${chapter.id}`)"
                                                class="chapters-btn">
                                                {{ chapter.id }}
                                            </a-button>
                                        </span>
                                        <span v-if="chapterList && chapterList?.length > 80"
                                            v-for="chapter in chapterList.slice((chaptersPage - 1) * 60, chaptersPage * 60)"
                                            :key="chapter.id">
                                            <a-tooltip v-if="String(lastViewedRecord?.cid) == chapter.id"
                                                :destroyTooltipOnHide="true"
                                                :title="`您 ${datetimeFormatter(lastViewedRecord?.update_time)} 看到这里`">
                                                <a-button type="primary" class="chapters-btn last-viewed-btn"
                                                    @click="router.push(`/comic/${albumID}/${chapter.id}`)">
                                                    {{ chapter.id }}
                                                </a-button>
                                            </a-tooltip>
                                            <a-button v-else @click="router.push(`/comic/${albumID}/${chapter.id}`)"
                                                class="chapters-btn">
                                                {{ chapter.id }}
                                            </a-button>
                                        </span>
                                    </span>
                                    <a-pagination v-if="chapterList && chapterList?.length > 80"
                                        class="chapters-page-panel" :current="chaptersPage" simple :default-current="1"
                                        :total="albumInfo.series?.length! * 10 / 60" :min="1"
                                        @change="chaptersPageChanged" />
                                </span>
                            </a-descriptions-item>
                            <a-descriptions-item v-if="chapterLoaded">
                                <a-button @click="
                                getSiteList(); setShowRedirectMirror(true);" type="dashed" block>前往源站点阅读</a-button>
                            </a-descriptions-item>
                        </a-descriptions>
                    </div>
                </div>
            </a-spin>
            <a-divider orientation="left">
                <h2 class="area-title" v-if="albumLoaded">相关推荐</h2>
            </a-divider>
            <div id="related-list" v-if="albumLoaded">
                <Albums :album-list="albumInfo?.related_list" />
            </div>

            <a-divider orientation="left">
                <h2 class="area-title" v-if="albumLoaded">源站评论</h2>
            </a-divider>
            <a-spin :spinning="chapterLoaded && !commentsLoaded" tip="加载评论中">
                <div class="comments" v-if="commentsLoaded && !commentsFailed">
                    <a-list class="comment-list" :header="`共 ${commentsList?.total} 条评论`" item-layout="horizontal"
                        :data-source="commentsList?.list">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-comment :author="item.username" :avatar="parseAvatarURL(item.photo)">
                                    <template #content>
                                        <p>{{ item.content }}</p>
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
                    <div v-if="commentsList?.list && Number(commentsList.total) > 10" class="pagination-container">
                        <a-pagination class="page-panel" :current="Number(commentPage)" simple :default-current="1"
                            :total="Number(commentsList.total)" :min="1" @change="commentPageChanged" />
                    </div>
                </div>
                <div v-else-if="commentsLoaded && commentsFailed" class="comments comment-error-container">
                    <stop-outlined style="font-size: 48px; margin-bottom: 15px;" />
                    <h2>漫画评论区暂不可用</h2>
                </div>
            </a-spin>
        </div>
        <a-modal :visible="isError" :closable="false" :maskClosable="false" :keyboard="false" title="ComikNet 访问异常">
            <api-outlined class="loading-error-icon" v-if="!showRedirectMirror" />
            <div class="loading-error-content" v-if="!showRedirectMirror">
                <h3 class="loading-error-title">很遗憾，ComikNet 在尝试加载此漫画时出现了错误。</h3>
                <p>可能是此漫画不存在或链接已经失效，也可能只是一时突发的服务器通讯故障。</p>
                <p>下面四个选项可能能帮助您解决此问题，悬浮在按钮上可以得到提示。</p>
                <p>您希望我们为您做什么？</p>
            </div>
            <export-outlined class="loading-error-icon" v-if="showRedirectMirror" />
            <div class="loading-error-content" v-if="showRedirectMirror">
                <h3 class="loading-error-title">请选择重定向到源站所使用的镜像源</h3>
                <p style="font-weight: bold;">如果您选择前往源站点阅读，您将离开 ComikNet 站点。</p>
                <p>ComikNet 不保证每个入口都正常可用</p>
                <div>
                    <a-spin :spinning="!siteLoaded" tip="加载镜像列表中..." />
                    <a-tooltip v-for="site in siteList" :key="site.name">
                        <template #title>
                            点击前往禁漫天堂的 {{ site.name }} 镜像站
                        </template>
                        <a-button class="mirror-btn" :href="`https://${site.url}/album/${albumID}`" block>
                            {{ site.name }}
                        </a-button>
                    </a-tooltip>
                </div>
            </div>
            <template #footer>
                <span v-if="!showRedirectMirror">
                    <a-tooltip color="green">
                        <template #title>
                            <p>如果只是暂时的网络波动，刷新页面可能会是解决问题最便捷的方法。</p>
                            <p>这大约需要十几秒。</p>
                        </template>
                        <a-button key="refresh" @click="resetLoaded(); update(albumID as string);"
                            type="primary">刷新此页面</a-button>
                    </a-tooltip>
                    <a-tooltip color="blue">
                        <template #title>
                            <p>如果反复出现无法载入，可能是当前选择的镜像连接质量不佳，重新选择最优的镜像可能可以解决此问题。</p>
                            <p>这可能需要一到两分钟。</p>
                        </template>
                        <a-button key="resetMirror" @click="resetMirror()" type="dashed">更换镜像源</a-button>
                    </a-tooltip>
                    <a-tooltip color="gold">
                        <template #title>
                            <p>如果只是输入了错误的地址，或者此漫画已经被删除或遗失，则您应该返回上一页。</p>
                            <p>您将立即被重定向至上一页面。</p>
                        </template>
                        <a-button key="back" @click="router.back()">返回上一页</a-button>
                    </a-tooltip>
                    <a-tooltip color="red">
                        <template #title>
                            <p>如果 ComikNet 服务意外中断，或您希望前往源站点继续尝试，您可以由此前往源站点的相关页面。</p>
                            <p>您将会离开 ComikNet 站点。</p>
                        </template>
                        <a-button key="back" @click="setShowRedirectMirror(true)" type="danger">前往源站点</a-button>
                    </a-tooltip>
                </span>
                <span v-if="showRedirectMirror">
                    <a-button key="cancel" @click="setShowRedirectMirror(false)" type="primary">我再想想</a-button>
                </span>

            </template>
        </a-modal>
        <a-modal :visible="!isError && showRedirectMirror" :closable="false" :maskClosable="false" :keyboard="false"
            title="前往源站点阅读此漫画">
            <export-outlined class="loading-error-icon" />
            <div class="loading-error-content">
                <h3 class="loading-error-title">请选择重定向到源站所使用的镜像源</h3>
                <p style="font-weight: bold;">如果您选择前往源站点阅读，您将离开 ComikNet 站点。</p>
                <p>ComikNet 不保证每个入口都正常可用</p>
                <div>
                    <a-spin :spinning="!siteLoaded" tip="加载镜像列表中..." />
                    <a-tooltip v-for="site in siteList" :key="site.name">
                        <template #title>
                            点击前往 禁漫天堂 的 {{ site.name }} 镜像站
                        </template>
                        <a-button class="mirror-btn" :href="`https://${site.url}/album/${albumID}`" block>
                            {{ site.name }}
                        </a-button>
                    </a-tooltip>
                </div>
            </div>
            <template #footer>
                <a-button key="cancel" @click="setShowRedirectMirror(false)" type="primary">返回</a-button>
            </template>
        </a-modal>
    </main>
</template>

<script lang="ts" setup>
import { ref, watch, h } from "vue";
import { useRouter } from "vue-router";
import useMirrorStore from "@/store/mirror";
import useUserStore from "@/store/user";
import Albums from "@/components/ComicCards/AlbumList.vue";
import {
    ApiOutlined, ExportOutlined, LikeOutlined, EyeOutlined,
    StarFilled, StarOutlined, MessageOutlined, BookOutlined,
    FieldTimeOutlined, EyeInvisibleOutlined, StopOutlined,
    ShareAltOutlined, HistoryOutlined, ReloadOutlined
} from "@ant-design/icons-vue";
import album from "@/apis/utils/album";
import { message, notification } from "ant-design-vue";
import type { AlbumInfo, ChapterInfo } from "@/models/albums";
import type { CommentsList } from "@/models/comments";
import type { WebSiteURL } from "@/models/mirror";
import useToggle from "@/utils/useToggle";
import ComikNetCore from "@/database/index";
import { datetimeFormatter } from "@/utils/timeFormatter";
import mirror from "@/apis/utils/mirror";
import sleep from "@/utils/useSleep";
import { HistoryRecord } from "@/models/database";

const router = useRouter();
const mirrorStore = useMirrorStore();
const userStore = useUserStore();
const albumID = ref(router.currentRoute.value.params.aid);
const commentPage = ref(1);
const chaptersPage = ref(1);

const { val: albumLoaded, set: setAlbumLoaded } = useToggle(false);
const { val: chapterLoaded, set: setChapterLoaded } = useToggle(false);
const { val: commentsLoaded, set: setCommentsLoaded } = useToggle(false);
const { val: isError, set: setIsError } = useToggle(false);
const { val: showRedirectMirror, set: setShowRedirectMirror } = useToggle(false);
const { val: isFavProcessing, set: setIsFavProcessing } = useToggle(false);
const { val: siteLoaded, set: setSiteLoaded } = useToggle(false);
const { val: historyFailed, set: setHistoryFailed } = useToggle(false);
const { val: commentsFailed, set: setCommentsFailed } = useToggle(false);

const albumInfo = ref<AlbumInfo>();
const chapterList = ref<Array<ChapterInfo>>();
const commentsList = ref<CommentsList>();
const lastViewedRecord = ref<HistoryRecord | null>();
const siteList = ref<WebSiteURL[]>([]);

const parseCoverURL = (id: string | undefined) => {
    return `https://${mirrorStore.pic_url}/media/albums/${id}_3x4.jpg`;
};

const parseAvatarURL = (pic: string) => {
    return `https://${mirrorStore.pic_url}/media/users/${pic}`;
};

const resetMirror = async () => {
    mirrorStore.reset();
    message.info("已重置镜像");
};

const commentPageChanged = (p: number) => {
    commentPage.value = p;
};

const chaptersPageChanged = (p: number) => {
    chaptersPage.value = p;
};

const getSiteList = async () => {
    if (siteLoaded.value) return;

    const res = await mirror.getSiteList();
    siteList.value = res;
    setSiteLoaded(true);
};

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
    setCommentsFailed(false);
    setHistoryFailed(false);
    albumInfo.value = undefined;
    chapterList.value = undefined;
    commentsList.value = undefined;
    lastViewedRecord.value = undefined;
};

const update = async (albumID: string) => {
    try {
        albumInfo.value = await album.getAlbumInfo(albumID);
        setAlbumLoaded(true);
        chapterList.value = await album.getChapterInfo(albumID);

    } catch (error: any) {
        getSiteList();
        setIsError(true);
    }
    try {
        if (!userStore.uid) {
            throw new Error("User not logged in");
        }
        lastViewedRecord.value = await ComikNetCore.getAlbumHistory(userStore.uid, albumID);
    } catch (error: any) {
        setHistoryFailed(true);
        notification.error({
            message: '读取 ComikNet 历史记录时出错',
            description: '您的上次观看记录将无法正常显示，但您仍可以正常阅览此漫画。您也可以选择刷新此页面重新尝试获取历史记录',
            icon: () => h(FieldTimeOutlined, { style: { color: '#fe8282' } }),
            duration: 30
        })
    }
    setChapterLoaded(true);

    try {
        commentsList.value = await album.getAlbumComents(albumID, commentPage.value);

    } catch (error: any) {

        setCommentsFailed(true);
        notification.error({
            message: '获取源站点评论时出错',
            description: '源站的评论区将不可用，但您仍可以正常阅览此漫画。您也可以选择刷新此页面重新尝试获取源站评论',
            icon: () => h(EyeInvisibleOutlined, { style: { color: '#fe8282' } }),
            duration: 30
        })
    };

    setCommentsLoaded(true);
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
.album-cover {
    margin-left: 35px;
    box-shadow: 0 0 5px 0 #95afc0;
}

.album-info {
    margin-left: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.content-album {
    padding: 24px;
    display: flex;
    column-gap: 24px;
}

.tag {
    margin-left: 4px;
    transition: all 0.3s;
    cursor: pointer;
}

.tag:hover {
    transform: scale(1.2);
    box-shadow: 0 0 5px 0 #95afc0;
}

.favor-icon {
    font-size: 24px;
}

.content-chapters {
    display: grid;
    grid-template-columns: repeat(20, 1fr);
    grid-auto-rows: 1fr;
    gap: 12px;
}

.chapters-btn {
    width: 50px;
    text-align: center;
    padding: 0;
}

.last-viewed-btn {
    box-shadow: 0 0 10px 0 #95afc0;
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
    text-align: center;
}

.mirror-btn:hover {
    background-color: #95afc063;
}

.comic-btn-panel {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.stat-container {
    display: flex;
    justify-content: right;
    align-items: center;
}

.stat-item {
    text-align: center;
    margin-right: 70px;
    transition: 0.3s all;
}

.stat-item:hover {
    cursor: pointer;
    transform: scale(1.1);
}

.chapters-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 5px;
}

.chapters-page-panel {
    margin-top: 15px;
}

.comment-error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 5px;
}

.area-title {
    font-size: 24px;
    font-weight: bold;
}

.comments {
    padding: 0 24px 24px;
}
</style>
