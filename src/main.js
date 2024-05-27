import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useConfigStore } from "./stores/config";
import "./main.css"

import { Button } from 'vant';
import { Swipe, SwipeItem } from 'vant';
import { Grid, GridItem } from 'vant';
import { Search } from 'vant';
import { List } from 'vant';
import { Cell, CellGroup } from 'vant';
import { Image as VanImage } from 'vant';
import { NavBar } from 'vant';
import { Collapse, CollapseItem } from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';
import '@vant/touch-emulator';


const app = createApp(App);

app.use(router);
app.use(createPinia());

app.use(Button);
app.use(Swipe);
app.use(SwipeItem);
app.use(Grid);
app.use(GridItem);
app.use(Search);
app.use(List);
app.use(Cell);
app.use(CellGroup);
app.use(VanImage);
app.use(NavBar);
app.use(Collapse);
app.use(CollapseItem);

// 先导入config
const configStore = useConfigStore();
configStore.getConfig();
console.log(configStore);

async function initApp() {
    // 设置 body 背景颜色为蓝色
    document.body.style.backgroundColor = '#add8e6';
    await configStore.getConfig();
    await configStore.checkLoginSate();
    // 等待3秒
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 添加淡出动画
    const loading = document.getElementById('loading');
    loading.classList.add('fade-out');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 隐藏启动动画
    loading.style.display = 'none';
    document.body.style.backgroundColor = '';
    app.mount('#app');
}

initApp();

