<template>
  <div>
    <a-table
      stripe
      column-resizable
      :columns="columns"
      :data="state.data"
      :pagination="pagination"
      @page-change="tableChange">
      <template #optional="{ record }">
        <a-button type="text" @click="handleView(record)">查看</a-button>
        <a-button type="text" @click="handleEdit(record)">编辑</a-button>
        <a-button type="text" @click="handleDelete(record)">删除</a-button>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import { goodsList, deleteGoods } from '@api/goods'

const router = useRouter()
const route = useRoute()
const foodCategoryId = Number(route.query.food_category_id || '')
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 50
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    width: 150
  },
  {
    title: '所属商铺',
    dataIndex: 'shop_name',
    width: 200
  },
  {
    title: '所属分类',
    dataIndex: 'food_category_name',
    width: 200
  },
  {
    title: '商品介绍',
    dataIndex: 'description',
    width: 200
  },
  {
    title: '操作',
    slotName: 'optional'
  }
]
const pagination = reactive({
  showTotal: true,
  pageSize: 1,
  current: 1,
  total: 0
})
const state = reactive({
  data: []
})

const getList = async () => {
  let param = {
    pageNum: pagination.current,
    pageSize: pagination.pageSize
  }
  foodCategoryId ? param.food_category_id = foodCategoryId : false
  let shopRes = await goodsList(param)
  const { list, total } = shopRes.data
  state.data = list
  pagination.total = total
}
const handleView = (row) => {
  router.push(`/goods/detail?goods_id=${row.id}&shop_id=${row.shop_id}&view=1`)
}
const handleEdit = (row) => {
  router.push(`/goods/detail?goods_id=${row.id}&shop_id=${row.shop_id}`)
}
const handleDelete = (row) => {
  Modal.confirm({
    title: '确认要删除商品吗？',
    onOk: () => {
      deleteGoods({ id: row.id }).then(res => {
        Message.success('删除成功！')
        getList()
      })
    }
  })
}
const tableChange = (current) => {
  pagination.current = current
  getList()
}

onMounted(getList)
</script>

<style scoped lang="less">
</style>
