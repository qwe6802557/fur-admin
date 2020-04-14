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
      <a-form-item label="员工名称"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'staff_name',
                                            ]"
                 placeholder="请输入员工名称">
        </a-input>
      </a-form-item>
      <a-form-item label="员工账号"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'staff_username',
                                            ]"
                 placeholder="请输入员工账号">
        </a-input>
      </a-form-item>
      <a-form-item label="手机号"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-input v-decorator="[
                                         'staff_phone',
                                            ]"
                 placeholder="请输入手机号">
        </a-input>
      </a-form-item>
        <a-form-item label="所属分组"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-select showSearch
                    :filterOption="filterOption"
                    v-decorator="['group_id'   ]"
                    placeholder="请选择所属分组"
          >
            <a-select-option  v-for="item in groupList" :value="item.id" :key="item.id">
              {{item.group_name}}
            </a-select-option>
          </a-select>
        </a-form-item>
      <a-form-item label="入职时间"
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
    <a-button type="primary" shape="round" class="confirm-button"  :loading="searchLoading" @click="toSearch" style="width: 192px;margin-left: -70px;margin-top: 320px;">确定</a-button>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name: "SearchStaff",
    props: ['searchLoading', 'groupList'],
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
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
    },
    computed: {
      ...mapState(['detailUse'])
    }
  }
</script>

<style scoped>

</style>
