<template>
  <div>
    <section class="tool-bar">
      <a-button type="primary" @click="handleAdd">新增</a-button>
    </section>
    <a-table :columns="columns" :data="state.data">
      <template #optional="{ record }">
        <a-button type="text" @click="handleView(record)">查看</a-button>
        <a-button type="text" @click="handleEdit(record)">编辑</a-button>
        <a-button type="text" @click="handleDelete(record)">删除</a-button>
      </template>
    </a-table>
  </div>
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
const getList = () => {
  getMenuList().then(res => {
    state.data = res.data
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
      deleteMenu({ id: row.id }).then(res => {
        Message.success('删除成功！')
        getList()
      })
    }
  })
}
const handleAdd = () => {
  router.push('/menu/detail')
}
getList()
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
