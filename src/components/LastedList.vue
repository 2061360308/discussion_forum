<template>
  <div class="title">
    <img src="../assets/热点.png" alt="logo" />
    <p>置顶 & 最新</p>
  </div>
  <van-list
    :loading="false"
    :finished="true"
    finished-text="没有更多了"
  >
    <van-cell v-for="item in list" :key="item" class="discussion-cell" :data-id="item.id">
      <template #icon>
        <div class="author">
          <van-image
            round
            width="30px"
            height="30px"
            :src="item.author.avatarUrl"
          />
          <p>{{ item.author.login }}</p>
        </div>
      </template>
      <template #title>
        <div class="title">{{ item.title }}</div>
      </template>
      <template #label>
        <div class="create-time">{{ item.createdAt }}</div>
      </template>
      <template #value>
        <div class="comments">
          <img src="../assets/评论.png" alt="logo" />
          <span>{{ item.comments.totalCount }}</span>
        </div>
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

export default {
  name: "LastedList",
  components: {
    [List.name]: List,
    [Cell.name]: Cell,
  },
  setup() {
    const list = ref([]);

    onMounted(() => {
      fetch(process.env.BASE_URL + "data.json")
        .then((response) => response.json())
        .then((data) => {
          list.value = data.Discussions;
          console.log("list::", list.value);
        })
        .catch((error) => console.error("Error:", error));
    });

    const onLoad = () => {
      loading.value = true;
      setTimeout(() => {
        finished.value = true;
        // for (let i = 0; i < 10; i++) {
        //   list.value.push(list.value.length + 1);
        // }
        // loading.value = false;
        // if (list.value.length >= 40) {
        //   finished.value = true;
        // }
      }, 1000);
    };

    return {
      list,
    };
  },
};
</script>
