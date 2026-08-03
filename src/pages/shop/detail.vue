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
            :auto-size="{ minRows: 7 }"
            :max-length="200"
            show-word-limit
            allow-clear>
          </a-textarea>
          <template #extra>
            <a-row>
              <a-col :span="12">
                <a-input
                  v-model="simpleIntroText"
                  placeholder="输入简介关键词"
                  allow-clear
                >
                </a-input>
              </a-col>
            </a-row>
            <a-space style="margin-top: 10px;">
              <a-row>
                <a-col :span="12">
                  <a-button
                    type="primary"
                    status="danger"
                    @click="validateAIGenShopDesc('normal')"
                    :loading="aiGenLoading"
                  >
                    {{ aiBtnText }}
                  </a-button>
                </a-col>
                <a-col :span="12">
                  <a-button
                    type="primary"
                    @click="validateAIGenShopDesc('stream')"
                    :loading="aiGenLoadingStream"
                  >
                    AI一键生成店铺简介（流式）
                  </a-button>
                </a-col>
              </a-row>
            </a-space>
          </template>
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
  import { ref, reactive, watch, onUnmounted } from 'vue'
  import { useRouter, useRoute } from "vue-router"
  import { getNowCity, placeSearch } from '@api/common'
  import { getCategory, getDetail, addShop, updateShop, genShopDesc } from '@api/shop'
  import { fetchSSEStream } from '@utils/SSE'
  import { Message, Modal } from '@arco-design/web-vue';
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
  const simpleIntroText = ref('')
  const aiGenLoading = ref(false)
  const aiGenLoadingStream = ref(false)
  const aiBtnText = ref('AI一键生成店铺简介')
  let typingTimer = null
  let streamTypewriter = null

  watch(aiGenLoading, (val) => {
    if (val) {
      const text = 'AI正在生成中...'
      let charIdx = 0
      typingTimer = setInterval(() => {
        aiBtnText.value = text.substring(0, charIdx + 1)
        charIdx++
        if (charIdx >= text.length) {
          charIdx = 0
        }
      }, 200)
    } else {
      if (typingTimer) {
        clearInterval(typingTimer)
        typingTimer = null
      }
      aiBtnText.value = 'AI一键生成店铺简介'
    }
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

  // type normal/stream
  function validateAIGenShopDesc (type = 'normal') {
    const conf = {
      normal: {
        loadingVar: aiGenLoading,
        title: '已有关键词内容将被覆盖，确认一键生成店铺简介吗',
        okCB: aiGenShopDesc
      },
      stream: {
        loadingVar: aiGenLoadingStream,
        title: '已有关键词内容将被覆盖，确认流式生成店铺简介吗',
        okCB: aiGenShopDescStream
      }
    }
    const typeConfig = conf[type] ?? {}
    const keyword = `${simpleIntroText.value} ${shopInfo.name}`

    if (typeConfig.loadingVar?.value) return
    if (!simpleIntroText.value) {
      Message.error('请输入店铺简介关键词便于ai生成！')
      return
    }

    const doGenerate = () => {
      shopInfo.intro_text = ''
      typeConfig.okCB(keyword)
    }

    if (shopInfo.intro_text) {
      Modal.confirm({
        title: typeConfig.title,
        okText: '确认',
        okType: 'danger',
        onOk: doGenerate
      })
    } else {
      doGenerate()
    }
  }

  /**
   * 一键生成店铺简介
   */
  async function aiGenShopDesc (keyword) {
    if (!keyword) return

    try {
      aiGenLoading.value = true
      const res = await genShopDesc({
        keyword
      }, {
        needLoading: false,
        timeout: 60 * 1000
      })
      const aiResultDesc = res?.data?.description ?? res?.data?.keyword ?? ''
      shopInfo.intro_text = aiResultDesc
    } catch (err) {
      Message.error(err.message || 'AI 生成失败')
      console.error('AI genShopDesc error:', err)
    } finally {
      aiGenLoading.value = false
    }
  }

  /**
   * 打字机渲染器：按固定节奏消费文本缓冲区，带光标闪烁效果
   * 与数据源解耦——外部只需调用 append 写入、complete 通知结束
   * @param { (text: string) => void } setText 文本回显函数
   * @param { object } options 配置项
   * @returns {{ append: Function, complete: Function, destroy: Function }}
   */
  function createTypewriter (setText, options = {}) {
    const { charDelay = 60, blinkDelay = 500, cursor = '|' } = options

    let fullText = ''        // 收到的完整文本（缓冲区）
    let displayedLength = 0  // 已展示的字符数
    let cursorVisible = true // 光标可见性
    let lastOutputTime = 0   // 上一次输出字符的时间戳
    let isComplete = false   // 数据源是否结束
    let rafId = null
    let finishResolve = null

    const finishPromise = new Promise((resolve) => {
      finishResolve = resolve
    })

    function render () {
      const shown = fullText.substring(0, displayedLength)
      const isFinished = isComplete && displayedLength >= fullText.length
      setText(isFinished ? shown : shown + (cursorVisible ? cursor : ''))
    }

    // 渲染循环：每帧同步展示进度与光标，保证闪烁效果实时生效
    function tick (now) {
      if (displayedLength < fullText.length) {
        // 控制展示节奏：距上次输出满 charDelay 才追加一个字符
        if (now - lastOutputTime >= charDelay) {
          displayedLength += 1
          lastOutputTime = now
        }
        render()
        rafId = requestAnimationFrame(tick)
      } else if (isComplete) {
        // 数据源结束且所有字符已展示，移除光标收尾
        render()
        finishResolve()
      } else {
        // 缓冲区已消费完但数据源未结束，仅同步光标闪烁状态
        render()
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)

    // 光标闪烁：翻转可见性（下一帧渲染时生效）
    const blinkTimer = setInterval(() => {
      cursorVisible = !cursorVisible
    }, blinkDelay)

    return {
      /** 追加新收到的文本到缓冲区 */
      append (text) {
        if (text) fullText += text
      },
      /** 通知数据源结束，返回的 Promise 在全部文字展示完毕后 resolve */
      complete () {
        isComplete = true
        return finishPromise
      },
      /** 销毁：停止渲染与定时器，回显完整文本（去除光标），可重复调用 */
      destroy () {
        clearInterval(blinkTimer)
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
        setText(fullText)
      }
    }
  }

  /**
   * 一键生成店铺简介（流式版）：编排 stream 拉取与打字机回显
   */
  async function aiGenShopDescStream (keyword) {
    if (!keyword) return

    streamTypewriter = createTypewriter((text) => {
      if (text) {
        shopInfo.intro_text = text
      }
    })

    try {
      aiGenLoadingStream.value = true

      await fetchSSEStream(
        `/admin/auth/ai/genShopDesc?keyword=${encodeURIComponent(keyword)}&stream=true`,
        (eventData) => {
          switch (eventData.event) {
            case 'start':
              console.log('AI 开始生成:', eventData.model)
              break
            case 'delta':
              streamTypewriter.append(eventData.text ?? '')
              break
            case 'done':
              console.log('AI 生成完成:', eventData.description)
              return false // 停止读取
            case 'error':
              throw new Error(eventData.msg)
          }
        },
        { credentials: 'include' }
      )

      // 等待打字机把缓冲区剩余内容展示完毕
      await streamTypewriter.complete()
    } catch (err) {
      Message.error(err.message || 'AI 生成失败')
      console.error('AI genShopDescStream error:', err)
    } finally {
      streamTypewriter?.destroy()
      streamTypewriter = null
      aiGenLoadingStream.value = false
    }
  }

  onUnmounted(() => {
    streamTypewriter?.destroy()
    streamTypewriter = null
  })

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
