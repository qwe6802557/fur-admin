<template>
  <div id="searchForm">
    <a-form layout="horizontal" :form="form" >
      <a-form-item label="生产编号"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'id',
                                            ]"
                 placeholder="请输入生产编号">
        </a-input>
      </a-form-item>
      <a-form-item label="产品名称"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'package_name',
                                            ]"
                 placeholder="请输入配件名称">
        </a-input>
      </a-form-item>
      <a-form-item label="运行机器"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select
          v-decorator="[ 'machine_id' ]"
          placeholder="请选择运行机器"
        >
          <a-select-option v-for="item in searchMachineList" :value="item.id" :key="item.id">
            {{item.machine_name}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="生产状态"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select
          v-decorator="[  'produce_status' ]"
          placeholder="请选择生产状态"
        >
          <a-select-option :value="0">
            {{'生产中'}}
          </a-select-option>
          <a-select-option :value="1">
            {{'已完成'}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="开始时间"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-range-picker
          separator="-"
          :showTime="{
            hideDisabledOptions: true,
            defaultValue: [this.$moment('00:00:00', 'HH:mm:ss'), this.$moment('11:59:59', 'HH:mm:ss')]
          }"
          format="YYYY-MM-DD HH:mm:ss"
          v-decorator="['produce_start_time']"
          :placeholder="['请输入起止时间', '请输入结束时间']"
        />
      </a-form-item>
      <a-form-item label="结束时间"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-range-picker
          separator="-"
          :showTime="{
            hideDisabledOptions: true,
            defaultValue: [this.$moment('00:00:00', 'HH:mm:ss'), this.$moment('11:59:59', 'HH:mm:ss')]
          }"
          format="YYYY-MM-DD HH:mm:ss"
          v-decorator="['produce_end_time']"
          :placeholder="['请输入起止时间', '请输入结束时间']"
        />
      </a-form-item>
    </a-form>
    <a-button type="primary" shape="round" class="confirm-button"  :loading="searchLoading" @click="toSearch" style="width: 192px;margin-left: -70px;margin-top: 300px;">确定</a-button>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name: "SearchPackage",
    props: ['searchLoading', 'searchMachineList'],
    data () {
      return {
        form: this.$form.createForm(this),
        formItemLayout: {
          labelCol: { span: 7 },
          wrapperCol: { span: 16 }
        }
      }
    },
    methods: {
      toSearch () {
        this.form.validateFields( (err, values) => {
          if (err) {
            return false;
          }
          if (values.produce_start_time){
            values.produce_begin_start_time = this.$moment(values.produce_start_time[0]).format('YYYY-MM-DD hh:mm:ss');
            values.produce_begin_end_time = this.$moment(values.produce_start_time[1]).format('YYYY-MM-DD hh:mm:ss');
          }
          if (values.produce_end_time){
            values.produce_end_start_time = this.$moment(values.produce_end_time[0]).format('YYYY-MM-DD hh:mm:ss');
            values.produce_end_end_time = this.$moment(values.produce_end_time[1]).format('YYYY-MM-DD hh:mm:ss');
          }
          delete values.produce_start_time;
          delete values.produce_end_time;
          this.$emit('search', values);
        })
      },
      resetForm () {
        this.form.resetFields();
      }
    },
    computed: {
      ...mapState(['detailUse'])
    }
  }
</script>

<style lang="less">
  .ant-calendar-picker{
    width: auto !important;
  }
</style>
