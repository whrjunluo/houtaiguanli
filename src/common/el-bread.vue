<template>
 <div>
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="#">{{this.$route.name}}</a></el-breadcrumb-item>
</el-breadcrumb>
 </div>
</template>

<script>
export default {
 data() {
 return {

 };
 },
 mounted() {
 },
};
</script>

<style lang="" scoped>
.el-breadcrumb{
  margin-bottom: 20px;
}
</style>
