import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useConfigStore } from "./config";

const useApiStore = defineStore("apiStore", () => {
  const configStore = useConfigStore();

  // 构造request对象
  const request = axios.create({
    baseURL: "https://api.github.com/graphql",
    headers: {
      "Content-Type": "application/json",
    },
  });

  request.interceptors.request.use((config) => {
    const token = configStore.access_token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 查询API
  async function githubApi(queryFun, variables = {}) {
    const query = queryFun(variables);
    console.log("查询字符串：", query, "变量：", variables);
    const response = await request.post("", { query });
    return response.data.data;
  }

  const QUERY_DISCUSSIONS = ({
    after = null,
    before = null,
    first = 10,
    last = null,
    categoryId = null,
    answered = null,
    orderBy = null,
  } = {}) => {
    /**
     * 查询讨论列表
     * @param {String} after 游标，用于分页
     * @param {String} before 游标，用于分页
     * @param {Number} first 每页数量
     * @param {Number} last 每页数量
     * @param {String} categoryId 分类ID
     * @param {Boolean} answered 是否已回答
     * @param {Object} orderBy 排序
     * @returns {String} 查询字符串
     */

    // 构造查询参数
    let params = [];
    if (first) params.push(`first: ${first}`);
    if (last) params.push(`last: ${last}`);
    if (after) params.push(`after: "${after}"`);
    if (before) params.push(`before: "${before}"`);
    if (categoryId) params.push(`categoryId: "${categoryId}"`);
    if (answered !== null) params.push(`answered: ${answered}`);
    if (orderBy) params.push(`orderBy: ${JSON.stringify(orderBy)}`);

    const query = `
      query {
        repository(owner: "${configStore.config.discussion.owner}", name: "${
      configStore.config.discussion.repo
    }") {
            discussions(${params.join(", ")}) {
                nodes {
                    id
                    title
                    author {
                        login
                        avatarUrl
                    }
                    category {
                        id
                        name
                        emoji
                    }
                    createdAt
                    comments {
                        totalCount
                    }
                }
                totalCount
                pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                    hasPreviousPage
                }
            }
        }
    }`;

    return query;
  };

  const QUERY_DISCUSSION = ({ id } = {}) => {
    /**
     * 查询讨论详情
     * @param {String} id 讨论ID
     * @returns {String} 查询字符串
     */
    const query = `
        query {
            node(id: "${id}") {
              ... on Discussion {
                id
                title
                body
                url
                author {
                  login
                  avatarUrl
                }
                category {
                  id
                  name
                  emojiHTML
                }
                createdAt
                comments(first: 10) {
                  totalCount
                }
              }
            }
          }`;
    return query;
  };

  const QUERY_DISCUSSION_COMMENTS = ({
    id,
    after = null,
    before = null,
    first = 10,
    last = null,
  } = {}) => {
    /**
     * 查询讨论评论列表
     * @param {String} id 讨论ID
     * @param {String} after 游标，用于分页
     * @param {String} before 游标，用于分页
     * @param {Number} first 每页数量
     * @param {Number} last 每页数量
     * @returns {String} 查询字符串
     */
    let params = [];
    if (first) params.push(`first: ${first}`);
    if (last) params.push(`last: ${last}`);
    if (after) params.push(`after: "${after}"`);
    if (before) params.push(`before: "${before}"`);

    const query = `
    query {
        node(id: "${id}") {
          ... on Discussion {
            id
            comments(${params.join(", ")}) {
              totalCount
              nodes {
                body
                author {
                  login
                  avatarUrl
                }
                id
                replies(first: 10) {
                  totalCount
                }
                createdAt
              }
              pageInfo {
                    hasPreviousPage
                    hasNextPage
                    startCursor
                    endCursor
                }
            }
          }
        }
      }`;
    return query;
  };

  const QUERY_PINNED_DISCUSSIONS = () => {
    /**
     * 查询置顶讨论列表
     * @returns {String} 查询字符串
     */
    const query = `
        query {
            repository(owner: "${configStore.config.discussion.owner}", name: "${configStore.config.discussion.repo}") {
                pinnedDiscussions(first: 10) {
                    nodes {
                        discussion {
                            id
                            title
                            author {
                                login
                                avatarUrl
                            }
                            category {
                                id
                                name
                                emoji
                            }
                            createdAt
                            comments {
                                totalCount
                            }
                        }
                    }
                }
            }
        }`;
    return query;
  };

  const QUERY_DISCUSSIONS_CATEGORIES = ({
    after = null,
    before = null,
    first = 10,
    last = null,
  } = {}) => {
    /**
     * 查询讨论分类列表
     * @param {String} after 游标，用于分页
     * @param {String} before 游标，用于分页
     * @param {Number} first 每页数量
     * @param {Number} last 每页数量
     * @returns {String} 查询字符串
     */

    let params = [];
    if (first) params.push(`first: ${first}`);
    if (last) params.push(`last: ${last}`);
    if (after) params.push(`after: ${after}`);
    if (before) params.push(`before: "${before}"`);

    console.log("after:::", JSON.stringify(after));

    console.log("查询参数", params);

    const query = `
        query {
          repository(owner: "${configStore.config.discussion.owner}", name: "${
      configStore.config.discussion.repo
    }") {
            discussionCategories(${params.join(", ")}) {
              nodes {
                name
                description
                emojiHTML
                emoji
                id
              }
            }
          }
        }
      `;
    return query;
  };

  const QUERY_DISCUSSION_COMMENT_REPLIES = ({
    id,
    after = null,
    before = null,
    first = 10,
    last = null,
  } = {}) => {
    let params = [];
    if (first) params.push(`first: ${first}`);
    if (last) params.push(`last: ${last}`);
    if (after) params.push(`after: "${after}"`);
    if (before) params.push(`before: "${before}"`);

    const query = `
        query {
            node(id: "${id}") {
              ... on DiscussionComment {
                id
                replies(first: 10) {
                  nodes {
                    author {
                      login
                      avatarUrl
                    }
                    body
                    createdAt
                    id
                    replyTo {
                      author {
                        login
                      }
                      id
                    }
                  }
                  pageInfo {
                    hasPreviousPage
                    hasNextPage
                    startCursor
                    endCursor
                  }
                  totalCount
                }
              }
            }
          }`;
    return query;
  };

  return {
    githubApi,
    QUERY_DISCUSSIONS,  // 查询讨论列表
    QUERY_DISCUSSION,  // 查询讨论详细信息
    QUERY_DISCUSSION_COMMENTS,  // 查询讨论评论
    QUERY_PINNED_DISCUSSIONS,  // 查询置顶讨论
    QUERY_DISCUSSIONS_CATEGORIES,  // 查询讨论分类
    QUERY_DISCUSSION_COMMENT_REPLIES,  // 查询讨论评论回复
  };
});

export { useApiStore };
