<template>
  <header id="header">
    <div
      id="header-content"
      :style="{ width: $route.meta.expand ? '100%' : '1200px' }"
    >
      <div id="main-title">
        <router-link to="/" class="nav-link">ComikNet</router-link>
      </div>
      <div id="route-title">
        {{ $route.meta.title }}
      </div>
      <div id="search-box">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="搜索..."
          enter-button
          @search="onSearch"
        />
      </div>

      <div id="user-bar">
        <a-avatar
          src="https://cdn.friendship.org.cn/LightPicture/2023/01/98675cef4ed63f9a.png"
          size="large"
        >
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
        <a-dropdown :trigger="['click']">
          <div id="bar-username" class="nav-link btn-link" @click.prevent>
            {{ userStore.username }}
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <router-link to="/user">个人资料</router-link>
              </a-menu-item>
              <a-menu-item>
                <router-link to="/favor">收藏夹</router-link>
              </a-menu-item>
              <a-menu-item>
                <router-link to="/history">观看历史</router-link>
              </a-menu-item>
              <a-menu-item>
                <span @click="resetMirror">重新选择镜像</span>
              </a-menu-item>
              <a-menu-item>
                <span @click="handleLogout">退出登录</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </header>
  <router-view />
  <footer id="footer">ComikNet © Friendship org 2023</footer>
</template>

<script lang="ts" setup>
import { UserOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import useUserStore from "@/store/user";
import { message } from "ant-design-vue";
import { onMounted, ref } from "vue";
import useMirrorStore from "@/store/mirror";

const router = useRouter();
const mirrorStore = useMirrorStore();
const userStore = useUserStore();
const searchQuery = ref("");

const resetMirror = async () => {
  mirrorStore.reset();
  message.info("已重置镜像");
  console.log("reset");
};

onMounted(async () => {
  if (!userStore.isLogined()) {
    if (!sessionStorage.login_form && !localStorage.login_form) {
      await router.push("/login");
      return;
    }

    if (sessionStorage.login_form) {
      try {
        const loginForm = JSON.parse(sessionStorage.login_form);
        if (await userStore.login(loginForm)) {
          console.log("Login from sessionStorage success");
        } else {
          await router.push("/login");
        }
        // eslint-disable-next-line
      } catch (err: any) {
        await router.push("/login");
      }
    }

    if (localStorage.login_form) {
      console.log("Login from localStorage");
      try {
        const loginForm = JSON.parse(localStorage.login_form);
        if (await userStore.login(loginForm)) {
          console.log("Login from localStorage success");
          message.success("自动登录成功");
        } else {
          await router.push("/login");
        }
        // eslint-disable-next-line
      } catch (err: any) {
        await router.push("/login");
      }
    }
  }
});

const handleLogout = () => {
  userStore.logout();
  message.info("已退出登录");
  router.push("/login");
};

const onSearch = async () => {
  router.push({ path: "/search", query: { query: searchQuery.value } });
};
</script>
<style lang="css">
#header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
}

#header-content {
  margin: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#main-title {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.nav-link {
  padding: 0 16px;
  text-decoration: none;
  color: #1f1f1f;
  transition: 0.28s background-color cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-link {
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
}

.nav-link:hover {
  background-color: #eeeeee;
}

#user-bar {
  display: flex;
  align-items: center;
  font-size: 16px;
}

#footer {
  text-align: center;
}

#bar-username {
  padding: 0 8px;
  cursor: pointer;
}

.main {
  flex-grow: 1;
  align-self: center;
  display: flex;
  margin-top: 64px;
}

.content {
  flex-grow: 1;
  background-color: #ffffff;
  margin: 16px 16px 0 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.content-title {
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.content-spin {
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#route-title {
  display: none;
}

@media (max-width: 1200px) {
  #header-content {
    width: 100vw;
  }

  .main {
    width: 100% !important;
  }

  .content {
    margin: 0;
    border-radius: 0;
    border-top: 1px solid #e0e0e0;
  }

  #footer {
    border-top: 1px solid #e0e0e0;
    background-color: #ffffff;
  }

  .content-title {
    display: none;
  }

  #route-title {
    display: inline;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
  }
}
</style>
