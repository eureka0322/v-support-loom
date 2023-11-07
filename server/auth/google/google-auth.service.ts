import { Profile } from 'passport';
import { Injectable } from '@nestjs/common';

import { v4 as uuidv4, v4 } from 'uuid';
import ShortUniqueId from 'short-unique-id';
import { shortenWithAlias } from 'tinyurl';
import { sign } from 'jsonwebtoken';

import { baseUrl } from '../../utils';

import { ConfigService } from '../../config/config.service';
import { UsersRepository } from '../../database/users/users.repository';
import { ClientRepository } from '../../database/client/client.repository';

import { User as UserModel } from '../../database/users/users.model';
import { Client as ClientModel } from '../../database/client/client.model';
import { AccountService } from '../../account/account.service';

export interface GoogleUser {
  id: string;
  accessToken: string;
  name: string;
  email: string;
  jwt?: string;
  photo: string;
}

@Injectable()
export class GoogleAuthService {
  private readonly jwtSecret: string;
  constructor(
    configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly clientRepository: ClientRepository,
    private readonly accountService: AccountService
  ) {
    this.jwtSecret = configService.getString('JWT_SECRET', false);
  }

  validateUser(accessToken: string, profile: Profile) {
    return {
      id: profile.id,
      accessToken: accessToken,
      name: profile.displayName,
      email: profile.emails?.[0].value || '',
      photo: profile.photos?.[0].value || '',
    };
  }

  async getClient(clientId: string) {
    var org = await this.clientRepository.getClientByClientId(clientId);

    if (org) {
      return org.data.subscription;
    }
    return false
  }

  async findUser(user: GoogleUser) {
    const dbUser = await this.usersRepository.getUserByEmail(user.email);

    if (dbUser) {
      return dbUser.data;
    }
    return false
  }

  async findOrCreate(user: GoogleUser) {
    const dbUser = await this.usersRepository.getUserByEmail(user.email);

    if (dbUser) {
      return dbUser.data;
    }

    const clientId = v4();
    await this.accountService.createAccount({
      id: clientId,
      companyName: 'Client',
      plan: 'solo',
      integrations: {},
      seats: 1,
      referrerUrl: 'https://videosupport.io',
      subscriptionType: 'trial',
    });

    const organizationRole = 'admin';

    const newUserObject = new UserModel(
      uuidv4(),
      user.name,
      user.email,
      user.photo,
      clientId,
      organizationRole,
      true
    );

    const newUserDocRefId = await this.usersRepository.createUser(
      newUserObject
    );

    if (newUserDocRefId) {
      return newUserObject;
    }

    return undefined;
    
  }
}
