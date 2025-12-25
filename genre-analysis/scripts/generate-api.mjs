// scripts/generate-api.mjs
import { resolve } from 'path';
import { generateApi } from 'swagger-typescript-api';

generateApi({
  name: "Api.ts",
  output: resolve(process.cwd(), "./src/api"),
  url: "http://localhost:8082/swagger/doc.json",  // ← ВОТ ТУТ ТОЧНЫЙ АДРЕС!
  httpClientType: "axios",
  generateClient: true,
  generateRouteTypes: false,
  generateResponses: true,
  cleanOutput: true,
  modular: false,
  // Эти опции критически важны для твоего Swagger 2.0:
  extractRequestParams: true,
  extractRequestBody: true,
  defaultResponseType: "void",
  singleHttpClient: true,
  unwrapResponseData: true,
});