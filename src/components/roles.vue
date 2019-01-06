<template>
  <el-card class="card">
    <!-- 引入面包屑 -->
    <my-bread text1="角色列表"></my-bread>
    <el-button class="btn" plain type="success">添加角色</el-button>
    <!-- 引入表格 -->
    <el-table :data="roles" style="width: 100%" height="600">
      <el-table-column fixed type="expand" width="80">
        <template slot-scope="scope">
          <!-- 先循环第一级5行row 行 -->
          <el-row v-for="(v1,i) in scope.row.children" :key="i">
            <!-- 第一级 第一列 -->
            <el-col :span="4">
              <el-tag
                class="tag"
                @close="deleRoles(scope.row,v1)"
                closable
                type="success"
              >{{v1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 第一级第二列col  是列 -->
            <el-col :span="20">
              <!-- 第二列 先循环没一行-->
              <el-row v-for="(v2,i) in v1.children" :key="i">
                <!-- 每一行左边一列 -->
                <el-col :span="4">
                  <el-tag
                    class="tag"
                    @close="deleRoles(scope.row,v2)"
                    closable
                    type="primary"
                  >{{v2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 右边的一列 -->
                <el-col :span="20">
                  <el-tag
                    class="tag"
                    @close="deleRoles(scope.row,v3)"
                    closable
                    type="warning"
                    v-for="(v3,i) in v2.children"
                    :key="i"
                  >{{v3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">此用户没有权限</el-row>
        </template>
      </el-table-column>
      <el-table-column fixed prop="id" label="#" width="120"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="220"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="220"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="showRoles(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 权限设定隐藏域 -->
    <el-dialog title="提示" :visible.sync="dialogVisibleRoles" width="50%">
      <el-tree
        default-expand-all
        ref="getId"
        :data="tree"
        show-checkbox
        node-key="id"
        :default-checked-keys="defCheck"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRoles = false">取 消</el-button>
        <el-button type="primary" @click="setRoles()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  created() {
    this.getRoles();
  },
  data() {
    return {
      roles: [],
      dialogVisibleRoles: false,
      defaultProps: {
        children: "children",
        label: "authName"
      },
      tree: [],
      roleId: -1,
      defCheck: []
    };
  },
  methods: {
    //   点击按钮给角色授权
    async setRoles() {
      // 1 获取角色id
      // this.roleId
      // console.log(this.roleId)
      // 2 获取权限id
      // 2.1 被全选中的id
      const ary1 = this.$refs.getId.getCheckedKeys();
      //   console.log(ary1)
      // 2.2 被半选中的id
      const ary2 = this.$refs.getId.getHalfCheckedKeys();
      //   console.log(ary2)
      const arr = [...ary1, ...ary2];
      // console.log(arr)
      // 3 发送请求
      const res = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: arr.join(",")
      });
      // console.log(res)
      // 4 关闭弹出层
      this.dialogVisibleRoles = false;
      // 5 刷新数据
      this.getRoles();
    },
    //   展示设置权限列表
    async showRoles(user) {
      // console.log(user)
      this.roleId = user.id;

      const res = await this.$http.get(`rights/tree`);
      this.tree = res.data.data;
      // 获取该用户应有的权限 先找到id
      let ary = [];
      user.children.forEach(item1 => {
        // console.log(item1.id)
        // ary.push(item1.id);
        item1.children.forEach(item2 => {
          // console.log(item2.id)
          // ary.push(item2.id);
          item2.children.forEach(item3 => {
            // console.log(item3.id)
            ary.push(item3.id)
            // this.defCheck = ary
          });
        });
      });
      // console.log(ary)
      // 应有的权限被选中
      this.defCheck = ary;
      this.dialogVisibleRoles = true;
    },
    //   删除角色指定权限
    async deleRoles(role, right) {
      // 获取用户id roles.id
      // console.log(role);
      // console.log(rights)
      // 获取权限id
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${right.id}`
      );
      // console.log(res)
      role.children = res.data.data;
    },
    // 获取一级角色列表
    async getRoles() {
      const res = await this.$http.get(`roles`);
      //   console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.roles = data;
        this.$message.success(msg);
      }
    }
  }
};
</script>

<style>
.btn {
  margin: 20px 0;
}
.card {
  height: 100%;
}
.tag {
  margin: 6px 2px;
}
</style>
