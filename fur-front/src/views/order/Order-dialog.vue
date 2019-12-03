<template>
  <div class="dialog">
    <el-dialog
      :title="flag===0?'添加产品':'编辑产品'"
      :visible.sync="FormVisible"
      width="30%"
      center>
      <span>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <div class="form-part1">
             <el-form-item label="订购产品" prop="order_name">
              <el-input v-model="ruleForm.order_name"></el-input>
             </el-form-item>
            <el-form-item label="订购数量" prop="order_num">
          <el-input-number v-model="ruleForm.order_num" @change="handleChange" :min="1" :max="999">
          </el-input-number>
          </el-form-item>
          <el-form-item label="订单总价" prop="order_price">
            <el-input v-model="ruleForm.order_price" class="goods_price"></el-input>
          </el-form-item>
           <el-form-item label="订购商家" prop="order_owner">
                 <el-select v-model="ruleForm.order_owner" placeholder="请选择订购商家">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
          </el-form-item>
            <el-form-item label="商家地址" prop="owner_address">
            <el-input v-model="ruleForm.owner_address" class="goods_price"></el-input>
          </el-form-item>
          <el-form-item label="订购时间" prop="order_time">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.order_Day" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col :span="2" class="divide-line">-</el-col>
            <el-col :span="11">
              <el-time-picker placeholder="选择时间" v-model="ruleForm.order_Time" style="width: 100%;"></el-time-picker>
            </el-col>
         </el-form-item>
          <el-form-item label="完成时限" prop="last_day">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.finish_day" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col :span="2" class="divide-line">-</el-col>
            <el-col :span="11">
              <el-time-picker placeholder="选择时间" v-model="ruleForm.finish_time" style="width: 100%;"></el-time-picker>
            </el-col>
         </el-form-item>
          </div>
          <div class="form-part2">
            <el-form-item label="订单状态" prop="order_status">
              <el-radio-group v-model="ruleForm.order_status">
                <el-radio label="未开始" border></el-radio>
                <el-radio label="生产中" border></el-radio>
                <el-radio label="已发货" border></el-radio>
              </el-radio-group>
           </el-form-item>
          </div>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="confirm">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {Message} from 'element-ui'
  export default {
    name: "Order-dialog",
    props:['FormVisible','flag'],
    data(){
      return {
        ruleForm:{
          order_name:'',
          order_status:'',
          order_owner:'',
          order_Day:'',
          order_Time:'',
          finish_day:'',
          finish_time:'',
          order_num: '',
          order_price:'',
          owner_address:''
        },
        rules:{
          order_name:[{
            required:true
          }],
          order_status:[
            {required:true}
          ],
          order_owner:[
            {required:true}
          ],
          order_time:[
            {required:true}
          ],
          last_day:[
            {required:true}
          ],
          order_num:[
            {
              required:true
            }
          ],
          order_price:[{
            required:true
          }],
          owner_address:[{
            require:true
          }]
        }
      }
    },
    methods:{
      cancel(){
        this.$emit('visibleChange');
      },
      confirm(){
        this.$emit('visibleChange');
      },
      handleChange(value) {
        console.log(value);
      }
    },
    mounted(){
      document.querySelector('.el-dialog__close').addEventListener('click',()=>{
        this.cancel();
      })
    }
  }
</script>

<style scoped>

</style>
<style lang="less">
  .dialog{
    .el-dialog{
      width: 57% !important;
      min-width: 700px;
    }
    .demo-ruleForm{
      width: 80%;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      .form-part1{
        flex: 1;
      }
      .form-part2{
        flex: 1;
      }
    }
    .divide-line{
      text-align: center;
    }
    .is-bordered{
      margin-right: 7px;
      margin-left: 0 !important;
    }
    .goods_price{
      width: 50%;
    }
  }

</style>
