import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000",
  timeout: 5000,
});

export const api = <T = unknown>(
  config: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  return instance(config);
};
