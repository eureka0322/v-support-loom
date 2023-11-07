import { Profile } from 'passport';
import { Strategy } from 'passport-google-oauth20';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ConfigService } from '../../config/config.service';
import { GoogleAuthService, GoogleUser } from './google-auth.service';
import { AuthService, Provider } from '../../auth/auth.service';

import { DatabaseService } from '../../database/database.service';

import { getEnv } from '../../utils';
const env = getEnv();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.getString('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getString('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getString('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = this.googleAuthService.validateUser(accessToken, profile);

    var email = ''
    var name = ''

    if(user.email != '' && user.email != undefined && user.email != null) {
      email = user.email  
    }

    if(user.name != '' && user.name != undefined && user.name != null) {
      name = user.name  
    }

    var is_user = await this.googleAuthService
      .findUser(user)
      .catch((err) => {
        console.log('Error findUser');
        console.log(err);
      });

    /* if user is not false means user has already account with us, don`t do anything then  */

    /* create trial subscription in stripe */

    if(is_user === false) {

      var search_customer = await stripe.customers.search({
        query: `email:"`+email+`"`,
      });

      var customer_id = ''

      if(search_customer.data.length >= 1){

        customer_id = search_customer.data[0].id

      } else {  // create customer

         var create_customer = await stripe.customers.create({
          email: email,
          name: name,
        });

        if(create_customer.id) {
          customer_id = create_customer.id
        }
      }

      if(customer_id != '') {

        var trial_week = Number(process.env.TRIAL_WEEK);
        var now = new Date();
        var trial_end = Number(now.setDate(now.getDate() + 3));

        var divide = trial_end/1000;
        var trial_end_date = divide.toString().split(".")[0];

        var subscription = await stripe.subscriptions.create({
            customer: customer_id,
            items: [
              {
                price: process.env.TRIAL_PRODUCT_PRICE_ID,
              },
            ],
            trial_end: trial_end_date,
          });
      }
    }

    const dbUser = await this.googleAuthService
      .findOrCreate(user)
      .catch((err) => {
        console.log('Error');
        console.log(err);
      });

    if (!dbUser) {
      console.log("[googleAuth/validate] Can't find user in database");
      throw new BadRequestException("Can't find user in database");
    } else if (dbUser.organizationRole !== 'admin') {
      const msg = `User ${dbUser.email} is not an admin`;
      console.error(msg);
      throw new UnauthorizedException(msg);
    }

    var clientId = dbUser.organizationId;

    if(subscription && clientId) {

      await this.databaseService.updateSubscription(clientId, {
          stripeCustomerId: subscription.customer,
          stripeSubscriptionId: subscription.id,
      });
    }

    const jwt: string = await this.authService.sign(
      dbUser.organizationId,
      dbUser.id,
      dbUser.name,
      dbUser.email,
      Provider.GOOGLE,
      dbUser.organizationRole
    );

    return { ...user, jwt } as GoogleUser;
  }
}
