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
      <button class="btn" style="background-color: aqua" @click="onAddCDK">增加卡密</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  setup() {
    const cdk = ref("");
    const machine = ref("");
    return {
      cdk,
      machine,
      onAddCDK() {
        alert("增加卡密");
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
