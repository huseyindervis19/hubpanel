export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: "/dashboard",

  // Product Categories
  VIEW_CATEGORIES: "/categories",
  ADD_CATEGORY: "/category/create",
  EDIT_CATEGORY: "/category/update",
  DELETE_CATEGORY: "/category/delete",
  VIEW_CATEGORY_PRODUCTS: "/category/products",

  // Products
  VIEW_PRODUCTS: "/products",
  ADD_PRODUCT: "/product/create",
  EDIT_PRODUCT: "/product/update",
  DELETE_PRODUCT: "/product/delete",

  // Contact Requests
  VIEW_CONTACT_REQUESTS: "/contact-requests",
  EDIT_CONTACT_REQUEST: "/contact-requests/update",

  // Languages
  VIEW_LANGUAGES: "/languages",
  ADD_LANGUAGE: "/language/create",
  EDIT_LANGUAGE: "/languages/update",
  DELETE_LANGUAGE: "/languages/delete",

  VIEW_LANGUAGE_KEYS: "view/language-keys",
  EDIT_LANGUAGE_KEYS: "edit/language-keys",

  // Profile
  VIEW_PROFILE: "/profile",
  EDIT_PROFILE: "/profile/update",

  // Users
  VIEW_USERS: "/users",
  ADD_USER: "/users/create",
  EDIT_USER: "/users/update",
  DELETE_USER: "/users/delete",

  // Roles & Permissions
  VIEW_ROLES: "/roles",
  ADD_ROLE: "/roles/create",
  EDIT_ROLE: "/roles/update",
  DELETE_ROLE: "/roles/delete",
  MANAGE_ROLE_PERMISSIONS: "/role/permissions",

  VIEW_PERMISSIONS: "/permissions",

  // Settings
  VIEW_ABOUT_US: "/about-us",
  EDIT_ABOUT_US: "/about-us/update",

  VIEW_CONTACT_INFORMATION: "/contact-information",
  EDIT_CONTACT_INFORMATION: "/contact-information/update",

  VIEW_HOME_SLIDER: "/home-slider",
  ADD_HOME_SLIDER: "/home-slider/create",
  EDIT_HOME_SLIDER: "/home-slider/update",
  DELETE_HOME_SLIDER: "/home-slider/delete",

  VIEW_SOCIAL_LINKS: "/social-links",
  ADD_SOCIAL_LINKS: "/social-links/create",
  EDIT_SOCIAL_LINKS: "/social-links/update",
  DELETE_SOCIAL_LINKS: "/social-links/delete",
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = typeof PERMISSIONS[PermissionKey];
