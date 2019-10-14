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
        <template slot-scope="scope">
          <!-- <el-input v-if="scope.row.isAdd" disabled v-model="scope.row.reader_id"></el-input> -->
          <div>{{scope.row.reader_id}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="reader_name"
        label="读者名"
        width="120">
        <template slot-scope="scope">
          <el-select @change="userSelected" v-if="scope.row.isAdd" v-model="scope.row.reader_name" filterable placeholder="请选择">
            <el-option
              v-for="item in userIdOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <div v-else>{{scope.row.reader_name}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="book_id"
        label="编号"
        width="50">
        <template slot-scope="scope">
          <!-- <el-input v-if="scope.row.isAdd" disabled v-model="scope.row.book_id"></el-input> -->
          <div>{{scope.row.book_id}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="book_name"
        label="书名"
        width="120">
        <template slot-scope="scope">
          <el-select @change="bookSelected" v-if="scope.row.isAdd" v-model="scope.row.book_name" filterable placeholder="请选择">
            <el-option
              v-for="item in bookIdOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <div v-else>{{scope.row.book_name}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="borrow_date"
        label="借书日期"
        width="180">
        <template slot-scope="scope">
          <el-date-picker
            v-if="scope.row.isAdd"
            v-model="start_date"
            type="date"
            placeholder="借书日期"
            :picker-options="startMonthOption"
            @change="selectStartMonth">
          </el-date-picker>
          <div v-else>{{handleDate(scope.row.borrow_date)}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="expect_return_date"
        label="预计归还日期"
        width="180">
        <template slot-scope="scope">
          <el-date-picker
            v-if="scope.row.isAdd"
            v-model="end_date"
            type="date"
            placeholder="归还日期"
            :picker-options="endMonthOption"
            @change="selectEndMonth">
          </el-date-picker>
          <div v-else>{{handleDate(scope.row.expect_return_date)}}</div>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="140">
        <template slot-scope="scope">
          <div v-if="scope.row.isAdd" style="display: flex;flex-direction: row;">
            <el-button size="mini" type="success" @click="confirm(scope.row)">确认</el-button>
            <el-button size="mini" type="info" @click="delectRecord(scope.row.id)">删除</el-button>
          </div>
          <el-button v-else size="mini" type="primary" @click="returnBook(scope.row)">还书</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-tooltip class="item" effect="dark" content="一次只能借一本书" placement="bottom">
      <el-button type="success" :disabled="isAdd" @click="borrowBook" style="margin-top: 30px;">借书</el-button>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  data () {
    return {
      startMonthOption: {},
      endMonthOption: {},
      tableData: [],
      bookIdOptions: [],
      userIdOptions: [],
      start_date: '',
      end_date: '',
      isAdd: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化数据
    init() {
      let self = this

      // 获取 借书情况 列表
      this.axios.get('http://localhost:4444/api/getBorrow').then((res, err)=>{
        if(res.data.code > 0) {
          self.tableData = res.data.data
          // console.log(self.tableData)
        }else {
          this.$message({
            showClose: true,
            message: `借书情况列表 拉取有误，错误：${err}`,
            type: 'warning'
          });
        }
      })

      // 获取 借书证号 列表
      this.axios.get('http://localhost:4444/api/getUserId').then((res, err)=>{
        if(res.data.code > 0) {
          // self.tableData = res.data.data
          // console.log(res.data.data)
          for(var key in res.data.data) {

            self.userIdOptions.push(res.data.data[key])
            // console.log(self.bookIdOptions)
          }
        }else {
          this.$message({
            showClose: true,
            message: `借书证号列表 拉取有误，错误：${err}`,
            type: 'warning'
          });
        }
      })

      // 获取 编号 列表
      this.axios.get('http://localhost:4444/api/getBookId').then((res, err)=>{
        if(res.data.code > 0) {
          // self.tableData = res.data.data
          // console.log(res.data.data)
          for(var key in res.data.data) {

            self.bookIdOptions.push(res.data.data[key])
            // console.log(self.bookIdOptions)
          }
        }else {
          this.$message({
            showClose: true,
            message: `借书证号列表 拉取有误，错误：${err}`,
            type: 'warning'
          });
        }
      })
    },

    // 日期处理
    handleDate(day) {
      var dateee = new Date(day).toJSON();  
      var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')    
      return date.split(' ')[0]
    },

    // 选择读者名，显示借书证号
    userSelected(value) {
      this.userIdOptions.forEach( item => {
        if(item.name == value) {
          this.tableData[this.tableData.length-1].reader_id = item.id
        }
      })
    },

    // 选择书名，显示编号
    bookSelected(value) {
      this.bookIdOptions.forEach( item => {
        if(item.name == value) {
          this.tableData[this.tableData.length-1].book_id = item.id
        }
      })
    },

    // 还书
    returnBook(record) {
      let param = {
        readerId: record.reader_id,
        bookId: record.book_id,
        curDate: new Date().toLocaleDateString().replace(/\//g,'-')
      }

      this.axios.post('http://localhost:4444/api/returnBook', param).then((res, err)=>{
        if(res.data.code > 0) {
          if(res.data.data.length > 1) {
            // console.log(res.data.data[0][0].msg)
            this.$message({
              showClose: true,
              message: '已逾期，请缴费！',
              type: 'warning'
            });
          }else {
            this.tableData.forEach( (item,index) => {
              if(item.reader_id == record.reader_id && item.book_id == record.book_id) {
                this.tableData.splice(index, 1)
              }
            })
            this.$message({
              showClose: true,
              message: '还书成功',
              type: 'success'
            });
          }
        }else {
          this.$message({
            showClose: true,
            message: `还书有误，错误：${err}`,
            type: 'warning'
          });
        }
      })
    },

    // 借书
    borrowBook() {
      // console.log('借书')
      this.isAdd = true
      let record = {
        reader_id: '',
        reader_name: '',
        book_id: '',
        book_name: '',
        borrow_date: '',
        expect_return_date: '',
        isAdd: true
      }
      this.tableData.push(record)
    },

    // 日期选择 处理
    pickDate(time) {
      var date = new Date(Date.parse(time));
      var newDate = date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
      return newDate
    },

    // 确认借书
    confirm(record) {
      // console.log(record)
      if( !record.reader_id || !record.book_id || !record.borrow_date || !record.expect_return_date ) {
        this.$message({
          showClose: true,
          message: `请填写完整信息`,
          type: 'warning'
        });
      }else {
        let params = {
          reader_id: record.reader_id,
          book_id: record.book_id,
          borrow_date: record.borrow_date,
          expect_return_date: record.expect_return_date
        }

        let self = this

        this.axios.post('http://localhost:4444/api/borrowBook', params).then((res, err)=>{
          if(res.data.code > 0) {
            if(res.data.data.length > 1) {
              // console.log(res.data.data[0][0].msg)
              this.$message({
                showClose: true,
                message: '该书库数为0，无法借阅！',
                type: 'warning'
              });
            }else {
              self.init()
              self.isAdd = false
              self.start_date = ''
              self.end_date = ''
              this.$message({
                showClose: true,
                message: '借书成功',
                type: 'success'
              });
            }
          }else {
            this.$message({
              showClose: true,
              message: `借书有误，错误：${err}`,
              type: 'warning'
            });
          }
        })
      }
    },

    // 开始月日期控件点击时触发此方法
    selectStartMonth(date) {
      this.tableData[this.tableData.length -1].borrow_date = this.pickDate(date)
      this.endMonthOption = {
        disabledDate: (time) => {
          if(this.start_date != '') {
            return time.getTime() < this.start_date;
          }
        }
      };
    },
    // 结束月日期控件点击时触发此方法
    selectEndMonth(date) {
      this.tableData[this.tableData.length -1].expect_return_date = this.pickDate(date)
      this.startMonthOption = {
        disabledDate: (time) => {
          if(this.end_date != '') {
            return time.getTime() > this.end_date;
          }
        }
      };
    },

    // 删除记录
    delectRecord(id) {
      this.tableData.splice(this.tableData.length - 1, 1)
      this.isAdd = false
      this.start_date = ''
      this.end_date = ''
    }

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-date-editor--date {
  width: 140px !important;
}
</style>
