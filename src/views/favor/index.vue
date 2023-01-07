<template>
  <div id="userFav">
    <h2>收藏夹</h2>
    <div id="favList">
      <div v-for="(item, index) in favList" :key="item.id" class="favItem"
        @click="showComicCard(index)" @mouseleave="destoryCard()">
        <img :src="getComicCover(item.id)" style="height: 20em" />
        <microCard :id="item.id" v-if="selectedIndex === index" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import axios from "@/api";
import { FavList } from "@/models/user";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import microCard from '@/views/components/comicCard.vue';

const router = useRouter();
const favList = ref<FavList>();
const selectedIndex = ref<string>();

const showComicCard = (index: any) => {
  selectedIndex.value = index;
}

const destoryCard = () => {
  selectedIndex.value = "";
}

const getFavourite = async () => {
  try {
    const resp = await axios.get("http://localhost:8000/favorite");
    if (resp.data.errorMsg) {
      if ((resp.data.errorMsg = "請先登入會員")) {
        message.error("需要登录");
      }
      router.push("/login");
      return;
    }
    favList.value = resp.data.data.list;
    console.log(favList.value);
  } catch (error: any) {
    message.error(error.message);
    console.log(error);
    router.push("/login");
  }
};

const getComicCover = (id: string) => {
  return `https://cdn-msp.jmapiproxy2.cc/media/albums/` + id + `_3x4.jpg`;
};

onMounted(() => {
  getFavourite();
});
</script>

<style scoped>
#favList {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-items: center;
  row-gap: 24px;
}

.favItem {
  transition: transform 0.2s cubic-bezier(0.06, 0.45, 0.35, 0.85);
  transform-origin: top;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: grid;
  place-items: center;
}

.favItem:hover {
  transform: perspective(280px) rotateX(1deg);
  box-shadow: 0 0 10px 0 purple;
}

.favItem::after {
  position: absolute;
  content: "";
  height: 280px;
  width: 210px;
  transition: transform 0.2s cubic-bezier(0.06, 0.45, 0.35, 0.85);
  transform-origin: top;
  background: linear-gradient(to bottom left,
      transparent,
      rgba(255, 255, 255, 0.4) 25%,
      transparent 30%,
      transparent 100%);
  z-index: 2;
}

.favItem:hover::after {
  /* background: linear-gradient(to bottom left , transparent, transparent 30%,rgba(255,255,255,0.6) 31%, rgba(255,255,255,0.6) 39%, transparent 40%, transparent 100% ); */
  transform: perspective(280px) rotateX(1deg);
}
</style>
