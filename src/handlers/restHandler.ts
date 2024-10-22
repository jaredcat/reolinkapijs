import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import https from "https";

interface RequestParams {
  [key: string]: string | number | undefined;
}

class Request {
  static proxies: AxiosRequestConfig["proxy"] = undefined;
  static session: AxiosInstance | undefined = undefined;

  private static getSession(): AxiosInstance {
    return Request.session || axios.create();
  }

  static async post(
    url: string,
    data: Array<Record<string, any>>,
    params: RequestParams = {},
  ): Promise<AxiosResponse | null> {
    try {
      const headers = { "Content-Type": "application/json" };
      const response = await Request.getSession().post(url, data, {
        headers,
        params,
        proxy: Request.proxies,
        httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Equivalent to `verify=False`
      });

      if (response.status === 200) {
        return response;
      } else {
        throw new Error(`HTTP Request had non-200 Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Post Error\n", error);
      throw error;
    }
  }

  static async get(
    url: string,
    params: RequestParams = {},
    timeout: number = 1,
  ): Promise<AxiosResponse | null> {
    try {
      const response = await Request.getSession().get(url, {
        params,
        timeout: timeout * 1000, // Convert seconds to milliseconds
        proxy: Request.proxies,
        httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Equivalent to `verify=False`
      });

      return response;
    } catch (error) {
      console.error("Get Error\n", error);
      throw error;
    }
  }
}

export default Request;
