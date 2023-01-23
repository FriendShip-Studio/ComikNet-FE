import { defineStore } from "pinia";
import pinia from "@/store/index";
import { MirrorState } from "@/models/mirror";

export const PERSIST_KEY = "mirror_store_persist";

const useMirrorStore = defineStore({
  id: "mirror",
  state: (): MirrorState => {
    return {
      configured: false,
      api_url: undefined,
      img_url: undefined,
    };
  },
  getters: {
    mirrorInfo(state: MirrorState): MirrorState {
      return { ...state };
    },
  },
  actions: {
    isConfigured(): boolean {
      return this.configured;
    },
    reset() {
      this.$reset();
    },
  },
});

const watchDog = useMirrorStore(pinia);

watchDog.$subscribe((_, state) => {
  localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
});

if (localStorage.getItem(PERSIST_KEY) !== null) {
  try {
    watchDog.$state = JSON.parse(localStorage.getItem(PERSIST_KEY) as string);
  } catch (e) {
    console.error(e);
    localStorage.removeItem(PERSIST_KEY);
  }
}

export default useMirrorStore;