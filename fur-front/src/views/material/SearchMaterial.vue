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
      <a-form-item label="原料名称"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'detail_name',
                                            ]"
                 placeholder="请输入原料名称">
        </a-input>
      </a-form-item>
      <a-form-item label="原料状态"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select
          v-decorator="[
                                                      'detail_status',

                                                    ]"
          placeholder="请选择原料状态"
        >
          <a-select-option value="0">
            不可用
          </a-select-option>
          <a-select-option value="1">
            可用
          </a-select-option>
        </a-select>
      </a-form-item>
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
          v-decorator="['detail_time']"
          :placeholder="['请输入开始时间', '请输入结束时间']"
        />
      </a-form-item>
    </a-form>
    <a-button type="primary" shape="round" class="confirm-button"  :loading="searchLoading" @click="toSearch" style="width: 192px;margin-left: -70px;margin-top: 430px;">确定</a-button>
  </div>
</template>

<script>
  export default {
    name: "SearchMaterial",
    props: ['searchLoading', 'detail_use'],
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
          if (values.detail_time){
            values.detail_start_time = this.$moment(values.detail_time[0]).format('YYYY-MM-DD hh:mm:ss');
            values.detail_end_time = this.$moment(values.detail_time[1]).format('YYYY-MM-DD hh:mm:ss');
          }
          delete values.detail_time;
          this.$emit('search', values);
        })
      },
      resetForm () {
        this.form.resetFields();
      }
    }
  }
</script>

<style scoped>

</style>
