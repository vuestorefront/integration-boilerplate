import { WithoutContext } from "@vue-storefront/middleware";
import * as api from "../../api";

export type Endpoints = WithoutContext<typeof api>;
