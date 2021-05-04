<template>
  <div id="app">
    <a-layout>
      <a-layout-header>
        小万的图书管理系统
        <div class="right">
          <a-button type="primary">注销</a-button>
          <a-button>注册</a-button>
        </div>
      </a-layout-header>
      <a-layout>
        <a-layout-sider>
          <Sider></Sider>
        </a-layout-sider>
        <a-layout-content>
          <div class="content">
            <a-card style="height:100%">
              <router-view />
            </a-card>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import Sider from '@/components/Sider.vue'

export default {
  name: 'app',
  components: {
    Sider
  }
}
</script>

<style>
  #app {
    text-align: center;
  }
  #app .ant-layout-header,
  #app .ant-layout-footer {
    background: #0b2538;
    color: #fff;
  }
  #app .ant-layout-header{
    text-align: left;
    font-size: 20px;
  }
  #app .ant-layout-footer {
    line-height: 1.5;
  }
  #app .ant-layout-sider {
    min-height: 100vh;
    background: #0b2538;
    color: #fff;
    line-height: 120px;
  }
  #app .ant-layout-content {
    color: #fff;
    min-height: 120px;
    line-height: 120px;
  }
  #app > .ant-layout {
    margin-bottom: 48px;
  }
  #app > .ant-layout:last-child {
    margin: 0;
  }
  .content{
    height: 95%;
    width: 96%;
    background-color: pink;
    margin:20px auto;
  }
  .right{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    float: right;
    height: 100%;
    width: 150px;
  }
</style>
