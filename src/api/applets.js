import request from '@/utils/request'
import qs from 'qs'
//小程序添加关联
export function createApplets(data) {
  return request({
    url: '/applet/create',
    method: 'post',
    data: qs.stringify(data)
  })
}

//小程序添加关联
export function readApplets(data) {
  return request({
    url: '/applet/read',
    method: 'post',
    data: qs.stringify(data)
  })
}

//小程序添加关联
export function updateApplets(data) {
  return request({
    url: '/applet/update',
    method: 'post',
    data: qs.stringify(data)
  })
}
