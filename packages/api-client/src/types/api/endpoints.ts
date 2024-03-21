import { WithoutContext } from "@vue-storefront/middleware";
import * as apiMethods from "../../api";

export type ApiMethods = typeof apiMethods;

export type Endpoints = WithoutContext<ApiMethods>;
