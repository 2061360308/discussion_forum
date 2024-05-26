<template>
  <router-view/>
</template>

<script>
import { defineComponent, onMounted, nextTick } from "vue";
import { useConfigStore } from "@/stores/config";
export default {
  name: "App",
  setup() {

    const configStore = useConfigStore();

    onMounted(async () => {
      await nextTick();

      let hash = window.location.hash
      // 去掉哈希部分的第一个字符（#）
      hash = hash.substr(2);
      // 使用 URLSearchParams 来解析查询参数
      let params = new URLSearchParams(hash);
      // 获取 access_token 参数
      let accessToken = params.get("access_token");
      let token = localStorage.getItem("token");
      if (accessToken) {
        configStore.access_token = accessToken;
        localStorage.setItem("access_token", token);
        // 清除哈希值
        window.location.hash = '';
        // 这种情况下不想access_token显示在地址栏中，重新定向到首页
        router.replace("/");
      }
    });

    return {
      msg: "Vue 3 + Vite",
    };
  },
};
</script>
