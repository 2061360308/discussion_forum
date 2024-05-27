import { defineStore } from "pinia";
import { ref } from "vue";
import { useConfigStore } from "./config";
import { marked } from 'marked';

const useMarkedStore = defineStore("markedStore", () => {
    function parseMarkdown(markdown) {
        // console.log('parseMarkdown', markdown);
        return marked.parse(markdown||'');
    }

    return {
        parseMarkdown,
    };
});

export { useMarkedStore };
