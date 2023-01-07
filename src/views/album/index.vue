<template>
    <div id="container">
        <div id="img-wapper">
        </div>
        <div id="info-wapper">
        </div>
    </div>
</template>

<script lang="ts" setup>
import { router } from "@/router";
import { ref, onMounted } from "vue";

const id = router.currentRoute.value.params.id;
console.log(id);
</script>