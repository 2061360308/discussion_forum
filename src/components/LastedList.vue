<template>
  <div class="title">
    <img src="../assets/热点.png" alt="logo" />
    <p>置顶 & 最新</p>
  </div>
  <van-list :loading="loading" :finished="finished" @load="onLoad" finished-text="没有更多了">
    <van-cell
      v-for="item in list"
      :key="item"
      class="discussion-cell"
      :data-id="item.id"
      @click="openDiscussion"
    >
      <template #icon>
        <div class="author">
          <van-image
            round
            width="30px"
            height="30px"
            :title="item.author.login"
            :src="item.author.avatarUrl"
          />
          <p :title="item.author.login">{{ item.author.login }}</p>
        </div>
      </template>
      <template #title>
        <div class="title">{{ item.title }}</div>
        <div class="comments">
          <img src="../assets/评论.png" alt="logo" />
          <span>{{ item.comments.totalCount }}</span>
        </div>
      </template>
      <template #label>
        <div class="create-time">发表于 {{ item.createdAt }} 所属板块 {{ item.category.name }}</div>
      </template>
    </van-cell>
  </van-list>
</template>

<style>
.title {
  padding: 5px 10px;
  background-color: #f7f8fa;
  border-bottom: 1px solid #ebedf0;
  display: flex;
  align-items: center;
  justify-content: start;
}

.title img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.title p {
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
}

.discussion-cell .title {
  font-size: 14px;
  font-weight: bold;
}

.discussion-cell .title:hover {
  color: #1989fa;
}

.discussion-cell .create-time {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}

.discussion-cell .author {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
}

.discussion-cell .author p {
  font-size: 10px;
  color: #606266;
  margin: 0;
  width: 60px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* padding: 0; */
}

.discussion-cell .comments {
  display: flex;
  /* justify-self: end; */
  width: 40px;
  float: right;
}

.discussion-cell .comments img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.discussion-cell .comments span {
  font-size: 12px;
  line-height: 20px;
  color: #606266;
}
</style>

<script>
import { ref, onMounted } from "vue";
import { List, Cell } from "vant";
import { useConfigStore } from "@/stores/config";
import { useApiStore } from "@/stores/api";
import { useRouter } from "vue-router";

export default {
  name: "LastedList",
  components: {
    [List.name]: List,
    [Cell.name]: Cell,
  },
  setup() {
    const configStore = useConfigStore();
    const apiStore = useApiStore();
    const router = useRouter();

    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    let pageInfo = null;

    if (configStore.access_token) {
      // 先请求置顶的帖子
      apiStore
        .githubApi(apiStore.QUERY_PINNED_DISCUSSIONS, {})
        .then((res) => {
          console.log(res);
          let pinned_discussion = res.repository.pinnedDiscussions.nodes;
          // 解析出所有的discussion
          pinned_discussion = pinned_discussion.map((item) => item.discussion);
          list.value.unshift(...pinned_discussion);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      // 未登录
      // Todo: 从action提前构建的数据中加载
    }

    const onLoad = () => {
      loading.value = true;
      // 请求最新的帖子20条
      apiStore
        .githubApi(apiStore.QUERY_DISCUSSIONS, {
          first: 20,
          after: pageInfo ? pageInfo.endCursor : null,
        })
        .then((res) => {
          console.log(res);
          pageInfo = res.repository.discussions.pageInfo;
          list.value.push(...res.repository.discussions.nodes);
          console.log("list::", list.value);
          loading.value = false;

          if (!pageInfo.hasNextPage) {
            finished.value = true;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };

    const openDiscussion = (e) => {
      router.push(`/discussion/${e.currentTarget.dataset.id}`);
      console.log(e.currentTarget.dataset.id);
    };

    return {
      list,
      loading,
      finished,
      onLoad,
      openDiscussion,
    };
  },
};
</script>
