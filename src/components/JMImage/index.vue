<template>
  <a-spin tip="再等会，要出来了" :spinning="isLoading">
    <div class="jm-image-wrapper">
      <canvas class="jm-image" ref="canvas" />
    </div>
  </a-spin>
</template>
<script lang="ts" setup>
import useToggle from "@/utils/useToggle";
import { ref, watch } from "vue";
import md5 from "md5";

const canvas = ref<HTMLCanvasElement | null>();
const props = defineProps<{
  imageSrc: string | null;
  scramble_id: string | undefined;
}>();

const { val: isLoading, set: setLoading } = useToggle(true);
const parseURL = (imageSrc: string) => {
  const url = new URL(imageSrc);
  const path = url.pathname;
  const pathArr = path.split("/");
  return {
    albumID: parseInt(pathArr[3]),
    imageIndex: pathArr[4].split(".")[0],
  };
};

const getTileCount = (
  albumID: number,
  imageIndex: string,
  scramble_id = "220980"
) => {
  let tileCount = 10;
  if (albumID < parseInt(scramble_id)) {
    tileCount = 1;
  }
  if (albumID >= 268850) {
    const indexCode = `${albumID.toString()}${imageIndex}`;
    const md5Code = md5(indexCode);
    const lastChar = md5Code.slice(-1);
    const charCode = lastChar.charCodeAt(0);
    const switchCode = charCode % 10;
    console.log(
      `indexCode: ${indexCode}, md5Code: ${md5Code}, lastChar: ${lastChar}, charCode: ${charCode}, switchCode: ${switchCode}`
    );
    switch (switchCode) {
      case 0:
        tileCount = 2;
        break;
      case 1:
        tileCount = 4;
        break;
      case 2:
        tileCount = 6;
        break;
      case 3:
        tileCount = 8;
        break;
      case 4:
        tileCount = 10;
        break;
      case 5:
        tileCount = 12;
        break;
      case 6:
        tileCount = 14;
        break;
      case 7:
        tileCount = 16;
        break;
      case 8:
        tileCount = 18;
        break;
      case 9:
        tileCount = 20;
    }
  }
  return tileCount;
};
watch(
  () => props,
  () => {
    if (props.imageSrc === null) return;
    console.log("imageSrc changed to ", props.imageSrc);
    const { albumID, imageIndex } = parseURL(props.imageSrc);
    const image = new Image();
    image.src = props.imageSrc;
    image.onload = () => {
      if (!canvas.value) throw new Error("canvas is null");
      const ctx = canvas.value.getContext("2d");
      if (!ctx) throw new Error("ctx is null");

      const nw = image.naturalWidth;
      const nh = image.naturalHeight;
      console.log(`image loaded：${nw}x${nh}`);

      canvas.value.width = nw;
      canvas.value.height = nh;
      // canvas.value.style.width = nw + "px";
      // canvas.value.style.height = nh + "px";

      // window.screen.width < 991
      //   ? (canvas.value.style.width = window.screen.width + "px")
      //   : nw > window.screen.width &&
      //     (canvas.value.style.width = nw / 2 + "px"),
      //   (canvas.value.style.padding = "10px");

      const tileCount = getTileCount(albumID, imageIndex, props.scramble_id);
      const offset = Math.floor(nh % tileCount);
      const span = Math.floor(nh / tileCount);
      console.log(`tileCount: ${tileCount}, offset: ${offset}, span: ${span}`);

      for (let i = 0; i < tileCount; i++) {
        const sy = nh - span * (i + 1) - offset;
        let dy = i * span;
        let sh = span;
        i === 0 ? (sh += offset) : (dy += offset);

        //image	规定要使用的图像、画布或视频
        //sx	可选。开始剪切图片的 x 坐标位置
        //sy	可选。开始剪切图片的 y 坐标位置
        //sw	可选。被剪切图像的宽度（就是裁剪之前的图片宽度，这里的宽度若小于图片的原宽。则图片多余部分被剪掉；若大于，则会以空白填充）
        //sh	可选。被剪切图像的高度（就是裁剪之前的图片高度）
        //dx	在画布上放置图像的 x 坐标位置
        //dy	在画布上放置图像的 y 坐标位置
        //dw	可选。要使用的图像的宽度（就是裁剪之后的图片高度，放大或者缩放）
        //dh	可选。要使用的图像的高度（就是裁剪之后的图片高度，放大或者缩放）
        ctx.drawImage(image, 0, sy, nw, sh, 0, dy, nw, sh);
      }

      setLoading(false);
    };
  },
  { immediate: true }
);
</script>
<script lang="ts">
export default {
  name: "JMImage",
};
</script>
<style lang="css" scoped>
.jm-image-wrapper {
  font-size: 0;
}

.jm-image {
  width: 512px;
}
</style>
