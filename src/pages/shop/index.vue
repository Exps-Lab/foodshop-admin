<template>
  <div>
    <section class="tool-bar">
      <a-button type="primary" @click="handleAdd">新增</a-button>
    </section>
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
    width: 400
  },
  {
    title: '店铺分类',
    dataIndex: 'category',
    width: 170
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    width: 100
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
  let shopRes = await shopList({
    pn: pagination.current,
    rn: pagination.pageSize
  })
  const { pn, rn, list, total } = shopRes.data
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
.childMenuBox {
  position: relative;
  margin: 0 0 20px 125px;
  padding: 20px 20px 0 0;
  border: 1px dashed #c5c5c5;
  > label {
    position: absolute;
    color: #4e5969;
    top: 8px;
    left: -15px;
    transform: translateX(-100%);
  }
}
</style>
