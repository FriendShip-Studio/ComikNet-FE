<template>
  <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
    <div class="content">
      <div class="content-title">搜索结果</div>
      <a-spin :spinning="isLoading" tip="正在加载...">
        <div v-if="isSearched && !isLoading">
          <div id="result-info">
            <h1>搜索 “{{ query }}” 共得到 {{ resultTotal }} 个结果</h1>
          </div>
          <div id="result-sort">
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="sortBy = sortRules.time">
                    <history-outlined />
                    按更新时间排序
                  </a-menu-item>
                  <a-menu-item @click="sortBy = sortRules.click">
                    <eye-outlined />
                    按浏览人数排序
                  </a-menu-item>
                  <a-menu-item @click="sortBy = sortRules.images">
                    <picture-outlined />
                    按漫画页数排序
                  </a-menu-item>
                  <a-menu-item @click="sortBy = sortRules.favorites">
                    <heart-outlined />
                    按收藏人数排序
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                <ordered-list-outlined />
                排序方式 - 正{{ sortNames[sortBy] }}
              </a-button>
            </a-dropdown>
          </div>
          <div id="result-list">
            <Albums :album-list="resultList" id="result-list" />
          </div>
          <div class="pagination-container" v-if="resultTotal && resultTotal > 80">
            <a-pagination
              :current="Number(page)"
              simple
              :default-current="1"
              :total="Math.ceil(resultTotal / 80) * 10"
              :min="1"
              @change="pageChanged"
            />
          </div>
          <a-back-top />
        </div>
      </a-spin>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { sortRules, sortNames } from "@/models/albums";
import search from "@/apis/utils/search";
import Albums from "@/components/ComicCards/AlbumList.vue";
import {
  OrderedListOutlined,
  HistoryOutlined,
  EyeOutlined,
  PictureOutlined,
  HeartOutlined,
} from "@ant-design/icons-vue";
import type { AlbumInfo } from "@/models/albums";

const router = useRouter();
const resultList = ref<Array<AlbumInfo>>();
const resultTotal = ref<number>();
const isSearched = ref(false);
const query = ref<string>();
const page = ref<string>();
const sortBy = ref<string>("mv");
const isLoading = ref(false);

const pageChanged = (p: number) => {
  page.value = p.toString();
};

const getResult = async () => {
  isLoading.value = true;
  if (typeof query.value != "string") {
    isSearched.value = false;
    isLoading.value = false;
    return;
  }

  if (!query.value) {
    isSearched.value = false;
    isLoading.value = false;
    return;
  }
  if (!page.value || typeof router.currentRoute.value.query.page != "string") {
    page.value = "1";
  }
  if (
    sortBy.value != "mr" &&
    sortBy.value != "mv" &&
    sortBy.value != "mp" &&
    sortBy.value != "tf"
  ) {
    sortBy.value = "mr";
  }
  isSearched.value = true;
  let resp = await search.search(query.value, Number(page.value), sortBy.value);
  resultList.value = resp?.content;
  resultTotal.value = resp?.total;
  isLoading.value = false;
};

watch(
  () => page.value,
  (p) => {
    try {
      if (p && typeof p == "string" && Number(p) >= 1) {
        router.push({
          query: {
            query: query.value,
            page: p,
            sort: sortBy.value,
          },
        });
      }
      // eslint-disable-next-line
    } catch (err: any) {
      console.log(err);
      return;
    }
  }
);

watch(
  () => sortBy.value,
  (s) => {
    try {
      if (
        s &&
        typeof s == "string" &&
        (s == "mr" || s == "mv" || s == "mp" || s == "tf")
      ) {
        router.push({
          query: {
            query: query.value,
            page: page.value,
            sort: s,
          },
        });
      }
      // eslint-disable-next-line
    } catch (err: any) {
      console.log(err);
      return;
    }
  }
);

watch(
  () => router.currentRoute.value.query,
  (q) => {
    try {
      query.value = q.query as string;
      page.value = q.page as string;
      sortBy.value = q.sort as string;
      getResult();
      // eslint-disable-next-line
    } catch (err: any) {
      console.log(err);
      isSearched.value = false;
    }
  },
  { immediate: true }
);

onMounted(() => {
  document.title = "搜索结果";
  console.log(page);
});
</script>

<style scoped>

@media (max-width: 1500px) {
  #result-list {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1250px) {
  #result-list {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1000px) {
  #result-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 750px) {
  #result-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 512px) {
  .main {
    min-width: 350px;
  }
}
</style>
