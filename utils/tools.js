import md5 from './md5'
import { encrypt } from './crypto_hx'

// 参数签名
export function getSignParams(data) {
  console.log(data);
  let arrParams = []
  let params = JSON.parse(JSON.stringify(data))
  let tmp = Date.parse(new Date()).toString();
  tmp = tmp.substring(0, 10);
  params.timestamp = tmp   // 自动加上当前时间戳

  for (let key in params) {
    let s = `${key}=${params[key]}`
    arrParams.push(s)
  }
  arrParams.sort()
  const str = arrParams.join('&')
  str.substring(0, str.length)

  params.sign = md5(str)
  let newData = encrypt(JSON.stringify(params))

  return { _data: newData }
}

// 主题色配置
export function setTheme(theme) {
  
}