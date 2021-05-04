<template>
  <div class="menu">
    <a-switch
      default-checked
      checked-children="dark"
      un-checked-children="light"
      @change="changeTheme"/>
    <a-menu
      :default-selected-keys="['3']"
      mode="inline"
      :theme="theme"
      :selected-keys="[current]"
      @click="handleClick">
      <a-menu-item key="/Message">
        <a-icon type="mail" />
        首页信息
      </a-menu-item>
      <a-sub-menu key="sub1">
        <span slot="title"><a-icon type="appstore" /><span>图书管理系统</span></span>
        <a-menu-item key="/BookForm">
          图书管理
        </a-menu-item>
        <a-menu-item key="/TypeManage">
          分类管理
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      current: '/Message',
      theme: 'dark'
    }
  },
  methods: {
    handleClick (e) {
      this.current = e.key
      this.$router.push(e.key)
    },
    changeTheme (checked) {
      this.theme = checked ? 'dark' : 'light'
    }
  }
}
</script>

<style scoped>
.menu{
  text-align: left;
  width: 100%;
  line-height: 0px;
}
</style>
