export interface LambdaContext {
  request: { path: string; query: string; method: string; body: unknown; headers: Headers };
  response: Response;
  getSecret<T = Record<string, string>>(secret: string): Promise<T>;
  getConfig(secret: string): Promise<Record<string, string>>;
  getLambdaInfo(): {
    name: string;
    namespace: string;
    resourceVersion: string;
    uid: string;
  };
  getQueryParams(): Record<string, string>;
  getBodyParams(): Record<string, string>;
  getRouteParams(): Record<string, string>;
}
