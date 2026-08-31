<template>
  <div
    id="userLayout"
    class="login-page w-full h-full relative flex items-center justify-center"
  >
    <!-- 登录容器：左右分栏（参考站点 .login-contain） -->
    <div class="login-contain z-[999] flex">
      <!-- 左侧装饰图（.login-image） -->
      <div class="login-image"></div>
      <!-- 右侧表单区（.login-submit） -->
      <div class="login-submit">
        <!-- 标题区域：对齐参考站点 .user-img 风格 -->
        <div class="user-img">
          <div class="flex items-center justify-center mb-4">
            <img class="w-16" :src="$GIN_VUE_ADMIN.appLogo" alt />
          </div>
          <b class="block text-center text-[36px] text-[#2f2e3f] leading-tight">{{
            $GIN_VUE_ADMIN.appName
          }}</b>
          <p class="text-center text-sm text-[#8c89a4] mt-2">
            AI-Meva 全球首个 AI 伴侣 + Web3 创业平台
          </p>
        </div>
        <el-form
          ref="loginForm"
          :model="loginFormData"
          :rules="rules"
          :validate-on-rule-change="false"
          @keyup.enter="submitForm"
        >
          <el-form-item prop="username" class="mb-5">
            <el-input
              v-model="loginFormData.username"
              size="large"
              placeholder="请输入用户名"
              suffix-icon="user"
            />
          </el-form-item>
          <el-form-item prop="password" class="mb-5">
            <el-input
              v-model="loginFormData.password"
              show-password
              size="large"
              type="password"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item prop="captcha" class="mb-5">
            <div class="flex w-full justify-between">
              <el-input
                v-model="loginFormData.captcha"
                type="text"
                maxlength="6"
                placeholder="请输入谷歌口令"
                size="large"
                class="flex-1"
              />
              <div
                v-if="loginFormData.openCaptcha"
                class="w-1/3 h-11 bg-[#c3d4f2] rounded ml-4"
              >
                <img
                  v-if="picPath"
                  class="w-full h-full"
                  :src="picPath"
                  alt="请输入验证码"
                  @click="loginVerify()"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item class="mb-2">
            <el-button
              class="shadow shadow-active h-11 w-full"
              type="primary"
              size="large"
              @click="submitForm"
              >登 录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { captcha } from '@base/api/user'
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useUserStore } from '@base/pinia/modules/user'

  defineOptions({
    name: 'Login'
  })
  // 验证函数
  const checkUsername = (rule, value, callback) => {
    if (value.length < 5) {
      return callback(new Error('请输入正确的用户名'))
    } else {
      callback()
    }
  }
  const checkPassword = (rule, value, callback) => {
    if (value.length < 6) {
      return callback(new Error('请输入正确的密码'))
    } else {
      callback()
    }
  }

  // 获取验证码
  const loginVerify = async () => {
    const ele = await captcha()
    rules.captcha.push({
      max: ele.data.captchaLength,
      min: ele.data.captchaLength,
      message: `请输入${ele.data.captchaLength}位验证码`,
      trigger: 'blur'
    })
    picPath.value = ele.data.picPath
    loginFormData.captchaId = ele.data.captchaId
    loginFormData.openCaptcha = ele.data.openCaptcha
  }
  loginVerify()

  // 登录相关操作
  const loginForm = ref(null)
  const picPath = ref('')
  const loginFormData = reactive({
    username: 'admin',
    password: '',
    captcha: '',
    captchaId: '',
    openCaptcha: false
  })
  const rules = reactive({
    username: [{ validator: checkUsername, trigger: 'blur' }],
    password: [{ validator: checkPassword, trigger: 'blur' }],
    captcha: [
      {
        message: '验证码格式不正确',
        trigger: 'blur'
      }
    ]
  })

  const userStore = useUserStore()
  const login = async () => {
    return await userStore.LoginIn(loginFormData)
  }
  const submitForm = () => {
    loginForm.value.validate(async (v) => {
      if (!v) {
        // 未通过前端静态验证
        ElMessage({
          type: 'error',
          message: '请正确填写登录信息',
          showClose: true
        })
        await loginVerify()
        return false
      }

      // 通过验证，请求登陆
      const flag = await login()

      // 登陆失败，刷新验证码
      if (!flag) {
        await loginVerify()
        return false
      }

      // 登陆成功
      return true
    })
  }
</script>

<style scoped lang="scss">
  /* 登录页：全屏背景图 */
  .login-page {
    background: url('@/assets/login_background.jpg') no-repeat center center;
    background-size: 100% 100%;
    background-color: #fff;
    min-height: 100vh;
  }

  /* 登录容器：左右分栏，参考站点 .login-contain */
  .login-contain {
    max-width: 1100px;
    width: 90%;
    max-height: 640px;
    height: 80vh;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 5px 5px 5px rgba(238, 239, 245, 0.6);
    overflow: hidden;
  }

  /* 左侧装饰图：参考站点 .login-image */
  .login-image {
    width: 55%;
    height: 100%;
    background: url('@/assets/login_tip.png') no-repeat center center;
    background-size: cover;
  }

  /* 右侧表单区：参考站点 .login-submit */
  .login-submit {
    flex: 1;
    height: 100%;
    padding: 80px 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* 标题区域下间距 */
  .user-img {
    padding-bottom: 40px;
  }

  /* 响应式：小屏隐藏左侧装饰图 */
  @media (max-width: 768px) {
    .login-contain {
      width: 92%;
      height: auto;
      max-height: none;
      border-radius: 16px;
    }
    .login-image {
      display: none;
    }
    .login-submit {
      padding: 40px 24px;
    }
  }
</style>
