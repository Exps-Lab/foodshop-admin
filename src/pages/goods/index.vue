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

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import { goodsList, deleteGoods } from '@api/goods'

interface GoodsItem {
  id: number
  name: string
  shop_name: string
  shop_id: number
  food_category_name: string
  description: string
}

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
  pageSize: 10,
  current: 1,
  total: 0
})

const state = reactive<{ data: GoodsItem[] }>({
  data: []
})

const getList = async () => {
  const param: Record<string, any> = {
    page_num: pagination.current,
    page_size: pagination.pageSize
  }
  if (foodCategoryId) param.food_category_id = foodCategoryId
  const shopRes = await goodsList(param)
  const { list, total } = shopRes.data
  state.data = list
  pagination.total = total
}

const handleView = (row: GoodsItem) => {
  router.push(`/goods/detail?goods_id=${row.id}&shop_id=${row.shop_id}&view=1`)
}

const handleEdit = (row: GoodsItem) => {
  router.push(`/goods/detail?goods_id=${row.id}&shop_id=${row.shop_id}`)
}

const handleDelete = (row: GoodsItem) => {
  Modal.confirm({
    title: '确认要删除商品吗？',
    content: '',
    onOk: () => {
      deleteGoods({ id: row.id }).then(() => {
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
