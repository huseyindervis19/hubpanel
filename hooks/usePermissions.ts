"use client";

import { useQuery } from "@tanstack/react-query";
import { permissionService } from "@/services/permissionService";
import { Permission } from "@/types/Permission";

export const usePermissions = (lang: string) => {
  return useQuery({
    queryKey: ["permissions", lang],
    queryFn: async () => {
      const res = await permissionService.getAll(lang);
      return res.data;
    },
    enabled: !!lang,
  });
};
