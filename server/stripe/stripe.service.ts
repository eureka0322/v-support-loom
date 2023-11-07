import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import Stripe from 'stripe';
import { ConfigService } from 'server/config/config.service';
import { Response } from 'express';
import { baseUrl } from 'server/utils';
var qs = require('qs');
import axios from 'axios';
import { getEnv } from '../utils';
const env = getEnv();
const stripe_custom = require('stripe')(process.env.STRIPE_SECRET_KEY);

@Injectable()
export class StripeService {
  stripe: Stripe;
  constructor(
    configService: ConfigService,
    private readonly databaseService: DatabaseService
  ) {
    this.stripe = new Stripe(
      configService.getString('STRIPE_SECRET_KEY', false),
      {
        apiVersion: '2022-11-15',
      }
    );
  }

  async updateSeats(clientId: string, seats: number) {
    const subscription = await this.databaseService.getClientSubscription(
      clientId
    );
    const client = await this.databaseService.getClientByClientId(clientId);

    console.log('subscription = ', subscription)
    console.log('client = ', client)

    if (client && client.data.settings.seats > seats) {
      return {
        success: false,
        msg: 'Fewer seats than selected agents',
      };
    }
    if (!subscription || !subscription.stripeSubscriptionId) {
      const msg = `Subscription or Stripe subscription ID not found (${subscription?.stripeSubscriptionId})`;
      console.error(msg);
      throw new BadRequestException(msg);
    }
    const subType = await this.databaseService.getSubscriptionType(
      subscription.subscriptionType
    );
    if (!subType?.pricePerSeat || !subType.stripeProductId) {
      const msg = `Stripe product ID (${subType?.stripeProductId}) or price per seat (${subType?.pricePerSeat}) not found (update post)`;
      console.error(msg);
      throw new BadRequestException(msg);
    }
    const totalPrice = subType.pricePerSeat * seats;
    const stripeSub = await this.stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    const items = stripeSub.items.data;

    if (items.length !== 1) {
      return {
        success: false,
        msg: 'Contact us at hello@videosupport.io',
      };
    } else {
      await this.stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        {
          items: [
            {
              id: items[0].id,
              quantity: seats,
            },
          ],
        }
      );

      await this.databaseService.updateSubscription(clientId, {
        paidSeats: seats,
      });

      return {
        success: true,
      };
    }
  }

  async createCheckout(
    clientId: string,
    clientEmail: string,
    subscriptionKey: string,
    paidSeats: number
  ) {
    const subType = await this.databaseService.getSubscriptionType(
      subscriptionKey
    );
    if (!subType.stripeProductId || !subType.pricePerSeat) {
      const msg = `Stripe product ID (${subType?.stripeProductId}) or price per seat (${subType?.pricePerSeat}) not found`;
      console.error(msg);
      throw new BadRequestException(msg);
    }

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            //currency: 'eur',
            currency: String(process.env.CURRENCY),
            product: subType.stripeProductId,
            unit_amount: subType.pricePerSeat * 100,
            recurring: {
              interval: 'month',
            },
            tax_behavior: 'exclusive',
          },
          quantity: paidSeats,
        },
      ],
      customer_email: clientEmail,
      mode: 'subscription',
      payment_method_collection: 'if_required',
      allow_promotion_codes: true,
      automatic_tax: {
        enabled: true,
      },
      tax_id_collection: {
        enabled: true,
      },
      //payment_method_types: ['card', 'sepa_debit'],
      payment_method_types: ['card'],
      success_url: baseUrl('stripe/success?session_id={CHECKOUT_SESSION_ID}'),
      cancel_url: baseUrl('account/billing?fail=true'),
      metadata: {
        subscriptionKey,
        clientId,
        paidSeats,
      },
    });
    if (session.url) {
      return session.url;
    } else {
      console.error(session);
      throw new BadRequestException("Couldn't create Stripe checkout page");
    }
  }

  async checkout(
    clientId: string,
    clientEmail: string,
    subscriptionKey: string,
    paidSeats: number
  ) {
    const currentSubscription =
      await this.databaseService.getClientSubscription(clientId);

    /*if (currentSubscription?.stripeSubscriptionId) {
      // TODO(Joao)
    } else {
      return await this.createCheckout(
        clientId,
        clientEmail,
        subscriptionKey,
        paidSeats
      );
    }*/ /* commented on jun-1-2023 */
    return await this.createCheckout(
        clientId,
        clientEmail,
        subscriptionKey,
        paidSeats
      );
  }

  async retrieveUpcomingInvoice(clientId: string) {
    const sub = await this.databaseService.getClientSubscription(clientId);
    const customerId = sub?.stripeCustomerId;
    const subscriptionId = sub?.stripeSubscriptionId;
    if (customerId && subscriptionId) {
      const nextInvoice = await this.stripe.invoices.retrieveUpcoming({
        customer: customerId,
        subscription: subscriptionId,
      });
    }
  }

  async success(sessionId: string, res: Response) {

    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    const clientId = session.metadata?.clientId;
    const subscriptionType = session.metadata?.subscriptionKey;
    const paidSeats = session.metadata?.paidSeats;

    if (
      clientId &&
      subscriptionType &&
      paidSeats &&
      session.subscription &&
      session.customer
    ) {

      let date = new Date();
      const subscriptionStart = Number(date.getTime());

      var newDate = new Date(date.setMonth(date.getMonth()+Number(process.env.ADD_MONTH_TO_CURRENT_DATE_FOR_STRIPE)));
      let subscriptionEnd = Number(newDate.getTime());

      await this.databaseService.updateSubscriptionStripePayment(clientId, {
        subscriptionType,
        paidSeats: parseInt(paidSeats),
        stripeSubscriptionId: session.subscription as string,
        stripeCustomerId: session.customer as string,
        subscriptionStart: subscriptionStart as number,
        subscriptionEnd: subscriptionEnd as number,
      });

      console.log('clientId success = ', clientId)
      const client_data = await this.databaseService.getAdminByClientId(clientId);

      console.log('client_data success = ', client_data)

      if(client_data) {

        var email = client_data[0]['email'];
        setTimeout(this.deleteOtherSubscriptions, 20000, email);

      }

      return res.redirect(baseUrl('account/billing?success=true'));
    } else {
      throw new BadRequestException(
        'No Client ID or Subscription Key in metadata'
      );
    }
  }


  /* delete other subscriptions if has/have */

  async deleteOtherSubscriptions(email: string) {
    console.log('deleteOtherSubscriptions email = ', email)

    const stripe_key = process.env.STRIPE_KEY;

    var data = qs.stringify({
      'expand[]': 'data.subscriptions',
      'query': 'email:\''+email+'\''
    });

    console.log('data = ', data)

    const send = await axios({
      method: 'GET',
      url: 'https://api.stripe.com/v1/customers/search?expand[]=data.subscriptions&query=email:\''+email+'\'',
      headers: { 
        'Authorization': 'Basic '+stripe_key,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data,
    }).catch((err) => {
      console.log('deleteOtherSubscriptions error =', err.response.data);
      
    });

    if(send) {

      console.log('send status = ', send.status)

      var stripe_data = send.data.data;
   
      console.log('stripe_data = ', stripe_data)

      var user_subscriptions = [];

      for(let i=0; i<stripe_data.length; i++) {

        if(stripe_data[i]['subscriptions']['data'][0] != undefined) {

          var subscriptions = { 
             customer_id:"", 
             subscription_id:"" ,
             created_at:"" ,
          }; 

          subscriptions.customer_id = stripe_data[i]['id'];
          subscriptions['subscription_id'] = stripe_data[i]['subscriptions']['data'][0].id;
          subscriptions['created_at'] = stripe_data[i]['subscriptions']['data'][0].created;

          user_subscriptions.push(subscriptions);
        }
      }

      user_subscriptions.sort(function(a:any, b:any) {
          return a.created_at-b.created_at
      });

      console.log('user_subscriptions = ', user_subscriptions);

      console.log('user_subscriptions length = ', user_subscriptions.length);

      if(user_subscriptions.length > 1) {

        user_subscriptions.pop()

        console.log('user_subscriptions after pop = ', user_subscriptions);

        for(let i = 0; i<user_subscriptions.length; i++) {

          if(user_subscriptions[i].subscription_id != '') {

            var subscription_id = user_subscriptions[i].subscription_id;
            console.log('subscription_id = ', subscription_id);

            var config = {
              method: 'delete',
              url: 'https://api.stripe.com/v1/subscriptions/'+subscription_id,
              headers: { 
                'Authorization': 'Basic '+stripe_key
              }
            };

            axios(config)
            .then(function (response) {
              console.log('delete = ', JSON.stringify(response.data));
            })
            .catch(function (error) {
              console.log('error in delete = ', error.response.statusText);
              console.log('error in delete status = ', error.response.status);
            });

            //var cancel_subscription = await stripe_custom.subscriptions.cancel(user_subscriptions[i].subscription_id);
          }
        }
      } else {
        console.log('length is 1, no need of cancel')
      }
    }
  }
}
