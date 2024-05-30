// vueI18n.js 文件
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import gloabalConfig from '../config/gloabal.config'
import {getLangs} from '../api/base'

Vue.use(VueI18n)

// 导出VueI18n对象
export const i18n = new VueI18n({
  locale: gloabalConfig.DEFAULT_LANG, //设置默认语言为英语
  fallbackLocale: gloabalConfig.DEFAULT_LANG, //如果设置了一个不存在的语言，则回退为‘en_us’
  messages:{}
})

//获取所有多语言文件
function getAllLangJson() {
  axios.get('http://api.wdamm.cn/base/lang_json',{})
  .then(res => {
      let langs = res.data
      console.log('语言包-------',res);
      langs.forEach((itm, idx) => {
      i18n.setLocaleMessage(itm.name, ret[idx].data)
    })
  });
  // getLangs({}).then(res => {
  //   console.log(res);
  //   const langs = res.data.list
  //   const promiseList = []
  //   for (let i = 0; i < langs.length; i++) {
  //     const getJson = axios.get(langs[i].langjosn)  // 获取json文件promise请求
  //     promiseList.push(getJson)
  //   }
  //   // 一次性请求json文件
  //   axios.all(promiseList).then(axios.spread((...ret) => {
  //     console.log(ret);
  //     langs.forEach((itm, idx) => {
  //       i18n.setLocaleMessage(itm.name, ret[idx].data)
  //     })
  //   }))
  // })
}

getAllLangJson()
