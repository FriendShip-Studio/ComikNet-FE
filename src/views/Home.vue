<template>
  <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
    <div class="content">
      <div class="content-title">首页</div>
      <!-- <a-spin
        tip="再等会，要出来了"
        :spinning="!loaded"
        class="absoulte-spin"
      ></a-spin> -->
      <div id="lightbox">
        <a-carousel arrows autoplay>
          <template #prevArrow>
            <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
              <left-circle-outlined />
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-slick-arrow" style="right: 10px">
              <right-circle-outlined />
            </div>
          </template>
          <div>
            <h3>欢迎来到 ComikNet Insider Preview!</h3>
          </div>
          <div>
            <h3>作为一位内测体验人员，你将可以体验到 ComikNet 最新开发的全部功能，并向我们提出你的建议。</h3>
          </div>
          <div>
            <h3>Powered by AsakiRain & BiDuang | Friendship Studio 2023</h3>
          </div>
        </a-carousel>
      </div>
      
      <img src="https://cdn.friendship.org.cn/LightPicture/2023/02/b0e5a742b92be7bf.webp" alt="Friendship Studio"
        class="banner" />
      <img src="https://cdn.friendship.org.cn/LightPicture/2022/12/267ad8dd86655b10.jpg" alt="Friendship Cloud"
        class="banner" />

    </div>
  </main>
</template>

<script lang="ts" setup>
import useToggle from "@/utils/useToggle";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons-vue";

const { val: loaded, set: setLoaded } = useToggle(false);
</script>

<style scoped>
#lightbox {
  width: 1200px;
  margin: 15px auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.banner {
  width: 15vw;
  margin: 15px auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 350px;
  line-height: 350px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
  z-index: 1;
}

.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}

.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}
</style>
