<template>
  <div class="box">
    <template>
      <div class="page">
        <a-breadcrumb>
          <a-breadcrumb-item><a-icon type="database" /> 图书管理系统</a-breadcrumb-item>
          <a-breadcrumb-item><a href="#" onclick="change()"><a-icon type="book" /></a>图书管理</a-breadcrumb-item>
          <a-breadcrumb-item><a-icon type="book" /> 查看评论</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </template>
    <a-divider></a-divider>
    <div class="comments">
      <a-textarea
      v-model="commentsData.comments"
      placeholder="留下你的评论..."
      :auto-size="{ minRows: 3, maxRows: 5 }"
    /><br><br>
    <a-button type="primary" @click="() => addComments()">发表</a-button>
    </div>
    <template>
      <a-list item-layout="vertical" size="large" :data-source="listData">
        <a-list-item style="text-align:left" slot="renderItem" key="item.title" slot-scope="item">
          <template v-for="{ type, text } in actions" slot="actions">
            <span :key="type">
              <a-icon :type="type" style="margin-right: 8px" />
              {{ text }}
            </span>
          </template>
          <a-list-item-meta :description="item.description">
            <span slot="title" style="font-size: 20px">{{ item.username }}</span><p slot="title" style="font-size: 12px">{{ item.date }}</p>
          </a-list-item-meta>
          {{ item.comments }}
        </a-list-item>
      </a-list>
    </template>
    <template>
      <br>
      <div id="components-pagination-demo-mini" :model="page">
        <a-pagination :total="countNum"
        @change="onChange"
        :pageSizeOptions="pageSizeOptions"
        @showSizeChange="showSizeChange"
        show-size-changer
        show-quick-jumper />
      </div>
    </template>
  </div>
</template>
<script>

export default {
  data () {
    return {
      listData: [],
      countNum: 0,
      pageSizeOptions: ['3', '5', '8', '10'],
      commentsData: {
        bookId: '',
        comments: ''
      },
      page: {
        current: 1,
        pageSize: 10,
        bookId: 0
      },
      pagination: {
        onChange: page => {
          console.log(page)
        },
        pageSize: 3
      },
      actions: [
        { type: 'star-o', text: '156' },
        { type: 'like-o', text: '156' },
        { type: 'message', text: '2' }
      ]
    }
  },
  methods: {
    async getData () {
      const res = await this.$http.post('http://localhost:8888/bms/User?action=checkComments', this.$qs.stringify(this.page))
      this.listData = res.data.data.data
      this.countNum = res.data.data.count
      // 将获取的数据中的date从时间戳转换为 YYYY-MM-dd HH:mm:ss
      for (var item in this.listData) {
        var date = this.listData[item].date
        this.listData[item].date = this.formatDate(date)
      }
      console.log('所有数据时间转换格式之后：', this.listData)
    },
    formatDate (datetime) {
      var date = new Date(datetime) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var year = date.getFullYear()
      var month = ('0' + (date.getMonth() + 1)).slice(-2)
      var sdate = ('0' + date.getDate()).slice(-2)
      var hour = ('0' + date.getHours()).slice(-2)
      var minute = ('0' + date.getMinutes()).slice(-2)
      var second = ('0' + date.getSeconds()).slice(-2)
      // 拼接
      var result = year + '-' + month + '-' + sdate + ' ' + hour + ':' + minute + ':' + second
      // 返回
      return result
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
    change () {
      this.$router.push('/BookForm')
    },
    async addComments () {
      this.$message.loading('正在发表', 1)
      const res = await this.$http.post('http://localhost:8888/bms/User?action=comments', this.$qs.stringify(this.commentsData))
      if (res.data.code === 200) {
        this.commentsData.comments = ''
        setTimeout(() => {
          this.getData() // 重新刷新数据
          this.$message.success('发表成功', 2)
          console.log('listData:', this.listData)
        }, 1500)
      }
    }
  },
  created () {
    this.commentsData.bookId = this.$route.query.bookId
    this.page.bookId = this.$route.query.bookId
    this.getData()
    console.log('第二次打印', this.$route.query.bookId)
  }
}
</script>
<style>
.box{
  margin: auto;
  width: 1500px;
}
.page{
  height: 100%;
  width: 100%;
  text-align: left;
}
</style>
