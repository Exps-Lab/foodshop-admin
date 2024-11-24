<template>
  <section class="tool-bar">
    <a-button type="primary" @click="handleAdd">新增</a-button>
  </section>
  <a-table :columns="columns" :data="state.data" :pagination="page" @page-change="pageChange">
    <template #optional="{ record }">
      <a-button type="text" @click="handleView(record)">查看</a-button>
      <a-button type="text" @click="handleEdit(record)">编辑</a-button>
      <a-button type="text" @click="handleDelete(record)">删除</a-button>
    </template>
  </a-table>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import { getMenuList, deleteMenu } from '@api/menu/index'

const router = useRouter()
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'label',
  },
  {
    title: '菜单路径',
    dataIndex: 'path',
  },
  {
    title: '图标名称',
    dataIndex: 'icon',
  },
  {
    title: '菜单权限',
    dataIndex: 'role_name',
  },
  {
    title: '菜单栏是否隐藏',
    dataIndex: 'is_hidden_text',
  },
  {
    title: '操作',
    slotName: 'optional'
  }
]
const state = reactive({
  data: []
})
const page = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const getList = () => {
  getMenuList({
    page_num: page.pageNum,
    page_size: page.pageSize
  }).then(res => {
    res.data.list.forEach(item => {
      item.key = item.id
      if (item.children?.length === 0) {
        delete item.children
      }
    });
    state.data = res.data.list
    page.total = res.data.total
  })
}
const handleView = (row) => {
  router.push(`/menu/detail?id=${row.id}&view=1`)
}
const handleEdit = (row) => {
  router.push(`/menu/detail?id=${row.id}`)
}
const handleDelete = (row) => {
  if (row.is_default) {
    Message.warning('内置菜单不可删除！')
    return
  }
  Modal.confirm({
    title: '确认删除？',
    onOk: () => {
      deleteMenu({ id: row.id }).then(() => {
        Message.success('删除成功！')
        getList()
      })
    }
  })
}
const handleAdd = () => {
  router.push('/menu/detail')
}
const pageChange = (num) => {
  page.pageNum = num
  getList()
}

getList()
</script>

<style scoped lang="less">
</style>
