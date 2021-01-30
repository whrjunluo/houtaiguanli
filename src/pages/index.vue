<template>
 <div class="index">
   <el-container class="container">
  <el-header class="header">智友社区后台管理系统</el-header>
  <el-container>
    <el-aside width="200px">
       <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b" unique-opened
      router>
      <el-menu-item index="/home">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu v-for='item in getUserInfo.menus' :index="item.id.toString()" :key='item.id'>
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.title}}</span>
        </template>
        <el-menu-item v-for='list in item.children' :key='list.id' :index="list.url">{{list.title}}</el-menu-item>
      </el-submenu>
     
    </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
 </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
 data() {
 return {
   defaultActive:"/home"
 };
 },
 computed:{
    ...mapGetters(['getUserInfo'])
 },
 mounted() {
   this.defaultActive = this.$route.path
 },
};
</script>

<style lang="">
    @import url('../assets/css/index.css');
   .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
</style>
