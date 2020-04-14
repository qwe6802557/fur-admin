<template>
  <div id="searchForm">
    <a-form layout="horizontal" :form="form" >
      <a-form-item label="序号"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'id'
                                            ]"
                 placeholder="请输入序号">
        </a-input>
      </a-form-item>
      <a-form-item label="列表名称"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'category_name',
                                            ]"
                 placeholder="请输入列表名称">
        </a-input>
      </a-form-item>
    </a-form>
    <a-button type="primary" shape="round" class="confirm-button"  :loading="searchLoading" @click="toSearch">确定</a-button>
  </div>
</template>

<script>
  export default {
    name: "SearchCategory",
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
          if(err){
            return false;
          }
          this.$emit('search', values);
        });
      },
      resetForm () {
        this.form.resetFields();
      }
    }
  }
</script>

<style scoped>

</style>
