import { asyncRoutes, asyncAdminRoutes, constantRoutes } from '@/router'

/**
 * 通过meta.perms判断是否与当前用户权限匹配
 * @param perms
 * @param route
 */
function hasPermission(perms, route) {
  if (route.meta && route.meta.perms) {
    return perms.some(perm => route.meta.perms.includes(perm))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncAdminRoutes
 * @param perms
 */
function filterAsyncRoutes(routes, perms) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children, perms)
      if (tmp.children && tmp.children.length > 0) {
        res.push(tmp)
      }
    } else {
      if (hasPermission(perms, tmp)) {
        res.push(tmp)
      }
    }
  })

  return res
}

const admin_permission = {
  state: {
    routes: constantRoutes,
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      console.log(routes)
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    GenerateAdminRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { perms } = data
        let accessedRoutes
        console.log(asyncAdminRoutes)
        if (perms.includes('*')) {
          accessedRoutes = asyncAdminRoutes
        } else {
          accessedRoutes = filterAsyncRoutes(asyncAdminRoutes, perms)
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve()
      })
    }
  }
}

export default admin_permission
