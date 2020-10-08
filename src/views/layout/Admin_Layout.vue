<template>
  <div class="app-wrapper">
    <!-- <sidebar class="sidebar-container" /> -->
    <div class="admin-left" />
    <div class="main-container">
      <navbar />
      <tags-view />
      <!-- <app-main/> -->
      <div class="container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 查询和其他操作 -->
          <div class="filter-container">
            <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入商户名" />
            <el-input v-model="listQuery.username" clearable class="filter-item" style="width: 200px;" placeholder="请输入商城名" />
            <el-input v-model="listQuery.userId" clearable class="filter-item" style="width: 200px;" placeholder="请输入appId" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
            <el-button v-permission="['POST /admin/keyword/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
            <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
          </div>
          <el-tab-pane label="小程序商城管理" name="first">
            <!-- 查询结果 -->
            <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>
              <el-table-column align="center" width="100px" label="序号" prop="id" sortable />
              <el-table-column align="center" label="小程序ID" prop="username" />
              <el-table-column align="center" label="商城名称" width="140">
                <template slot-scope="scope">
                  <router-link to="/dashboard">
                    <el-dropdown-item>
                      {{ scope.row.username }}
                    </el-dropdown-item>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column align="center" label="商户名称" prop="username" />
              <el-table-column align="center" label="未查看订单数" prop="gender" />
              <el-table-column align="center" label="商户联系方式" prop="mobile" />
              <el-table-column align="center" label="状态" prop="status">
                <template slot-scope="scope">
                  <el-tag>{{ statusDic[scope.row.status] }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button v-permission="['POST /admin/keyword/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                  <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
            <!-- 添加或修改对话框 -->
            <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
              <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
                <el-form-item label="关键词" prop="keyword">
                  <el-input v-model="dataForm.keyword" />
                </el-form-item>
                <el-form-item label="跳转链接" prop="url">
                  <el-input v-model="dataForm.url" />
                </el-form-item>
                <el-form-item label="是否推荐" prop="isHot">
                  <el-select v-model="dataForm.isHot" placeholder="请选择">
                    <el-option :value="true" label="推荐" />
                    <el-option :value="false" label="普通" />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否默认" prop="isDefault">
                  <el-select v-model="dataForm.isDefault" placeholder="请选择">
                    <el-option :value="true" label="默认" />
                    <el-option :value="false" label="非默认" />
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
                <el-button v-else type="primary" @click="updateData">确定</el-button>
              </div>
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="回收站" name="second">回收站</el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { fetchList, userDetail, updateUser } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'Layout',
  components: {
    Navbar,
    AppMain,
    TagsView,
    Pagination
  },
  mixins: [ResizeMixin],
  data() {
    return {
      rules: {
        keyword: [{ required: true, message: '关键词不能为空', trigger: 'blur' }]
      },
      dataForm: {
        id: undefined,
        keyword: undefined,
        url: undefined,
        isHot: undefined,
        isDefault: undefined
      },
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        username: undefined,
        mobile: undefined,
        userId: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      downloadLoading: false,
      activeName: 'first',
      listLoading: true,
      levelDic: ['普通用户', 'VIP用户', '高级VIP用户'],
      statusDic: ['已关联appId', '禁用', '注销']
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.listQuery.userId) {
        userDetail(this.listQuery.userId).then(response => {
          this.list = []
          if (response.data.data) {
            this.list.push(response.data.data)
            this.total = 1
            this.listLoading = false
          } else {
            this.list = []
            this.total = 0
            this.listLoading = false
          }
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      } else {
        fetchList(this.listQuery).then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        keyword: undefined,
        url: undefined,
        isHot: undefined,
        isDefault: undefined
      }
    },
    // 新增
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createKeyword(this.dataForm).then(response => {
            this.list.unshift(response.data.data)
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '创建成功'
            })
          }).catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
        }
      })
    },
    // 打开新增弹窗
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 打开编辑弹窗
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateKeyword(this.dataForm).then(() => {
            for (const v of this.list) {
              if (v.id === this.dataForm.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.dataForm)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify.success({
              title: '成功',
              message: '更新成功'
            })
          }).catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
        }
      })
    },
    // 导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户名', '手机号码', '性别', '生日', '状态']
        const filterVal = ['username', 'mobile', 'gender', 'birthday', 'status']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.admin-left {
  width: 210px;
  height: 100%;
  background-color: #304156;
  float: left;
}
.main-container{
  .container{
    padding: 10px;
  }
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
