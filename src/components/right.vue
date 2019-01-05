<template>
  <el-card>
    <!-- 引入面包屑组件 -->
    <my-bread text1="权限管理" text2="权限列表"></my-bread>

    <el-table class="table" :data="rights" border style="width: 100%">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.level==='0'">一级</span>
          <span v-if="scope.row.level==='1'">二级</span>
          <span v-if="scope.row.level==='2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  created() {
    this.getRights();
  },
  data() {
    return {
      rights: []
    };
  },
  methods: {
    async getRights() {
      const res = await this.$http.get(`rights/list`);
      // console.log(res);
      const {
        data,
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.rights = data;
        this.$message.success(msg);
      }
    }
  }
};
</script>

<style>
.table {
  margin-top: 20px;
  height: 100%;
}
</style>
