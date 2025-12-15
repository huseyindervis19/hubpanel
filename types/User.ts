import { Language } from "./Language";
import { Permission } from "./Permission";
import { UserRole } from "./UserRole";

export interface Links {
  self: string;
  edit: string;
  delete: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  status: string;
  languageId: number;
  language: Language;
  createdAt: string;
  updatedAt: string;
  userRoles: UserRole[];
  _links: Links;
}

/**
* User after logging in (contains their permissions)
*  */
export interface AuthenticatedUser extends Omit<User, "password"> {
  permissions: Permission[];
}