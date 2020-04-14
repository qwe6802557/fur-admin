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
      <a-form-item label="分组名称"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'group_name',
                                            ]"
                 placeholder="请输入分组名称">
        </a-input>
      </a-form-item>
      <a-form-item label="创建时间"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-range-picker
          separator="-"
          :showTime="{
            hideDisabledOptions: true,
            defaultValue: [this.$moment('00:00:00', 'HH:mm:ss'), this.$moment('11:59:59', 'HH:mm:ss')]
          }"
          format="YYYY-MM-DD HH:mm:ss"
          v-decorator="['group_time']"
          :placeholder="['请输入开始时间', '请输入结束时间']"
        />
      </a-form-item>
    </a-form>
    <a-button type="primary" shape="round" class="confirm-button"  :loading="searchLoading" @click="toSearch" style="width: 192px;margin-left: -70px;margin-top: 535px;">确定</a-button>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name: "SearchGroup",
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
          if (values.goods_time){
            values.goods_start_time = this.$moment(values.goods_time[0]).format('YYYY-MM-DD hh:mm:ss');
            values.goods_end_time = this.$moment(values.goods_time[1]).format('YYYY-MM-DD hh:mm:ss');
          }
          delete values.goods_time;
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
