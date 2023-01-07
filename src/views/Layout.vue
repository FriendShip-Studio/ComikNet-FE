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
      <div id="user-bar">
        <a-avatar src="https://cdn.friendship.org.cn/LightPicture/2023/01/98675cef4ed63f9a.png" size="large">
          <template #icon>
            <UserOutlined/>
          </template>
        </a-avatar>
        <div id="bar-username" class="nav-link btn-link">
          {{ userStore.nickname }}
        </div>
      </div>
    </div>
  </header>
  <router-view></router-view>
  <footer id="footer">ComikNet © Friendship org 2022</footer>
</template>

<script lang="ts" setup>
  import { UserOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import useUserStore from '@/store/user';

  const router = useRouter();
  const userStore = useUserStore();
  const logout = () => {
    userStore.logout();
    router.push('/login');
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
    margin-right: 16px;
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
    align-items: center;
  }

  .content-title {
    align-self: stretch;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
  }

  #route-title {
    display: none;
  }

  @media (max-width: 1200px) {
    #header-content {
      width: 100vw
    }

    .main {
      width: 100vw !important;
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
