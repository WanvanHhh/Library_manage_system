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
       <a-form-item label="图书编号">
          <a-input style="width: 460px" placeholder="请输入..." v-model="form.sn"/>
        </a-form-item>
        <a-form-item label="书名" has-feedback>
          <a-input style="width: 460px" placeholder="请输入..." v-model="form.name"/>
        </a-form-item>
        <a-form-item label="作者" has-feedback>
          <a-input style="width: 460px" placeholder="请输入..." v-model="form.author"/>
        </a-form-item>
        <a-form-item label="价格" has-feedback>
          <a-input type="number" style="width: 460px" placeholder="请输入..." v-model="form.price"/>
        </a-form-item>
        <a-form-item label="分类" has-feedback>
          <a-select :default-value="form.dirid" style="width: 120px" @change="handleChange">
            <a-select-option value="">
              全部
            </a-select-option>
            <a-select-option v-for="item in typeValue" :key="item.id" :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
     </a-form>
    </template>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    name: '图书编号',
    id: 'sn'
  },
  {
    name: '书名',
    id: 'name'
  },
  {
    name: '作者',
    id: 'author'
  },
  {
    name: '价格',
    id: 'price'
  },
  {
    name: '分类',
    id: 'dirid'
  }
]
export default {
  name: 'Baddupdate',
  props: ['Visible', 'value'],
  data () {
    return {
      ModalText: '',
      confirmLoading: false,
      visible: false,
      addData: false,
      typeValue: [],
      form: {},
      values: {
        author: '',
        dirid: '',
        id: '',
        name: '',
        price: '',
        sn: ''
      },
      columns
    }
  },
  methods: {
    checkForm () { // 检查输入的数据是否为空
      for (var item in this.form) {
        if (this.form[item] === null || this.form[item] === '') {
          if (item === 'id') {
            continue
          }
          this.$message.warning('请填写完整信息！')
          return false
        }
      }
      return true
    },
    async handleOk () {
      if (this.addData === true) {
        this.confirmLoading = true
        if (this.checkForm()) {
          console.log('新增数据：', this.form)
          this.confirmLoading = true
          const res = await this.$http.post('http://localhost:8888/bms/Book?action=addBook', this.$qs.stringify(this.form))
          this.$message.loading('正在插入...', 1.5)
          this.closeModel(res.data.code, '添加')
        }
      } else {
        this.confirmLoading = true
        const res = await this.$http.post('http://localhost:8888/bms/Book?action=updateBookData', this.$qs.stringify(this.form))
        this.closeModel(res.data.code, '修改')
      }
      setTimeout(() => {
        this.form = this.values// 添加完成后将弹窗中的数据清空，避免再次使用弹窗的时候出现bug
        this.$emit('refresh')// 通知父组件重新刷新数据
        this.addData = false
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    closeModel (code, msg) {
      setTimeout(() => {
        this.form = this.values// 添加完成后将弹窗中的数据清空，避免再次使用弹窗的时候出现bug
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
      console.log('value', value)
      this.form.dirid = value
    },
    handleCancel (e) {
      this.form = this.values// 点击取消或着关闭弹窗的同时清空数据，避免再次使用弹窗的时候出现bug
      this.addData = false
      this.visible = false
    },
    evaluationValue (typeValue, record, show) {
      // 把父组件传的值赋值给子组件中的变量
      this.visible = show
      this.typeValue = typeValue
      if (record != null) { // 若record不等于null那么把数据赋值给this.form进行数据回显
        this.form = record
        this.ModalText = '修改书籍信息'
      } else {
        this.addData = true
        this.ModalText = '新增书籍信息'
      }
      console.log('子组件中的this.form', this.form)
    }
  }
}
</script>
