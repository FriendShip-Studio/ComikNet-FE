import { apiGet } from "@/api/index";
import { message } from "ant-design-vue";

const search = async (query: string, page: number = 1, sortBy: string = "mr") => {
    const resp = await apiGet("/search", { query, page, sortBy });
    if (resp.status_code !== 200) {
        message.error(resp.errorMsg);
        Promise.reject(resp.errorMsg);
    }
    return resp
}

export default {
    search
}