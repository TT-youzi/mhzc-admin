<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in adminRoutes" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { asyncAdminRoutes } from '@/router'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'admin_permission_routes',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    },
  },
  data() {
    return {
      adminRoutes:[]
    }
  },
  mounted() {
    this.adminRoutes = asyncAdminRoutes
    console.log(this.adminRoutes)
  },
  created() {
    console.log(this.admin_permission_routes)
    console.log(asyncAdminRoutes)
    // console.log(constantRoutes)
    // this.adminRoutes = constantRoutes.concat(asyncAdminRoutes)
    
  },
}
</script>
