<template>
  <div class="view-container">
    <div class="tool-bar">
      <a-button type="primary" @click="handleAdd">新增优惠券</a-button>
    </div>
    <a-table
      stripe
      column-resizable
      :columns="columns"
      :data="state.data"
      :pagination="pagination"
      @page-change="tableChange">
      <template #validTime="{ record }">
        {{ record.valid_start }} ~ {{ record.valid_end }}
      </template>
      <template #optional="{ record }">
        <a-button type="text" @click="handleView(record)">查看</a-button>
        <a-button type="text" @click="handleEdit(record)">编辑</a-button>
        <a-button type="text" status="danger" @click="handleDelete(record)">删除</a-button>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import { getCouponList, deleteCoupon } from '@api/coupon'

interface CouponItem {
  coupon_id: number
  title: string
  base_val: number
  valid_start: string
  valid_end: string
  create_user: string
  update_user: string
}

const router = useRouter()

const columns = [
  {
    title: 'ID',
    dataIndex: 'coupon_id',
    width: 80
  },
  {
    title: '优惠券标题',
    dataIndex: 'title',
    width: 200
  },
  {
    title: '优惠券金额',
    dataIndex: 'base_val',
    width: 120
  },
  {
    title: '优惠券生效区间',
    slotName: 'validTime',
    width: 300
  },
  {
    title: '创建人',
    dataIndex: 'create_user',
    width: 120
  },
  {
    title: '更新人',
    dataIndex: 'update_user',
    width: 120
  },
  {
    title: '操作',
    slotName: 'optional',
    width: 250
  }
]

const pagination = reactive({
  showTotal: true,
  pageSize: 10,
  current: 1,
  total: 0
})

const state = reactive<{ data: CouponItem[] }>({
  data: []
})

const getList = async () => {
  const res = await getCouponList({
    page_num: pagination.current,
    page_size: pagination.pageSize
  })
  const { list, total } = res.data
  state.data = list
  pagination.total = total
}

const handleAdd = () => {
  router.push('/coupon/detail')
}

const handleView = (row: CouponItem) => {
  router.push(`/coupon/detail?coupon_id=${row.coupon_id}&view=1`)
}

const handleEdit = (row: CouponItem) => {
  router.push(`/coupon/detail?coupon_id=${row.coupon_id}`)
}

const handleDelete = (row: CouponItem) => {
  Modal.confirm({
    title: '确认要删除该优惠券吗？',
    content: '',
    onOk: () => {
      deleteCoupon({ coupon_id: row.coupon_id }).then(() => {
        Message.success('删除成功！')
        getList()
      })
    }
  })
}

const tableChange = (current: number) => {
  pagination.current = current
  getList()
}

onMounted(getList)
</script>

<style scoped lang="less">
</style>
