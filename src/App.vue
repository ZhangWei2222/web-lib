<template>
  <div id="app">
    <el-menu
      :default-active="$route.path"
      router
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="/book">图书管理</el-menu-item>
      <el-menu-item index="/user">读者管理</el-menu-item>
      <el-menu-item index="/admin">管理员管理</el-menu-item>
      <el-menu-item index="/borrow">借还管理</el-menu-item>
      <el-menu-item index="/ticket">罚单管理</el-menu-item>
      <el-menu-item index="/return">还书信息</el-menu-item>
    </el-menu>
    <el-main>
      <router-view/>
    </el-main>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    }
  }
}
</script>


