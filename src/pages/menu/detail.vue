<template>
  <a-form :model="form" :style="{width:'600px'}" @submitSuccess="handleSubmit">
    <a-form-item field="label" label="菜单名称" :rules="[{required:true, message:'请输入菜单名称'}]">
      <a-input v-model="form.label" placeholder="请输入菜单名称" />
    </a-form-item>
    <a-form-item field="path" label="菜单路径" :rules="[{required:true, message:'请输入菜单路径'}, {match:/^\//, message:'必须以/开头'}]">
      <a-input v-model="form.path" placeholder="请输入菜单全路径" />
    </a-form-item>
    <a-form-item field="icon" label="图标">
      <a-input v-model="form.icon" placeholder="请输入图标名称" />
    </a-form-item>
    <a-form-item field="role" label="菜单权限">
      <a-select v-model="form.role" placeholder="请选择菜单权限">
        <a-option v-for="item in roleOptions" :key="item.role_id" :value="item.role">{{ item.role_name }}</a-option>
      </a-select>
    </a-form-item>
    <a-form-item field="icon" label="菜单栏是否隐藏">
      <a-switch v-model="form.is_hidden" />
    </a-form-item>
    <a-form-item>
      <a-button @click="addChild">
        <template #icon>
          <icon-plus />
        </template>
        添加子菜单
      </a-button>
    </a-form-item>
    <div class="childMenuBox" v-for="(child, index) in form.children" :key="index">
      <label>子菜单{{ index + 1 }}</label>
      <a-form-item :field="`children.${index}.label`" label="菜单名称" :rules="[{required:true, message:'请输入菜单名称'}]">
        <a-input v-model="child.label" placeholder="请输入菜单名称" />
      </a-form-item>
      <a-form-item :field="`children.${index}.path`" label="菜单路径" :rules="[{required:true, message:'请输入菜单路径'}, {match:/^\//, message:'必须以/开头'}]">
        <a-input v-model="child.path" placeholder="请输入菜单全路径" />
      </a-form-item>
      <a-form-item :field="`children.${index}.icon`" label="图标">
        <a-input v-model="child.icon" placeholder="请输入图标名称" />
      </a-form-item>
    </div>
    
    <a-form-item>
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" html-type="submit">保存</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { getMenuDetail, addMenu, updateMenu, getRoleList } from '@api/menu/index'

const route = useRoute()
const id = Number(route.query.id)
let roleOptions = ref([])
const form = reactive({
  path: '',
  label: '',
  icon: '',
  role: 2,
  is_hidden: false,
  children: []
})
const getData = () => {
  getMenuDetail({ id }).then(res => {
    Object.keys(form).forEach(key => {
      form[key] = res.data[key]
    })
  })
}
const getRole = () => {
  getRoleList().then(res => {
    roleOptions.value = res.data
  })
}
const addChild = () => {
  form.children.push({
    path: '',
    label: '',
    icon: ''
  })
}
const handleSubmit = async (data) => {
  if (id) {
    await updateMenu({
      id,
      ...data
    })
  } else {
    await addMenu({ ...data })
  }
  Message.success('保存成功！')
  history.back()
}
const handleCancel = async (data) => {
  history.back()
}
const init = () => {
  getRole()
  if (id) {
    getData()
  }
}

init()
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
