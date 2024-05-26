import { defineStore } from "pinia";
import { ref } from "vue";

const useConfigStore = defineStore("configStore", () => {
    const config = ref({});

    const access_token = ref(window.localStorage.getItem("access_token") || null);

    function getAbsolutePath(path){
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

    return { config, access_token, getConfig, getAbsolutePath };
});

export { useConfigStore };
