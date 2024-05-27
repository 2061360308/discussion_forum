<template>
  <van-nav-bar
    title="讨论"
    left-text="返回"
    right-text="回复"
    :fixed="true"
    left-arrow
    @click-left="onClickNavLeft"
    @click-right="onClickNavRight"
  />
  <div class="top-info">
    <div class="author">
      <van-image
        round
        :src="discussionInf?.author?.avatarUrl"
        alt="avatar"
        width="40px"
        height="40px"
      />
      <p>{{ discussionInf?.author?.login }}</p>
    </div>
    <div class="create-time">发表于：{{ discussionInf?.createdAt }}</div>
  </div>
  <div class="title">
    {{ discussionInf?.title }}
  </div>
  <div
    class="content markdown"
    v-html="markedStore.parseMarkdown(discussionInf?.body)"
  ></div>
  <van-collapse v-model="activeNames">
    <van-collapse-item title="详细信息" name="1">
      <van-cell-group>
        <van-cell title="所属板块">
          <template #value>
            <div class="emoji" v-html="discussionInf?.category.emojiHTML"></div>
            {{ discussionInf?.category.name }}
          </template>
        </van-cell>
        <van-cell title="全局id" :value="discussionInf?.id" />
        <van-cell
          title="回复数量"
          :value="discussionInf?.comments.totalCount"
        />
        <van-cell title="Github原地址">
          <template #value>
            <a :href="discussionInf?.url" target="_blank">{{
              discussionInf?.url
            }}</a>
          </template>
        </van-cell>
      </van-cell-group>
    </van-collapse-item>
  </van-collapse>
  <div class="title">
    <img src="../assets/评论.png" alt="logo" />
    <p>评论 {{ discussionInf?.comments?.totalCount }}</p>
  </div>
  <van-list
    :loading="loading"
    :finished="finished"
    @load="onLoad"
    finished-text="没有更多了"
  >
    <commit-box
      v-for="commit in discussionComments"
      :commit="commit"
    ></commit-box>
  </van-list>
  <van-floating-panel v-if="editerPanel">
    <van-nav-bar title="编辑" right-text="取消" @click-right="onClickEditorCancel" />
  </van-floating-panel>
</template>
<style>
.top-info {
  display: flex;
  justify-content: space-between;
  align-items: end;
}

.author {
  padding: 0px 10px;
  display: flex;
  align-items: center;
  justify-content: start;
}

.author p {
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  line-height: 40px;
  margin: 0 0 0 10px;
}

.top-info .create-time {
  font-size: 12px;
  color: #999;
  margin-left: 40px;
  margin: 0 10px;
}

.title {
  padding: 5px 10px;
  background-color: #f7f8fa;
  border-bottom: 1px solid #ebedf0;
  display: flex;
  align-items: center;
  justify-content: start;
  font-size: 22px;
  font-weight: bold;
}

.content {
  padding: 10px;
}
</style>
<script>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useMarkedStore, useApiStore } from "@/stores/index";

import CommitBox from "@/components/CommitBox.vue";

export default {
  name: "DiscussionView",
  components: {
    CommitBox,
  },
  setup() {
    const route = useRoute();
    const apiStore = useApiStore();
    const markedStore = useMarkedStore();
    const editerPanel = ref(false);

    const loading = ref(false);
    const finished = ref(false);

    const discussionInf = ref({}); // 讨论详情
    const discussionComments = ref([]); // 讨论评论
    const discussionCommentsPageInfo = ref({});
    console.log("当前讨论id为", route.params.id);

    onMounted(() => {
      apiStore
        .githubApi(apiStore.QUERY_DISCUSSION, {
          id: route.params.id,
        })
        .then((res) => {
          console.log("返回Discussion详情", res);
          discussionInf.value = res.node;
        })
        .catch((err) => {
          console.error(err);
        });
    });

    const onClickNavLeft = () => history.back();

    const onClickNavRight = () => {
      console.log("点击了回复");
      editerPanel.value = !editerPanel.value;
    };

    const onClickEditorCancel = () => {
      editerPanel.value = false;
    };

    const activeNames = ref(["0"]);

    const onLoad = () => {
      apiStore
        .githubApi(apiStore.QUERY_DISCUSSION_COMMENTS, {
          id: route.params.id,
          after: discussionCommentsPageInfo.value
            ? discussionCommentsPageInfo.value.endCursor
            : null,
        })
        .then((res) => {
          console.log("返回Discussion评论详情", res);
          discussionComments.value.push(...res.node.comments.nodes);
          discussionCommentsPageInfo.value = res.node.comments.pageInfo;
          loading.value = false;
          if (!discussionCommentsPageInfo.value.hasNextPage) {
            finished.value = true;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };

    return {
      markedStore,
      editerPanel,
      onClickEditorCancel,
      loading,
      finished,
      onLoad,
      discussionInf,
      discussionComments,
      activeNames,
      onClickNavLeft,
      onClickNavRight,
    };
  },
};
</script>
