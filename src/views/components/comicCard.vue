<template>
    <div id="comicCard">
        <a-skeleton :loading="loading" active>
            <p>{{ comicInfo }}</p>
        </a-skeleton>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import axios from "@/api";
import { message } from "ant-design-vue";

const props = defineProps<{ id: string }>();

const comicInfo = ref({});

const loading = ref(true);

const getComicInfo = async () => {
    try {
        const resp = await axios.get(`http://localhost:8000/album?id=${props.id}`);
        if (resp.data.status_code != 200) {
            message.error(resp.data.errorMsg);
            loading.value = false;
            return;
        }
        comicInfo.value = resp.data.data;
        loading.value = false;
    } catch (error: any) {
        message.error(error.message);
    }
}

onMounted(() => {
    getComicInfo();
})
</script>

<style scoped>
#comicCard {
    width: 20em;
    height: 30em;
    border: 1px solid black;
    border-radius: 10px;
    padding: 1em;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>