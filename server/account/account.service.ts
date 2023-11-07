import {
  BadGatewayException,
  BadRequestException,
} from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Client as ClientModel } from '../database/client/client.model';
import { SubscriptionService } from 'server/database/subscription/subscription.service';
import { baseUrl } from 'server/utils';
import { AuthService } from 'server/auth/auth.service';
import { PostmarkService } from 'server/postmark/postmark.service';
import { v4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { User } from 'server/database/users/users.model';
import { getEnv } from '../utils';
const env = getEnv();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


export class CreateAccountDto {
  id: string;
  companyName: string;
  plan: string;
  integrations: { [key: string]: any };
  seats: number;
  referrerUrl: string;
  subscriptionType: string;
}

@Injectable()
export class AccountService {
  constructor(
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
    private readonly subscriptionService: SubscriptionService,
    private readonly postmarkService: PostmarkService
  ) {}

  async createAccount(account: CreateAccountDto) {
    const settings = {
      app: {
        branding: {
          primary_colour: '#8614f8',
          secondary_colour: '#ffffff',
        },
        referrerUrl: account.referrerUrl,
      },
      seats: {
        amount: account.seats,
      },
      integrations: account.integrations,
    };

    const recordingAmount = 0;
    const createdAt = new Date();

    let client = new ClientModel(
      account.id,
      account.companyName,
      settings,
      account.plan,
      recordingAmount,
      createdAt,
      ''
    );


    const subscription =
      await this.subscriptionService.createClientSubscription(
        client,
        account.subscriptionType
      );

    client.subscription = subscription;

    const newClient = await this.databaseService.createClient(client);

    return newClient;
  }

  async verifyClient(client: ClientModel) {
    const subscription = await this.subscriptionService.getClientSubscription(
      client
    );

    if (!subscription) {
      // This should never happen, so we return true because it's probably an error from our side
      console.log(
        `[account/verifyClient] Client doesn't have subscription (${client.id})`
      );
      return true;
    }

    if (
      subscription.subscriptionEnd !== undefined &&
      subscription.subscriptionEnd < Date.now()
    ) {
      console.log(
        `[account/verifyClient] Trial ended for ${client.id} (${client.name})`
      );
      return false;
    } else {
      return true;
    }
  }

  async verifyClientId(clientId: string) {
    const client = await this.databaseService.getClientByClientId(clientId);

    if (!client) return false;

    return await this.verifyClient(client.data);
  }

  async getClient(clientId: string) {
    const client = await this.databaseService.getUserByClientId(clientId);
    if (client) return client.data;

    return false
  }

  async updatePassword(email: string, password: string) {

    const secureRounds = 10;

    const dbUser = await this.databaseService.getUserByEmail(email);

    if(dbUser) {

      var user_id = dbUser.data.id

      return hash(password, secureRounds).then(async (hashed) => {
        return await this.databaseService.updatePassword(user_id, {
            hashedPassword: hashed,
        });
      });
    }
  }


  async register(email: string, session: any) {
    const dbUser = await this.databaseService.getUserByEmail(email);

    if ((dbUser && dbUser.data.organizationRole === 'admin') || !dbUser) {
      const min15 = 60 * 15;
      const sessionState = v4();
      const usages = 1; // can only use once
      await this.databaseService.addSignupSessionState(
        sessionState,
        Date.now() + 1000 * min15,
        usages
      );
      const jwt = await this.authService.signPayload(
        {
          createPassword: true,
          email,
          sessionState,
        },
        'single-create-password',
        {
          // Expires in 15 minutes
          expiresIn: min15,
        }
      );
      const createPasswordUrl = baseUrl(`account/create-password?token=${jwt}`);
      console.log('createPasswordUrl = ', createPasswordUrl);
      await this.postmarkService.createAccount(email, createPasswordUrl);
    } else {
      throw new UnauthorizedException('Email already in use');
    }
  }

  async register1(email: string, session: any) {
    const dbUser = await this.databaseService.getUserByEmail(email);
    if (dbUser) {
      // user already in DB, if admin then we can give access to account
      if (dbUser.data.organizationRole === 'admin') {
        const min15 = 60 * 15;
        const sessionState = v4();
        const usages = 1; // can only use once
        await this.databaseService.addSignupSessionState(
          sessionState,
          Date.now() + 1000 * min15,
          usages
        );
        const jwt = await this.authService.signPayload(
          {
            clientId: dbUser.data.organizationId,
            createPassword: true,
            email,
            sessionState,
          },
          'single-create-password',
          {
            // Expires in 15 minutes
            expiresIn: min15,
          }
        );
        const createPasswordUrl = baseUrl(
          `account/create-password?token=${jwt}`
        );
        await this.postmarkService.createAccount(email, createPasswordUrl);
      } else {
        throw new UnauthorizedException('User is not account admin');
      }
    } else {
      // no user in DB, brand new account
    }
  }


  async setPassword(email: string, password: string, state: string) {
    const secureRounds = 10;
    const dbUser = await this.databaseService.getUserByEmail(email);
    let user: User;
    if (!dbUser) {
      // Create account
      const account = await this.createAccount({
        id: v4(),
        companyName: email,
        plan: 'prepricing',
        integrations: {},
        seats: 1,
        referrerUrl: 'https://videosupport.io',
        subscriptionType: 'trial',
      });
      // Create user
      user = new User(v4(), email, email, '', account.id, 'admin', true);

      await this.databaseService.createUser(user);
    } else {
      user = dbUser.data;
    }

    /* create trial subscription in stripe */

    var search_customer = await stripe.customers.search({
      query: `email:"`+email+`"`,
    });

    var customer_id = ''

    if(search_customer.data.length >= 1){

      customer_id = search_customer.data[0].id

    } else {  /* create customer */

       var create_customer = await stripe.customers.create({
        email: email,
        name: email,
      });

      if(create_customer.id) {
        customer_id = create_customer.id
      }
    }

    if(customer_id != '') {

      var trial_week = Number(process.env.TRIAL_WEEK);
      var now = new Date();
      var trial_end = Number(now.setDate(now.getDate() + 3));   // 3 day trial

      var divide = trial_end/1000;
      var trial_end_date = divide.toString().split(".")[0];

      const subscription = await stripe.subscriptions.create({
          customer: customer_id,
          items: [
            {
              price: process.env.TRIAL_PRODUCT_PRICE_ID,
            },
          ],
          trial_end: trial_end_date,
        });

      var clientId = user.organizationId;

      if(subscription && clientId) {

        await this.databaseService.updateSubscription(clientId, {
            stripeCustomerId: subscription.customer,
            stripeSubscriptionId: subscription.id,
        });
      }
    }

    const authorized = await this.databaseService.useSignupSessionOnce(state);
    if (!authorized) {
      throw new UnauthorizedException('Sign up link already used or expired');
    } else if (user) {
      hash(password, secureRounds).then(async (hashed) => {
        await this.databaseService.addUserPassword(user.id, hashed);
      });
    } else {
      throw new BadRequestException('Could not create user');
    }
  }

  async setPassword1(email: string, password: string, state: string) {
    const secureRounds = 10;
    const dbUser = await this.databaseService.getUserByEmail(email);
    const authorized = await this.databaseService.useSignupSessionOnce(state);
    if (dbUser && authorized) {
      hash(password, secureRounds).then(async (hashed) => {
        await this.databaseService.addUserPassword(dbUser.data.id, hashed);
      });
    } else {
      let msg;
      if (!authorized) msg = 'Sign up link already used or expired';
      else msg = 'Cannot find user';
      console.error(msg);
      throw new UnauthorizedException(msg);
    }
  }

  async getUser(email: string) {
    const dbUser = await this.databaseService.getUserByEmail(email);

    if ( dbUser ) {
      return dbUser;
    }
    return false
  }

  async getUserForCrispWidget(clientId:string, email: string) {
    const dbUser = await this.databaseService.getUserForCrispWidget(clientId, email);

    if ( dbUser ) {
      return dbUser;
    }
    return false
  }

  async crispEmailLogin(email: string, password: string, crisp_client_id:string, crisp_email:string,) {
    const dbUser = await this.databaseService.getUserByEmail(email);
    
    if (
      dbUser &&
      dbUser.data.hashedPassword
    ) {

      const res = await compare(password, dbUser.data.hashedPassword);

      if (res) {

          if(!dbUser.data.organizationId){
            return 'no_pass'

          } else {

            var organizationId = dbUser.data.organizationId;

            if(crisp_client_id != organizationId) {
              return 'no_pass'
            }
          }

          var organizationId = dbUser.data.organizationId
          const updateUser = await this.databaseService.updateUserCrispWidgetStatus(organizationId, {
              crisp_client_id:crisp_client_id
          });
        

        const jwt: string = await this.authService.signPayload(
          {
            clientId: dbUser.data.organizationId,
            userId: dbUser.data.id,
            name: dbUser.data.name,
            email: dbUser.data.email,
          },
          dbUser.data.organizationRole
        );
        return jwt;
      }
    }
    throw new UnauthorizedException();
  }

  async emailLogin(email: string, password: string) {
    const dbUser = await this.databaseService.getUserByEmail(email);

    if (
      dbUser &&
      dbUser.data.hashedPassword &&
      dbUser.data.organizationRole === 'admin'
    ) {
      const res = await compare(password, dbUser.data.hashedPassword);
      if (res) {

        const jwt: string = await this.authService.signPayload(
          {
            clientId: dbUser.data.organizationId,
            userId: dbUser.data.id,
            name: dbUser.data.name,
            email: dbUser.data.email,
          },
          dbUser.data.organizationRole
        );
        return jwt;
      }
    }
    throw new UnauthorizedException();
  }
}
