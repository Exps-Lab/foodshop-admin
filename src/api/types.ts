// 基础响应类型
export interface BaseResponse<T = any> {
  code: number
  data: T
  message?: string
}

// 分页响应
export interface PageResponse<T> {
  list: T[]
  total: number
}

// ========== Common ==========
export interface CommonInfo {
  [key: string]: any
}

export interface UploadTokenData {
  token: string
  domain?: string
}

export interface CityInfo {
  city: string
  [key: string]: any
}

export interface PlaceSearchParams {
  keyword?: string
  city?: string
  [key: string]: any
}

// ========== Login ==========
export interface LoginParams {
  username: string
  password: string
  [key: string]: any
}

export interface LoginResult {
  token?: string
  [key: string]: any
}

// ========== Menu ==========
export interface MenuParams {
  id?: number | string
  [key: string]: any
}

export interface MenuItem {
  id: number | string
  name: string
  [key: string]: any
}

export interface RoleItem {
  id: number | string
  name: string
  [key: string]: any
}

// ========== Shop ==========
export interface ShopCategory {
  id: number | string
  name: string
  [key: string]: any
}

export interface ShopParams {
  page?: number
  pageSize?: number
  [key: string]: any
}

export interface ShopItem {
  id: number | string
  name: string
  [key: string]: any
}

export interface ShopDetail extends ShopItem {
  [key: string]: any
}

export interface GenShopDescParams {
  [key: string]: any
}

// ========== Goods ==========
export interface GoodsCategoryParams {
  [key: string]: any
}

export interface GoodsCategoryItem {
  id: number | string
  name: string
  [key: string]: any
}

export interface GoodsParams {
  page?: number
  pageSize?: number
  [key: string]: any
}

export interface GoodsItem {
  id: number | string
  name: string
  [key: string]: any
}

export interface GoodsDetail extends GoodsItem {
  [key: string]: any
}

// ========== Coupon ==========
export interface CouponParams {
  page?: number
  pageSize?: number
  [key: string]: any
}

export interface CouponItem {
  id: number | string
  name: string
  [key: string]: any
}

export interface CouponDetail extends CouponItem {
  [key: string]: any
}
