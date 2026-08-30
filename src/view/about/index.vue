<template>
  <div class="mt-2">
    <div class="flex justify-center">
      <div class="w-full max-w-md">
        <el-card class="min-w-96">
          <template #header>
            <el-divider>AI-Meva</el-divider>
          </template>
          <div>
            <div class="w-full flex items-center justify-center">
              <img
                class="org-img dom-center"
                src="@base/assets/logo.png"
                alt="ai-meva-admin"
              />
            </div>
            <div class="w-full flex items-center justify-center mt-4">
              <p class="text-gray-600 text-center">AI-Meva 全球首个 AI 伴侣 + Web3 创业平台</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
  defineOptions({
    name: 'About'
  })
</script>

<style scoped>
  .avatar-img {
    float: left;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    margin-top: 15px;
  }

  .org-img {
    height: 150px;
    width: 150px;
  }

  .dom-center {
    margin-left: 50%;
    transform: translateX(-50%);
  }
</style>
