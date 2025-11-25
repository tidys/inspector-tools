<template>
  <div class="root">
    <a href="./voice.html">voice-faker</a>
    <a href="./inspector.html">inspector</a>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<style less scoped>
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
