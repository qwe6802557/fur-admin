<template>
  <div id="searchForm">
    <a-form layout="horizontal" :form="form" >
      <a-form-item label="订单产品"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select showSearch
                  :filterOption="filterOption"
                  v-decorator="['goods_id']"
                  placeholder="请选择订单产品"
        >
          <a-select-option  v-for="item in goodsList" :value="item.id" :key="item.id">
            {{item.goods_name}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="下单商户"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select showSearch
                  :filterOption="filterOption"
                  v-decorator="['merchant_id']"
                  placeholder="请选择下单商户"
        >
          <a-select-option  v-for="item in merchantList" :value="item.id" :key="item.id">
            {{item.merchant_username}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="订单状态"
                   :label-col="formItemLayout.labelCol"
                   :wrapper-col="formItemLayout.wrapperCol">
        <a-select v-decorator="['order_status']"
                  placeholder="请选择订单状态"
        >
          <a-select-option  v-for="item in merchantList" :value="item.id" :key="item.id">
            {{'请选择'}}
          </a-select-option>
          <a-select-option  :value="'0'">
            {{'未交付'}}
          </a-select-option>
          <a-select-option  :value="'1'">
            {{'已交付'}}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="注册时间"
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
    <a-button type="primary" shape="round" class="confirm-button"  :loading="searchLoading" @click="toSearch" style="width: 192px;margin-left: -70px;margin-top: 450px;">确定</a-button>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name: "SearchOrder",
    props: ['searchLoading', 'goodsList', 'merchantList'],
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
