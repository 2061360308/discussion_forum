<template>
  <van-nav-bar
    left-text="返回"
    right-text="发帖"
    :fixed="true"
    left-arrow
    @click-left="onClickNavLeft"
    @click-right="onClickNavRight"
  />
  <div class="top">
    <div class="title">
      <img
        alt="logo"
        :src="
          configStore.config.categories[categoryInf.name]
            ? configStore.getAbsolutePath(
                configStore.config.categories[categoryInf.name]
              )
            : configStore.getAbsolutePath(configStore.config.site.logo)
        "
      />
      <div>
        <span v-html="categoryInf.emojiHTML" class="emoji"></span>
        {{ categoryInf.name }}
      </div>
    </div>
    <div class="subtitle">
      <p>{{ categoryInf.description }}</p>
    </div>
  </div>
  <van-search v-model="value" placeholder="请输入搜索关键词" />
  <van-dropdown-menu>
    <van-dropdown-item v-model="sort" :options="sortOption" />
  </van-dropdown-menu>
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
            :title="item?.author?.login"
            :src="item?.author?.avatarUrl"
          />
          <p :title="item?.author?.login">{{ item?.author?.login }}</p>
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
.top {
  display: flex;
  flex-direction: column;
  justify-self: start;
  padding: 20px;
  margin-top: 50px;
}

.top .title {
  display: flex;
}

.top .title p {
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
}

.top .title img {
  width: 80px;
  height: 80px;
}

.top .subtitle {
  margin-top: 10px;
  margin-left: 10px;
}

.top .subtitle p {
  font-size: 12px;
  font-weight: bold;
}
</style>

<script>
import { ref, onMounted } from "vue";
import { useConfigStore, useApiStore } from "@/stores/index";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "CategoryView",
  setup() {
    const configStore = useConfigStore();
    const apiStore = useApiStore();
    const categoryInf = ref({});
    const route = useRoute();
    const router = useRouter();

    const sort = ref(0);
    const sortOption = [
      { text: "更新时间", value: 0 },
      { text: "发布时间", value: 1 },
    ];

    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    let pageInfo = null;

    onMounted(() => {
      apiStore
        .githubApi(apiStore.QUERY_DISCUSSIONS_CATEGORIES, {})
        .then((res) => {
          console.log(res);
          categoryInf.value = res.repository.discussionCategories.nodes.filter(
            (item) => item.id === route.params.id
          )[0];

          console.log(categoryInf.value);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    const onLoad = () => {
      loading.value = true;
      // 请求最新的帖子20条
      apiStore
        .githubApi(apiStore.QUERY_DISCUSSIONS, {
          first: 20,
          after: pageInfo ? pageInfo.endCursor : null,
          categoryId: route.params.id,
          orderBy: sort.value,
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
    
    const onClickNavLeft = () => history.back();

    const onClickNavRight = () => {
      console.log("onClickNavRight");
    };

    const openDiscussion = (e) => {
      router.push(`/discussion/${e.currentTarget.dataset.id}`);
      console.log(e.currentTarget.dataset.id);
    };

    return {
      categoryInf,
      configStore,
      sort,
      sortOption,
      list,
      loading,
      finished,
      onLoad,
      onClickNavLeft,
      onClickNavRight,
      openDiscussion,
    };
  },
};
</script>
