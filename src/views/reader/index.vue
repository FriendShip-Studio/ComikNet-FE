<template>
    <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
        <div id="container">
            <div class="img-wrapper" v-for="img in imgList" :key="img">
                <img :src="parseImg(img)" />
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { picGet } from '@/api';
import { message } from 'ant-design-vue';

const router = useRouter();

const id = router.currentRoute.value.params.id;

const imgList = ref<string[]>([]);

let scramble_id: string;

const getImageUrls = async () => {
    const resp = await picGet('/img_list', { id });
    if (resp.status_code !== 200) {
        message.error(resp.errorMsg);
        Promise.reject(resp.errorMsg);
        router.back();
        return;
    }
    scramble_id = resp.scramble_id;
    for (let img of resp.data) {
        imgList.value.push(img.replace(".webp",""));
    }
}

const parseImg = (img: string) => {
    return "http://localhost:8000/img?id=" + id + "&page=" + img + "&scramble_id=" + scramble_id;
}

onMounted(() => {
    getImageUrls();
});

</script>