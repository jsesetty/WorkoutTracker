import { getCatalog } from '../storage/jsonStorage.js';

export class CatalogService {
  /**
   * Retrieve canonical exercise catalog
   */
  async getCatalog() {
    return await getCatalog();
  }
}

export const catalogService = new CatalogService();
