<template>
  <div id="searchForm">
    <a-form layout="horizontal" :form="form" >
      <a-form-item label="序号"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'id',
                                            ]"
                 placeholder="请输入序号">
        </a-input>
      </a-form-item>
      <a-form-item label="提交人"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'creator_name',
                                            ]"
                 placeholder="请输入提交人">
        </a-input>
      </a-form-item>
      <a-form-item label="审批类型"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select
          v-decorator="[ 'approve_type'   ]"
          placeholder="请选择审批类型"
        >
          <a-select-option value="0">
            配件生产
          </a-select-option>
          <a-select-option value="1">
            产品生产
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="审批状态"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select
          v-decorator="[
                                                      'approve_status',

                                                    ]"
          placeholder="请选择审批状态"
        >
          <a-select-option value="0">
            待审批
          </a-select-option>
          <a-select-option value="1">
            通过
          </a-select-option>
          <a-select-option value="2">
            驳回
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="提交时间"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-range-picker
          separator="-"
          :showTime="{
            hideDisabledOptions: true,
            defaultValue: [this.$moment('00:00:00', 'HH:mm:ss'), this.$moment('11:59:59', 'HH:mm:ss')]
          }"
          format="YYYY-MM-DD HH:mm:ss"
          v-decorator="['approve_time']"
          :placeholder="['请输入开始时间', '请输入结束时间']"
        />
      </a-form-item>
    </a-form>
    <a-button type="primary" shape="round" class="confirm-button"  :loading="searchLoading" @click="toSearch" style="width: 192px;margin-left: -70px;margin-top: 430px;">确定</a-button>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name: "SearchApprove",
    props: ['searchLoading'],
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
          if (values.approve_time){
            values.approve_start_time = this.$moment(values.approve_time[0]).format('YYYY-MM-DD hh:mm:ss');
            values.approve_end_time = this.$moment(values.approve_time[1]).format('YYYY-MM-DD hh:mm:ss');
          }
          delete values.approve_time;
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

<style scoped>

</style>
