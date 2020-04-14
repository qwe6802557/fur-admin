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
      <a-form-item label="配件名称"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'package_name',
                                            ]"
                 placeholder="请输入配件名称">
        </a-input>
      </a-form-item>
      <a-form-item label="配件用途"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select
          v-decorator="[
                                                      'package_use',

                                                    ]"
          placeholder="请选择配件用途"
        >
          <a-select-option v-for="item in detailUse" :value="item.id" :key="item.id">
            {{item.use_name}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="配件状态"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select
          v-decorator="[
                                                      'package_status',

                                                    ]"
          placeholder="请选择配件状态"
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
  import { mapState } from 'vuex';
  export default {
    name: "SearchPackage",
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
          if (values.detail_time){
            values.package_start_time = this.$moment(values.detail_time[0]).format('YYYY-MM-DD hh:mm:ss');
            values.package_end_time = this.$moment(values.detail_time[1]).format('YYYY-MM-DD hh:mm:ss');
          }
          delete values.detail_time;
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
