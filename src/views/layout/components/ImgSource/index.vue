<template>
  <div>
    <el-dialog
      title="选择图片"
      :visible.sync="isvisable"
      width="80%"
      center
      :show-close="false"
    >
      <el-row class="tac" style="border: solid 1px #e6e6e6">
        <el-col
          :span="12"
          style="padding: 10px; border-right: solid 1px #e6e6e6"
        >
          <div style="display: flex; width: 350px">
            <el-input
              style="margin-right: 10px"
              v-model="addVal"
              placeholder="输入要添加的分组"
            ></el-input>
            <el-button type="primary" @click="handleCreate">添加分组</el-button>
          </div>
          <el-input
            style="margin-top: 10px"
            v-model="searchVal"
            placeholder="请输入分类名称搜索"
          ></el-input>
          <el-menu
            style="border-right: none"
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-menu-item
              :index="(index + 1).toString()"
              v-for="(item, index) in groupList"
              :key="item.id"
            >
              <div class="menuItem">
                <div>
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{ item.name }}</span>
                </div>
                <div>
                  <el-button size="small" type="primary" @click="handleShowEdit(item.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(item.id)"
                    >删除</el-button
                  >
                </div>
              </div>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="12" style="padding: 10px">
          <div style="background: red">123</div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="close">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <el-input
        style="margin-right: 10px"
        v-model="newName"
        placeholder="输入要更改的分组名"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  sourceList,
  createSource,
  logicalDelete,
  sourceDelete,
  sourceUpdate
} from "@/api/source";
import { fetchList, userDetail, updateUser } from "@/api/user";
export default {
  props: {
    isvisable: {
      type: Boolean,
      default: false,
    },
    close: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      appId: "",
      searchVal: "",
      addVal: "",
      groupList: [],
      visible2: false,
      centerDialogVisible: false,
      newName:'',
      currId:''
    };
  },
  created() {
    this.appId = JSON.parse(sessionStorage.getItem("currMallInfo")).appId;
    this.getSourceList();
  },
  methods: {
    handleShowEdit(id) {
      this.currId = id
      this.centerDialogVisible = true;
    },
    handleEdit() {
      sourceUpdate({ appId: this.appId,name:this.newName,id:this.currId}).then((res) => {
        if (res.data) {
          this.$message({
            message: "更新成功！",
            type: "success",
          });
          this.getSourceList();
          this.centerDialogVisible = false;
        } else {
          this.$message.error("更新失败");
        }
      })
    },
    handleDelete(id) {
      this.visible2 = false;
      sourceDelete({ id: id }).then((res) => {
        if (res.data) {
          this.$message({
            message: "删除成功！",
            type: "success",
          });
          this.getSourceList();
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    getSourceList() {
      sourceList({
        appId: this.appId,
        order: "desc",
        sort: "create_on",
        page: 1,
        limit: 99,
      })
        .then((res) => {
          console.log(res);
          this.groupList = res.data.data.list;
        })
        .catch(() => {});
    },
    handleCreate() {
      if (this.addVal == "") {
        this.$message.error("分组名不能为空");
        return false;
      } else {
        createSource({
          appId: this.appId,
          type: "0",
          name: this.addVal,
        })
          .then((res) => {
            if (res.data) {
              this.$message({
                message: "添加成功！",
                type: "success",
              });
              this.getSourceList();
            } else {
              this.$message.error("添加失败");
            }
          })
          .catch(() => {});
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style>
.menuItem {
  display: flex;
  justify-content: space-between;
}
</style>