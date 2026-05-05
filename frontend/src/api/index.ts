// API クライアントのラッパー
import { getFastAPI } from "./generated";

const fastAPIClient = getFastAPI();

export const getHello = fastAPIClient.getHello;

export type { HelloResponse } from "./generated";
