<template>
  <van-floating-panel v-if="modelValue">
    <van-nav-bar
      title="编辑"
      right-text="取消"
      @click-right="onClickEditorCancel"
    />
    <div id="editor" ref="editorElm"></div>
  </van-floating-panel>
</template>
<style>
#editor {
  height: calc(100% - 50px);
}
</style>
<script>
import { ref, onMounted, nextTick, defineModel, watch } from "vue";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

// const Editor = toastui.Editor;
export default {
  name: "EditorPanel",
  props: {
    modelValue: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const editorElm = ref(null);
    let editor = null;

    watch(() => props.modelValue, (val) => {
      if (val) {
        nextTick(() => {
          editor = new Editor({
            el: editorElm.value,
            height: "calc(100% - 50px)",
            initialEditType: "wysiwyg",
            previewStyle: "vertical",
          });
        });
      }
    });

    // watch(show.value, (val) => {
    //     console.log("show", val);
    //   if (val) {
    //     nextTick(() => {
    //       editor = new Editor({
    //         el: editorElm.value,
    //         height: "calc(100% - 50px)",
    //         initialEditType: "wysiwyg",
    //         previewStyle: "vertical",
    //       });
    //     });
    //   }
    // });

    const onClickEditorCancel = () => {
        // show.value = false;
        emit('update:modelValue', false);
    };

    return {
      editor,
      editorElm,
      onClickEditorCancel,
    };
  },
};
</script>
