import { isPrimitive, isObject } from 'dinovel/std/core/guards.ts'

export type QueryParams = Record<string, unknown>

export abstract class BaseApi {
  private readonly _baseUrl;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  protected async GET<T>(...urlParts: string[] | [QueryParams, ...string[]]): Promise<T> {
    const [queryParams, ...parts] = isObject<QueryParams>(urlParts[0]) ? [urlParts[0], ...urlParts.slice(1)] : [{}, ...urlParts];
    const url = this.buildUrl(queryParams, ...parts as string[]);
    return await fetch(url).then(res => res.json());
  }

  protected buildUrl(queryParams: Record<string, unknown> = {}, ...parts: string[]): string {
    const url = [this._baseUrl, ...parts].join('/').replaceAll('//', '/');
    const query = new URLSearchParams(this.mapParams(queryParams)).toString();
    return query ? `${url}?${query}` : url;
  }

  private mapParams(params: Record<string, unknown>): Record<string, string> {
    return Object.entries(params).reduce((acc, [key, value]) => {
      acc[key] = isPrimitive(value) ? `${value}` : '';
      return acc;
    }, {} as Record<string, string>);
  }
}
