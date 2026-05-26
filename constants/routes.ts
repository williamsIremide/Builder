import { URLParamType, URLResourceType } from "./types/utilTypes";

export const productName = "RetailBox";
export const baseURL = `${productName.toLowerCase()}.co`;
export const BACKEND_BASE_URL = "http://localhost:8000";
export const sloganOrMotto = "Providing retail solutions in Nigeria.";
export const DEFAULT_PAGE_SIZE = 42;
const API_BASE = "api/v1";

export const contactInfo = {
  emailAddress: {
    label: "Email",
    value: `hello@${baseURL}`,
    description: "Mail us at the address below",
  },
  phoneNumber: {
    label: "Phone",
    value: "+234 912 345 6789",
    description: "Call us at the number below",
  },
  officeAddress: {
    label: "Lagos, Nigeria",
    value: "Lagos, Nigeria",
    description: "Visit our office at the address below",
  },
};

export const socialLinks = {
  linktree: {
    name: "Linktree",
    link: "https://linktr.ee/theretailbox",
    description: "Check our links on Linktree",
  },
  facebook: {
    name: "Facebook",
    link: "https://www.facebook.com/theretailbox",
    description: "Follow us on Facebook",
  },
  twitter: {
    name: "Twitter",
    link: "https://x.com/theretailbox",
    description: "Follow us on Twitter",
  },
  instagram: {
    name: "Instagram",
    link: "https://www.instagram.com/theretailbox",
    description: "Follow us on Instagram",
  },
  linkedin: {
    name: "LinkedIn",
    link: "https://www.linkedin.com/company/theretailbox",
    description: "Connect with us on LinkedIn",
  },
  whatsapp: {
    name: "WhatsApp",
    link: "https://wa.me/+2349163197595", // https://wa.me/message/FKPG2K3FNFGLD1
    description: "Message us on WhatsApp",
  },
  telegram: {
    name: "Telegram",
    link: "https://t.me/theretailbox",
    description: "Message us on Telegram",
  },
  github: {
    name: "GitHub",
    link: "https://github/theretailbox",
    description: "Follow us on GitHub",
  },
  youtube: {
    name: "YouTube",
    link: "https://www.youtube.com/dummy",
    description: "Subscribe to our YouTube channel",
  },
  pinterest: {
    name: "Pinterest",
    link: "https://www.pinterest.com/dummy",
    description: "Follow us on Pinterest",
  },
  tiktok: {
    name: "TikTok",
    link: "https://www.tiktok.com/@dummy",
    description: "Follow us on TikTok",
  },
};

export const API_ROUTES: {
  [key in URLResourceType]: string;
} = {
  cards: `${API_BASE}/cards`,
  carts: `${API_BASE}/carts`,
  entity: `${API_BASE}/branch-entity`,
  order: `${API_BASE}/orders`,
  collection: `${API_BASE}/collections`,
  apiKeys: `${API_BASE}/api-keys`,
  inventoryCategory: `${API_BASE}/category/inventory-categories`,
  variantCategory: `${API_BASE}/category/variant-categories`,
  expenseCategory: `${API_BASE}/category/expense-categories`,
  inventory: `${API_BASE}/inventory`,
  item: `${API_BASE}/branch-items`,
  retailStore: `${API_BASE}/retail-store`,
  storefront: `${API_BASE}/storefront`,
  storefrontPage: `${API_BASE}/storefront-pages`,
  branch: `${API_BASE}/branches`,
  deduction: `${API_BASE}/deduction`,
  variant: `${API_BASE}/variants`,
  expense: `${API_BASE}/branch-expenses`,
  user: `${API_BASE}/users`,
  agent: `${API_BASE}/branch-agents`,
  expenseSettlements: `${API_BASE}/expense-settlements`,
};

