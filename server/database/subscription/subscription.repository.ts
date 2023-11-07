import { BadRequestException, Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { DatabaseRepository } from '../database.repository';
import {
  SubscriptionModel,
  SubscriptionTypeModel,
  collection,
  converter,
  typeCollection,
  typeConverter,
} from './subscription.model';

@Injectable()
export class SubscriptionRepository extends DatabaseRepository<SubscriptionModel> {
  collection = collection;
  converter = converter;
  async create(id: string, model: SubscriptionModel) {
    await this.doc(id).set(model);
    return id;
  }
  async getById(id: string) {
    const snapshot = await this.doc(id).get();
    return snapshot.data();
  }
  async getByStripeSubscriptionId(stripeSubscriptionId: string) {
    const snapshot = await this.where(
      'stripeSubscriptionId',
      '==',
      stripeSubscriptionId
    ).get();
    return this.extractOne(snapshot);
  }

  async updateSubscription(
    subscriptionId: string,
    toUpdate: {
      subscriptionType?: string;
      subscriptionName?: string;
      paidSeats?: number;
      stripeSubscriptionId?: string;
      subscriptionStart?: number;
      subscriptionEnd?: number;
    }
  ) {
    console.log('subscriptionId = ', subscriptionId)
    console.log('toUpdate = ', toUpdate)
    await this.doc(subscriptionId).update(toUpdate);
  }
}

@Injectable()
export class SubscriptionTypeRepository extends DatabaseRepository<SubscriptionTypeModel> {
  collection = typeCollection;
  converter = typeConverter;
  async create(subscription: SubscriptionTypeModel) {
    const id = v4();
    await this.doc(id).set(subscription);
  }

  async find(subscriptionType: string) {
    const snapshot = await this.doc(subscriptionType).get();
    const subscription = snapshot.data();
    if (subscription === undefined) {
      throw new BadRequestException('Subscription type not found');
    }
    return subscription;
  }
}
