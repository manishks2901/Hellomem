import axios from "axios";

import Config from "../../config";
const BASE_URL_DYNAMIC = `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}`;


export type LoginResponse = {
  statusCode: number;
  statusMessage: string;
  message: string | null;
  data: string; // JSON string — should be parsed separately into UserData[]
  isAuthorized: boolean;
  token: string;
  errorMessage: string;
};

export type UserData = {
  UserID: number;
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  PhoneNo: string;
  MobileNo: string;
  CountryID: number;
  CountryName: string;
  AddressID: number;
  AddressLineOne: string;
  PostalCode: string;
  StateProvinceID: number;
  CityID: number;
  CityName: string;
  StateName: string;
  ResponseMsg: string;
};

// export type UserAddressResponse = {
//   UserID: number;
//   FirstName: string;
//   LastName: string;
//   EmailAddress: string;
//   PhoneNo: string;
//   MobileNo: string;
//   CountryID: number;
//   CountryName: string;
//   AddressID: number;
//   AddressLineOne: string;
//   PostalCode: string;
//   StateProvinceID: number;
//   CityID: number;
//   CityName: string;
//   StateName: string;
//   ResponseMsg: string;
// };

export type OrderStatus = 'Active' | 'In Progress' | 'Completed';

export type Order = {
  OrderId: number;
  OrderNumber: string;
  OrderDateUTC: string;
  OrderTotal: number;
  LatestStatusName: OrderStatus;
  TotalItems: number;
};

export type OrderItem = {
  OrderItemID: number;
  OrderID: number;
  ProductID: number;
  Quantity: number;
  Price: number;
  ProductName: string;
  IsDigitalProduct: boolean;
  OrderItemTotal: number;
  DefaultImageUrl: string;
  ShippingStatusID: number;
  LatestStatusID: number;
};



export interface ProductImage {
  AttachmentName: string;
  AttachmentURL: string;
  ProductID: number;
}
export type Campaign = {
  CampaignId: number;
  DiscountTitle: string;
  MainTitle: string;
  Body: string;
  IsActive: boolean;
  DisplayStartDate: string; // ISO date string like "2022-08-08T00:00:00"
  DisplayEndDate: string;   // ISO date string
  CoverPictureUrl: string;
};

export type color = {
  ColorID: number;
  ColorName: string;
  HexCode: string;
};
export type Product = {
  ProductId: number;
  ProductName: string;
  ShortDescription: string;
  FullDescription: string;
  Price: number;
  StockQuantity: number;
  IsBoundToStockQuantity: boolean;
  DisplayStockQuantity: boolean;
  MetaTitle: string;
  MetaKeywords: string;
  MetaDescription: string;
  VendorName: string;
  Rating: number;
  TotalReviews: number;
  IsShippingFree: boolean;
  ManufacturerName: string;
  IsReturnAble: boolean;
  MarkAsNew: boolean;
  OrderMaximumQuantity: number;
  OrderMinimumQuantity: number;
  EstimatedShippingDays: number;
  IsDiscountAllowed: boolean;
  CategoryID?: number; // <-- Add this line for category filtering
  ProductImagesJson: {
    AttachmentID: number;
    AttachmentName: string;
    AttachmentURL: string;
    ProductID: number;
    ColorID: number;
  }[];
  ProductColorsJson: color[];
  ProductTagsJson: {
    TagID: number;
    TagName: string;
  }[];
  ProductShipMethodsJson: {
    ShippingMethodID: number;
    ShippingMethodName: string;
  }[];
  // Extra field for selected color
  SelectedColor?: {
    ColorID: number;
    ColorName: string;
    HexCode: string;
  };
};

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
export type CountryList = {
  TotalRecords: number;
  CountryID: number;
  CountryName: string;
  IsActive: boolean;
  DisplaySeqNo: number;
  MetaTitle: string;
  MetaKeywords: string;
  MetaDescription: string;
  CreatedOn: string; // or Date if you parse it
  CreatedBy: number;
};

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

export type StateProvince = {
  StateProvinceID: number;
  StateName: string;
};

const data_GET_ALL_PRODUCTS = JSON.stringify({
  requestParameters: {
    SearchTerm: null,
    SizeID: "",
    ColorID: null,
    CategoryID: "0",
    TagID: "",
    ManufacturerID: "",
    MinPrice: null,
    MaxPrice: null,
    Rating: null,
    OrderByColumnName: "",
    PageNo: 1,
    PageSize: 100,
    recordValueJson: "[]",
  },
});
const config_GET_ALL_PRODUCTS = {
  method: "post",
  maxBodyLength: Infinity,
  url: `${BASE_URL_DYNAMIC}${Config.END_POINT_NAMES.GET_All_PRODUCTS}`,
  headers: {
    "Content-Type": "application/json",
  },
  data: data_GET_ALL_PRODUCTS,
};

export const GET_ALL_PRODUCTS = async (): Promise<Product[]> => {
  const response = await axios.request<{ data: string }>(
    config_GET_ALL_PRODUCTS
  );
  return JSON.parse(response.data?.data || "[]");
};
const data_GET_CATEGORY_LIST = JSON.stringify({
  requestParameters: {
    PageNo: 1,
    PageSize: 100,
    recordValueJson: "[]",
  },
});

const config_GET_ALL_CATEGORY = {
  method: "post",
  maxBodyLength: Infinity,
  url: `${BASE_URL_DYNAMIC}${Config.END_POINT_NAMES.GET_CATEGORIES_LIST}`,
  headers: {
    "Content-Type": "application/json",
  },
  data: data_GET_CATEGORY_LIST,
};

