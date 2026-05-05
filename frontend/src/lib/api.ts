import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

export const api = <T = unknown>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return instance(config);
};