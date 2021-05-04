<template>
  <div>
    <template>
      <div class="page">
        <a-breadcrumb>
          <a-breadcrumb-item><a-icon type="database" /> 图书管理系统</a-breadcrumb-item>
          <a-breadcrumb-item><a href=""><a-icon type="book" /> 图书管理</a></a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </template>
    <a-divider></a-divider>
    <template>
      <div class="query_layout">
        <table>
          <th>
            <td>关键字:</td><td><a-input placeholder="请输入书籍/作者名字" v-model="query.keyword" /></td>
            <td>类别:</td>
            <td>
              <a-select  default-value=" " style="width: 120px" @change="handleChange">
                <a-select-option value=" ">
                  全部
                </a-select-option>
                <a-select-option v-for="item in typeValue" :key="item.id" :value="item.id">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </td>
            <td><a-button size="small" icon="search" type="primary" @click="() => search()">查询</a-button></td>
            <td><a-button size="small" icon="plus" type="primary" @click="() => addBook()">添加</a-button></td>
          </th>
        </table>
      </div>
    </template>
    <template>
      <br>
      <a-table :pagination="false" :columns="columns" :data-source="data" :rowKey="record => record.id" bordered>
        <template slot="classfiy" slot-scope="text, record">
          {{record.directory.name}}
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <a-button size="small" icon="edit" type="primary" @click="() => updateBook(record)">修改</a-button>&nbsp;
            <a-button size="small" icon="delete" type="danger" @click="() => deleteBook(record)">删除</a-button>&nbsp;
            <a-button size="small" icon="pic-right" type="primary" @click="() => comments(record)">评论</a-button>
          </div>
        </template>
      </a-table>
      <template>
        <br>
        <div id="components-pagination-demo-mini" :model="page">
          <a-pagination :total="countNum"
          :pageSizeOptions="pageSizeOptions"
          @change="onChange"
          @showSizeChange="showSizeChange"
          show-size-changer
          show-quick-jumper />
        </div>
      </template>
    </template>
    <Baddupdate ref="addUpdate" @refresh="getData"></Baddupdate>
  </div>
</template>
<script>
import Baddupdate from '@/components/BaddUpdate.vue'

const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    width: '5%',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '图书编号',
    dataIndex: 'sn',
    width: '15%',
    scopedSlots: { customRender: 'sn' }
  },
  {
    title: '书名',
    dataIndex: 'name',
    width: '20%',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '作者',
    dataIndex: 'author',
    width: '15%',
    scopedSlots: { customRender: 'author' }
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: '15%',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '分类',
    dataIndex: 'classfiy',
    width: '15%',
    scopedSlots: { customRender: 'classfiy' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  components: {
    Baddupdate
  },
  data () {
    return {
      data: [],
      value: {},
      pageSizeOptions: ['3', '5', '8', '10'],
      countNum: 0,
      typeValue: [],
      page: {
        current: 1,
        pageSize: 10
      },
      query: {
        dirid: '',
        keyword: ''
      },
      columns
    }
  },
  methods: {
    updateBook (record) {
      console.log('update_value', record)
      this.$refs.addUpdate.evaluationValue(this.typeValue, record, true)
      this.value = record
    },
    onChange (page, pageSize) {
      console.log('改变后的页码page', page)
      console.log('改变后的每页条数pageSize', pageSize)
      this.page.current = page
      this.page.pageSize = pageSize
      setTimeout(() => {
        this.getData() // 重新刷新数据
      }, 200)
    },
    showSizeChange (current, size) {
      console.log('当前页码current', current)
      console.log('一页显示数据条数size', size)
      this.onChange(current, size)
    },
    async search () {
      console.log('query', this.query)
      const res = await this.$http.post('http://localhost:8888/bms/Book?action=selectBookList', this.$qs.stringify(this.query))
      if (res.data.data != null) {
        this.countNum = res.data.data.count
        console.log('countNum', this.countNum)
        this.data = res.data.data.data
        console.log('this.data:', res.data.data.data)
      }
    },
    addBook () {
      console.log('添加新书信息')
      this.$refs.addUpdate.evaluationValue(this.typeValue, null, true)
    },
    print (record) {
      console.log('record', record)
    },
    comments (record) {
      console.log('点击评论后将要进行评论的bookId', record.id)
      this.$router.push({ path: '/Comments', query: { bookId: record.id } })
    },
    async deleteBook (value) {
      console.log('key', value.id)
      this.$message.loading('正在删除数据', 1)
      const res = await this.$http.post('http://localhost:8888/bms/Book?action=deleteBook', this.$qs.stringify({ id: value.id }))
      if (res.data.code === 200) {
        setTimeout(() => {
          this.getData() // 重新刷新数据
          this.$message.success('删除成功', 1.5)
        }, 1500)
      }
    },
    handleChange (value) {
      this.query.dirid = value
    },
    async getData () {
      console.log('重新更新')
      const res = await this.$http.post('http://localhost:8888/bms/Book?action=selectBookList', this.$qs.stringify(this.page))
      if (res.data.data != null) {
        this.countNum = res.data.data.count
        console.log('this.countNum', this.countNum)
        this.data = res.data.data.data
      }
      const resType = await this.$http.post('http://localhost:8888/bms/Directory?action=selectDirectoryList')
      if (resType.data.data != null) {
        this.typeValue = resType.data.data.data
        console.log('this.typeValue:', this.typeValue)
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
.components-input-demo-size .ant-input {
  width: 50px;
  margin: 0 8px 8px 0;
}
.query_layout{
  display: flex;
  flex-direction: row;
}
#components-pagination-demo-mini .ant-pagination:not(:last-child) {
  margin-bottom: 24px;
}
</style>
