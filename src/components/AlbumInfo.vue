<template>
  <a-skeleton :loading="loading" active>
    <p>{{ albumInfo }}</p>
  </a-skeleton>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { apiGet } from '@/api';

  const { albumID } = defineProps(
    {
      albumID: String
    }
  );

  const loading = ref(true);
  const albumInfo = ref({});

  const getAlbumInfo = async () => {
    try {
      const resp = await apiGet(`http://localhost:8000/album?id=${ albumID }`);
      albumInfo.value = resp.data;
      loading.value = false;
    } catch (error: any) {
      message.error(error.message);
    }
  };

  onMounted(() => {
    getAlbumInfo();
  });
</script>

<style scoped>
</style>