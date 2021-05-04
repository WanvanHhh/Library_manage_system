<template>
  <div>
    <template>
      <div class="page">
        <a-breadcrumb>
          <a-breadcrumb-item><a-icon type="database" /> 图书管理系统</a-breadcrumb-item>
          <a-breadcrumb-item><a href=""><a-icon type="book" /> 分类管理</a></a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </template>
    <a-divider></a-divider>
    <template>
      <div class="query_layout">
        <a-button icon="plus" type="primary" @click="() => addDirectory()">添加</a-button>
      </div>
    </template>
    <template>
      <br>
      <a-table :pagination="false" :columns="columns" :data-source="data" :rowKey="record => record.id" bordered>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <a-button size="small" icon="edit" type="primary" @click="() => updateDirectory(record)">修改</a-button>&nbsp;
            <a-button size="small" icon="delete" type="danger" @click="() => deleteDirectory(record)">删除</a-button>
          </div>
        </template>
      </a-table>
    </template>
    <Daddupdate ref="daddUpdate" @refresh="getData"></Daddupdate>
    <template>
        <br>
        <div id="components-pagination-demo-mini" :model="page">
          <a-pagination :total="countNum"
          @change="onChange"
          @showSizeChange="showSizeChange"
          show-size-changer
          show-quick-jumper />
        </div>
      </template>
  </div>
</template>
<script>
import Daddupdate from '@/components/DaddUpdate.vue'
const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    width: '15%',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '分类名称',
    dataIndex: 'name',
    width: '25%',
    scopedSlots: { customRender: 'sn' }
  },
  {
    title: '分类描述',
    dataIndex: 'describes',
    width: '35%',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  components: {
    Daddupdate
  },
  data () {
    return {
      data: [],
      columns,
      countNum: 0,
      page: {
        current: 1,
        pageSize: 10,
        withCredentials: true
      },
      editingKey: ''
    }
  },
  methods: {
    addDirectory () {
      console.log('这里是daddUpdate点击了增加按钮')
      this.$refs.daddUpdate.evaluationValue(null, true)
    },
    updateDirectory (record) {
      console.log('record', record)
      this.$refs.daddUpdate.evaluationValue(record, true)
    },
    onChange (page, pageSize) {
      this.page.current = page
      this.page.pageSize = pageSize
      setTimeout(() => {
        this.getData() // 重新刷新数据
      }, 200)
    },
    showSizeChange (current, size) {
      this.onChange(current, size)
    },
    async deleteDirectory (record) {
      console.log('record', record.id)
      this.$message.loading('正在删除数据', 1)
      const res = await this.$http.post('http://localhost:8888/bms/Directory?action=deleteDirectory', this.$qs.stringify({ id: record.id }))
      if (res.data.code === 200) {
        setTimeout(() => {
          this.getData() // 重新刷新数据
          this.$message.success('删除成功', 1.5)
        }, 1500)
      }
    },
    async getData () {
      const res = await this.$http.post('http://localhost:8888/bms/Directory?action=selectDirectoryList', this.$qs.stringify(this.page))
      if (res.data.data != null) {
        this.data = res.data.data.data
        this.countNum = res.data.data.count
        console.log('this.data:', res.data.data)
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.page{
  height: 100%;
  width: 100%;
  text-align: left;
}
.query_layout{
  display: flex;
  flex-direction: row;
}
</style>
