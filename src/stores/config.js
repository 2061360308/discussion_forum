import { defineStore } from "pinia";
import { ref } from "vue";

const useConfigStore = defineStore("configStore", () => {
    const config = ref({});

    const access_token = ref(window.localStorage.getItem("access_token") || null);

    function getConfig() {
      fetch("/config.json")
        .then((response) => response.json())
        .then((data) => {
          config.value = data;
          console.log("configData:",data);
        })
        .catch((error) => console.error("Error:", error));
    }

    return { config, access_token, getConfig };
});

export { useConfigStore };
