<template>
  <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
    <div class="content">
      <div class="content-title">{{ albumInfo?.name || "漫画详情" }}</div>
      <a-spin
        tip="再等会，要出来了"
        :spinning="!albumLoaded"
        class="absoulte-spin"
      >
      </a-spin>
      <div class="content-album" v-if="albumLoaded && albumInfo">
        <div class="album-cover">
          <img :src="parseCoverURL(albumInfo?.id)" alt="cover" />
        </div>
        <div class="album-info">
          <a-descriptions v-if="albumLoaded" :column="1" :contentStyle="caonima_zi_zheme_xiao" :labelStyle="caonima_zi_zheme_xiao">
            <a-descriptions-item label="禁漫号">
              JM{{ albumInfo.id }}
            </a-descriptions-item>
            <a-descriptions-item label="作者">
              <span class="gray-tip" v-if="albumInfo.author.length === 0">
                没有作者信息~
              </span>
              <span v-else>
                <a-tag
                  v-for="author in albumInfo.author"
                  :key="author"
                  color="#39c5bb"
                >
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
              <span
                class="gray-tip"
                v-if="
                  !albumInfo.description || albumInfo.description.length === 0
                "
              >
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
            <a-descriptions-item label="章节列表">
              <a-spin
                :spinning="!chapterLoaded && albumLoaded"
                tip="加载章节列表中"
                class="relative-spin"
              >
              </a-spin>
              <div class="content-chapters" v-if="chapterLoaded">
                <a-button
                  v-for="chapter in chapterList"
                  :key="chapter.id"
                  @click="router.push(`/comic/${chapter.cid}`)"
                >
                  {{ chapter.id }}
                </a-button>
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
      <div id="related-list" v-if="albumLoaded">
        <Albums :album-list="albumInfo?.related_list" />
      </div>
      <a-spin
        :spinning="!chapterLoaded && albumLoaded"
        tip="加载评论中"
      ></a-spin>
      <div class="comments" v-if="commentsLoaded">
        <a-list
          class="comment-list"
          :header="`共 ${commentsList?.total} 条评论`"
          item-layout="horizontal"
          :data-source="commentsList?.list"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-comment
                :author="item.username"
                :avatar="parseAvatarURL(item.UID)"
              >
                <template #content>
                  <p>
                    {{ item.content }}
                  </p>
                </template>
                <template #datetime>
                  <a-tooltip :title="item.addtime.format('YYYY-MM-DD')">
                    <span>{{ item.datetime.fromNow() }}</span>
                  </a-tooltip>
                </template>
              </a-comment>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import useMirrorStore from "@/store/mirror";
import Albums from "@/components/ComicCards/AlbumList.vue";
import album from "@/apis/utils/album";
import { message } from "ant-design-vue";
import type { AlbumInfo, ChapterInfo } from "@/models/albums";
import type { CommentsList } from "@/models/comments";
import useToggle from "@/utils/useToggle";

const router = useRouter();
const mirrorStore = useMirrorStore();
const albumID = ref(router.currentRoute.value.params.id);

const { val: albumLoaded, set: setAlbumLoaded } = useToggle(false);
const { val: chapterLoaded, set: setChapterLoaded } = useToggle(false);
const { val: commentsLoaded, set: setCommentsLoaded } = useToggle(false);

const albumInfo = ref<AlbumInfo>();
const chapterList = ref<Array<ChapterInfo>>();
const commentsList = ref<CommentsList>();

const caonima_zi_zheme_xiao = {
  "font-size": "20px",
};

const parseCoverURL = (id: string | undefined) => {
  return `https://${mirrorStore.pic_url}/media/albums/${id}.jpg`;
};

const parseAvatarURL = (uid: string) => {
  return `https://${mirrorStore.pic_url}/media/users/${uid}.jpg`;
};

const resetLoaded = () => {
  setAlbumLoaded(false);
  setChapterLoaded(false);
  setCommentsLoaded(false);
  albumInfo.value = undefined;
  chapterList.value = undefined;
  commentsList.value = undefined;
};

const update = async (albumID: string) => {
  try {
    albumInfo.value = await album.getAlbumInfo(albumID);
    setAlbumLoaded(true);
    chapterList.value = await album.getChapterInfo(albumID);
    setChapterLoaded(true);
    // commentsList.value = await album.getAlbumComents(albumID);
    // setCommentsLoaded(true);
    // eslint-disable-next-line
  } catch (error: any) {
    // 建议弹出一个对话框提示错误并且询问是否前往源站还是重新加载
    console.log(error);
    message.error(error.errTip);
  }
};

watch(
  () => router.currentRoute.value.params.id,
  (newID) => {
    if (!newID || typeof newID !== "string") {
      router.push("/404");
      return;
    }
    albumID.value = newID;
    resetLoaded();
    update(newID);
  },
  {
    immediate: true,
  }
);
</script>

<style>
.content-album {
  padding: 24px;
  display: flex;
  column-gap: 24px;
}
.content-chapters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
