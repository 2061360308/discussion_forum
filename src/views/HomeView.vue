<template>
  <div class="top">
    <div class="title">
      <img
        alt="logo"
        :src="configStore.getAbsolutePath(configStore.config.site.logo)"
      />
      <p>{{ configStore.config.site.name }}</p>
    </div>
    <div class="subtitle">
      <p>{{ configStore.config.site.description }}</p>
    </div>
  </div>
  <div class="login" v-if="!configStore.access_token">
    <van-button type="primary" @click="login">Github 授权</van-button>
    <p>授权登录后查看实时消息、参与讨论</p>
  </div>
  <div class="categories-box">
    <van-swipe class="my-swipe" indicator-color="#42b983">
      <van-swipe-item
        v-for="(group, index) in discussionCategories"
        :key="index"
      >
        <van-grid :column-num="categorie_columns">
          <van-grid-item
            v-for="(item, index) in group"
            :key="index"
            icon="photo-o"
            text="文字"
          >
            <template v-slot:default>
              <div class="categorie">
                <div class="info">
                  <div class="name">
                    <span v-html="item.emojiHTML"></span>
                    {{ item.name }}
                  </div>
                  <div class="desc">{{ item.description }}</div>
                </div>
                <img
                  v-if="categoriesLogo[item.name]"
                  :src="configStore.getAbsolutePath(categoriesLogo[item.name])"
                  alt="logo"
                />
              </div>
            </template>
          </van-grid-item>
        </van-grid>
      </van-swipe-item>
    </van-swipe>
  </div>
  <van-search v-model="value" placeholder="请输入搜索关键词" />
  <LastedList />
</template>

<style>
.top {
  display: flex;
  flex-direction: column;
  justify-self: start;
  padding: 20px;
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

.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 0;
}

.login .van-button {
  max-width: 150px;
  margin: 0 auto;
}

.login p {
  font-size: 14px;
  color: #464444;
  margin-bottom: 10px;
  text-align: center;
}

.categories-box {
  margin-bottom: 20px;
}

.categorie {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
}

.categorie .info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.categorie .info .name {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.categorie .info .desc {
  font-size: 12px;
  color: #666;
}

.categorie img {
  width: 50px;
  height: 50px;
}
</style>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { onMounted, ref, onBeforeUnmount } from "vue";
import LastedList from "@/components/LastedList.vue";
import { useConfigStore } from "@/stores/config";
import { useApiStore } from "@/stores/api";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
    LastedList,
  },
  setup() {
    const configStore = useConfigStore();
    const apiStore = useApiStore();
    const discussionCategories = ref([]);
    const categoriesLogo = ref({});

    const chunkArray = (array, chunkSize) => {
      return array.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / chunkSize);

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
      }, []);
    };

    const categorie_columns = ref(2);

    const handleResize = () => {
      let windowWidth = window.innerWidth;
      categorie_columns.value = windowWidth >= 400 ? 2 : 1;
    };

    onMounted(() => {
      window.addEventListener("resize", handleResize);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });



    // 加载分类
    // 判断是否登录
    if (configStore.access_token) {
      apiStore
        .githubApi(apiStore.QUERY_DISCUSSIONS_CATEGORIES, {})
        .then((res) => {
          // console.log(res);
          const categories = res.repository.discussionCategories.nodes;
          discussionCategories.value = chunkArray(categories, 4);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      // 从action提前构建的数据中加载
      const categories = [
        {
          name: "A公告",
          description: "维护者更新",
          emojiHTML: "<div>📣</div>",
          emoji: ":mega:",
          id: "DIC_kwDOL_11UM4CfkqR",
        },
        {
          name: "B闲聊区",
          description: "可以在这儿聊所有有关Legado的事情",
          emojiHTML: "<div>💬</div>",
          emoji: ":speech_balloon:",
          id: "DIC_kwDOL_11UM4CfkqS",
        },
        {
          name: "C书源发布",
          description: "分享你编写或喜欢的书源以及书源合集",
          emojiHTML: "<div>💡</div>",
          emoji: ":bulb:",
          id: "DIC_kwDOL_11UM4CfkqU",
        },
        {
          name: "D订阅源发布",
          description: "分享你编写或喜欢的订阅源",
          emojiHTML: "<div>🙌</div>",
          emoji: ":raised_hands:",
          id: "DIC_kwDOL_11UM4CfkqV",
        },
        {
          name: "E问答区",
          description: "寻求社区的帮助",
          emojiHTML: "<div>🙏</div>",
          emoji: ":pray:",
          id: "DIC_kwDOL_11UM4CfkqT",
        },
        {
          name: "F投票",
          description: "社区投票",
          emojiHTML: "<div>🗳️</div>",
          emoji: ":ballot_box:",
          id: "DIC_kwDOL_11UM4CfkqW",
        },
      ];
      discussionCategories.value = chunkArray(categories, 4);
    }

    categoriesLogo.value = configStore.config.categories;

    const login = () => {
      const clientId = configStore.config.discussion.clientId;
      const redirectUri = encodeURIComponent(
        configStore.config.discussion.redirectUri
      );
      const scope = encodeURIComponent("user,public_repo,gist");
      const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
      window.location.href = url;
    };

    return {
      configStore,
      discussionCategories,
      categoriesLogo,
      categorie_columns,
      login,
    };
  },
};
</script>
