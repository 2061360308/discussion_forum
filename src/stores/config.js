import { defineStore } from "pinia";
import { ref } from "vue";

const useConfigStore = defineStore("configStore", () => {
  const config = ref({});

  const actionData = ref(null);

  const access_token = ref(null);

  function getAbsolutePath(path) {
    if (path.startsWith("/")) {
      path = path.slice(1);
      return process.env.BASE_URL + path;
    }
  }

  async function getConfig() {
    try {
      const response = await fetch(getAbsolutePath("/config.json"));
      const data = await response.json();
      config.value = data;
      console.log("configData:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function checkLoginSate() {
    access_token.value = window.localStorage.getItem("access_token");
    if (access_token.value) {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${access_token.value}`,
        },
      });

      if (response.ok) {
        console.log("Token is valid");
        console.log("加载配置值access_token:", access_token.value);
      } else {
        // 清除无效token
        console.log("Token is invalid");
        access_token.value = null;
        window.localStorage.removeItem("access_token");
        // 从仓库加载action预先打包的数据
        try{
          const response = await fetch(configStore.getAbsolutePath("/data.json"));
          const data = await response.json();
          actionData.value = data;
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
  }

  return { config, access_token, getConfig, getAbsolutePath, checkLoginSate };
});

export { useConfigStore };
