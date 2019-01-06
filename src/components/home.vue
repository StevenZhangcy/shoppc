<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <img src="@/assets/logo.png" alt="图片无法加载">
          </div>
        </el-col>
        <el-col :span="19">
          <div class="grid-content bg-purple-light">
            <h2>电商后台管理系统</h2>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a href="#" @click.prevent="logout()">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="asider" width="220px">
        <!-- 配置动态路由渲染配合登录 -->
        <!-- 需要两层循环 -->
        <!-- 用户管理导航 -->
        <el-menu
          v-for="(v,i) in meuns"
          :key="i"
          default-active="2"
          router
          class="el-menu-vertical-demo"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{v.authName}}</span>
            </template>
            <el-menu-item v-for="(v1,i) in v.children" :key="i" :index="v1.path">
              <i class="el-icon-location"></i>
              {{v1.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  beforeCreate() {
    // 判断是否有token 如果有就渲染下面页面 如果没有直接返回登录页面
    // if (!localStorage.getItem("token")) {
    //   this.$router.push({
    //     name: "login"
    //   });
    // }
  },
  created() {
    this.getMeuns();
  },
  data() {
    return {
      meuns: []
    };
  },
  methods: {
    // 获取侧边栏权限
    async getMeuns() {
      const res = await this.$http.get(`menus`);
      this.meuns = res.data.data;
      console.log(res);
    },
    // 退出功能
    logout() {
      localStorage.clear();
      this.$router.push({
        name: "login"
      });
      this.$message.success("退出成功");
    }
  }
};
</script>
<style>
.container {
  /* height: 938px; */
  height: 100%;
}
.header {
  background-color: #b1becf;
  text-align: center;
  line-height: 60px;
}
.asider {
  background-color: #fff;
}
.main {
  background-color: rgb(223, 220, 220);
}
</style>
