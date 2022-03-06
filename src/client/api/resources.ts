import { ResourceState } from 'dinovel/server/modules/resources/models.ts';
import { BaseApi } from "./base-api.ts";

export class ResourcesApi extends BaseApi {
  constructor(baseUrl: string = '') {
    super(baseUrl + "/api/resources");
  }

  /** Return list of project resources */
  async loadResources() { return await this.GET<ResourceState>("/"); }
}
