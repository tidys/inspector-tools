<template>
  <div class="hello">
    <div class="line">
      <div class="label">机器码:</div>
      <input style="flex: 1" type="text" placeholder="机器码" v-model="machine" />
      <button class="btn" @click="onRandomMachine">随机机器码</button>
    </div>
    <div class="line">
      <div class="label">卡密:</div>
      <input style="flex: 1" type="text" placeholder="请输入卡密" v-model="cdk" />
      <button class="btn" @click="onRandomCDK">随机卡密</button>
    </div>
    <div class="line">
      <div style="flex: 1"></div>
      <button class="btn" style="background-color: aqua; width: 180px" @click="onQueryCDK">查询卡密</button>
      <button class="btn" style="background-color: aqua; width: 180px" @click="onAddCDK">增加30天的卡密</button>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/com/db";
import { ref, toRaw } from "vue";

const KEY_MACHINE = "machine";
const KEY_CDK = "cdkey";
const TABLE = "voice-faker";
export default {
  name: "App",
  props: {
    msg: String,
  },
  setup() {
    const cdk = ref(localStorage.getItem(KEY_CDK) || "");
    const machine = ref(localStorage.getItem(KEY_MACHINE) || "");
    return {
      cdk,
      machine,
      async onQueryCDK() {
        // eslint-disable-next-line no-debugger
        debugger;
        const machineValue = toRaw(machine.value);
        const cdkValue = toRaw(cdk.value);
        const ret = await supabase.from(TABLE).select("*").eq("machine", machineValue).eq("cdkey", cdkValue);
        if (ret.data && Array.isArray(ret.data) && ret.data.length > 0) {
          const info = ret.data[0];
          const t1 = new Date(info["time-start"]).toLocaleString();
          const t2 = new Date(info["time-end"]).toLocaleString();
          alert(`机器码: ${machineValue}\n卡密: ${cdkValue}\n开始时间:${t1}\n结束时间:${t2}`);
          return;
        }
      },
      async onAddCDK() {
        // eslint-disable-next-line no-debugger
        debugger;
        const machineValue = toRaw(machine.value);
        const cdkValue = toRaw(cdk.value);
        if (!machineValue.length) {
          alert("请输入机器码");
          return;
        }
        if (!cdkValue.length) {
          alert("请输入卡密");
          return;
        }
        localStorage.setItem(KEY_MACHINE, machineValue);
        localStorage.setItem(KEY_CDK, cdkValue);
        const ret = await supabase.from(TABLE).select("*").eq("machine", machineValue).eq("cdkey", cdkValue);
        if (ret.data && ret.data.length > 0) {
          alert(`机器码: ${machineValue}\n卡密: ${cdkValue}\n已存在, 无需重复添加`);
          return;
        }
        // 添加一条记录
        const cur = new Date().getTime();
        const end = cur + 1000 * 60 * 60 * 24 * 30;
        const { data, error } = await supabase
          .from(TABLE)
          .insert([
            {
              machine: machineValue,
              cdkey: cdkValue,
              ["time-start"]: cur, //
              ["time-end"]: end,
            },
          ])
          .select();
        if (error) {
          console.log(error);
          alert(`${machineValue}-${cdkValue}增加失败`);
          return;
        }
        console.log(data);
        alert(`机器码: ${machineValue}\n卡密: ${cdkValue}\n增加成功`);
      },
      onRandomCDK() {
        cdk.value = Math.random().toString(36).substring(2, 10);
      },
      onRandomMachine() {
        machine.value = Math.random().toString(36).substring(2, 10);
      },
    };
  },
};
</script>

<style less scoped>
.btn {
  margin-left: 5px;
  width: 100px;
}

.line {
  margin: 2px 1px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .label {
    width: 80px;
  }
}
</style>
