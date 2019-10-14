<template>
  <div class="admin">
    <el-table
      :default-sort = "{prop: 'payoff', order: 'descending'}"
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
        prop="over_date"
        label="逾期天数"
        width="50">
      </el-table-column>

      <el-table-column
        prop="ticket_fee"
        label="欠费"
        width="50">
      </el-table-column>

      <el-table-column
        sortable
        prop="payoff"
        label="是否欠费"
        width="50">
      </el-table-column>

      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.payoff > 0" size="mini" type="primary" @click="pay(scope.row)">缴费</el-button>
          <el-button v-else size="mini" type="info" @click="delect(scope.row)">删除</el-button>
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
    this.axios.get('http://localhost:4444/api/getTicket').then((res, err)=>{
      if(res.data.code > 0) {
        self.tableData = res.data.data
        // console.log(self.tableData)
      }else {
        this.$message({
          showClose: true,
          message: `获取罚单列表错误：${err}`,
          type: 'warning'
        });
      }
    })
  },
  methods: {
    pay(record) {
      // console.log(record)
      let param = {
        readerId: record.reader_id,
        bookId: record.book_id
      }

      this.axios.post('http://localhost:4444/api/payTicket', param).then((res, err)=>{
        if(res.data.code > 0) {
          this.tableData.forEach( (item,index) => {
            if(item.reader_id == record.reader_id && item.book_id == record.book_id) {
              this.tableData[index].payoff = 0
            }
          })
          this.$message({
            showClose: true,
            message: '缴费成功！',
            type: 'success'
          });
        }else {
          this.$message({
            showClose: true,
            message: `缴费失败：${err}`,
            type: 'warning'
          });
        }
      })

    },
    delect(record) {
      let param = {
        readerId: record.reader_id,
        bookId: record.book_id
      }

      this.axios.post('http://localhost:4444/api/delectTicket', param).then((res, err)=>{
        if(res.data.code > 0) {
          this.tableData.forEach( (item,index) => {
            if(item.reader_id == record.reader_id && item.book_id == record.book_id) {
              this.tableData.splice(index, 1)
            }
          })
          this.$message({
            showClose: true,
            message: '删除成功！',
            type: 'success'
          });
        }else {
          this.$message({
            showClose: true,
            message: `删除错误：${err}`,
            type: 'warning'
          });
        }
      })
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
