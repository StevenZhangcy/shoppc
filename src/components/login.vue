<template>
  <div class="wrap">
    <el-form class="form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button class="btn" @click="handleLogin()" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      let res = await this.$http.post('login', this.formdata)
      // console.log(res)
      const {
        data: {
          meta: { msg, status },
          data
        }
      } = res
      if (status === 200) {
        localStorage.setItem('token', data.token)
        this.$router.push({
          name: 'home'
        })
      } else {
        // this.$message.warning(msg)
        this.$message({
          message: msg,
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style>
.wrap {
  height: 100%;
  /* height: 938px; */
  background-color: #314052;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrap .form {
  width: 500px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
}
.wrap .form .btn {
  width: 100%;
}
</style>
