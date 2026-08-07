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
        <a-button type="text" @click="handleView(record)">所有商品</a-button>
        <a-button type="text" @click="handleDelete(record)">删除</a-button>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Message, Modal } from '@arco-design/web-vue'
  import { getCategory, deleteCategory } from '@api/goods'

  interface CategoryItem {
    id: number
    name: string
    description: string
    foods_names: string[]
  }
  interface Query {
    page_num: number
    page_size: number
    shop_id?: number | string
  }

  const router = useRouter()
  const route = useRoute()
  const shopId = Number(route.query.shop_id) || ''
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50
    },
    {
      title: '类型名',
      dataIndex: 'name',
      width: 150
    },
    {
      title: '类型介绍',
      dataIndex: 'description',
      width: 200
    },
    {
      title: '包含商品',
      dataIndex: 'foods_names',
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
  const state = reactive<{ data: CategoryItem[] }>({
    data: []
  })

  const getList = async () => {
    const query: Query = {
      page_num: pagination.current,
      page_size: pagination.pageSize
    }
    if (shopId) {
      query.shop_id = shopId
    }
    const shopRes = await getCategory(query)
    const { pageNum, list, total } = shopRes.data
    state.data = list
    pagination.total = total
    pagination.current = pageNum
  }
  const handleView = (row: CategoryItem) => {
    router.push(`/goods/index?food_category_id=${row.id}`)
  }
  const handleDelete = (row: CategoryItem) => {
    Modal.confirm({
      title: '确认要删除商品分类吗？',
      content: '',
      onOk: () => {
        deleteCategory({ id: row.id })
          .then(() => {
            Message.success('删除成功！')
            getList()
          })
          .catch((err: any) => {
            Message.error(err.data.msg)
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
