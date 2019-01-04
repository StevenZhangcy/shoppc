<template>
  <!-- 引入card小容器 -->
  <el-card class="card">
    <!-- 引入面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 引入搜索栏 -->
    <el-input
      placeholder="请输入内容"
      v-model="query"
      @clear="clear()"
      clearable
      class="input-with-select"
    >
      <el-button slot="append" icon="el-icon-search" @click="checkUser()"></el-button>
    </el-input>
    <el-button type="success" @click="showAdd()">添加用户</el-button>
    <!-- 引入表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
      <!-- 处理时间 -->
      <el-table-column label="创建日期" width="260">
        <template slot-scope="scope">{{scope.row.create_time | forDate}}</template>
      </el-table-column>
      <!-- 处理状态 -->
      <el-table-column label="用户状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="editStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- 处理用户按钮 -->
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-row>
            <el-button
              size="mini"
              plain
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEdit(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleted(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              plain
              type="success"
              icon="el-icon-check"
              circle
              @click="showRoles(scope.row)"
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页导航 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户隐藏域 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户隐藏域 -->
    <el-dialog title="修改用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit(form.id)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色管理 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRoles">
      <el-form>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <span>{{currentUsrname}}</span>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="currentRoleId">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRoles = false">取 消</el-button>
        <el-button type="primary" @click="handleRoles()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  created () {
    this.getUsers()
  },
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      tableData: [],
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRoles: false,
      form: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      formLabelWidth: '120px',
      currentRoleId: -1,
      roles: [],
      currentUsrname: '',
      currentUserId: -1
    }
  },
  methods: {
    // 处理角色显示
    async showRoles (user) {
      // console.log(user)
      // 打开角色选项 要把用户信息传过来  包括id 和姓名
      // 然后把用户id和姓名储存在data中供视图使用
      this.currentUsrname = user.username
      this.currentUserId = user.id
      this.dialogFormVisibleRoles = true
      // 查询要渲染页面的角色列表信息 所有的一级信息 里面包含角色id
      const res = await this.$http.get(`roles`)
      const {
        data,
        meta: { status }
      } = res.data
      if (status === 200) {
        this.roles = data
      }
      // 根据id查询用户
      // 的角色id视图中有个逻辑  即 根据用户id查询出来的角色id=== 获取角色信息的角色id相互匹配
      // 在selection中就是默认显示label中的内容
      const res1 = await this.$http.get(`users/` + user.id)
      // console.log(res1)
      // 根据id获取角色id
      this.currentRoleId = res1.data.data.rid
    },
    // 处理角色分配
    async handleRoles (rid) {
      const res = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRoleId
      })
      // console.log(res)
      this.dialogFormVisibleRoles = false
    },
    // 修改用户状态
    async editStatus (user) {
      // console.log(user)
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      )
      // console.log(res)
      const {
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.$message.success(msg)
      }
      // this.tableData = res.data
      // if
    },
    // 清空搜索框发送查询请求
    clear () {
      this.getUsers()
    },
    // 查询用户功能
    checkUser () {
      this.getUsers()
    },
    // 处理编辑功能
    async handleEdit (id) {
      //  console.log(id)
      const res = await this.$http.put(`users/` + id, this.form)
      // console.log(res)
      const {
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.dialogFormVisibleEdit = false
        this.getUsers()
        // this.$message.success(msg)
      } else {
        this.$message.success(msg)
      }
    },
    // 编辑功能 显示编辑
    async showEdit (id) {
      this.dialogFormVisibleEdit = true
      const res = await this.$http.get(`users/` + id)
      // console.log(res)
      const {
        data,
        meta: { status }
      } = res.data
      if (status === 200) {
        this.form = data
        // console.log(this.form)
      }
    },
    // 删除用户
    deleted (id) {
      this.$confirm('是否删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`users/` + id)
          const {
            meta: { status }
          } = res.data
          if (status === 200) {
            this.getUsers()
            this.$message.success('删除成功!')
          }
        })
        .catch(() => {
          this.$message.success('已取消删除')
        })
    },
    // 添加用户
    // 显示添加页面
    showAdd () {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },
    // 处理添加请求
    async handleAdd () {
      const res = await this.$http.post(`users`, this.form)
      // console.log(res)
      const {
        meta: { status, msg }
      } = res.data
      if (status === 201) {
        this.dialogFormVisibleAdd = false
        this.getUsers()
      } else {
        this.$message.warning(msg)
      }
    },
    // 分页导航
    // 处理页面条数变化变化方法
    handleSizeChange (val) {
      this.pagesize = val
      this.getUsers()
      this.pagenum = 1
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUsers()
      this.pagenum = 1

      // console.log(`当前页: ${val}`);
    },
    //   查询用户列表
    async getUsers () {
      // 设置公共请求 token
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )
      // console.log(res);
      const {
        data: { users, total },
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.total = total
        this.tableData = users
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>
<style>
.input-with-select {
  margin: 20px 0;
  width: 350px;
}
.card {
  height: 100%;
}
</style>
