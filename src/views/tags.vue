<template>
    <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
        <div class="content">
            <div class="content-title">高级搜索</div>
            <div class="content-body">
                <h2>标签选择器</h2>
                <div class="tags-selector">
                    <a-transfer></a-transfer>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import useMirrorStore from '@/store/mirror';



</script>