import { Template } from "./templates/types";
import { nuxtPageMethod } from "./templates/nuxtPageMethod";
import { apiMethod } from "./templates/apiMethod";
import { nextPageMethod } from "./templates/nextPageMethod";

export const templates = {
  apiMethod,
  nuxtPageMethod,
  nextPageMethod,
} as Record<string, Template>;
