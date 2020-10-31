<template>
  <div class="app-wrapper">
    <!-- <sidebar class="sidebar-container" /> -->
    <div class="admin-left">
      <div class="left-img">
        <img src="../../assets/mhzc5.gif" />
      </div>
      <div class="left-title">
        <p>美环之窗</p>
      </div>
      <div class="left-name">
        <p>后台管理系统</p>
      </div>
    </div>
    <div class="main-container">
      <navbar />
      <!-- <tags-view /> -->
      <!-- <app-main/> -->
      <div class="container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 查询和其他操作 -->
          <div class="filter-container">
            <el-input
              v-model="listQuery.name"
              clearable
              class="filter-item"
              style="width: 200px"
              placeholder="请输入商户名"
            />
            <el-input
              v-model="listQuery.name"
              clearable
              class="filter-item"
              style="width: 200px"
              placeholder="请输入商城名"
            />
            <el-input
              v-model="listQuery.name"
              clearable
              class="filter-item"
              style="width: 200px"
              placeholder="请输入appId"
            />
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
              >查找</el-button
            >
            <el-button
              v-permission="['POST /admin/keyword/create']"
              class="filter-item"
              type="primary"
              icon="el-icon-edit"
              @click="handleCreate"
              >添加</el-button
            >
            <el-button
              :loading="downloadLoading"
              class="filter-item"
              type="primary"
              icon="el-icon-download"
              @click="handleDownload"
              >导出</el-button
            >
          </div>
          <el-tab-pane label="小程序商城管理" name="first">
            <!-- 查询结果 -->
            <el-table
              v-loading="listLoading"
              :data="list"
              element-loading-text="正在查询中。。。"
              border
              fit
              highlight-current-row
            >
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="50"
              />
              <el-table-column align="center" label="小程序ID" prop="appId" />
              <el-table-column align="center" label="商城名称" width="140">
                <template slot-scope="scope">
                  <router-link to="/dashboard">
                    <el-dropdown-item>
                      {{ scope.row.mallName }}
                    </el-dropdown-item>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="所属商户"
                prop="managerNames"
              />
              <el-table-column
                align="center"
                label="商户联系方式"
                prop="phone"
              />
              <el-table-column
                align="center"
                label="未查看订单数"
                prop="gender"
              />
              <el-table-column align="center" label="创建人" prop="createBy" />
              <el-table-column
                align="center"
                label="创建日期"
                prop="createOn"
                width="180"
              />
              <el-table-column align="center" label="状态" prop="status">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.deleted">禁用</el-tag>
                  <el-tag v-if="!scope.row.deleted">开启</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作"
                width="250"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['POST /admin/keyword/update']"
                    type="primary"
                    size="mini"
                    @click="handleUpdate(scope.row)"
                    >编辑</el-button
                  >
                  <!-- <el-button
                    type="primary"
                    size="mini"
                    @click="handleDetail(scope.row)"
                    >详情</el-button
                  > -->
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleDelete(scope.row)"
                    >禁用</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              @pagination="getList"
            />
            <!-- 添加或修改对话框 -->
            <el-dialog
              :title="textMap[dialogStatus]"
              :visible.sync="dialogFormVisible"
            >
              <el-form
                ref="dataForm"
                :rules="rules"
                :model="dataForm"
                status-icon
                label-position="left"
                label-width="100px"
                style="width: 400px; margin-left: 50px"
              >
                <el-form-item label="商城名称" prop="mallName">
                  <el-input v-model="dataForm.mallName" />
                </el-form-item>
                <el-form-item label="商户" prop="managerIds">
                  <el-select
                    v-model="dataForm.managerIds"
                    multiple
                    placeholder="请选择"
                    @change="handleSelect"
                  >
                    <el-option
                      v-for="item in managerList"
                      :key="item.itemValue"
                      :value="item.itemValue"
                      :label="item.itemText"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="商户联系方式" prop="phone">
                  <el-input v-model="dataForm.phone" />
                </el-form-item>
                <el-form-item label="是否开启" prop="deleted">
                  <el-select v-model="dataForm.deleted" placeholder="请选择">
                    <el-option :value="true" label="禁用" />
                    <el-option :value="false" label="开启" />
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button
                  v-if="dialogStatus == 'create'"
                  type="primary"
                  @click="createData"
                  >确定</el-button
                >
                <el-button v-else type="primary" @click="updateData"
                  >确定</el-button
                >
              </div>
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="回收站" name="second">
            <!-- 查询结果 -->
            <el-table
              v-loading="listLoading"
              :data="deleteList"
              element-loading-text="正在查询中。。。"
              border
              fit
              highlight-current-row
            >
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="50"
              />
              <el-table-column align="center" label="小程序ID" prop="appId" />
              <el-table-column align="center" label="商城名称" width="140">
                <template slot-scope="scope">
                  <router-link to="/dashboard">
                    <el-dropdown-item>
                      {{ scope.row.mallName }}
                    </el-dropdown-item>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="所属商户"
                prop="managerNames"
              />
              <el-table-column
                align="center"
                label="商户联系方式"
                prop="phone"
              />
              <el-table-column align="center" label="状态" prop="status">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.deleted">禁用</el-tag>
                  <el-tag v-if="!scope.row.deleted">开启</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作"
                width="250"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permission="['POST /admin/keyword/update']"
                    type="primary"
                    size="mini"
                    @click="handleReUse(scope.row)"
                    >恢复</el-button
                  >
                  <!-- <el-button
                    type="primary"
                    size="mini"
                    @click="handleDetail(scope.row)"
                    >详情</el-button
                  > -->
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleDelete(scope.row)"
                    >彻底删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              @pagination="getList"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, AppMain, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { fetchList, userDetail, updateUser } from "@/api/user";
