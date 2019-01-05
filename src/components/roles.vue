<template>
  <el-card>
    <!-- 引入面包屑 -->
    <my-bread text1="角色列表"></my-bread>
    <el-button class="btn" plain type="success">添加角色</el-button>
    <!-- 引入表格 -->
    <el-table :data="roles" style="width: 100%" height="400">
      <el-table-column fixed type="expand" width="80">
        <template slot-scope="scope">
          <!-- 先循环第一级5行row 行 -->
          <el-row v-for="(v1,i) in scope.row.children" :key="i">
            <!-- 第一级 第一列 -->
            <el-col :span="4">
              <el-tag type="success">{{v1.authName}}</el-tag>
            </el-col>
            <!-- 第一级第二列col  是列 -->
            <el-col :span="20">
              <!-- 第二列 先循环没一行-->
              <el-row v-for="(v2,i) in v1.children" :key="i">
                  <!-- 每一行左边一列 -->
                <el-col :span="4">
                  <el-tag type="primary">{{v1.authName}}</el-tag>
                </el-col>
                <!-- 右边的一列 -->
                <el-col :span="20">
                  <el-tag type="warning" v-for="(v3,i) in v2.children" :key="i">{{v3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column fixed prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  created() {
    this.getRoles();
  },
  data() {
    return {
      roles: []
    };
  },
  methods: {
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
</style>
//   <!-- 循环第一级 5行 -->
//           <el-row v-for="(v1,i) in scope.row.children" :key="i">
//             <el-col :span="4">
//               <el-tag type="success">{{v1.authName}}</el-tag>
//             </el-col>
//             <!-- 第一行 第二列 -->
//             <el-col :span="20">
//               <el-row v-for="(v2,i) in v1.children" :key="i">
//                 <el-col :span="4">
//                   <el-tag type="primary">{{v2.authName}}</el-tag>
//                 </el-col>
//                 <el-col :span="20">
//                   <el-tag type="warning" v-for="(v3,i) in v2.children" :key="i">{{v3.authName}}</el-tag>
//                 </el-col>
//               </el-row>
//             </el-col>
//           </el-row>