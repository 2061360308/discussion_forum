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

// 先导入config
const configStore = useConfigStore();
configStore.getConfig();
console.log(configStore);

configStore.getConfig().then(() => {
    app.mount('#app');
});

