import { createRequestListener } from "@react-router/node";
import * as build from "virtual:react-router/server-build";

export default createRequestListener({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext() {
    return {};
  },
});