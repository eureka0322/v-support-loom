import {
  Body,
  Headers,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiGuard } from 'server/guards/api.guard';
import { RolesGuard } from 'server/guards/roles.guard';
import { Roles } from 'server/roles/roles.decorator';
import { StripeService } from './stripe.service';
import { SubscriptionRepository } from 'server/database/subscription/subscription.repository';
import { Response } from 'express';
import { ClientEmail, ClientId } from 'server/api/api.decorator';
import { ClientRepository } from 'server/database/client/client.repository';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService, private readonly subscriptionRepository: SubscriptionRepository, private readonly clientRepository: ClientRepository) { }

  @Roles('admin')
  @UseGuards(ApiGuard)
  @UseGuards(RolesGuard)
  @Post('create-checkout')
  async createStripeCheckout(
    @ClientId() clientId: string,
    @ClientEmail() clientEmail: string,
    @Body() body: any
  ) {
    return await this.stripeService.checkout(
      clientId,
      clientEmail,
      body.subscriptionKey,
      body.seats
    );
  }

  @Roles('admin')
  @UseGuards(ApiGuard)
  @UseGuards(RolesGuard)
  @Get('upcoming-invoice')
  async getUpcomingInvoice(@ClientId() clientId: string) {
    return await this.stripeService.retrieveUpcomingInvoice(clientId);
  }

  @Roles('admin')
  @UseGuards(ApiGuard)
  @UseGuards(RolesGuard)
  @Post('update-seats')
  async updateSeats(
    @ClientId() clientId: string,
    @Body() { chosenSeats }: { chosenSeats: number }
  ) {
    return await this.stripeService.updateSeats(clientId, chosenSeats);
  }

  @Get('success')
  async success(@Query('session_id') successId: string, @Res() res: Response) {
    return await this.stripeService.success(successId, res);
  }

  @Post('webhooks')
  async webhooks(
    @Headers() headers: any,
    @Body() requestBody: any,
  ) {
    console.group('Stripe webhook logs:');
    // console.log('headers: ', headers);
    // console.log('requestBody: ', requestBody)
    // var body = JSON.parse(requestBody);

    var validated = (requestBody.type == 'customer.subscription.updated' || requestBody.type == 'customer.subscription.created');
    var response;
    console.log('validated: ', validated)
    if (validated == true) {

      var subscription_id = requestBody.data.object.id;
      var discount = requestBody.data.object.discount;
      var subscription_price = requestBody.data.object.items.data[0].plan.id;
      var subscription_product = requestBody.data.object.items.data[0].plan.product;
      var customer = requestBody.data.object.customer;
      var amount_off;
      var trialing = requestBody.data.object.status == 'trialing';
      if (discount != null) {
        var coupon = requestBody.data.object.discount?.coupon;
        amount_off = coupon.amount_off;
      } else {
        var coupon = null;
        amount_off = 0;
      }
      if (trialing == true) {
        var trial_end = requestBody.data.object.trial_end;
      }
      // var invoice = requestBody.data.object.invoice;
      // var amount = requestBody.data.object.amount_paid;
      var quantity = requestBody.data.object.quantity;

      var amount_paid = requestBody.data.object.items.data[0].plan.amount * quantity - amount_off;


      var plan_name;
      var free_seats = 0;
      if (trialing == true) {
        console.log('trial_end: ', trial_end);
        console.log('trial_end (UTC): ', new Date(trial_end * 1000).toUTCString());
        plan_name = 'Trial';
      } else if(coupon?.name != null) {
        plan_name = coupon.name;
        if(quantity >= 1) {
          if (plan_name.toLowerCase() == 'appsumo ltd tier 1') {
            free_seats = 1;
          } else if(plan_name.toLowerCase() == 'superbrian') {
            free_seats = 1;
          } else if(plan_name.toLowerCase() == 'appsumo ltd tier 2') {
            free_seats = 5;
          } else if(plan_name.toLowerCase() == 'appsumo ltd tier 3') {
            free_seats = 10;
          } 

          if (quantity>free_seats) {
            plan_name += ' + ' + (quantity-free_seats) + ' seats';
          }
        }
      }
      // console.log('invoice: ', invoice);
      // console.log('amount: ', amount);
      console.log('subscription_id: ', subscription_id);
      console.log('discount: ', discount);
      console.log('subscription_price: ', subscription_price);
      console.log('subscription_product: ', subscription_product);
      console.log('customer: ', customer);
      console.log('coupon.id: ', coupon?.id);
      console.log('amount_paid: ', amount_paid);
      console.log('trialing: ', trialing);
      console.log('quantity: ', quantity);
      console.log('plan_name: ', plan_name);


      const current_subscription = await this.subscriptionRepository.getByStripeSubscriptionId(subscription_id);
      if (current_subscription != null) {
        current_subscription.data.subscriptionDisplayName = plan_name;
        current_subscription.data.paidSeats = quantity;
        current_subscription.data.freeSeats = free_seats;
        const subscriptionData = { ...current_subscription.data }; // create a plain JavaScript object from the SubscriptionModel object
        Object.setPrototypeOf(subscriptionData, null); // remove the custom prototype from the plain JavaScript object
        await this.subscriptionRepository.updateSubscription(current_subscription.docRef, subscriptionData);
        await this.clientRepository.getClientBySubscription(current_subscription.docRef).then(async (client) => {
          if(client != null) {
            this.clientRepository.updateSeats(client.docRef, quantity);
          }
        });

      } 
    
      var status = 'success';
      response = { status: status, headers: headers, discount: discount, subscription_price: subscription_price, subscription_product: subscription_product, customer: customer, coupon: coupon?.id, amount_paid: amount_paid, trialing: trialing, quantity: quantity, plan_name: plan_name };
    } else {
      var status = 'error';
      response = { status: status, headers: headers, requestBody: requestBody };
    }
    // console.log('response: ', response)
    console.groupEnd();
    return response;
  }
}
