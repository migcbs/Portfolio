import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getSiteSettings = cache(() => prisma.siteSettings.findFirst());
