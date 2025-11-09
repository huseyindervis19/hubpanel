export const PERMISSIONS = {
  // Languages
  VIEW_LANGUAGES: "/languages",
  ADD_LANGUAGE: "/language/create",
  EDIT_LANGUAGE: "/languages/update",
  DELETE_LANGUAGE: "/languages/delete",

  VIEW_LANGUAGE_KEYS: "view/language-keys",
  EDIT_LANGUAGE_KEYS: "edit/language-keys",

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

  VIEW_PERMISSIONS: "view-permissions",
  ADD_PERMISSION: "add-permission",
  EDIT_PERMISSION: "edit-permission",
  DELETE_PERMISSION: "delete-permission",

  // Products
  VIEW_PRODUCTS: "view-products",
  ADD_PRODUCT: "add-product",
  EDIT_PRODUCT: "edit-product",
  DELETE_PRODUCT: "delete-product",

  // Product Categories
  VIEW_CATEGORIES: "view-categories",
  ADD_CATEGORY: "add-category",
  EDIT_CATEGORY: "edit-category",
  DELETE_CATEGORY: "delete-category",

  // Dashboard
  VIEW_DASHBOARD: "view-dashboard",

  // Profile
  VIEW_PROFILE: "view-profile",
  EDIT_PROFILE: "edit-profile",
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = typeof PERMISSIONS[PermissionKey];
