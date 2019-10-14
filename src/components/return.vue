<template>
  <div class="admin">
    <el-table
      :data="tableData"
      style="width: 100%">

      <el-table-column
        prop="reader_id"
        label="借书证号"
        width="50">
      </el-table-column>

      <el-table-column
        prop="reader_name"
        label="读者名"
        width="120">
      </el-table-column>

      <el-table-column
        prop="book_id"
        label="编号"
        width="50">
      </el-table-column>

      <el-table-column
        prop="book_name"
        label="书名"
        width="120">
      </el-table-column>

      <el-table-column
        prop="return_date"
        label="归还时间"
        width="120">
        <template slot-scope="scope">
          <div>{{handleDate(scope.row.return_date)}}</div>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
    }
  },
  mounted() {
    let self = this
    this.axios.get('http://localhost:4444/api/getReturn').then((res, err)=>{
      if(res.data.code > 0) {
        self.tableData = res.data.data
        // console.log(self.tableData)
      }else {
        this.$message({
          showClose: true,
          message: `获取归还列表失败：${err}`,
          type: 'warning'
        });
      }
    })
  },
  methods: {
    // 日期处理
    handleDate(day) {
      var dateee = new Date(day).toJSON();  
      var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')    
      return date.split(' ')[0]
    },
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
