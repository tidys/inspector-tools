<template>
  <div class="app">
    <textarea style="min-height: 100px" v-model="txt"></textarea>
    <div class="btn-container">
      <button class="btn all" @click="onClickAll">开通所有</button>
      <button class="btn" @click="paste">粘贴</button>
      <button class="btn one" @click="onClick">开通单个</button>
    </div>
    <div style="margin: 3px 0">
      <button class="btn-test" @click="onClickTest">给当前用户追加测试网址</button>
      <a :href="testUrl" target="_blank">测试网址</a>
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
    let txt = ref('{"id":"xuyanfeng","url":"*"}');
    let testUrl = ref("https://cs.youxi112.com/hczwjs/");
    function getIdUrl(order) {
      const ret = { id: "", url: "", error: "" };
      try {
        const orderObj = JSON.parse(order);
        ret.id = orderObj.id || "";
        ret.url = orderObj.url || "";
      } catch (error) {
        ret.error = `无效的订单格式，不是有效的json数据`;
        return ret;
      }
      if (!ret.id) {
        ret.error = `无效的用户，缺失id字段`;
        return ret;
      }
      if (!ret.url) {
        ret.error = `无效的站点，缺失url字段`;
        return ret;
      }
      return ret;
    }

    async function addOrider(order) {
      const { id, url, error } = getIdUrl(order);
      if (error) {
        alert(error);
        return;
      }
      console.log("click");
      try {
        // 查询是否有该记录
        const table = "CdKey";
        const ret = await supabase.from(table).select("*").eq("site", url).eq("user", id);
        if (ret.data && ret.data.length > 0) {
          alert(`用户: ${id}\n网站: ${url}\n已存在`);
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
        alert(`id: ${id}\nurl: ${url}\n增加成功`);
      } catch (e) {
        console.log(e);
        return false;
      }
    }
    return {
      txt,
      testUrl,
      async paste() {
        try {
          const text = await navigator.clipboard.readText();
          txt.value = text;
        } catch (err) {
          console.error("无法从剪切板粘贴:", err);
          alert("无法从剪切板粘贴内容，请手动粘贴或检查浏览器权限");
        }
      },
      async onClickTest() {
        console.log("click test");
        if (!txt.value) {
          return;
        }
        const { id, error } = getIdUrl(toRaw(txt.value));
        if (error) {
          alert(error);
          return;
        }
        const order = JSON.stringify({ id: id, url: toRaw(testUrl.value) });
        await addOrider(order);
      },
      async onClick() {
        if (!txt.value) {
          return;
        }
        console.log(txt.value);
        const order = toRaw(txt.value);
        await addOrider(order);
      },
      async onClickAll() {
        if (!txt.value) {
          return;
        }
        const { id, error } = getIdUrl(toRaw(txt.value));
        if (error) {
          alert(error);
          return;
        }
        const order = JSON.stringify({ id: id, url: "*" });
        await addOrider(order);
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
.btn-test {
  height: 50px;
  margin: 0 3px;
}
.btn-container {
  display: flex;
  .btn {
    flex: 1;
    height: 100px;
  }
  .all {
    background-color: rgb(249, 113, 55);
  }
  .one {
    background-color: rgb(111, 255, 101);
  }
}
</style>
