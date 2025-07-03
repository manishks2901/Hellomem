import axios from "axios";

import Config from "../../config";
const BASE_URL_DYNAMIC = `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}`
export interface ProductImage {
  AttachmentName: string;
  AttachmentURL: string;
  ProductID: number;
}

export interface Product {
  TotalRecords: number;
  ProductImagesJson: ProductImage[];
  ProductColorsJson: any; // Replace `any` with actual structure if known
  ProductSizesJson: any;
  ProductTagsJson: any;
  ProductShipMethodsJson: any;
  Rating: number;
  TotalReviews: number | null;
  Quantity: number;
  DiscountId: number | null;
  DiscountedPrice: number | null;
  OrderItemDiscount: number | null;
  ItemSubTotal: number | null;
  IsDiscountCalculated: boolean | null;
  CouponCode: string | null;
  VendorName: string | null;
  ManufacturerName: string | null;
  CategoryID: number;
  ColorId: number | null;
  SizeId: number | null;
  CategoryName: string;
  DiscEndDate: string | null;
  ProductAllSelectedAttributes: string | null;
  ProductId: number;
  ProductName: string;
  ShortDescription: string | null;
  FullDescription: string | null;
  VendorId: number;
  ManufacturerId: number | null;
  MetaTitle: string | null;
  MetaKeywords: string | null;
  MetaDescription: string | null;
  Price: number;
  OldPrice: number | null;
  IsTaxExempt: boolean | null;
  IsShippingFree: boolean | null;
  EstimatedShippingDays: number | null;
  ShippingCharges: number | null;
  ShowOnHomePage: boolean | null;
  AllowCustomerReviews: boolean | null;
  ProductViewCount: number | null;
  ProductSalesCount: number | null;
  IsReturnAble: boolean | null;
  IsDigitalProduct: boolean | null;
  IsDiscountAllowed: boolean;
  SellStartDatetimeUtc: string | null;
  SellEndDatetimeUtc: string | null;
  Sku: string | null;
  CreatedOn: string;
  CreatedBy: string | null;
  ModifiedOn: string | null;
  ModifiedBy: string | null;
  WarehouseId: number | null;
  InventoryMethodId: number | null;
  StockQuantity: number;
  IsBoundToStockQuantity: boolean | null;
  DisplayStockQuantity: number | null;
  OrderMinimumQuantity: number | null;
  OrderMaximumQuantity: number | null;
  MarkAsNew: boolean | null;
  DisplaySeqNo: number | null;
  IsActive: boolean;
}


export interface LocalizationData {
  langId: number;
  text: string;
}

export interface Category {
  TotalRecords: number;
  CategoryID: number;
  Name: string;
  ParentCategoryID?: number;
  IsActive: boolean;
  AttachmentID?: number;
  CreatedOn: string;
  CreatedBy: number;
  ModifiedOn?: string;
  ModifiedBy?: number;
  ParentCategoryName?: string;
  LocalizationJsonData?: LocalizationData[];
  LocalizationJsonDataParent?: LocalizationData[];
}
export interface LocalizationData {
  langId: number;
  text: string;
}

export interface Size {
  SizeID: number;
  Name: string;
  ShortName: string;
  Inches: number;
  Centimeters: number;
  IsActive: boolean;
  DisplaySeqNo: number;
  CreatedOn: string;
  CreatedBy: number;
  ModifiedOn?: string;
  ModifiedBy?: number;
  LocalizationJsonData: LocalizationData[];
}

export interface LocalizationData {
  langId: number;
  text: string;
}

export interface PopularCategory {
  CategoryID: number;
  ParentCategoryID: number;
  Name: string;
  AttachmentURL: string;
  AttachmentName: string;
  LocalizationJsonData: LocalizationData[];
  TotalProducts: number;
}

export interface GetPopularCategoriesResponse {
  statusCode: number;
  statusMessage: string;
  message: string | null;
  data: PopularCategory[];
  isAuthorized: boolean;
  token: string | null;
  errorMessage: string | null;
}