export const apiEndpoints = {
  auth: {
    signUp: {
      backendURL: `${BACKEND_BASE_URL}/api/v1/users/signup/`,
      route: "/api/userMgt/signup",
      requestMethod: "POST",
    },
    login: {
      backendURL: `${BACKEND_BASE_URL}/api/v1/users/login/`,
      route: "/api/userMgt/auth",
      requestMethod: "POST",
    },
    forgotPassword: {
      backendURL: `${BACKEND_BASE_URL}/api/v1/users/password_reset/`,
      route: "/api/userMgt/change-password",
      requestMethod: "POST",
    },
    logout: {
      backendURL: `${BACKEND_BASE_URL}/logout/`,
      route: "/api/auth/logout",
      requestMethod: "POST",
    },
  },
  generateApiEndpointsWithType: (resource: URLResourceType) => {
    const generateBackendURL = (
      type: URLParamType,
      id?: string,
      action?: string,
    ) =>
      `${BACKEND_BASE_URL}/${API_ROUTES[resource]}/${getBackendPath(type)}${
        id ? `/${id}` : ""
      }${action ? `/${action}` : ""}/`;

    const generateRoute = (
      type: URLParamType,
      id?: string,
      extraParams: Record<string, string> = {},
    ) => {
      const params = new URLSearchParams({
        resource,
        type,
        ...(id && { id }),
        ...extraParams,
      });
      return `/api/general2/?${params}`;
    };

    return {
      list: {
        backendURL: (type: URLParamType) => generateBackendURL(type),
        route: (type: URLParamType) => generateRoute(type),
        requestMethod: "GET",
      },
      create: {
        backendURL: (type: URLParamType) => generateBackendURL(type),
        route: (type: URLParamType) => generateRoute(type),
        requestMethod: "POST",
      },
      retrieve: {
        backendURL: (type: URLParamType, id: string) =>
          generateBackendURL(type, id),
        route: (type: URLParamType, id: string) => generateRoute(type, id),
        requestMethod: "GET",
      },
      update: {
        backendURL: (type: URLParamType, id: string) =>
          generateBackendURL(type, id),
        route: (type: URLParamType, id: string) => generateRoute(type, id),
        requestMethod: "PATCH",
      },
      delete: {
        backendURL: (type: URLParamType, id: string) =>
          generateBackendURL(type, id),
        route: (type: URLParamType, id: string) => generateRoute(type, id),
        requestMethod: "DELETE",
      },
      restore: {
        backendURL: (type: URLParamType, id: string | number) =>
          generateBackendURL(type, id.toString(), "restore"),
        route: (type: URLParamType, id: string | number) =>
          generateRoute(type, id.toString(), { restore: "true" }),
        requestMethod: "POST",
      },
      bulkCreate: {
        backendURL: (type: URLParamType) =>
          generateBackendURL(type, undefined, "bulk_create"),
        route: (type: URLParamType) =>
          generateRoute(type, undefined, { bulk_create: "true" }),
        requestMethod: "POST",
      },
      bulkDelete: {
        backendURL: (type: URLParamType) =>
          generateBackendURL(type, undefined, "bulk_delete"),
        route: (type: URLParamType) =>
          generateRoute(type, undefined, { bulk_delete: "true" }),
        requestMethod: "POST",
      },
    };
  },
  generateApiEndpointsWithoutType: (resource: URLResourceType) => {
    return {
      list: {
        backendURL: `${BACKEND_BASE_URL}/${API_ROUTES[resource]}/`,
        route: `/api/general2/?resource=${resource}`,
        requestMethod: "GET",
      },
      create: {
        backendURL: `${BACKEND_BASE_URL}/${API_ROUTES[resource]}/`,
        route: `/api/general2/?resource=${resource}`,
        requestMethod: "POST",
      },
      retrieve: {
        backendURL: (id: string | number) =>
          `${BACKEND_BASE_URL}/${API_ROUTES[resource]}/${id}/`,
        route: (id: string | number) =>
          `/api/general2/?resource=${resource}&id=${id}`,
        requestMethod: "GET",
      },
      update: {
        backendURL: (id: string | number) =>
          `${BACKEND_BASE_URL}/${API_ROUTES[resource]}/${id}/`,
        route: (id: string | number) =>
          `/api/general2/?resource=${resource}&id=${id}`,
        requestMethod: "PATCH",
      },
      delete: {
        backendURL: (id: string | number) =>
          `${BACKEND_BASE_URL}/${API_ROUTES[resource]}/${id}/`,
        route: (id: string | number) =>
          `/api/general2/?resource=${resource}&id=${id}`,
        requestMethod: "DELETE",
      },
      restore: {
        backendURL: (id: string | number) =>
          `${BACKEND_BASE_URL}/${API_ROUTES[resource]}/${id}/restore/`,
        route: (id: string | number) =>
          `/api/general2/?resource=${resource}&id=${id}&restore=true`,
        requestMethod: "POST",
      },
      bulkCreate: {
        backendURL: `${BACKEND_BASE_URL}/${API_ROUTES[resource]}/bulk_create/`,
        route: `/api/general2/?resource=${resource}&bulk_create=true`,
        requestMethod: "POST",
      },
      bulkDelete: {
        backendURL: `${BACKEND_BASE_URL}/${API_ROUTES[resource]}/bulk_delete/`,
        route: `/api/general2/?resource=${resource}&bulk_delete=true`,
        requestMethod: "POST",
      },
    };
  },
};

const getBackendPath = (type: URLParamType): string => {
  switch (type) {
    case "tax":
      return "branch-taxes";
    case "discount":
      return "branch-discounts";
    case "loyalty":
      return "loyalty-cards";
    case "gift":
      return "gift-cards";
    default:
      return type;
  }
};

export const orderEndpoints =
  apiEndpoints.generateApiEndpointsWithType("order");
export const entityEndpoints =
  apiEndpoints.generateApiEndpointsWithType("entity");
export const deductionEndpoints =
  apiEndpoints.generateApiEndpointsWithType("deduction");
export const cardsEndpoints =
  apiEndpoints.generateApiEndpointsWithType("cards");
export const expenseEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("expense");
export const userEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("user");
export const agentEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("agent");
export const apiKeysEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("apiKeys");
export const storefrontEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("storefront");
export const storefrontPageEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("storefrontPage");
export const branchEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("branch");
export const itemEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("item");
export const collectionEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("collection");
export const variantEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("variant");
export const cartEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("carts");
export const retailStoreEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("retailStore");
export const inventoryEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("inventory");
export const variantCategoryEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("variantCategory");
export const inventoryCategoryEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("inventoryCategory");
export const expenseCategoryEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("expenseCategory");
export const expenseSettlementsEndpoints =
  apiEndpoints.generateApiEndpointsWithoutType("expenseSettlements");
