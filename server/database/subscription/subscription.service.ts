import { v4 } from 'uuid';
import { SubscriptionModel } from './subscription.model';
import {
  SubscriptionRepository,
  SubscriptionTypeRepository,
} from './subscription.repository';
import { Client as ClientModel } from '../client/client.model';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly subscriptionTypeRepository: SubscriptionTypeRepository
  ) {}

  computeNextBillingValue(
    client: ClientModel,
    billingModel: string,
    billingValue: number
  ) {
    if (billingModel === 'seat') {
      return billingValue * client.settings.seats;
    } else if (billingModel === 'fixed') {
      return billingValue;
    } else {
      throw new BadRequestException('Billing model unrecognized');
    }
  }

  // TODO(Joao): this function doesn't deal with leap years, months without a certain day,
  // etc
  computeNextBillingDate(
    lastPayment: number,
    billingDay: number,
    billingCycle: string
  ) {
    const date = new Date(lastPayment);
    if (billingCycle === 'yearly') {
      return new Date(date.getFullYear() + 1, date.getMonth(), billingDay);
    } else if (billingCycle === 'monthly') {
      return new Date(date.getFullYear(), date.getMonth() + 1, billingDay);
    } else {
      throw new BadRequestException('Billing cycle not recognized');
    }
  }
  computeNextBilling(
    client: ClientModel,
    billingDay: number,
    billingCycle: string,
    paymentModel: string,
    paymentValue: number,
    lastBillingId: number,
    lastPayment: number
  ) {
    const newBillingId = lastBillingId + 1;
    const billingDate = this.computeNextBillingDate(
      lastPayment,
      billingDay,
      billingCycle
    );
    const billingValue = this.computeNextBillingValue(
      client,
      paymentModel,
      paymentValue
    );
    return {
      id: newBillingId,
      date: billingDate.getTime(),
      amount: billingValue,
    };
  }

  async createClientSubscription(
    client: ClientModel,
    subscriptionType: string,
    subscriptionName: string = '' //todo: BS: remove default value and add logic to all functions using this service
  ) {
    const subType = await this.subscriptionTypeRepository.find(
      subscriptionType
    );
    const subscriptionStart = Number(Date.now());
    let subscriptionEnd: number | undefined;

    if (subType.expires) {
      subscriptionEnd = Number(subscriptionStart) + Number(subType.expires);
    }

    const subscriptionId = v4();
    const subscription = new SubscriptionModel(
      subscriptionType,
      subscriptionName,
      subscriptionStart,
      subscriptionEnd
    );

    await this.subscriptionRepository.create(subscriptionId, subscription);
    return subscriptionId;
  }

  async getClientSubscription(client: ClientModel) {
    const subscription = await this.subscriptionRepository.getById(
      client.subscription
    );
    return subscription;
  }
}
