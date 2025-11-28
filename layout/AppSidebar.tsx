"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  UserCircleIcon,
  UserIcon,
  CategoriesIcon,
  ProductsIcon,
  DashboardIcon,
  LockIcon,
  LanguageIcon,
  PageIcon,
  EnvelopeIcon,
  MailIcon,
  PlugInIcon,
} from "../icons";
import { useLocale } from "@/context/LocaleContext";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";

type SubItem = Exclude<NavItem["subItems"], undefined>[number]; // Utility type for a single sub-item

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const getNavItems = (
  messages: Record<string, string>,
  canViewProducts: boolean,
  canAddProduct: boolean,
  canViewCategories: boolean,
  canAddCategory: boolean,
  canViewAboutUs: boolean = true, // temporary: default to true
  canViewContactRequests: boolean = true // temporary: default to true
): NavItem[] => {
  const navItems: NavItem[] = [
    {
      icon: <DashboardIcon />,
      name: messages["dashboard"] || "Dashboard",
      path: "/",
    },
  ];

  // 1. Products Categories
  if (canViewCategories || canAddCategory) {
    // FIX: Define type as an array of SubItem[] to avoid 'possibly undefined' error
    const categorySubItems: SubItem[] = [
      canViewCategories && { name: messages["products_categories"] || "Products Categories", path: "/categories/list-categories" },
      canAddCategory && { name: messages["add_product_categories"] || "Add Categories", path: "/categories/add-category" },
    ].filter(Boolean) as SubItem[];

    if (categorySubItems.length > 0) {
      navItems.push({
        icon: <CategoriesIcon />,
        name: messages["products_categories"] || "Products Categories",
        subItems: categorySubItems,
      });
    }
  }

  // 2. Products
  if (canViewProducts || canAddProduct) {
    // FIX: Define type as an array of SubItem[] to avoid 'possibly undefined' error
    const productSubItems: SubItem[] = [
      canViewProducts && { name: messages["product_list"] || "List Product", path: "/products/list-products" },
      canAddProduct && { name: messages["add_product"] || "Add Product", path: "/products/add-product" },
    ].filter(Boolean) as SubItem[];

    if (productSubItems.length > 0) {
      navItems.push({
        icon: <ProductsIcon />,
        name: messages["products_list"] || "List Products",
        subItems: productSubItems,
      });
    }
  }

  // 3. About Us (temporary: no permission check)
  navItems.push({
    icon: <PageIcon />,
    name: messages["nav_about_us"] || "About Us",
    path: "/setting/about-us",
  });

  // 4. Contact Information (temporary: no permission check)
  navItems.push({
    icon: <MailIcon />,
    name: messages["contact_information"] || "Contact Information",
    path: "/setting/contact-information",
  });

  // 5. Social Links (temporary: no permission check)
  navItems.push({
    icon: <PlugInIcon />,
    name: messages["social_links"] || "Social Links",
    path: "/setting/social-links",
  });

  // 6. Contact Requests (temporary: no permission check)
  navItems.push({
    icon: <EnvelopeIcon />,
    name: messages["nav_contact_requests"] || messages["nav_communication_requests"] || "Contact Requests",
    path: "/contact-requests",
  });
  // for testing only
   navItems.push({
    icon: <EnvelopeIcon />,
    name: messages["nav_contact_requests"] || messages["nav_communication_requests"] || "home slider",
    path: "/home-slider/list-slider",
  });
    navItems.push({
    icon: <EnvelopeIcon />,
    name: messages["nav_contact_requests"] || messages["nav_communication_requests"] || "add slider",
    path: "/home-slider/add-slider",
  });

  return navItems;
};
const getOtherItems = (
  messages: Record<string, string>,
  canViewUsers: boolean,
  canViewRoles: boolean,
  canViewLanguages: boolean,
  canViewLanguageKeys: boolean
): NavItem[] => {
  const items: NavItem[] = [];

  if (canViewRoles) {
    items.push({
      icon: <LockIcon />,
      name: messages["roles_permissions"] || "Roles && Permissions",
      subItems: [
        { name: messages["permissions"] || "Permissions", path: "/permissions" },
        { name: messages["roles"] || "Roles", path: "/roles" },
      ],
    });
  }

  if (canViewLanguages || canViewLanguageKeys) {
    const languageSubItems: SubItem[] = [
      canViewLanguages && { name: messages["languages_list"] || "Languages", path: "/languages/lang" },
      canViewLanguageKeys && { name: messages["languages_keys"] || "Language Keys", path: "/languages/translations" },
    ].filter(Boolean) as SubItem[];

    if (languageSubItems.length > 0) {
      items.push({
        icon: <LanguageIcon />,
        name: messages["languages"] || "Languages",
        subItems: languageSubItems,
      });
    }
  }

  if (canViewUsers) {
    items.push({
      icon: <UserIcon />,
      name: messages["users"] || "Users",
      path: "/users",
    });
  }

  items.push({
    icon: <UserCircleIcon />,
    name: messages["profile"] || "User Profile",
    path: "/profile",
  });

  return items;
};

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { locale, messages } = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const canViewUsers = useHasPermission(PERMISSIONS.VIEW_USERS);
  const canViewProducts = useHasPermission(PERMISSIONS.VIEW_PRODUCTS);
  const canAddProduct = useHasPermission(PERMISSIONS.ADD_PRODUCT);
  const canViewCategories = useHasPermission(PERMISSIONS.VIEW_CATEGORIES);
  const canAddCategory = useHasPermission(PERMISSIONS.ADD_CATEGORY);
  const canViewRoles = useHasPermission(PERMISSIONS.VIEW_ROLES);
  const canViewLanguages = useHasPermission(PERMISSIONS.VIEW_LANGUAGES);
  const canViewLanguageKeys = useHasPermission(PERMISSIONS.VIEW_LANGUAGE_KEYS);
  // Temporary: removed permission checks for About Us and Contact Requests
  // const canViewAboutUs = useHasPermission(PERMISSIONS.VIEW_ABOUT_US);
  // const canViewContactRequests = useHasPermission(PERMISSIONS.VIEW_CONTACT_REQUESTS);

  const navItems = useMemo(
    () => getNavItems(
      messages as Record<string, string>,
      canViewProducts,
      canAddProduct,
      canViewCategories,
      canAddCategory,
      true, // canViewAboutUs - temporary: always true
      true  // canViewContactRequests - temporary: always true
    ),
    [messages, canViewProducts, canAddProduct, canViewCategories, canAddCategory]
  );

  const othersItems = useMemo(
    () => getOtherItems(messages as Record<string, string>, canViewUsers, canViewRoles, canViewLanguages, canViewLanguageKeys),
    [messages, canViewUsers, canViewRoles, canViewLanguages, canViewLanguageKeys]
  );

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main" | "others"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleSubmenuToggle = useCallback(
    (index: number, menuType: "main" | "others") => {
      setOpenSubmenu((prev) =>
        prev && prev.type === menuType && prev.index === index ? null : { type: menuType, index }
      );
    },
    []
  );

  useEffect(() => {
    ["main", "others"].forEach((type) => {
      const items = type === "main" ? navItems : othersItems;
      items.forEach((nav, i) => {
        if (nav.subItems?.some((sub) => isActive(sub.path))) {
          setOpenSubmenu({ type: type as "main" | "others", index: i });
        }
      });
    });
  }, [pathname, navItems, othersItems, isActive]);

  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const el = subMenuRefs.current[key];
      if (el) {
        setSubMenuHeight((prev) => ({ ...prev, [key]: el.scrollHeight }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = useCallback(
    (items: NavItem[], type: "main" | "others") => (
      <ul className="flex flex-col gap-4">
        {items.map((nav, i) => (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(i, type)}
                className={`menu-item group ${openSubmenu?.type === type && openSubmenu?.index === i
                  ? "menu-item-active"
                  : "menu-item-inactive"
                  } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
              >
                <span>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    width={18}
                    height={18}
                    className={`ml-auto transition-transform duration-200 ${openSubmenu?.type === type && openSubmenu?.index === i ? "rotate-180" : ""}`}
                  />
                )}
              </button>
            ) : (
              <Link
                href={nav.path || "#"}
                className={`menu-item group ${isActive(nav.path || "") ? "menu-item-active" : "menu-item-inactive"}`}
              >
                <span>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${type}-${i}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === type && openSubmenu?.index === i
                      ? `${subMenuHeight[`${type}-${i}`] || 0}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        href={sub.path}
                        className={`menu-dropdown-item ${isActive(sub.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                          }`}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    ),
    [openSubmenu, isExpanded, isHovered, isMobileOpen, handleSubmenuToggle, subMenuHeight, isActive]
  );

  return (
    <aside
      className={`fixed flex flex-col px-5 transition-[width] duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800
      ${dir === "ltr" ? "left-0" : "right-0"} bg-white dark:bg-gray-900 text-gray-900 z-50
      ${isExpanded || isMobileOpen ? "w-[280px]" : isHovered ? "w-[280px]" : "w-[90px]"}
      ${isMobileOpen ? "translate-x-0" : dir === "rtl" ? "translate-x-full" : "-translate-x-full"}
      lg:translate-x-0 top-16 lg:top-0 h-[calc(100vh-64px)] lg:h-screen`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-3">
              <Image
                className="dark:hidden"
                src="/images/logo/light-theme-logo.png"
                alt="Logo"
                width={200}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/dark-theme-logo.png"
                alt="Logo"
                width={200}
                height={40}
              />
            </div>
          ) : (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/main-logo.png"
                alt="Logo"
                width={50}
                height={10}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/main-logo.png"
                alt="Logo"
                width={50}
                height={10}
              />
            </>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6 space-y-8">
          <section>
            <h2 className="mb-4 text-xs uppercase leading-5 text-gray-400">
              {messages["nav_menu"] || "Menu"}
            </h2>
            {renderMenuItems(navItems, "main")}
          </section>

          <section>
            <h2 className="mb-4 text-xs uppercase leading-5 text-gray-400">
              {messages["nav_others"] || "Others"}
            </h2>
            {renderMenuItems(othersItems, "others")}
          </section>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;