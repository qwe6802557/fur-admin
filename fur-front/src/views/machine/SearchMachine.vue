<template>
  <div id="searchForm">
    <a-form layout="horizontal" :form="form" >
      <a-form-item label="编号"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'id',
                                            ]"
                 placeholder="请输入编号">
        </a-input>
      </a-form-item>
      <a-form-item label="机器名称"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'machine_name',
                                            ]"
                 placeholder="请输入机器名称">
        </a-input>
      </a-form-item>
      <a-form-item label="机器类型"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select
          v-decorator="[  'machine_use'  ]"
          placeholder="请选择机器类型"
          @change="typeChange"
        >
          <a-select-option value="0">
            配件生产
          </a-select-option>
          <a-select-option value="1">
            产品生产
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="机器用途"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol" v-if="showType">
        <a-select
          v-decorator="[  'machine_type'  ]"
          placeholder="请选择机器用途"
        >
          <a-select-option value="0">
            待运行
          </a-select-option>
          <a-select-option value="1">
            运行中
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="运行状态"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select
          v-decorator="[  'machine_status'  ]"
          placeholder="请选择运行状态"
        >
          <a-select-option value="0">
            待运行
          </a-select-option>
          <a-select-option value="1">
            运行中
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <a-form-item label="入库时间"
                 :label-col="formItemLayout.labelCol"
                 :wrapper-col="formItemLayout.wrapperCol">
      <a-range-picker
        separator="-"
        :showTime="{
            hideDisabledOptions: true,
            defaultValue: [this.$moment('00:00:00', 'HH:mm:ss'), this.$moment('11:59:59', 'HH:mm:ss')]
          }"
        format="YYYY-MM-DD HH:mm:ss"
        v-decorator="['machine_time']"
        :placeholder="['请输入开始时间', '请输入结束时间']"
      />
    </a-form-item>
    <a-button type="primary" shape="round" class="confirm-button"  :loading="searchLoading" @click="toSearch" style="width: 192px;margin-left: -70px;margin-top: 330px;">确定</a-button>
  </div>
</template>

<script>
  export default {
    name: "SearchMachine",
    props: ['searchLoading', 'detail_use'],
    data () {
      return {
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: { span: 7 },
          wrapperCol: { span: 16 }
        },
        showType: true
      }
    },
    methods: {
      typeChange (value) {
        if (value === '0'){
          this.showType = false;
        } else {
          this.showType = true;
        }
      },
      toSearch () {
        this.form.validateFields( (err, values) => {
          if (err) {
            return false;
          }
          if (values.machine_time){
            values.machine_start_time = this.$moment(values.machine_time[0]).format('YYYY-MM-DD hh:mm:ss');
            values.machine_end_time = this.$moment(values.machine_time[1]).format('YYYY-MM-DD hh:mm:ss');
          }
          delete values.machine_time;
          this.$emit('search', values);
        })
      },
      resetForm () {
        this.form.resetFields();
      }
    }
  }
</script>

<style lang="less">
   .ant-drawer-wrapper-body{
     overflow: hidden !important;
   }
</style>
