import cors from "cors";
import { createServer, MiddlewareConfig } from "@vue-storefront/middleware";
import { integrations } from "../middleware.config";

const buildApp = async (config: MiddlewareConfig) => {
  const app = await createServer(config);

  const CORS_MIDDLEWARE_NAME = "corsMiddleware";

  const corsMiddleware = app._router.stack.find(
    (middleware: any) => middleware.name === CORS_MIDDLEWARE_NAME
  );
  corsMiddleware.handle = cors({
    origin: ["http://localhost:3000"],
    optionsSuccessStatus: 200,
    credentials: true,
  });
  return app;
};

(async () => {
  // Waiting to fix breaking change from middleware
  const app = await buildApp({ integrations } as any);
  const port = Number(process.env.API_PORT) || 8181;

  app.listen(port, "", () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`);
    if (process.env.IS_MULTISTORE_ENABLED === "false") {
      // eslint-disable-next-line no-console
      console.log("Multistore is not enabled");
    }
  });
})();
