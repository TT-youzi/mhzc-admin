import request from '@/utils/request'
import qs from 'qs'

export function sourceList(params) {
  return request({
    url: '/material/list',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function createSource(params) {
  return request({
    url: '/material/create',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function logicalDelete(params) {
  return request({
    url: '/material/logicalDelete',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function sourceDelete(params) {
  return request({
    url: '/material/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function sourceUpdate(params) {
  return request({
    url: '/material/update',
    method: 'post',
    data: qs.stringify(params)
  })
}


