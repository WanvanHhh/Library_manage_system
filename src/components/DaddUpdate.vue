<template>
  <div>
    <a-modal
      :title="ModalText"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
    <template>
     <a-form :model="form">
        <a-form-item label="分类名称" has-feedback>
          <a-input style="width: 460px" placeholder="请输入..." v-model="form.name"/>
        </a-form-item>
        <a-form-item label="分类描述" has-feedback>
          <a-input style="width: 460px" placeholder="请输入..." v-model="form.describes"/>
        </a-form-item>
     </a-form>
    </template>
    </a-modal>
  </div>
</template>
<script>
const label = [
  {
    id: 'name',
    name: '分类名称'
  },
  {
    id: 'describes',
    name: '分类描述'
  }
]
export default {
  name: 'Baddupdate',
  data () {
    return {
      ModalText: 'Content of the modal',
      confirmLoading: false,
      visible: false,
      addData: false,
      submit: false,
      form: {
        id: '',
        name: '',
        describes: ''
      },
      values: {
        id: '',
        name: '',
        describes: ''
      },
      label
    }
  },
  methods: {
    checkForm () { // 检查输入的数据是否为空
      for (var item in this.form) {
        if (this.form[item] === null || this.form[item] === '') {
          if (item === 'id') {
            continue
          }
          var name = ''
          if (item === 'name') {
            name = '分类名称'
          } else {
            name = '分类描述'
          }
          this.$message.warning(name + '：为空，请重检查')
          return false
        }
      }
      return true
    },
    async handleOk () {
      if (this.addData === true) {
        if (this.checkForm()) {
          console.log('新增数据：', this.form)
          this.confirmLoading = true
          const res = await this.$http.post('http://localhost:8888/bms/Directory?action=addDirectory', this.$qs.stringify(this.form))
          this.$message.loading('正在插入...', 1.5)
          this.closeModel(res.data.code, '添加')
        }
      } else {
        this.confirmLoading = true
        const res = await this.$http.post('http://localhost:8888/bms/Directory?action=updateDirectoryData', this.$qs.stringify(this.form))
        this.closeModel(res.data.code, '修改')
      }
    },
    closeModel (code, msg) {
      setTimeout(() => {
        this.form = this.values// 添加完成后将弹窗中的数据清空，避免再次使用弹窗的时候出现bug
        console.log('this.form', this.form)
        this.$emit('refresh')// 通知父组件重新刷新数据
        this.addData = false
        this.visible = false
        this.confirmLoading = false
        if (code === 200) {
          this.$message.success(msg + '成功')
        } else {
          this.$message.error('出现错误，' + msg + '失败！')
        }
      }, 2000)
    },
    handleChange (value) {
      this.form.dirid = value
    },
    handleCancel (e) {
      this.form = this.values// 点击取消或着关闭弹窗的同时清空数据，避免再次使用弹窗的时候出现bug
      this.addData = false
      this.visible = false
    },
    evaluationValue (record, show) {
      // 把父组件传的值赋值给子组件中的变量
      this.visible = show
      if (record !== null) { // 若record不等于null那么把数据赋值给this.form进行数据回显
        this.form = record
        this.ModalText = '修改分类信息'
      } else {
        this.addData = true
        this.ModalText = '新增分类信息'
      }
      console.log('子组件中的this.form', this.form)
    }
  }
}
</script>
