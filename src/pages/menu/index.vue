<template>
  <a-table :columns="columns" :data="state.data">
    <template #columns>
      <a-table-column title="菜单名称" data-index="label"></a-table-column>
      <a-table-column title="菜单路径" data-index="path"></a-table-column>
      <a-table-column title="图标名称" data-index="icon"></a-table-column>
      <a-table-column title="菜单权限" data-index="role">
        <template #cell="{ record }">
          {{ record === 1 ? '管理员' : '普通用户' }}
        </template>
      </a-table-column>
      <a-table-column title="操作">
        <template #cell="{ record }">
          <a-button type="text" @click="handleEdit(record)">编辑</a-button>
          <a-button type="text" @click="handleDelete(record)">删除</a-button>
        </template>
      </a-table-column>
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
    dataIndex: 'role',
  },
]
const state = reactive({
  data: []
})
const getList = () => {
  getMenuList().then(res => {
    state.data = res.data
  })
}
const handleEdit = (row) => {
  router.push('/menu/detail?id=' + row.id)
}
const handleDelete = (row) => {
  Modal.confirm({
    title: '确认删除？',
    onOk: () => {
      deleteMenu({ id: row.id }).then(res => {
        Message.success('删除成功！')
        getList()
      })
    }
  });
  
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
