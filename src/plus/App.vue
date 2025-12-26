<template>
  <div class="app">
    <textarea style="min-height: 100px" v-model="txt"></textarea>
    <div class="btn-container">
      <button class="btn" @click="paste">粘贴</button>
      <button class="btn one" @click="onClick">开通PLUS</button>
    </div>
  </div>
</template>

<script>
import { ref, toRaw } from "vue";
import { supabase } from "../com/db";
export default {
  name: "App",
  components: {},
  setup() {
    let txt = ref('{"id":"xuyanfeng"}');
    let testUrl = ref("https://cs.youxi112.com/hczwjs/");
    function getIdUrl(order) {
      // {"id":"xuyanfeng","type":"plus","day":360}
      const ret = { id: "", type: "", day: 0, error: "" };
      try {
        const orderObj = JSON.parse(order);
        ret.id = orderObj.id || "";
        ret.type = orderObj.type || "";
        ret.day = orderObj.day || 0;
      } catch (error) {
        ret.error = `无效的订单格式，不是有效的json数据`;
        return ret;
      }
      if (!ret.id) {
        ret.error = `无效的用户，缺失id字段`;
        return ret;
      }
      if (!ret.type) {
        ret.error = `无效的类型，缺失type字段`;
        return ret;
      }
      if (!ret.day) {
        ret.error = `无效的天数，缺失day字段`;
        return ret;
      }
      return ret;
    }

    async function addOrder(order) {
      console.log("click");
      const { id, type, day, error } = getIdUrl(order);
      if (error) {
        alert(error);
        return;
      }
      if (type !== "plus") {
        alert(`无效的type类型，只支持plus类型`);
        return;
      }
      try {
        // 查询是否有该记录
        const table = "cc-inspector-plus";
        const cur = Date.now();
        const end = cur + day * 24 * 60 * 60 * 1000;
        const ret = await supabase.from(table).select("*").eq("user", id);
        if (ret.data && ret.data.length > 0) {
          // 更新时间
          const { data, error } = await supabase.from(table).update({ end: end }).eq("user", id).select();
          if (error) {
            console.log(error);
            alert(`${id}更新失败`);
            return;
          }
          if (data && data.length > 0) {
            alert(`用户${id}开通成功\n新的过期时间为:[${end}]\n${new Date(end).toLocaleString()}`);
          } else {
            alert(`发生异常`);
          }
        } else {
          // 添加一条记录
          const { data, error } = await supabase
            .from(table)
            .insert([{ user: id, end: end, enable: 1, try_time: 0, try_count: 0 }])
            .select();
          if (error) {
            console.log(error);
            alert(`用户${id}增加失败`);
            return;
          }
          console.log(data);
          alert(`用户${id}开通成功\n过期时间为:[${end}]\n${new Date(end).toLocaleString()}`);
        }
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

      async onClick() {
        if (!txt.value) {
          return;
        }
        console.log(txt.value);
        const order = toRaw(txt.value);
        await addOrder(order);
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

  .one {
    background-color: rgb(111, 255, 101);
  }
}
</style>
