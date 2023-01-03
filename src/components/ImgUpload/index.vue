<!--
 * @method imgUploadFinish(data)    // 方法：上传成功。Important，在组件之外获取上传成功的图片url
 *   @param                         // 服务端返回的数据以及图片url
 * @method removeImg(data)          // 方法：删除图片。
 *   @param                         // 删除的图片文件
 * @description    // 附加说明。
 *   1) 本组件使用七牛云直传。
 *   2) 所有传入参数说明：
 *      · fileList: 数组类型，已经存在的图片列表，默认为 空数组，
            [
              {
                name: '文件名',   （no require）
                url: '文件路径'   （require）
              }
            ]
          oss上传：fileList 也可以用以下方式传递（数组里面直接存放url链接）
          ['http://a.png']
        · disabled: Boolean类型，是否禁用
 *      · limitNum: Number类型，上传的图片数量，默认为1
 *      · acceptType: String, 支持上传的文件类型，MIME_type（非图片类型必填），MIME_type参照：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types

 *  @example // 调用示例
 *
 *    // 引入
    import ImgUpload from '@components/ImgUpload/index.vue'
 *   //  使用
    <ImgUpload
      accept="image/png,image/jpg"
      :disabled="false"
      :fileList="picFileList"
      @imgUploadFinish="imgUploadFinish"
      @removeImg="removeImg"
    />
-->

<template>
  <a-space direction="vertical" :style="{ width: '100%' }">
    <a-upload
      list-type="picture-card"
      image-preview
      :file-list="fileList"
      :limit="limitNum"
      :accept="acceptType"
      :disabled="disabled"
      :custom-request="qiniuRequest"
      :on-before-remove="handleRemove"
    />
  </a-space>
</template>

<script setup>
import axios from "axios"
import { uploadToken } from '@api/common/index'

const domain = 'https://upload-z1.qiniup.com'
const qiniuAddr = 'static.foodshop.fun'
defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  acceptType: { // 支持接收的类型
    type: String,
    default: 'image/jpeg,image/png,image/jpg'
  },
  limitNum: {  // 最大支持上传图片总数量
    type: Number,
    default: 1
  },
  fileList: { //  默认文件列表
    type: Array,
    default: () => { return [] }
  },
})
const emits = defineEmits(['imgUploadFinish', 'removeImg'])

const qiniuRequest = async (option) => {
  const { onProgress, onError, onSuccess, fileItem, name } = option
  const extName = fileItem.name.split('.').at(-1)
  const keyname = randomString(15) + '.' + extName
  // 从后端获取上传凭证token
  const { data: token } = await uploadToken()
  const formData = new FormData()
  formData.append(name || 'file', fileItem.file)
  formData.append('token', token)
  formData.append('key', keyname)
  // 获取到凭证以后再将文件上传到七牛云空间
  const res = await axios.post(domain, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: event => {
      // 上传进度
      let percent
      if (event.total > 0) {
        percent = event.loaded / event.total
      }
      onProgress(percent, event)
    }
  })
  if (res && res.status === 200){
    const url = 'http://' + qiniuAddr + '/' + res.data.key
    emits('imgUploadFinish', { ...res.data, url })
    onSuccess(res.data)
  } else {
    onError(res.msg)
  }
}
const handleRemove = (file) => {
  emits('removeImg', file)
  return true
}
const randomString = (len = 32) => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}
</script>

<style lang="less" scoped>

</style>
