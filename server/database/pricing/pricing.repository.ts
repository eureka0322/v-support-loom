import { Injectable } from '@nestjs/common';

import { DatabaseRepository } from '../database.repository';
import { Pricing, collection, converter } from './pricing.model';

@Injectable()
export class PricingRepository extends DatabaseRepository<Pricing> {
  collection = collection;
  converter = converter;

  async getPricingByTier(tier: string) {
    const snapshot = await this.doc(tier).get();
    const data = snapshot.data();

    return data;
  }
}
