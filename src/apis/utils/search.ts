import { get } from "@/apis/index";
import { message } from "ant-design-vue";
import type { SearchResult } from "@/models/albums"

const search = async (query: string, page?: number, sort?: string): Promise<SearchResult | null> => {
    try {
        const resp = await get(`/search`, { query, page, sort });
        if (resp.errorMsg) {
            message.error(resp.errorMsg);
            return null;
        }
        return resp.data;
    } catch (error: any) {
        message.error(error.message);
        return null;
    }
}

export default {
    search
}