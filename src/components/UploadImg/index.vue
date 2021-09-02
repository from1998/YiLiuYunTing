<template>
  <div>
    <el-tooltip class="item" effect="dark" content="文件大小不得超过2MB。" placement="bottom">
      <el-upload
        :class="{hide:hideUpload}"
        :file-list="handHeld"
        :action="uploadPath"
        :data="{sonmerno:sonmerno}"
        accept="image/*"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-progress="handleProgress"
        :limit="limitCount"
        :headers="headers"
        list-type="picture-card"
      >
        <i slot="default" class="el-icon-plus" />
        <div slot="file" slot-scope="{file}">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
          >
          <span class="el-upload-list__item-actions">
            <span
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in" />
            </span>
            <span
              @click="handleDownload(file)"
            >
              <i class="el-icon-download" />
            </span>
            <span
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete" />
            </span>
          </span>
        </div>
      </el-upload>
    </el-tooltip>
    <el-dialog :visible.sync="uploadImgVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'UploadImg',
  data() {
    return {
      sonmerno: '',
      dialogImageUrl: '',
      // 文件列表
      handHeld: [],
      limitCount: 1,
      uploadImgVisible: false,
      // 为隐藏上传图片按钮设置的类的激活状态
      hideUpload: false,
      // 声明上传路径
      uploadPath: undefined,
      // 头
      headers: undefined,
      // 文件列表的json对象
      fileListJsonObj: []
    }
  },
  created() {
    // 文件上传的路径
    this.uploadPath = process.env.VUE_APP_BASE_API + '/ylyt/personal/uploadFile'
    // 设置请求头加入token 避免请求认证的问题
    this.headers = { 'token': getToken() }
    this.sonmerno = window.sessionStorage.getItem('sonmerno')
  },
  methods: {
    // 放大预览图片
    handlePictureCardPreview(file) {
      this.uploadImgVisible = true
      this.dialogImageUrl = file.url
    },
    // 上传图片成功
    handleSuccess(res, file, fileList) {
      if (res.code === 200) {
        this.handHeld = fileList
        this.hideUpload = fileList.length >= this.limitCount
        this.msgSuccess(res.msg)
        this.$emit('imgagePush', res.data)
      } else {
        this.handHeld = fileList
        this.hideUpload = false
        this.msgError('上传失败')
      }
    },
    // 上传图片失败
    handleError(res, file, fileList) {
      this.handHeld = fileList
      this.hideUpload = false
      this.msgError('上传失败')
    },
    // 上传图片时
    handleProgress() {
      this.hideUpload = true
    },
    // 删除上传的图片
    handleRemove(file, fileList) {
      this.handHeld = fileList
      this.hideUpload = false
    },
    // 图片下载
    handleDownload(file) {
      var a = document.createElement('a')
      var event = new MouseEvent('click')
      a.download = file.name
      a.href = file.url
      a.dispatchEvent(event)
    }
  }
}
</script>
<style lang="scss">
.hide .el-upload--picture-card {
    display: none;
}
.el-upload--picture-card,.el-upload-list__item is-ready {
    width: 90px!important;
    height: 90px!important;
    cursor: pointer;
    line-height: 92px!important;
}
</style>