export interface Banner {
  BannerID: number;
  TopTitle: string;
  MainTitle: string;
  BottomTitle: string;
  LeftButtonText: string;
  LeftButtonUrl: string;
  RightButtonText: string;
  RightButtonUrl: string;
  AttachmentID: number;
  IsActive: boolean;
  DisplaySeqNo: number;
  ThemeTypeID: number;
  CreatedOn: string; // or Date, if you parse it
  CreatedBy: number;
  ModifiedOn?: string; // optional since some entries may not have it
  ModifiedBy?: number;
  BannerImgUrl: string;
}





const data_GET_ALL_PRODUCTS = JSON.stringify({
  "requestParameters": {
    "SearchTerm": null,
    "SizeID": "",
    "ColorID": null,
    "CategoryID": "0",
    "TagID": "",
    "ManufacturerID": "",
    "MinPrice": null,
    "MaxPrice": null,
    "Rating": null,
    "OrderByColumnName": "",
    "PageNo": 1,
    "PageSize": 100,
    "recordValueJson": "[]"
  }
});
const config_GET_ALL_PRODUCTS = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${BASE_URL_DYNAMIC}${Config.END_POINT_NAMES.GET_ALL_PRODUCTS}`,
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data_GET_ALL_PRODUCTS
};

export const GET_ALL_PRODUCTS = async (): Promise<Product[]> => {
  const response = await axios.request<{ data: string }>(config_GET_ALL_PRODUCTS);
  return JSON.parse(response.data?.data || "[]");
}
const data_GET_CATEGORY_LIST = JSON.stringify({
  "requestParameters": {
    "PageNo": 1,
    "PageSize": 100,
    "recordValueJson": "[]"
  }
});

const config_GET_ALL_CATEGORY = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${BASE_URL_DYNAMIC}${Config.END_POINT_NAMES.GET_CATEGORIES_LIST}`,
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data_GET_CATEGORY_LIST
};

export const GET_CATEGORY_LIST = async():Promise<Category[]> =>{
  const response = await axios.request<{data:string}>(config_GET_ALL_CATEGORY);
  return JSON.parse(response.data?.data || "[]");
}
const data_POPULAR_CATEGORY = JSON.stringify({
  "requestParameters": {
    "recordValueJson": "[]"
  }
});

const config_POPULAR_CATEGORY = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${BASE_URL_DYNAMIC}${Config.END_POINT_NAMES.GET_POPULAR_CATEGORIES}`,
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data_POPULAR_CATEGORY
};

export const POPULAR_CATEGORY = async (): Promise<PopularCategory[]> => {
  const response = await axios.request<{ data: string }>(config_POPULAR_CATEGORY);
  console.log(JSON.parse(response.data?.data || "[]"))
  return JSON.parse(response.data?.data || "[]");
}

const dataBanner = JSON.stringify({
  "requestParameters": {
    "recordValueJson": "[]"
  }
});

const configBanner = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}${Config.END_POINT_NAMES.GET_HOME_SCREEN_BANNER}`,
  headers: { 
    'Content-Type': 'application/json'
  },
  data : dataBanner
};


export const GET_BANNER = async ():Promise<Banner[]> => {
  const response = await axios.request<{ data: string }>(configBanner);
  return JSON.parse(response.data.data)
}

const dataRecent = JSON.stringify({
  "requestParameters": {
    "PageNo": 1,
    "PageSize": 20,
    "TabName": "new products",
    "recordValueJson": "[]"
  }
});

const configRecentData = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}${Config.END_POINT_NAMES.GET_RECENTS_PRODUCTS_LIST}`,
  headers: { 
    'Content-Type': 'application/json'
  },
  data : dataRecent
};

export const GET_RECENTS_PRODUCTS_LIST = async ():Promise<Product[]> => {
  const response = await axios.request<{ data: string }>(configRecentData);
  return JSON.parse(response.data.data)
}