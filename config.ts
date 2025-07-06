const Config = {
    // ADMIN_BASE_URL: 'https://localhost:7149/',
    ADMIN_BASE_URL: 'http://noornashad-001-site2.etempurl.com/',
    // ADMIN_BASE_URL: 'https://admin.hellomem.com/',

    DYNAMIC_METHOD_SUB_URL: 'api/v1/dynamic/dataoperation/',
    COMMON_CONTROLLER_SUB_URL: 'api/v1/common/',
    SITE_TTILE: 'Hello Mem',

    END_POINT_NAMES: {
        GET_SIZE_LIST: 'get-size-list',
        GET_CATEGORIES_LIST: 'get-categories-list',
        GET_RECENTS_PRODUCTS_LIST: 'get-recents-products-list',
        GET_POPULAR_PRODUCTS_LIST: 'get-popular-products-list',
        GET_RELATED_PRODUCTS_LIST: 'get-related-products-list',
        GET_POPULAR_CATEGORIES: 'get-popular-categories',
        GET_PAYMENT_METHODS: 'get-payment-methods',
        GET_COLORS_LIST: 'get-colors-list',
        INSERT_PRODUCT_REVIEW: 'insert-product-review',
        SIGNUP_USER: 'signup-user',
        CREATE_VENDOR_REQUEST: 'create-vendor-request',
        CONTACT_US: 'contact-us',
        GET_USER_LOGIN: 'get-user-login',
        INSERT_SUBSCRIBER: 'insert-subscriber',
        GET_PRODUCT_REVIEWS: 'get-product-reviews',
        GET_MANUFACTURER_LIST: 'get-manufacturer-list',
        GET_TAGS_LIST: 'get-popular-tags',
        GET_All_PRODUCTS: 'get-all-products',
        GET_PRODUCT_DETAIL: 'get-product_detail',
        GET_COUNTRIES_LIST: 'get-countries-list',
        GET_CITIES_LIST: 'get-cities-list',
        GET_STATES_PROVINCES_LIST: 'get-states-provinces-list',
        GET_PRODUCTS_LIST_BY_IDS: 'get-products-list-by-ids',
        POST_CUSTOMER_ORDER: 'post-order/post-customer-order',
        GET_HOME_SCREEN_BANNER: 'get-home-screen-banner',
        UPDATE_PROFILE: 'update-profile',
        GET_WEB_CAMPAIGN_LIST: 'get-web-campaign-list',
        GET_WEB_CAMPAIGN_DETAIL: 'get-web-campaign-detail',
        GET_CUSTOMER_ORDER_HISTORY_MASTER: 'get-customer-order-history-master',
        GET_CUSTOME_ORDER_HISTORY_DETAIL: 'get-customer-order-history-detail',
        VALIDATE_EMAIL_SEND_OTP: 'validate-email-send-otp',
        VALIDATE_OTP_CHANGE_PASSWORD: 'validate-otp-change-password',
        GET_STRP_PUB_KEY: 'get-strp-pub-key',
        GET_WEBSITE_LOGO: 'get-website-logo',
        GET_PRODUCT_ALL_ATTRIBUTES_BY_ID: 'get-product-all-attributes-by-productId',
        GET_CUSTOMER_CART_ITEMS: 'get-customer-cart-items/cart-data',
        GET_COUPON_CODE_DISCOUNT: 'get-coupon-code-discount-value/calculate-coupon-discount',
        GET_LOCALIZATION_CSTM_PORTAL: 'localization-cstm-portal/get-localization-data',
        EN_UR_DROW_PASS_RNDOM: 'en-ur-drow-pass-rndom/en-ur-drow-pass-rndom',
        DOWNLOAD_DIGITAL_FILE: 'download-digital-file',
        GET_LATEST_HOT_PRODUCT: 'get-latest-hot-product',
        GET_CUSTOMER_FAVOURITE_PRODUCTS: 'get-customer-favourite-products'
    },

    ORDER_STATUS: {
        Active: 1,
        InProgress: 2,
        Completed: 3,
        Returned: 4,
        Refunded: 5
       
    },

    APP_SETTING : {
        DefaultCurrencyCode: "USD",
        DefaultCurrencySymbol: "$"
    },

    PRODUCT_ATTRIBUTE_TYPES_ENUM : {
        FixedValue: 1,
        Percentage: 2
    },
    PRODUCT_ATTRIBUTE_ENUM : {
        Color: 1,
        Size: 2
    },

    LANG_CODES_ENUM : {
        English: "en",
        Arabic: "ar"
    },
    
    LANG_CODES_IDS_ENUM : {
        English: 1,
        Arabic: 2
    }
    
}
export default Config;