export const GET_CATEGORY_LIST = async (): Promise<Category[]> => {
  const response = await axios.request<{ data: string }>(
    config_GET_ALL_CATEGORY
  );
  return JSON.parse(response.data?.data || "[]");
};
const data_POPULAR_CATEGORY = JSON.stringify({
  requestParameters: {
    recordValueJson: "[]",
  },
});

const config_POPULAR_CATEGORY = {
  method: "post",
  maxBodyLength: Infinity,
  url: `${BASE_URL_DYNAMIC}${Config.END_POINT_NAMES.GET_POPULAR_CATEGORIES}`,
  headers: {
    "Content-Type": "application/json",
  },
  data: data_POPULAR_CATEGORY,
};

export const POPULAR_CATEGORY = async (): Promise<PopularCategory[]> => {
  const response = await axios.request<{ data: string }>(
    config_POPULAR_CATEGORY
  );
  console.log(JSON.parse(response.data?.data || "[]"));
  return JSON.parse(response.data?.data || "[]");
};

const dataBanner = JSON.stringify({
  requestParameters: {
    recordValueJson: "[]",
  },
});

const configBanner = {
  method: "post",
  maxBodyLength: Infinity,
  url: `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}${Config.END_POINT_NAMES.GET_HOME_SCREEN_BANNER}`,
  headers: {
    "Content-Type": "application/json",
  },
  data: dataBanner,
};

export const GET_BANNER = async (): Promise<Banner[]> => {
  const response = await axios.request<{ data: string }>(configBanner);
  return JSON.parse(response.data.data);
};

const dataRecent = JSON.stringify({
  requestParameters: {
    PageNo: 1,
    PageSize: 20,
    TabName: "new products",
    recordValueJson: "[]",
  },
});

const configRecentData = {
  method: "post",
  maxBodyLength: Infinity,
  url: `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}${Config.END_POINT_NAMES.GET_RECENTS_PRODUCTS_LIST}`,
  headers: {
    "Content-Type": "application/json",
  },
  data: dataRecent,
};

export const GET_RECENTS_PRODUCTS_LIST = async (): Promise<Product[]> => {
  const response = await axios.request<{ data: string }>(configRecentData);
  return JSON.parse(response.data.data);
};

const data_Country_list = JSON.stringify({
  requestParameters: {
    recordValueJson: "[]",
  },
});

const config_country_list = {
  method: "post",
  maxBodyLength: Infinity,
  url: `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}${Config.END_POINT_NAMES.GET_COUNTRIES_LIST}`,
  headers: {
    "Content-Type": "application/json",
  },
  data: data_Country_list,
};

export const GET_COUNTRIES_LIST = async (): Promise<CountryList[]> => {
  const response = await axios.request<{ data: string }>(config_country_list);
  return JSON.parse(response.data.data);
};
export const GET_STATE_LIST = async (
  countryId: string
): Promise<StateProvince[]> => {
  const response = await axios.post(
    `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}${Config.END_POINT_NAMES.GET_STATES_PROVINCES_LIST}`,
    { requestParameters: { CountryId: countryId, recordValueJson: "[]" } }
  );

  return JSON.parse(response.data.data);
};

export const GET_PRODUCT_DETAIL = async (
  productId: string
): Promise<Product> => {
  const response = await axios.post(
    `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}${Config.END_POINT_NAMES.GET_PRODUCT_DETAIL}`,
    { requestParameters: { ProductId: productId, recordValueJson: "[]" } },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return JSON.parse(response.data.data);
};

export const GET_RELATED_PRODUCTS_LIST = async (
  productId: string
): Promise<Product[]> => {
  const response = await axios.post(
    `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}${Config.END_POINT_NAMES.GET_RELATED_PRODUCTS_LIST}`,
    {
      requestParameters: {
        ProductId: productId,
        PageNo: 1,
        PageSize: 20,
        recordValueJson: "[]",
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return JSON.parse(response.data.data);
};


const dataCampaign = JSON.stringify({
  "requestParameters": {
    "recordValueJson": "[]"
  }
});


const configCampaign = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}${Config.END_POINT_NAMES.GET_WEB_CAMPAIGN_LIST}`,
  headers: { 
    'Content-Type': 'application/json'
  },
  data : dataCampaign
};

export const GET_CAMPAIGN_LIST = async (): Promise<Campaign[]> => {
  const response = await axios.request(configCampaign)
  return JSON.parse(response.data.data);
};



export const GET_URER_DETAIL = async(email: string, password: string): Promise<LoginResponse> => {
  // Example usage of password parameter (replace with actual implementation)
  // Here, both email and password are sent in the request body
  const response = await axios.post(
    `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}${Config.END_POINT_NAMES.GET_USER_LOGIN}`,
    { requestParameters: { Email: email, Password: password, recordValueJson: "[]" } },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response.data)
  return response.data;
};


export const GET_CUSTOME_ORDER_HISTORY_DETAIL_MASTER = async (userid: number): Promise<Order[]> => {
  const response = await axios.post(
    `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}${Config.END_POINT_NAMES.GET_CUSTOMER_ORDER_HISTORY_MASTER}`,
    {
      requestParameters: {
        userId: userid,
        recordValueJson: [],
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );


  return JSON.parse(response.data.data) 
};
export const GET_CUSTOME_ORDER_HISTORY_DETAIL = async (orderid: number): Promise<OrderItem> => {
  const response = await axios.post(
    `${Config.ADMIN_BASE_URL}${Config.DYNAMIC_METHOD_SUB_URL}${Config.END_POINT_NAMES.GET_CUSTOME_ORDER_HISTORY_DETAIL}`,
    {
      requestParameters: {
        OrderId: orderid,
        recordValueJson: [],
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );


  return JSON.parse(response.data.data)
};


