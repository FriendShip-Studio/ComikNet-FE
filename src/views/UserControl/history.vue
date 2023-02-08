<template>
    <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
        <div class="content">
            <div class="content-title">历史记录</div>
            <div class="historyList">
                <a-spin tip="请稍候，正在加载" :spinning="!loaded" class="absoulte-spin">
                    <div v-if="historyList.length > 0">
                        <label>按 </label>
                        <a-switch @click="setReversed(!isReversed)" :checked="isReversed" checked-children="从旧到新"
                            un-checked-children="从新到旧" />
                        <label> 的顺序展示您的历史记录</label>
                        <a-timeline :reverse="isReversed" class="historyList" v-if="loaded">
                            <a-timeline-item v-for="time in historyTimeDict.keys()" :key="time">
                                <template #dot>
                                    <clock-circle-outlined style="font-size: 16px" />
                                </template>
                                <label class="title">{{ time }}</label>
                                <Albums :album-list="historyTimeDict.get(time)" :isHistory="true" />
                            </a-timeline-item>
                        </a-timeline>
                    </div>
                    <div class="historyList" v-else-if="loaded">
                        <a-empty description="暂无历史记录" />
                    </div>
                </a-spin>
                <a-back-top />
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import useUserStore from "@/store/user";
import useToggle from "@/utils/useToggle";
import ComikNetCore from "@/database/index";
import Albums from "@/components/ComicCards/AlbumList.vue";
import type { HistoryRecord } from "@/models/database";
import type { AlbumInfo } from "@/models/albums";
import album from "@/apis/utils/album";
import { message } from "ant-design-vue";
import { ClockCircleOutlined } from "@ant-design/icons-vue"
import { datetimeFormatter } from "@/utils/timeFormatter";

const router = useRouter();
const { val: loaded, set: setLoaded } = useToggle(false);
const { val: isReversed, set: setReversed } = useToggle(false);
const userStore = useUserStore();

const historyList = ref<HistoryRecord[]>([]);
const historyTimeDict = ref<Map<string, AlbumInfo[]>>(new Map());

const getHistoryList = async () => {
    try {
        setLoaded(false);
        if (!userStore.uid) {
            router.push("/login");
            return;
        }
        historyList.value = await ComikNetCore.getUserHistory(userStore.uid);
        for (let item of historyList.value) {
            if (historyTimeDict.value.has(datetimeFormatter(item.update_time))) {
                historyTimeDict.value.get(datetimeFormatter(item.update_time))?.push(await album.getAlbumInfo(String(item.aid)));
            } else {
                historyTimeDict.value.set(datetimeFormatter(item.update_time), [await album.getAlbumInfo(String(item.aid))]);
            }
        }
        setLoaded(true);
    } catch (error) {
        console.error(error);
        message.error("获取历史记录失败");
    }
}

onMounted(() => {
    getHistoryList();
});

</script>

<style scoped>
.historyList {
    padding: 1%;
}

.title {
    font-size: 16px;
    font-weight: bold;
}
</style>