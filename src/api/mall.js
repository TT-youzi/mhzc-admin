import request from '@/utils/request'
import qs from 'qs'
//商城列表
export function mallList(params) {
  return request({
    url: '/mall/list',
    method: 'get',
    params
  })
}
//创建商城
export function mallCreate(params) {
  return request({
    url: '/mall/create',
    method: 'post',
    data: qs.stringify(params, {
      arrayFormat: 'brackets'
    })
  })
}

//删除商城
export function mallDelete(params) {
  return request({
    url: '/mall/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

//商城详情
export function mallDetail(params) {
  return request({
    url: '/mall/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

//编辑商城
export function mallUpdate(params) {
  return request({
    url: '/mall/update',
    method: 'post',
    data: qs.stringify(params, {
      arrayFormat: 'brackets'
    })
  })
}