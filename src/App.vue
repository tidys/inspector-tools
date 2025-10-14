<template>
  <div class="app">
    <textarea style="min-height: 100px" v-model="txt"></textarea>
    <div class="btn-container">
      <button class="btn" @click="paste">粘贴</button>
      <button class="btn" @click="onClick">增加订单</button>
    </div>
  </div>
</template>

<script>
import { ref, toRaw } from "vue";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://cxzdqwdteoxteqtpllar.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emRxd2R0ZW94dGVxdHBsbGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyODY3OTksImV4cCI6MjA3NDg2Mjc5OX0.DDue3CQJjns3PwA0nCxL9yVwjLk-AkNzHd7950ycysY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default {
  name: "App",
  components: {},
  setup() {
    let txt = ref('{"user":"123","site":"456"}');
    return {
      txt,
      async paste() {
        try {
          const text = await navigator.clipboard.readText();
          txt.value = text;
        } catch (err) {
          console.error("无法从剪切板粘贴:", err);
          alert("无法从剪切板粘贴内容，请手动粘贴或检查浏览器权限");
        }
      },
      async onClick() {
        if (!txt.value) {
          return;
        }
        console.log(txt.value);
        const order = toRaw(txt.value);
        let id = "";
        let url = "";
        try {
          const orderObj = JSON.parse(order);
          id = orderObj.id || "";
          url = orderObj.url || "";
        } catch (error) {
          console.log(error);
          alert(`无效的订单格式，不是有效的json数据`);
          return;
        }
        if (!id) {
          alert(`无效的用户，缺失id字段`);
          return;
        }
        if (!url) {
          alert(`无效的站点，缺失url字段`);
          return;
        }

        console.log("click");
        try {
          // 查询是否有该记录
          const table = "CdKey";
          const ret = await supabase.from(table).select("*").eq("site", url).eq("user", id);
          if (ret.data && ret.data.length > 0) {
            alert(`用户:${id}\n网站:${url}\n已存在`);
            return;
          }

          // const token = "sbp_c2794be3bb1e536d55bf2f44ecf03f208267deea";
          // const dd = await supabase.auth.setSession({
          //   access_token: token,
          //   refresh_token: token,
          // });
          // console.log(dd);
          // 添加一条记录
          const { data, error } = await supabase
            .from(table)
            .insert([{ user: id, site: url }])
            .select();
          if (error) {
            console.log(error);
            alert(`${id}-${url}增加失败`);
            return;
          }
          console.log(data);
          alert(`${id}-${url}增加成功`);
        } catch (e) {
          console.log(e);
          return false;
        }
      },
    };
  },
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
}
.btn-container {
  display: flex;
  .btn {
    flex: 1;
    height: 100px;
  }
}
</style>
