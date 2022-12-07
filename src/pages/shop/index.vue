<template>
  <div>
    <section class="tool-bar">
      <a-button type="primary" @click="handleAdd">新增</a-button>
    </section>
    <a-table
      stripe
      :columns="columns"
      :data="state.data"
      :pagination="pagination"
      :scroll="{ x: 1000 }"
      @page-change="tableChange">
      <template #optional="{ record }">
        <a-button type="text" @click="handleView(record)">查看</a-button>
        <a-button type="text" @click="handleEdit(record)">编辑</a-button>
        <a-button type="text" @click="handleDelete(record)">删除</a-button>
        <a-button type="text" @click="addGoods(record)">添加商品</a-button>
        <a-button type="text" @click="showAllCategory(record)">所有商品类型</a-button>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import { shopList, deleteShop } from '@api/shop'

const router = useRouter()
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 50
  },
  {
    title: '店铺名称',
    dataIndex: 'name',
    ellipsis: true,
    tooltip: true,
    width: 150
  },
  {
    title: '店铺地址',
    dataIndex: 'address',
    ellipsis: true,
    tooltip: true,
    width: 330
  },
  {
    title: '店铺分类',
    dataIndex: 'category',
    width: 160
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    width: 120
  },
  {
    title: '操作',
    slotName: 'optional',
    fixed: 'right',
    width: 420
  }
]
const pagination = reactive({
  showTotal: true,
  pageSize: 10,
  current: 1,
  total: 0
})
const state = reactive({
  data: []
})

const getList = async () => {
  let shopRes = await shopList({
    page_num: pagination.current,
    page_size: pagination.pageSize
  })
  const { page_num, page_size, list, total } = shopRes.data
  state.data = list
  pagination.total = total
}
const handleView = (row) => {
  router.push(`/shop/detail?id=${row.id}&view=1`)
}
const handleEdit = (row) => {
  router.push(`/shop/detail?id=${row.id}`)
}
const handleDelete = (row) => {
  Modal.confirm({
    title: '确认要删除这家商铺吗？',
    onOk: () => {
      deleteShop({ id: row.id }).then(res => {
        Message.success('删除成功！')
        getList()
      })
    }
  })
}
const addGoods = (row) => {
  router.push(`/goods/detail?shop_id=${row.id}`)
}
const showAllCategory = (row) => {
  router.push(`/goods/categoryList?shop_id=${row.id}`)
}
const handleAdd = () => {
  router.push('/shop/detail')
}
const tableChange = (current) => {
  pagination.current = current
  getList()
}

onMounted(getList)
</script>

<style scoped lang="less">
</style>
