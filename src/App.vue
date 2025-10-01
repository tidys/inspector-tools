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
        let user = "";
        let site = "";
        try {
          const orderObj = JSON.parse(order);
          user = orderObj.user || "";
          site = orderObj.site || "";
        } catch (error) {
          console.log(error);
          alert(`无效的订单格式`);
          return;
        }
        if (!user) {
          alert(`无效的用户`);
          return;
        }
        if (!site) {
          alert(`无效的站点`);
          return;
        }

        console.log("click");
        try {
          // 查询是否有该记录
          const table = "CdKey";
          const ret = await supabase.from(table).select("*").eq("site", site).eq("user", user);
          if (ret.data && ret.data.length > 0) {
            alert(`用户:${user}\n网站:${site}\n已存在`);
            return;
          }

          // const token = "sbp_c2794be3bb1e536d55bf2f44ecf03f208267deea";
          // const dd = await supabase.auth.setSession({
          //   access_token: token,
          //   refresh_token: token,
          // });
          // console.log(dd);
          // 添加一条记录
          const { data, error } = await supabase.from(table).insert([{ user, site }]).select();
          if (error) {
            console.log(error);
            alert(`${user}-${site}增加失败`);
            return;
          }
          console.log(data);
          alert(`${user}-${site}增加成功`);
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
