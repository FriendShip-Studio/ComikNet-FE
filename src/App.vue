<script setup lang="ts">
import useMirrorStore from "@/store/mirror";
import { notification } from "ant-design-vue";
import { reactive, ref, watch } from "vue";
import useToggle from "@/utils/useToggle";
import mirror from "@/apis/utils/mirror";
import { CloudServerOutlined } from "@ant-design/icons-vue";
import type {
  ApiMirrorStatus,
  MirrorState,
  PicMirrorStatus,
} from "@/models/mirror";

const mirrorStore = useMirrorStore();
const { val: isModalVis, set: setModalVis } = useToggle(false);
const { val: isPending, set: setPending } = useToggle(false);
const { val: isLoading, set: setLoading } = useToggle(false);
const { val: isLoaded, set: setLoaded } = useToggle(false);

const mirrorSettings = reactive<MirrorState>({
  api_url: "",
  pic_url: "",
  configured: false,
});
const apiList = ref<Array<ApiMirrorStatus>>([]);
const picList = ref<Array<PicMirrorStatus>>([]);
const loadingMsg = ref("正在准备镜像源连接...");

const getMirrorStatus = async () => {
  setLoading(true);
  setLoaded(false);
  apiList.value = [];
  picList.value = [];
  try {
    loadingMsg.value = "正在获取接口通讯镜像源状态...";
    apiList.value = await mirror.getApiSpeed();
    loadingMsg.value = "正在获取漫画图像镜像源状态...";
    picList.value = await mirror.getPicSpeed();
    loadingMsg.value = "正在准备镜像源连接...";
    //eslint-disable-next-line
  } catch (error: any) {
    console.log(error);
  } finally {
    setLoading(false);
    setLoaded(true);
  }
};

watch(
  () => mirrorStore.isConfigured(),
  (val: boolean) => {
    if (val) {
      notification["info"]({
        message: "镜像源提示",
        description: `当前选择的api源为${mirrorStore.api_url}，图像源为${mirrorStore.pic_url}，如需切换请点击右上角头像`,
      });
    } else {
      setModalVis(true);
    }
  },
  { immediate: true }
);

const handelSetMirror = async () => {
  setPending(true);
  mirror.setMirror(mirrorSettings.api_url, mirrorSettings.pic_url);
  mirrorStore.set(
    mirrorSettings.api_url as string,
    mirrorSettings.pic_url as string
  );
  setPending(false);
  setModalVis(false);
  setLoaded(false);
  apiList.value = [];
  picList.value = [];
};

const rules = {
  api_url: [{ required: true, message: "必须选择一个镜像源!" }],
  pic_url: [{ required: true, message: "必须选择一个镜像源!" }],
};
</script>

<template>
  <RouterView />
  <a-modal v-model:visible="isModalVis" :confirm-loading="isPending" :closable="false" :maskClosable="false"
    :keyboard="false" title="选择 ComikNet 镜像源">
    <div id="mirror-settings-notice">
      <cloud-server-outlined class="mirror-icon" v-if="!isLoaded" />
      <cloud-server-outlined class="mirror-icon-loaded" v-else />
      <p>
        请先获取一次镜像服务器状态，再根据镜像选项后的延迟选择最优的服务器线路。
      </p>
      <p>一般来说，延迟越低的服务器访问体验越好。</p>
      <p>你随时可以在右上角的个人菜单中重新设置镜像源。</p>
    </div>

    <a-spin :spinning="isLoading">
      <template #tip>
        {{ loadingMsg }}
      </template>
      <div id="mirror-modal-content">
        <a-button block type="primary" @click="getMirrorStatus">
          获取镜像状态
        </a-button>
        <a-form id="mirror-setting-form" :model="mirrorSettings" name="mirror" :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }" autocomplete="off" @finish="handelSetMirror" v-if="isLoaded" :rules="rules">
          <a-form-item label="接口通讯镜像" name="api_url">
            <a-radio-group v-model:value="mirrorSettings.api_url" button-style="solid">
              <a-radio-button v-for="apiMirror in apiList" :key="apiMirror.url" :value="apiMirror.url"
                class="mirror-btn">
                {{ apiMirror.url }} {{ apiMirror.time }}ms
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="漫画图片镜像" name="pic_url">
            <a-radio-group v-model:value="mirrorSettings.pic_url" button-style="solid">
              <a-radio-button v-for="picMirror in picList" :key="picMirror.url" :value="picMirror.url"
                class="mirror-btn">
                {{ picMirror.url }} {{ picMirror.time }}ms
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-button html-type="submit" :loading="isPending" type="primary" block>
            确定
          </a-button>
        </a-form>
      </div>
    </a-spin>
    <template #footer> </template>
  </a-modal>
</template>

<style>
* {
  box-sizing: border-box;
  font-family: Roboto, sans-serif;
}

body {
  height: 100vh;
}

#app {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  transform: none;
  min-height: 100vh;
}

#app::before {
  content: "";
  position: fixed;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background-image: url("https://cdn.friendship.org.cn/LightPicture/2022/10/1c83da163ffb738b.png");
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(6px);
  z-index: -1;
}

#mirror-settings-notice {
  font-size: 13px;
}

#mirror-setting-form {
  padding-top: 24px;
}

.mirror-icon {
  font-size: 58px;
  color: gray;
  padding: 0 0 16px 0;
  position: relative !important;
  left: 50%;
  transform: translateX(-50%);
}


.mirror-icon-loaded {
  font-size: 58px;
  color: #1890ff;
  padding: 0 0 16px 0;
  position: relative !important;
  left: 50%;
  transform: translateX(-50%);
}

.mirror-btn {
  width: 70%;
  text-align: left;
}
</style>
