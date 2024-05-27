<template>
  <div class="commit-box">
    <div class="top-info">
      <div class="author">
        <van-image
          round
          :src="commit?.author?.avatarUrl"
          alt="avatar"
          width="40px"
          height="40px"
        />
        <p>{{ commit?.author?.login }}</p>
      </div>
      <div class="create-time">发表于：{{ commit?.createdAt }}</div>
    </div>
    <div class="title">
      {{ commit?.title }}
    </div>
    <div class="content">
      {{ commit?.body }}
    </div>
    <van-collapse
      v-model="activeNames"
      v-if="commit?.replies?.totalCount & (commit?.replies?.totalCount > 0)"
    >
      <van-collapse-item
        :title="'回复 ' + commit?.replies?.totalCount"
        name="1"
      >
        <van-list
          :loading="loading"
          :finished="finished"
          finished-text=""
        >
          <div class="replie" v-for="replie in replies" :key="replie.id">
            <div class="top-info">
              <div class="author">
                <van-image
                  round
                  :src="replie?.author?.avatarUrl"
                  alt="avatar"
                  width="40px"
                  height="40px"
                />
                <p>{{ replie?.author?.login }}</p>
              </div>
              <div class="create-time">发表于：{{ replie?.createdAt }}</div>
            </div>
            <div class="title">
              {{ replie?.title }}
            </div>
            <div class="content">
              {{ replie?.body }}
            </div>
          </div>
          <div class="load_replie" v-if="commit?.replies?.totalCount - replies.length > 0" @click="onLoad">剩余 {{ commit?.replies?.totalCount - replies.length }} 条, 展开</div>
        </van-list>
      </van-collapse-item>
    </van-collapse>
  </div>
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
  display: flex;
  align-items: center;
  justify-content: start;
  font-size: 22px;
  font-weight: bold;
}

.content {
  padding: 10px;
  background-color: #f7f8fa;
  border-bottom: 1px solid #ebedf0;
}

.load_replie{
  text-align: center;
}
</style>

<script>
import { ref } from "vue";
import { useApiStore } from "@/stores/api";

export default {
  name: "CommitBox",
  props: {
    commit: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const apiStore = useApiStore();

    const activeNames = ref(["0"]);
    const replies = ref([]);
    const loading = ref(false);
    const finished = ref(false);

    const onLoad = () => {
      loading.value = true;
      apiStore
        .githubApi(apiStore.QUERY_DISCUSSION_COMMENT_REPLIES, { id: props.commit.id })
        .then((res) => {
          console.log("评论回复", res);
          replies.value.push(...res.node.replies.nodes);
          loading.value = false;
          finished.value = true;
        });
    };

    console.log("传入props", props);
    return {
      activeNames,
      replies,
      loading,
      finished,
      onLoad,
    };
  },
};
</script>
