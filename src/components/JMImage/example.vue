<template>
  <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
    <div class="content">
      <div class="content-title">0721示范</div>
      <div class="content-body">
        <div class="album-wrapper" v-if="loaded">
          <JMImage
            v-for="image in imageList"
            :key="image.imageSrc"
            :imageSrc="image.imageSrc"
          />
        </div>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
import sleep from "@/utils/useSleep";
import useToggle from "@/utils/useToggle";
import { onMounted, ref } from "vue";
import JMImage from "@/components/JMImage/index.vue";

const { val: loaded, set: setLoaded } = useToggle(false);
const imageList = ref<Array<{ manifest: string; imageSrc: string }> | null>(null);

onMounted(async () => {
  console.log("onMounted");
  await sleep(2000);
  console.log("emulate imageSrc change");
  setLoaded(true);
  imageList.value = imageData;
  // hua'hua
});

const imageData: Array<{ manifest: string; imageSrc: string }> = [
  {
    manifest: "[NA]侵蚀椛封面",
    imageSrc: "https://cdn-msp.18comic.vip/media/photos/142618/00001.webp",
  },
  {
    manifest: "[2]被打败并变成魔王女儿的勇者",
    imageSrc: "https://cdn-msp.18comic.vip/media/photos/340803/00047.webp",
  },
  {
    manifest: "[4]小草神",
    imageSrc: "https://cdn-msp.18comic.org/media/photos/416662/00001.webp",
  },
  {
    manifest: "[6]犬走椛泳装",
    imageSrc: "https://cdn-msp.18comic.vip/media/photos/271608/00004.webp",
  },
  {
    manifest: "[8]对战被换魂妹妹的牌佬",
    imageSrc: "https://cdn-msp2.18comic.org/media/photos/376018/00018.webp",
  },
  {
    manifest: "[10]被妖狐性转成为妻子的翘家人",
    imageSrc: "https://cdn-msp.18comic.vip/media/photos/224065/00010.webp",
  },
  {
    manifest: "[14]被强迫发动眷属化技能的牌佬",
    imageSrc: "https://cdn-msp2.18comic.org/media/photos/376018/00031.webp",
  },
  {
    manifest: "[16]犬走椛巫女服汪pose~",
    imageSrc: "https://cdn-msp.18comic.vip/media/photos/271608/00008.webp",
  },
  {
    manifest: "[18]与大妖狐卡牌换魂的牌佬",
    imageSrc: "https://cdn-msp2.18comic.org/media/photos/376018/00010.webp",
  },
  {
    manifest: "[20]犬走椛泳装封面",
    imageSrc: "https://cdn-msp.18comic.vip/media/photos/271608/00001.webp",
  },
  {
    manifest: "[20]换魂の仪 横向比例封面",
    imageSrc: "https://cdn-msp2.18comic.org/media/photos/376018/00001.webp",
  },
];
</script>
<style lang="css" scoped>
.content-body {
  padding: 24px;
}
</style>
