<template>
    <div class="table">
        <router-link :to="'/detail'">
            <el-button type="primary" class="add">添加菜单</el-button>
        </router-link>
        <div  v-if="menuList.length">
            <el-table
            :data="menuList"
            border align="center">
                <el-table-column
                  prop="codeId"
                  label="权限id"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="parentId"
                  label="父级id"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="icon"
                  label="图标"
                  width="120">
                </el-table-column>
                <el-table-column
                  label="是否总显示"
                  width="120">
                    <template scope="scope">
                        {{scope.row.is_always_show}}
                    </template>
                </el-table-column>
                <el-table-column
                  label="是否入驻"
                  width="80">
                    <template scope="scope">
                        {{scope.row.is_join}}
                    </template>
                </el-table-column>
                <el-table-column
                  prop="menuName"
                  label="菜单名称"
                  width="300">
                </el-table-column>
                <el-table-column
                  prop="url"
                  label="链接"
                  width="200">
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="150">
                  <template scope="scope">
                    <el-button @click="delMenu(scope.row._id, scope.$index)" type="text" size="middle">删除</el-button>
                    <router-link :to="'/detail/'+scope.row._id" class="nav-item-a">
                        <el-button type="text" size="middle">编辑</el-button>
                    </router-link>
                  </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
  </template>

  <style>
    .table {
        text-align: left;
    }
    .add {
        margin-left: 0;
        margin-top: 10px;
    }
  </style>

  <script>
  export default {
      data() {
          return {
              menuList: []
          };
      },
    // computed: {
    //     ...mapGetters({
    //         munuList: 'menu'
    //     })
    // },
      mounted() {
          this.getData();
      },
      methods: {
          async delMenu(id, index) {
              const result = await this.$store.dispatch('delMenu', id);
              if (result.statusCode) {
                  this.$store.dispatch('gloable/showMsg', {
                      msg: result.errorMsg
                  });
              } else {
                  this.$store.dispatch('gloable/showMsg', {
                      msg: '删除成功',
                      type: 'success'
                  });
                  // this.$router.replace('/menuList');
                  this.menuList.splice(index, 1);
              }
          },
          async getData() {
              const rs = await this.$store.dispatch('menuList');
              this.menuList.push(...rs);
          }
      }
};
  </script>
