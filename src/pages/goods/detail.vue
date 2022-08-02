<template>
  <div class="box">
    <a-form
      auto-label-width
      :model="goodsInfo"
      class="goods-form"
      :style="{ width:'600px' }"
      @submitSuccess="handleSubmit"
      :disabled="isDisabled">

      <a-form-item
        field="name"
        label="商品名称"
        :rules="[{ required: true, message: '商品名称不能为空'}]"
        :validate-trigger="['change', 'blur']">
        <a-input v-model="goodsInfo.name" placeholder="请输入商品名称"></a-input>
      </a-form-item>

      <a-form-item
        field="category"
        label="商品种类">
        <a-select
          :allow-search="true"
          v-model="goodsInfo.food_category_id"
          :loading="searchControl.loading"
          placeholder="请输入商品归属种类"
          :filter-option="false"
          @search="handleSearch">
          <a-option v-for="item of searchControl.option" :value="item.id">{{item.name}}</a-option>
        </a-select>
      </a-form-item>

      <a-form-item class="collapse-box">
        <a-collapse :show-expand-icon="true">
          <a-collapse-item header="如果需要新的商品种类，点此输入" :style="{minWidth: '500px'}" >
            <a-space direction="vertical" fill>
              <a-input v-model="goodsInfo.food_category_name" placeholder="请输入商品种类名"></a-input>
              <a-input v-model="goodsInfo.food_category_desc" placeholder="请输入商品种类描述"></a-input>
            </a-space>
          </a-collapse-item>
        </a-collapse>
      </a-form-item>

      <a-form-item
        field="description"
        label="商品描述">
        <a-input v-model="goodsInfo.description" placeholder="请输入商品描述"></a-input>
      </a-form-item>

      <a-form-item
        field="material"
        label="商品原料">
        <a-input v-model="goodsInfo.material" placeholder="请输入商品原料"></a-input>
      </a-form-item>

      <a-form-item
        field="measure"
        label="商品份量">
        <a-input v-model="goodsInfo.measure" placeholder="请输入商品份量(例如：2人份)"></a-input>
      </a-form-item>

      <a-form-item
        field="image_path"
        label="上传商品头像">
        <ImgUpload
          :fileList="picFileList.goods_pic"
          @imgUploadFinish="imgUploadFinish"
          @removeImg="removeImg"/>
      </a-form-item>

      <a-form-item
        field="measure"
        label="是否优惠">
        <a-switch v-model="goodsInfo.is_discount" />
      </a-form-item>

      <a-form-item
        v-if="goodsInfo.is_discount"
        field="discount_val"
        label="优惠比例">
        <a-input-number
          hide-button
          :max="10"
          :min="0"
          :precision="1"
          :style="{ width:'80px' }"
          v-model="goodsInfo.discount_val"
          placeholder="请输入优惠折扣比例">
          <template #suffix>折</template>
        </a-input-number>
        <template #extra>
          <div>例如：7.5折</div>
        </template>
      </a-form-item>

      <a-form-item
        field="measure"
        label="商品特点">
        <a-select v-model="goodsInfo.attrs" :style="{ width:'300px' }" placeholder="请选择商品特点" multiple>
          <a-option value="is_new">新品上市</a-option>
          <a-option value="id_hot">招牌商品</a-option>
        </a-select>
      </a-form-item>

      <a-form-item
        field="measure"
        label="商品规格">
        <a-space direction="vertical" fill>
          <a-button type="outline" size="mini" :style="{float: 'right'}" @click="showSpecModal"><icon-plus />新增规格</a-button>
          <a-table :columns="specConf.columns" :data="goodsInfo.specfoods" :pagination="false">
            <template #optional="{ record, rowIndex }">
              <a-button type="text" @click="showSpecModal(record)">编辑</a-button>
              <a-button type="text" @click="handleSpecDelete(record, rowIndex)">删除</a-button>
            </template>
          </a-table>
        </a-space>
      </a-form-item>

      <a-form-item>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" html-type="submit">保存商品</a-button>
      </a-form-item>
    </a-form>

    <a-modal
      v-model:visible="specConf.modalVisible"
      :footer="false"
      title="保存商品规格"
      @cancel="beforeSpecHide">
      <a-form :model="specConf.modalEditSpec" @submitSuccess="beforeSpecSave">
        <a-form-item field="name" label="规格名称" :rules="[{ validator: validateSpecName, required: true }]" :validate-trigger="['change', 'blur']">
          <a-input v-model="specConf.modalEditSpec.name" placeholder="请输入规格名称" />
        </a-form-item>
        <a-form-item field="packing_fee" label="包装费" :rules="[{ required: true, message: '包装费不能为空'}]" :validate-trigger="['change', 'blur']">
          <a-input-number v-model="specConf.modalEditSpec.packing_fee" placeholder="请输入规格包装费" />
        </a-form-item>
        <a-form-item field="price" label="价格" :rules="[{ required: true, message: '价格不能为空'}]" :validate-trigger="['change', 'blur']">
          <a-input-number v-model="specConf.modalEditSpec.price" placeholder="请输入规格价格" />
        </a-form-item>
        <a-form-item field="stock" label="库存" :rules="[{ required: true, message: '库存不能为空'}]" :validate-trigger="['change', 'blur']">
          <a-input-number v-model="specConf.modalEditSpec.stock" placeholder="请输入库存库存数" />
        </a-form-item>
        <a-space :style="{ justifyContent: 'flex-end'}">
          <a-button @click="beforeSpecHide">取消</a-button>
          <a-button type="primary" html-type="submit">保存</a-button>
        </a-space>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
  import { reactive, onMounted } from 'vue'
  import { useRouter, useRoute } from "vue-router"
  import { getCategory, getDetail, addGoods, updateGoods } from '@api/goods'
  import { Message } from '@arco-design/web-vue';
  import ImgUpload from '@components/ImgUpload/index.vue'

  const router = useRouter()
  const route = useRoute()
  const isDisabled = Boolean(route.query.view || false)
  const shopId = Number(route.query.shop_id || '')
  const goodsId = Number(route.query.goods_id || '')


  //商品规格相关
  const specConf = reactive({
    columns: [
    {
      title: '规格名称',
      dataIndex: 'name',
      slotName: 'name',
      width: 150
    },{
      title: '包装费',
      dataIndex: 'packing_fee',
      slotName: 'packing_fee',
      width: 100
    },{
      title: '价格',
      dataIndex: 'price',
      slotName: 'price',
      width: 100
    },{
      title: '库存',
      dataIndex: 'stock',
      slotName: 'stock',
      width: 100
    },{
      title: '操作',
      slotName: 'optional',
      width: 160
    }],
    editSpecName: '', // 当前编辑的规格name
    modalVisible: false,
    modalEditSpec: {
      name: '',
      packing_fee: 1,
      price: 10,
      stock: 1000
    }
  })
  function validateSpecName (value, callback) {
    let { specfoods:data } = goodsInfo
    let temp = data.filter(item => item.name === value)
    if (temp.length) {
      callback('商品规格名不能重复!')
    }
    callback()
  }
  function beforeSpecSave () {
    let { modalEditSpec, editSpecName } = specConf
    let { specfoods:data } = goodsInfo

    if (editSpecName) {
      for (let i=0; i<data.length; i++) {
        if (data[i].name === editSpecName) {
          data[i] = Object.assign(data[i], modalEditSpec)
        }
      }
    } else {
      data.push(Object.assign({}, modalEditSpec))
    }
    beforeSpecHide()
  }
  function beforeSpecHide() {
    initSpecModal()
    specConf.modalVisible = false
  }
  function showSpecModal(data) {
    if (data) {
      specConf.modalEditSpec =Object.assign(specConf.modalEditSpec, data)
      specConf.editSpecName = data.name
    } else {
      specConf.editSpecName = ''
    }
    specConf.modalVisible = true
  }
  function initSpecModal () {
    specConf.modalEditSpec = Object.assign(specConf.modalEditSpec, {
      name: '',
      packing_fee: 1,
      price: 10,
      stock: 1000
    })
  }
  function handleSpecDelete(data, index) {
    goodsInfo.specfoods.splice(index, 1)
  }


  //商品分类搜索相关
  const searchControl = reactive({
    loading: false,
    option: [],
    pageNum: 1,
    pageSize: 10000
  })
  async function handleSearch(val) {
    searchControl.loading = true
    const res = await getCategory({
      shop_id: shopId,
      name: val,
      pageNum: searchControl.pageNum,
      pageSize: searchControl.pageSize
    })

    const { list } = res.data
    searchControl.option = list
    searchControl.loading = false
  }


  //图片相关
  const picFileList = reactive({
    goods_pic: []
  })
  function imgUploadFinish(data) {
    goodsInfo.image_path = data.url || ''
  }
  function removeImg() {
    goodsInfo.image_path = ''
  }


  // 表单相关
  let goodsInfo = reactive({
    name: '',
    food_category_id: '',
    food_category_name: '',
    food_category_desc: '',
    description: '',
    material: '',
    measure: '',
    image_path: '',
    is_discount: false,
    discount_val: 0,
    attrs: [],
    specfoods: [{
      name: '默认规格',
      packing_fee: 0,
      price: 10,
      stock: 1000
    }]
  })
  async function handleSubmit (data) {
    if (goodsId) {
      await updateGoods({
        id: goodsId,
        shop_id: shopId,
        ...data
      })
    } else {
      await addGoods({
        shop_id: shopId,
        ...data
      })
    }
    Message.success('保存成功！')
    handleCancel()
  }


  // init
  async function preGetDetail () {
    if (goodsId) {
      const res = await getDetail({ id: goodsId })
      const shop_image = res.data.image_path
      goodsInfo = Object.assign(goodsInfo, res.data)
      picFileList.goods_pic.push({
        name: shop_image.split('/').at(-1),
        url: shop_image
      })
    }
  }
  function handleCancel() {
    router.go(-1)
  }
  async function init () {
    await preGetDetail()
  }

  onMounted(init)
</script>

<style lang="less" scoped>
  .collapse-box {
    :deep(.arco-collapse-item-content) {
      background-color: #fff;
    }
  }
</style>
