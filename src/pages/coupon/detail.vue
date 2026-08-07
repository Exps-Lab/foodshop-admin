<template>
  <div class="box">
    <a-form
      auto-label-width
      :model="couponInfo"
      class="coupon-form"
      :style="{ width: '600px' }"
      @submitSuccess="handleSubmit"
      :disabled="isDisabled">

      <a-form-item
        field="title"
        label="优惠券标题"
        :rules="[{ required: true, message: '优惠券标题不能为空' }, { maxLength: 20, message: '标题最多20个字符' }]"
        :validate-trigger="['change', 'blur']">
        <a-input
          v-model="couponInfo.title"
          placeholder="请输入优惠券标题"
          :max-length="20"
          show-word-limit>
        </a-input>
      </a-form-item>

      <a-form-item
        field="base_val"
        label="基础优惠值"
        :rules="[{ required: true, message: '基础优惠值不能为空' }]"
        :validate-trigger="['change', 'blur']">
        <a-input-number
          v-model="couponInfo.base_val"
          placeholder="请输入基础优惠值"
          mode="button"
          :min="0"
          :precision="0" />
      </a-form-item>

      <a-form-item
        field="valid_time"
        label="优惠券生效区间"
        :rules="[{ required: true, message: '请选择优惠券生效区间' }]"
        :validate-trigger="['change', 'blur']">
        <a-range-picker
          v-model="couponInfo.valid_time"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          value-format="timestamp"
          :placeholder="['请选择生效时间', '请选择过期时间']" />
      </a-form-item>

      <a-form-item>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" html-type="submit">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { getCouponDetail, addCoupon, updateCoupon } from '@api/coupon'

interface CouponForm {
  title: string
  base_val: number
  valid_time: number[]
}

const router = useRouter()
const route = useRoute()
const isDisabled = Boolean(route.query.view || false)
const couponId = Number(route.query.coupon_id || '')

const couponInfo = reactive<CouponForm>({
  title: '',
  base_val: 0,
  valid_time: []
})

const handleSubmit = async (data: CouponForm) => {
  const [valid_start, valid_end] = data.valid_time || []
  const payload = {
    title: data.title,
    base_val: data.base_val,
    valid_start: valid_start,
    valid_end: valid_end
  }

  if (couponId) {
    await updateCoupon({ coupon_id: couponId, ...payload })
  } else {
    await addCoupon(payload)
  }
  Message.success('保存成功！')
  handleCancel()
}

const handleCancel = () => {
  router.go(-1)
}

const preGetDetail = async () => {
  if (couponId) {
    const res = await getCouponDetail({ coupon_id: couponId })
    const { title, base_val, valid_start, valid_end } = res.data
    couponInfo.title = title
    couponInfo.base_val = base_val
    // Date 类型返回 ISO 字符串，需转为时间戳供 DatePicker 使用
    couponInfo.valid_time = [
      new Date(valid_start).getTime(),
      new Date(valid_end).getTime()
    ]
  }
}

onMounted(preGetDetail)
</script>

<style lang="less" scoped>
</style>