import {
  mallList,
  mallCreate,
  mallDelete,
  mallUpdate,
  mallDetail,
} from "@/api/mall";
import { mallManager, getManagerById } from "@/api/mallManager";

import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  name: "Layout",
  components: {
    Navbar,
    AppMain,
    TagsView,
    Pagination,
  },
  mixins: [ResizeMixin],
  data() {
    return {
      rules: {
        keyword: [
          { required: true, message: "关键词不能为空", trigger: "blur" },
        ],
      },
      dataForm: {
        id: undefined,
        keyword: undefined,
        url: undefined,
        isHot: undefined,
        isDefault: undefined,
        managerIds: [],
      },
      list: [],
      deleteList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        sort: "create_on",
        order: "desc",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建",
      },
      downloadLoading: false,
      activeName: "first",
      listLoading: true,
      levelDic: ["普通用户", "VIP用户", "高级VIP用户"],
      statusDic: ["已关联appId", "禁用", "注销"],
      managerList: [],
    };
  },
  computed: {},
  created() {
    this.getList();
    let currUserInfo = JSON.parse(sessionStorage.getItem("currUserInfo"));
    if (currUserInfo.type == "0") {
      this.getManagerList();
    }
  },
  methods: {
    handleDelete(row) {
      mallDelete({ id: row.id })
        .then((response) => {
          if (response.data.errmsg == "成功") {
            this.listLoading = false;
            this.getList();
          }
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    getManagerList() {
      mallManager({
        limit: 100,
        page: 1,
        sort: "add_time",
        order: "desc",
      })
        .then((response) => {
          this.managerList = response.data.data.list;
        })
        .catch(() => {});
    },
    handleSelect(val) {
      this.dataForm.managerIds = val;
    },
    getList() {
      this.listLoading = true;
      mallList(this.listQuery)
        .then((response) => {
          if (response.data.data) {
            let temp = [];
            let tempDelete = [];
            response.data.data.list.forEach((item) => {
              if (item.deleted == false) {
                console.log(item);
                temp.push(item);
              }
              if (item.deleted == true) {
                console.log(item);
                tempDelete.push(item);
              }
            });
            temp.forEach((item) => {
              item.managerNames = item.managerNames.map((item1) => {
                return item1 + "  ";
              });
              // item.managerNames = item.managerNames.slice(0,(item.managerNames.length)-1 ,)
            });
            this.list = temp;
            this.deleteList = tempDelete;
            this.total = response.data.data.total;
            this.listLoading = false;
          } else {
            this.list = [];
            this.total = 0;
            this.listLoading = false;
          }
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        keyword: undefined,
        url: undefined,
        isHot: undefined,
        isDefault: undefined,
      };
    },
    // 新增
    createData() {
      this.dataForm.managerIds = this.dataForm.managerIds.map((item) => {
        return Number(item);
      });
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          mallCreate(this.dataForm)
            .then((response) => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify.success({
                title: "成功",
                message: "创建成功",
              });
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg,
              });
            });
        }
      });
    },
    // 打开新增弹窗
    handleCreate() {
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleReUse(row) {
      this.dataForm = Object.assign({}, row);
      mallUpdate({ id: row.id, deleted: false }).then(() => {
        this.dialogFormVisible = false;
        this.$notify.success({
          title: "成功",
          message: "更新成功",
        });
        this.getList();
      });
    },
    // 打开编辑弹窗
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row);
      getManagerById({ mallId: row.id })
        .then((res) => {
          if (res.data.data.list) {
            let ids = [];
            let list = res.data.data.list;
            list.forEach((element) => {
              ids.push(element.id.toString());
            });
            this.dataForm.managerIds = ids;
            console.log(this.managerList);
            this.dialogStatus = "update";
            this.dialogFormVisible = true;
            this.$nextTick(() => {
              this.$refs["dataForm"].clearValidate();
            });
          }
        })
        .catch((response) => {});
    },
    // 编辑
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        delete this.dataForm.managerNames;
        delete this.dataForm.updateOn;
        delete this.dataForm.createOn;
        delete this.dataForm.createBy;
        // delete this.dataForm.deleted
        if (valid) {
          mallUpdate(this.dataForm)
            .then(() => {
              console.log("xxx");

              this.dialogFormVisible = false;
              this.$notify.success({
                title: "成功",
                message: "更新成功",
              });
              this.getList();
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg,
              });
            });
        }
      });
    },
    // 导出
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["用户名", "手机号码", "性别", "生日", "状态"];
        const filterVal = [
          "username",
          "mobile",
          "gender",
          "birthday",
          "status",
        ];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "用户信息");
        this.downloadLoading = false;
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.admin-left {
  width: 210px;
  height: 100%;
  background-color: #304156;
  float: left;
  .left-img {
    height: 80px;
    width: 80px;
    border-radius: 40px;
    margin: 0 auto;
    margin-top: 40px;
    text-align: center;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .left-title {
    color: aliceblue;
    font-size: 22px;
    text-align: center;
  }
  .left-name {
    color: aliceblue;
    font-size: 18px;
    text-align: center;
  }
}
.main-container {
  .container {
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
