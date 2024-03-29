<template>
  <div class="box">
    <a-form
      auto-label-width
      :model="shopInfo"
      class="shop-form"
      :style="{ width:'600px' }"
      @submitSuccess="handleSubmit"
      :disabled="isDisabled">

      <a-form-item
        field="name"
        label="店铺名称"
        :rules="[{ required: true, message: '店铺名称不能为空'}]"
        :validate-trigger="['change', 'blur']">
        <a-input v-model="shopInfo.name" placeholder="请输入店铺名称"></a-input>
      </a-form-item>

      <a-form-item
        field="address"
        label="详细地址"
        :rules="[{ required: true, message: '详细地址不能为空'}]"
        :validate-trigger="['blur']">
        <a-select
          :allow-search="true"
          :loading="searchControl.loading"
          placeholder="请输入详细地址"
          v-model="shopInfo.address"
          @search="handleSearch"
          @change="searchChange"
          :filter-option="false">
            <a-option v-for="(item, index) of searchControl.option" :value="item.address + ' ' + item.title" :key="index">{{item.address + ' ' + item.title}}</a-option>
          <template #footer>
            <a-pagination
              style="display: flex; justify-content: flex-end; padding: 6px 0;"
              simple
              size="mini"
              show-total
              :page-size="10"
              :current="searchControl.pageNum"
              :total="searchControl.total"
              :hide-on-single-page="true"
              @change="controlSearchPage"/>
          </template>
        </a-select>
      </a-form-item>

      <a-form-item
        field="phone"
        label="联系电话"
        :rules="[{ required: true, message: '联系电话不能为空'}]"
        :validate-trigger="['change', 'blur']">
        <a-input
          v-model="shopInfo.phone"
          placeholder="请输入联系电话"
          :max-length="11"
          show-word-limit>
        </a-input>
      </a-form-item>

      <a-form-item
        field="intro_text"
        label="店铺简介"
        :rules="[{ required: true, message: '店铺简介不能为空'}]"
        :validate-trigger="['change', 'blur']">
        <a-textarea
          v-model="shopInfo.intro_text"
          placeholder="请输入店铺简介"
          :auto-size="{ minRows: 3 }"
          :max-length="150"
          show-word-limit>
        </a-textarea>
      </a-form-item>

      <a-form-item
        field="shop_mark"
        label="店铺标语"
        :rules="[{ required: true, message: '店铺标语不能为空'}]"
        :validate-trigger="['change', 'blur']">
        <a-input v-model="shopInfo.shop_mark" placeholder="请输入店铺标语"></a-input>
      </a-form-item>

      <a-form-item
        field="category"
        label="店铺分类"
        :rules="[{ required: true, message: '店铺分类不能为空'}]"
        :validate-trigger="['change', 'blur']">
        <a-cascader
          allow-clear
          path-mode
          :options="categoryOptions"
          v-model="shopInfo.category"
          expand-trigger="hover"
          :field-names="{ label: 'name', value: 'name' }"
          placeholder="请选择店铺分类">
        </a-cascader>
      </a-form-item>

      <a-form-item
        field="delivery_fee"
        label="配送费"
        :rules="[{ required: true, message: '配送费不能为空'}]"
        :validate-trigger="['change', 'blur']">
        <a-input-number v-model="shopInfo.delivery_fee" placeholder="请输入配送费用" mode="button" :min="0" />
      </a-form-item>

      <a-form-item
        field="mini_delivery_price"
        label="起送价"
        :rules="[{ required: true, message: '起送价不能为空'}]"
        :validate-trigger="['change', 'blur']">
        <a-input-number v-model="shopInfo.mini_delivery_price" placeholder="请输入起送价" mode="button" :min="0" />
      </a-form-item>

      <a-form-item
        field="open_time"
        label="营业时间"
        :rules="[{ required: true, message: '营业时间不能为空'}]"
        :validate-trigger="['change', 'blur']">
        <a-time-picker
          readonly
          disableConfirm
          type="time-range"
          format="HH:mm"
          v-model="shopInfo.open_time"
          placeholder="请选择营业时间"/>
      </a-form-item>

      <a-form-item
        field="measure"
        label="是否设置满减优惠">
        <a-switch v-model="shopInfo.has_discount" />
      </a-form-item>

      <a-form-item
        class="discount-box"
        v-if="shopInfo.has_discount"
        label="设置满减优惠">
        <a-row :gutter="24" v-for="(item, index) in shopInfo.discount_Arr" :key="index">
          <a-col :span="8">
            <a-form-item :field="'discount_Arr.' + index + '.total_val'" label-col-flex="15px" label="满"
              :rules="[{ required: true, message: '满减上限不能为空'}]">
              <a-input-number
                hide-button
                :min="0"
                :precision="0"
                :style="{ width:'100px' }"
                v-model="item.total_val">
               </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
             <a-form-item :field="'discount_Arr.' + index + '.discount_val'" label-col-flex="15px" label="减"
             :rules="[{ required: true, message: '满减额度不能为空'}]">
              <a-input-number
                hide-button
                :min="0"
                :precision="0"
                :style="{ width:'100px' }"
                v-model="item.discount_val">
              </a-input-number>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <section class="operator-box">
              <a-button type="primary" @click="addDiscount(index)">
                <template #icon>
                  <icon-plus />
                </template>
              </a-button>
              <a-button type="primary" @click="deleteDiscount(index)">
                <template #icon>
                  <icon-minus />
                </template>
              </a-button>
            </section>
          </a-col>
        </a-row>
      </a-form-item>

      <a-form-item
        field="shop_image.avatar"
        label="上传店铺头像"
        :rules="[{ required: true, message: '店铺头像不能为空'}]"
        :validate-trigger="['change', 'blur']">
        <ImgUpload
          :fileList="picFileList.avatar"
          @imgUploadFinish="imgUploadFinish($event,'avatar')"
          @removeImg="removeImg($event, 'avatar')"/>
      </a-form-item>

      <a-form-item
        field="shop_image.business_licence"
        label="上传营业执照"
        :rules="[{ required: true, message: '营业执照不能为空'}]"
        :validate-trigger="['change', 'blur']">
        <ImgUpload
          :fileList="picFileList.business_licence"
          @imgUploadFinish="imgUploadFinish($event,'business_licence')"
          @removeImg="removeImg($event, 'business_licence')"/>
      </a-form-item>

      <a-form-item
        field="shop_image.food_licence"
        label="上传餐饮服务许可证"
        :rules="[{ required: true, message: '餐饮服务许可证不能为空'}]"
        :validate-trigger="['change', 'blur']">
        <ImgUpload
          :fileList="picFileList.food_licence"
          @imgUploadFinish="imgUploadFinish($event,'food_licence')"
          @removeImg="removeImg($event, 'food_licence')"/>
      </a-form-item>

      <a-form-item>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" html-type="submit">保存店铺</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { useRouter, useRoute } from "vue-router"
  import { getNowCity, placeSearch } from '@api/common'
  import { getCategory, getDetail, addShop, updateShop } from '@api/shop'
  import { Message } from '@arco-design/web-vue';
  import ImgUpload from '@components/ImgUpload/index.vue'

  const router = useRouter()
  const route = useRoute()
  const isDisabled = Boolean(route.query.view || false)
  const shopId = Number(route.query.id || '')
  const searchControl = reactive({
    searchText: '',
    loading: false,
    option: [],
    total: 0,
    pageNum: 1
  })
  const picFileList = reactive({
    avatar: [],
    business_licence: [],
    food_licence: []
  })
  let cityInfo = {}
  let categoryOptions = ref([])

  let shopInfo = reactive({
    name: '',
    address: '',
    pos: {
      lat: '',
      lng: ''
    },
    phone: '',
    intro_text: '',
    shop_mark: '',
    category: '',
    delivery_fee: 0,
    mini_delivery_price: 0,
    open_time: [],
    shop_image: {
      avatar: '',
      business_licence: '',
      food_licence: ''
    },
    has_discount: false,
    discount_Arr: [{
      total_val: 0,
      discount_val: 0
    }]
  })

  /**
   * 添加满减优惠
   * @param { number } index
   */
  const addDiscount = (index) => {
    shopInfo.discount_Arr.splice(index+1, 0 , {
      total_val: 0,
      discount_val: 0
    })
  }
  /**
   * 删除满减优惠
   * @param { number } index
   */
  const deleteDiscount = (index) => {
    shopInfo.discount_Arr.splice(index, 1)
  }

  async function handleSearch(val) {
    searchControl.loading = true
    val ? searchControl.searchText = val : false
    val && val !== shopInfo.address ? searchControl.pageNum = 1 : false

    const res = await placeSearch({
      keyword: val || searchControl.searchText,
      city_name: cityInfo.name,
      page_num: searchControl.pageNum
    })

    const { place, total } = res.data
    searchControl.option = place
    searchControl.total = total
    searchControl.loading = false
  }

  function controlSearchPage(nowPage) {
    searchControl.pageNum = nowPage
    handleSearch()
  }

  function searchChange(val) {
    for (let item of searchControl.option) {
      if (item.address + ' ' + item.title === val) {
        shopInfo.pos.lat = item.location.lat
        shopInfo.pos.lng = item.location.lng
      }
    }
  }

  function imgUploadFinish(data, type) {
    shopInfo.shop_image[type] !== undefined
      ? shopInfo.shop_image[type] = data.url || ''
      : false
  }

  function removeImg(file, type) {
    shopInfo.shop_image[type] !== undefined
      ? shopInfo.shop_image[type] = ''
      : false
  }

  async function handleSubmit (data) {
    if (shopId) {
      await updateShop({
        id: shopId,
        ...data
      })
    } else {
      await addShop({ ...data })
    }
    Message.success('保存成功！')
    handleCancel()
  }

  function handleCancel() {
    router.go(-1)
  }

  function filterCategory (data, res, level) {
    for (let item of data) {
      if (item.id !== undefined && item.level === level) {
        const { sub_categories = [], ...data } = item
        if (sub_categories.length) {
          level++
          data.children = filterCategory(sub_categories, [], level)
          level--
          res.push(data)
        } else {
          res.push(item)
        }
      }
    }
    return res
  }

  async function preGetDetail () {
    if (shopId) {
      const res = await getDetail({ id: shopId })
      const shop_image = res.data.shop_image
      shopInfo = Object.assign(shopInfo, res.data)
      Object.keys(shop_image).forEach(key => {
        picFileList[key].push({
          name: shop_image[key].split('/').at(-1),
          url: shop_image[key]
        })
      })
    }
  }

  async function init () {
    preGetDetail()
    getNowCity().then(({ data }) => {
      cityInfo = data
    })
    let categoryTemp = await getCategory()
    categoryOptions.value = filterCategory(categoryTemp.data, [], 1)
  }

  init()
</script>

<style lang="less" scoped>
  :deep(.discount-box) {
    .arco-form-item-content-flex {
      flex-wrap: wrap;
    }
  }
</style>
