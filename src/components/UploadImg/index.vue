<template>
  <div>
    <el-upload
      :class="{hide:hideUpload}"
      :file-list="handHeld"
      action="#"
      :auto-upload="false"
      :on-change="handleChange"
      :limit="limitCount"
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
            v-if="!disabled"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download" />
          </span>
          <span
            v-if="!disabled"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="uploadImgVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'UploadImg',
  data() {
    return {
      handHeld: [],
      limitCount: 1,
      uploadImgVisible: false,
      // 为隐藏上传图片按钮设置的类的激活状态
      hideUpload: false
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.uploadImgVisible = true
      this.dialogImageUrl = file.url
    },
    handleChange(file, fileList) {
      this.handHeld = fileList
      this.hideUpload = fileList.length >= this.limitCount
    },
    // 删除上传的图片
    handleRemove(file, fileList) {
      this.handHeld = fileList
      this.hideUpload = false
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
