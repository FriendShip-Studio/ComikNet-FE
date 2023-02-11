import { defineStore } from "pinia";
import type { PageStatus } from "@/models/albums";

const usePageStore = defineStore({
    id: "page",
    state: (): PageStatus => {
        return {
            nowPage: 1,
        };
    },
    getters: {
        page(state: PageStatus): PageStatus {
            return { ...state };
        },
    },
    actions: {
        setPage(page: number) {
            this.nowPage = page;
        },
        reset() {
            this.$reset();
        }
    }
});

export default usePageStore;