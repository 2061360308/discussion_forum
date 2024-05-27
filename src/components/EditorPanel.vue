<template>
  <van-floating-panel
    v-if="modelValue"
    v-model:height="panelHeight"
    :anchors="anchors"
    :content-draggable="false"
  >
  <div class="send-box">
    <van-nav-bar
      title="编辑"
      left-text="回复"
      right-text="取消"
      @click-left="onClickPublish"
      @click-right="onClickEditorCancel"
    />
    <div class="send-name">
        <span>回复：</span>
        <span>{{ sendObject?.recipient?.login }}</span>
        <van-image
          round
          :src="sendObject?.recipient?.avatarUrl"
          alt="avatar"
          width="40px"
          height="40px"
        />
    </div>
  </div>
    <div id="editor" ref="editorElm"></div>
  </van-floating-panel>
</template>
<style>
#editor {
  height: calc(100% - 50px);
}

.send-box{
    height: 100px;
    display: flex;
    flex-direction: column;
}

.send-name{
    display: flex;
    align-items: center;
    padding: 5px 10px;
}

.send-name span{
    font-size: 16px;
    font-weight: bold;
    margin-right: 10px;
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
    sendObject: Object,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const editorElm = ref(null);
    let editor = null;

    const anchors = [
      100,
      Math.round(0.4 * window.innerHeight),
      Math.round(0.9 * window.innerHeight),
    ];
    const panelHeight = ref(anchors[0]);

    watch(
      () => props.modelValue,
      (val) => {
        if (val) {
          nextTick(() => {
            editor = new Editor({
              el: editorElm.value,
              height: "calc(100% - 100px)",
              initialEditType: "wysiwyg",
              previewStyle: "vertical",
            });
          });
        }
      }
    );

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
      emit("update:modelValue", false);
    };

    const onClickPublish = () => {
      console.log("点击了发布");
      console.log(editor.getMarkdown(), props.sendObject);
    };

    return {
      editor,
      editorElm,
      anchors,
      panelHeight,
      onClickPublish,
      onClickEditorCancel,
    };
  },
};
</script>
