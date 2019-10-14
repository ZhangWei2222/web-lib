<template>
  <div class="user">
    <el-table
      :data="tableData"
      style="width: 100%">

      <el-table-column
        prop="id"
        label="借书证号"
        width="50">
      </el-table-column>

      <el-table-column
        prop="name"
        label="姓名"
        width="120">
        <template slot-scope="scope">
          <el-input v-if="isEdit" v-model="scope.row.name" @change="textChange($event, 'name', scope.$index)"></el-input>
          <div v-else>{{scope.row.name}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="class"
        label="班级"
        width="120">
        <template slot-scope="scope">
          <el-input v-if="isEdit" v-model="scope.row.class" type="number" @change="textChange($event, 'class', scope.$index)"></el-input>
          <div v-else>{{scope.row.class}}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="department"
        label="院系"
        width="130">
        <template slot-scope="scope">
          <el-input v-if="isEdit" v-model="scope.row.department" @change="textChange($event, 'department', scope.$index)"></el-input>
          <div v-else>{{scope.row.department}}</div>
        </template>
      </el-table-column>

      <el-table-column
        v-if="isEdit"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="delect(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-button v-if="isEdit" type="success" @click="putNewBooks">新增读者</el-button>

    <el-button type="primary"  @click="edit" style="margin-top: 30px">{{ isEdit ? '完成' : '编辑'}}</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      isEdit: false,
      isFull: true,
      isNum: true,
      editIdArr: [],
      addIdArr: []
    }
  },

  mounted() {
    let self = this

    //显示列表
    this.axios.get('http://localhost:4444/api/getUsers').then((res, err)=>{
      if(res.data.code > 0) {
        self.tableData = res.data.data
        // console.log(self.tableData)
      }else {
        this.$message({
          showClose: true,
          message: `获取读者列表失败：${err}`,
          type: 'warning'
        });
      }
    })
  },

  methods: {
    //新增记录
    putNewBooks() {
      let self = this
      this.isFull = false

      let book = {
        id: parseInt(this.tableData[this.tableData.length - 1].id  )+ 1,
        name: '',
        class: '',
        department: '',
      }
      this.tableData.push(book)

      if(this.addIdArr.indexOf(book.id) <= -1) {
        this.addIdArr.push(book.id)
      }
    },

    //点击编辑 /完成
    edit() {
      let self = this;
      if(this.isNum) {
        this.isEdit = !this.isEdit
      }

      //点击 完成 按钮
      if(!this.isEdit) {
        // 如果有记录为空，提示错误，点击 完成 不成功
        let flag = true
        self.tableData.forEach( item => {
          if( !(item.name && item.class && item.department) ) {
            this.$message({
              showClose: true,
              message: '请检查是否输入完整',
              type: 'warning'
            });
            flag = false
          }
        })

        // 通过验证，可以点击完成
        if(!flag) {
          self.isFull = false
          self.isEdit = true
        }else {
          self.isFull = true
          self.isEdit = false
        }

        if(self.isFull) {
          // 记录修改记录的id
          let params = []
          this.editIdArr.forEach( item => {
            if(params.indexOf(item) <= -1) {
              params.push(item)
            }
          })


          // 批量上传修改
          for(let i = 0;i < params.length;i++){
            let currentParam
            self.tableData.forEach( item => {
              if(item.id == params[i]) {
                currentParam = item
              }
            })
            this.axios.post('http://localhost:4444/api/updateUser', currentParam).then((res, err)=>{
              if(res.data.code > 0) {
                if(i == params.length -1) {
                  this.$message({
                    showClose: true,
                    message: '编辑成功！',
                    type: 'success'
                  });
                  self.editIdArr = []
                }
              }else {
                this.$message({
                  showClose: true,
                  message: `编辑失败：${err}`,
                  type: 'warning'
                });
              }
            })
          }

          // 批量上传新增
          let addParams = this.addIdArr
          for(let i = 0;i < addParams.length;i++){
            let currentAddParam
            self.tableData.forEach( item => {
              if(item.id == addParams[i]) {
                currentAddParam = item
              }
            })
            this.axios.post('http://localhost:4444/api/addUser', currentAddParam).then((res, err)=>{
              if(res.data.code > 0) {
                self.addIdArr = []
                this.$message({
                  showClose: true,
                  message: `添加成功`,
                  type: 'success'
                });
              }else {
                console.log(err)
                this.$message({
                  showClose: true,
                  message: `添加失败：${err}`,
                  type: 'warning'
                });
              }
            })
          }

        }

      }
    },

    // 记录修改后，赋值
    textChange(event, type, index) {
      switch (type) {
        case 'name':
          this.tableData[index].name = event
          break;
        case 'class':
          this.tableData[index].class = event
          break;
        case 'department':
          this.tableData[index].department = event
          break;
        default:
          break;
      }
      this.editIdArr.push(Number(this.tableData[index].id))
    },

    // 删除记录
    delect(id) {
        if(this.addIdArr.indexOf(id) >= 0) {
          this.tableData.forEach((item, index) => {
            if(item.id == id) {
              this.tableData.splice(index, 1)
              this.addIdArr.splice(this.addIdArr.indexOf(id), 1)
            }
          })
        }else{
          let param = {
            id: id
          }
          this.axios.post('http://localhost:4444/api/delectUser', param).then((res, err)=>{
            console.log(res)
            if(res.data.code > 0) {
              this.tableData.forEach((item, index) => {
                if(item.id == id) {
                  this.tableData.splice(index, 1)
                }
              })
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
            }else {
              console.log(err)
              this.$message({
                showClose: true,
                message: `删除失败：${err}`,
                type: 'warning'
              });
            }
          })
        }
      // }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
