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

<script setup lang="ts">
  import { ref, reactive, watch, onUnmounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { getNowCity, placeSearch } from '@api/common'
  import { getCategory, getDetail, addShop, updateShop, genShopDesc } from '@api/shop'
  import { fetchSSEStream } from '@utils/SSE'
  import { Message, Modal } from '@arco-design/web-vue'
  import ImgUpload from '@components/ImgUpload/index.vue'

  interface PlaceOption {
    address: string
    title: string
    location: { lat: string; lng: string }
  }

  interface CityInfo {
    name: string
    [key: string]: any
  }

  interface DiscountItem {
    total_val: number
    discount_val: number
  }

  interface ShopInfo {
    name: string
    address: string
    pos: { lat: string; lng: string }
    phone: string
    intro_text: string
    shop_mark: string
    category: string
    delivery_fee: number
    mini_delivery_price: number
    open_time: string[]
    shop_image: Record<string, string>
    has_discount: boolean
    discount_Arr: DiscountItem[]
    [key: string]: any
  }

  interface TypewriterOptions {
    charDelay?: number
    blinkDelay?: number
    cursor?: string
  }

  interface Typewriter {
    append: (text: string) => void
    complete: () => Promise<void>
    destroy: () => void
  }

  const router = useRouter()
  const route = useRoute()
  const isDisabled = Boolean(route.query.view || false)
  const shopId = Number(route.query.id || '')
  const searchControl = reactive<{
    searchText: string
    loading: boolean
    option: PlaceOption[]
    total: number
    pageNum: number
  }>({
    searchText: '',
    loading: false,
    option: [],
    total: 0,
    pageNum: 1
  })
  const picFileList = reactive<Record<string, Array<{ name?: string; url: string }>>>({
    avatar: [],
    business_licence: [],
    food_licence: []
  })
  let cityInfo: CityInfo = { name: '' }
  const categoryOptions = ref<any[]>([])

  let shopInfo = reactive<ShopInfo>({
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
  let typingTimer: ReturnType<typeof setInterval> | null = null
  let streamTypewriter: Typewriter | null = null

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

  const addDiscount = (index: number) => {
    shopInfo.discount_Arr.splice(index + 1, 0, {
      total_val: 0,
      discount_val: 0
    })
  }

  const deleteDiscount = (index: number) => {
    shopInfo.discount_Arr.splice(index, 1)
  }

  async function handleSearch(val?: string) {
    searchControl.loading = true
    if (val) searchControl.searchText = val
    if (val && val !== shopInfo.address) searchControl.pageNum = 1

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

  function controlSearchPage(nowPage: number) {
    searchControl.pageNum = nowPage
    handleSearch()
  }

  function searchChange(val: string) {
    for (const item of searchControl.option) {
      if (item.address + ' ' + item.title === val) {
        shopInfo.pos.lat = item.location.lat
        shopInfo.pos.lng = item.location.lng
      }
    }
  }

  function imgUploadFinish(data: { url?: string }, type: string) {
    if (shopInfo.shop_image[type] !== undefined) {
      shopInfo.shop_image[type] = data.url || ''
    }
  }

  function removeImg(_file: any, type: string) {
    if (shopInfo.shop_image[type] !== undefined) {
      shopInfo.shop_image[type] = ''
    }
  }

  async function handleSubmit(data: any) {
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

  function filterCategory(data: any[], res: any[], level: number): any[] {
    for (const item of data) {
      if (item.id !== undefined && item.level === level) {
        const { sub_categories = [], ...rest } = item
        if (sub_categories.length) {
          level++;
          (rest as any).children = filterCategory(sub_categories, [], level)
          level--;
          res.push(rest)
        } else {
          res.push(item)
        }
      }
    }
    return res
  }

  function validateAIGenShopDesc(type: 'normal' | 'stream' = 'normal') {
    const conf: Record<string, { loadingVar: any; title: string; okCB: (keyword: string) => void }> = {
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
    const typeConfig = conf[type] ?? { loadingVar: ref(false), title: '', okCB: () => {} }
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
        content: '',
        okText: '确认',
        onOk: doGenerate
      })
    } else {
      doGenerate()
    }
  }

  async function aiGenShopDesc(keyword: string) {
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
    } catch (err: any) {
      Message.error(err.message || 'AI 生成失败')
      console.error('AI genShopDesc error:', err)
    } finally {
      aiGenLoading.value = false
    }
  }

  function createTypewriter(setText: (text: string) => void, options: TypewriterOptions = {}): Typewriter {
    const { charDelay = 60, blinkDelay = 500, cursor = '|' } = options

    let fullText = ''
    let displayedLength = 0
    let cursorVisible = true
    let lastOutputTime = 0
    let isComplete = false
    let rafId: number | null = null
    let finishResolve: (() => void) | null = null

    const finishPromise = new Promise<void>((resolve) => {
      finishResolve = resolve
    })

    function render() {
      const shown = fullText.substring(0, displayedLength)
      const isFinished = isComplete && displayedLength >= fullText.length
      setText(isFinished ? shown : shown + (cursorVisible ? cursor : ''))
    }

    function tick(now: number) {
      if (displayedLength < fullText.length) {
        if (now - lastOutputTime >= charDelay) {
          displayedLength += 1
          lastOutputTime = now
        }
        render()
        rafId = requestAnimationFrame(tick)
      } else if (isComplete) {
        render()
        finishResolve?.()
      } else {
        render()
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)

    const blinkTimer = setInterval(() => {
      cursorVisible = !cursorVisible
    }, blinkDelay)

    return {
      append(text: string) {
        if (text) fullText += text
      },
      complete() {
        isComplete = true
        return finishPromise
      },
      destroy() {
        clearInterval(blinkTimer)
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
        setText(fullText)
      }
    }
  }

  async function aiGenShopDescStream(keyword: string) {
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
        (eventData: any) => {
          switch (eventData.event) {
            case 'start':
              console.log('AI 开始生成:', eventData.model)
              break
            case 'delta':
              streamTypewriter!.append(eventData.text ?? '')
              break
            case 'done':
              console.log('AI 生成完成:', eventData.description)
              return false
            case 'error':
              throw new Error(eventData.msg)
          }
        },
        { credentials: 'include' }
      )

      await streamTypewriter.complete()
    } catch (err: any) {
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

  async function preGetDetail() {
    if (shopId) {
      const res = await getDetail({ id: shopId })
      const shop_image = res.data.shop_image
      shopInfo = Object.assign(shopInfo, res.data)
      Object.keys(shop_image).forEach((key: string) => {
        picFileList[key].push({
          name: shop_image[key].split('/').pop(),
          url: shop_image[key]
        })
      })
    }
  }

  async function init() {
    preGetDetail()
    getNowCity().then(({ data }) => {
      cityInfo = data
    })
    const categoryTemp = await getCategory()
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
