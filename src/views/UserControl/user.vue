<template>
  <main class="main" :style="{ width: $route.meta.expand ? '100%' : '1200px' }">
    <div class="content">
      <div class="content-title">{{ userStore.username ? userStore.username + " 的个人信息" : "用户信息" }}</div>
      <a-spin tip="再等会，要出来了" :spinning="!loaded" class="absoulte-spin" />
      <div class="container">
        <div class="user-avatar">
          <a-image :width="250" :src="parseAvatarURL(userStore.photo)" :alt="userStore.username"
            fallback="https://cdn.friendship.org.cn/LightPicture/2022/10/406559cff5ae46ea.jpg" />
        </div>
        <div class="user-info" v-if="loaded">
          <a-descriptions :column="1" :labelStyle="{ 'font-size': '18px', 'font-weight': 'bold' }"
            :contentStyle="{ 'font-size': '16px' }">
            <a-descriptions-item label="等级">Lv.{{ userStore.level }} - {{ userStore.level_name }}</a-descriptions-item>
            <a-descriptions-item label="性别">
              <a-tooltip :title="userStore.gender === 'Male' ? '绅士' : '淑女'">
                <man-outlined v-if="userStore.gender === 'Male'" class="gender-icon" />
                <woman-outlined v-else class="gender-icon" />
              </a-tooltip>
            </a-descriptions-item>
            <a-descriptions-item label="硬币">{{ userStore.coin }}</a-descriptions-item>
            <a-descriptions-item label="收藏">
              {{ userStore.album_favorites }} / {{ userStore.album_favorites_max }}
            </a-descriptions-item>
            <a-descriptions-item label="勋章">
              <a-empty v-if="userStore.badges.length === 0" description="您还没有任何勋章" :image="Empty.PRESENTED_IMAGE_SIMPLE"
                class="empty-col" />
              <a-tooltip v-for="item in userStore.badges" :key="item.id" :title="item.name">
                <img :src="parseMedalURL(item.content)" class="medal-pic" />
              </a-tooltip>
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
        </div>
        <div class="progressbar-container" v-if="loaded">
          <p id="progressbar-title">距离下一级还差 {{ userStore.nextLevelExp }} 经验值</p>
          <a-progress type="circle" :stroke-color="{
            '0%': '#108ee9',
            '100%': '#39c5bb',
          }" :percent="Number(userStore.expPercent?.toFixed(1))" />
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import useToggle from "@/utils/useToggle";
import useUserStore from "@/store/user";
import useMirrorStore from "@/store/mirror";
import { useRouter } from "vue-router";
import { ManOutlined, WomanOutlined } from "@ant-design/icons-vue";
import { Empty } from "ant-design-vue";

const router = useRouter();
const userStore = useUserStore();
const mirrorStore = useMirrorStore();

const { val: loaded, set: setLoaded } = useToggle(false);

const parseAvatarURL = (pic: string | undefined) => {
  if (!pic) return "";
  setLoaded(true);
  return `https://${mirrorStore.pic_url}/media/users/${pic}`;
};

const parseMedalURL = (medal: string | undefined) => {
  if (!medal) return "";
  return `https://${mirrorStore.pic_url}/${medal}`;
};

</script>

<style scoped>
.container {
  padding: 24px;
  display: flex;
  column-gap: 24px;
  width: 100%;
}

.user-avatar {
  width: 250px;
  height: 250px;
}

.user-info {
  flex: 1;
}

.gender-icon {
  font-size: 26px;
}

.empty-col {
  margin: 0;
}

.progressbar-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 250px;
}

.medal-pic {
  width: 48px;
  height: 48px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  margin-right: 8px;
}

#progressbar-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  white-space: nowrap;
}
</style>
