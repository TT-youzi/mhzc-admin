import request from '@/utils/request'
//商户下拉列表
export function mallManager(query) {
  return request({
    url: '/mall-manager/select2',
    method: 'get',
    params: query
  })
}

//查询商城商户列表
export function getManagerById(query) {
  return request({
    url: '/mall-manager/listByMallId',
    method: 'get',
    params: query
  })
}
