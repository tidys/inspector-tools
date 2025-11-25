const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: "./",
  transpileDependencies: true,
  pages: {
    index: {
      entry: "src/index/main.js",
      filename: "index.html"
    },
    inspector: {
      entry: "src/inspector/main.js",
      filename: "inspector.html"
    },
    voice: {
      entry: "src/voice/main.js",
      filename: "voice.html"
    }
  }
})
