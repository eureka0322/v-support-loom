import { ConfigService } from '../config/config.service';
import * as moment from 'moment';
import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostmarkService {
  private readonly postmarkServerToken: string;
  private readonly postmarkFromEmail: string;
  private readonly postmarkRecordingTemplateId: string;
  private readonly postmarkRecordingTemplateAlias: string;
  private readonly postmarkIntercomInstallTemplateId: string;
  private readonly postmarkIntercomInstallTemplateAlias: string;
  private readonly postmarkZendeskInstallTemplateId: string;
  private readonly postmarkZendeskInstallTemplateAlias: string;
  private readonly postmarkSendLinkTemplateAlias: string;
  private readonly postmarkSendLinkTemplateId: string;
  private readonly postmarkSendLinkSupportTemplateAlias: string;
  private readonly postmarkSendLinkSupportTemplateId: string;
  private readonly postmarkCreateAccountAlias: string;
  private readonly postmarkCreateAccountId: string;

  constructor(configService: ConfigService) {
    this.postmarkServerToken = configService.getString(
      'POSTMARK_SERVER_TOKEN',
      false
    );
    this.postmarkFromEmail = configService.getString(
      'POSTMARK_FROM_EMAIL',
      false
    );
    this.postmarkRecordingTemplateId = configService.getString(
      'POSTMARK_VIDEO_RECORDING_TEMPLATE_ID',
      false
    );
    this.postmarkRecordingTemplateAlias = configService.getString(
      'POSTMARK_VIDEO_RECORDING_TEMPLATE_ALIAS',
      false
    );
    this.postmarkIntercomInstallTemplateId = configService.getString(
      'POSTMARK_INTERCOM_INSTALL_TEMPLATE_ID',
      false
    );
    this.postmarkIntercomInstallTemplateAlias = configService.getString(
      'POSTMARK_INTERCOM_INSTALL_TEMPLATE_ALIAS',
      false
    );
    this.postmarkZendeskInstallTemplateId = configService.getString(
      'POSTMARK_ZENDESK_INSTALL_TEMPLATE_ID',
      false
    );
    this.postmarkZendeskInstallTemplateAlias = configService.getString(
      'POSTMARK_ZENDESK_INSTALL_TEMPLATE_ALIAS',
      false
    );
    this.postmarkSendLinkTemplateAlias = configService.getString(
      'POSTMARK_SEND_LINK_TEMPLATE_ALIAS',
      false
    );
    this.postmarkSendLinkTemplateId = configService.getString(
      'POSTMARK_SEND_LINK_TEMPLATE_ID',
      false
    );
    this.postmarkSendLinkSupportTemplateAlias = configService.getString(
      'POSTMARK_VIDEO_RECORDING_SUPPORT_TEMPLATE_ALIAS',
      false
    );
    this.postmarkSendLinkSupportTemplateId = configService.getString(
      'POSTMARK_VIDEO_RECORDING_SUPPORT_TEMPLATE_ID',
      false
    );
    this.postmarkCreateAccountAlias = configService.getString(
      'POSTMARK_CREATE_ACCOUNT_TEMPLATE_ALIAS',
      false
    );
    this.postmarkCreateAccountId = configService.getString(
      'POSTMARK_CREATE_ACCOUNT_TEMPLATE_ID',
      false
    );
  }

  async sendLink(
    senderName: string,
    senderEmail: string,
    receiver: string,
    link: string,
    message?: string
  ) {
    const data = {
      From: this.postmarkFromEmail,
      To: receiver,
      // TODO(Joao): _check_v2
      // Needs to be company email
      ReplyTo: senderEmail,
      TemplateModel: {
        companyName: senderName,
        linkUrl: link,
        message: message,
      },
      TemplateId: this.postmarkSendLinkTemplateId,
      TemplateAlias: this.postmarkSendLinkTemplateAlias,
    };

    await axios({
      method: 'POST',
      url: 'https://api.postmarkapp.com/email/withTemplate',
      headers: {
        Accept: 'application/json',
        'X-Postmark-Server-Token': this.postmarkServerToken,
        'Content-Type': 'application/json; charset=utf-8',
      },
      data,
    }).catch((err) => {
      console.log(`[Postmark error] ${err}`);
    });

    return;
  }

  async recordingToRequester(
    date: number,
    requesterEmail: string,
    pageUrl: string,
    thumbnailUrl: string,
    videoId: string,
    customerEmail?: string
  ) {
    const dateFmt = moment(date).format('DD/MM/YY');
    const data = {
      From: this.postmarkFromEmail,
      To: requesterEmail,
      ReplyTo: customerEmail || 'francis@videosupport.io',
      TemplateModel: {
        pageUrl: pageUrl,
        thumbnailUrl: thumbnailUrl,
        date: dateFmt,
        videoId: videoId,
      },
      TemplateId: this.postmarkSendLinkSupportTemplateId,
      TemplateAlias: this.postmarkSendLinkSupportTemplateAlias,
    };

    const send = await axios({
      method: 'POST',
      url: `https://api.postmarkapp.com/email/withTemplate`,
      headers: {
        Accept: 'application/json',
        'X-Postmark-Server-Token': this.postmarkServerToken,
        'Content-Type': 'application/json; charset=utf-8',
      },
      data,
    }).catch((err) => {
      console.log('[postmark][recording][error]', err.response.data);
      return {
        status: 'error',
        error: err.response.data.ErrorCode,
        message: err.response.data.Message,
      };
    });

    if (send.status === 'error') {
      /* error – catch */
      return send;
    } else {
      return {
        status: 'ok',
        message: 'email sent',
      };
    }
  }
  async recording(
    date: number,
    customerEmail: string,
    pageUrl: string,
    thumbnailUrl: string,
    videoId: string
  ) {
    const dateFmt = moment(date).format('DD/MM/YY');
    const data = {
      From: this.postmarkFromEmail,
      To: customerEmail,
      ReplyTo: 'francis@videosupport.io',
      TemplateModel: {
        pageUrl: pageUrl,
        thumbnailUrl: thumbnailUrl,
        date: dateFmt,
        videoId: videoId,
      },
      TemplateId: this.postmarkRecordingTemplateId,
      TemplateAlias: this.postmarkRecordingTemplateAlias,
    };

    const send = await axios({
      method: 'POST',
      url: `https://api.postmarkapp.com/email/withTemplate`,
      headers: {
        Accept: 'application/json',
        'X-Postmark-Server-Token': this.postmarkServerToken,
        'Content-Type': 'application/json; charset=utf-8',
      },
      data,
    }).catch((err) => {
      console.log('[postmark][recording][error]', err.response.data);
      return {
        status: 'error',
        error: err.response.data.ErrorCode,
        message: err.response.data.Message,
      };
    });

    if (send.status === 'error') {
      /* error – catch */
      return send;
    } else {
      return {
        status: 'ok',
        message: 'email sent',
      };
    }
  }

  async installIntercom(name: string, email: string) {
    const data = {
      From: this.postmarkFromEmail,
      To: email,
      ReplyTo: 'francis@videosupport.io',
      TemplateModel: {
        name: name,
      },
      TemplateId: this.postmarkIntercomInstallTemplateId,
      TemplateAlias: this.postmarkIntercomInstallTemplateAlias,
    };

    const send = await axios({
      method: 'POST',
      url: `https://api.postmarkapp.com/email/withTemplate`,
      headers: {
        Accept: 'application/json',
        'X-Postmark-Server-Token': this.postmarkServerToken,
        'Content-Type': 'application/json; charset=utf-8',
      },
      data,
    }).catch((err) => {
      console.log('[postmark][recording][error]', err.response.data);
      return {
        status: 'error',
        error: err.response.data.ErrorCode,
        message: err.response.data.Message,
      };
    });

    if (send.status === 'error') {
      /* error – catch */
      return send;
    } else {
      return {
        status: 'ok',
        message: 'email sent',
      };
    }
  }

  async createAccount(email: string, actionUrl: string) {
    const data = {
      From: this.postmarkFromEmail,
      To: email,
      TemplateModel: { actionUrl },
      ReplyTo: 'francis@videosupport.io',
      TemplateId: this.postmarkCreateAccountId,
      TemplateAlias: this.postmarkCreateAccountAlias,
    };

    const send = await axios({
      method: 'POST',
      url: `https://api.postmarkapp.com/email/withTemplate`,
      headers: {
        Accept: 'application/json',
        'X-Postmark-Server-Token': this.postmarkServerToken,
        'Content-Type': 'application/json; charset=utf-8',
      },
      data,
    }).catch((err) => {
      console.log('[postmark][recording][error]', err.response.data);
      return {
        status: 'error',
        error: err.response.data.ErrorCode,
        message: err.response.data.Message,
      };
    });

    if (send.status === 'error') {
      /* error – catch */
      return send;
    } else {
      return {
        status: 'ok',
        message: 'email sent',
      };
    }
  }
  async installZendesk(name: string, email: string) {
    const data = {
      From: this.postmarkFromEmail,
      To: email,
      ReplyTo: 'francis@videosupport.io',
      TemplateModel: {
        name: name,
      },
      TemplateId: this.postmarkZendeskInstallTemplateId,
      TemplateAlias: this.postmarkZendeskInstallTemplateAlias,
    };

    const send = await axios({
      method: 'POST',
      url: `https://api.postmarkapp.com/email/withTemplate`,
      headers: {
        Accept: 'application/json',
        'X-Postmark-Server-Token': this.postmarkServerToken,
        'Content-Type': 'application/json; charset=utf-8',
      },
      data,
    }).catch((err) => {
      console.log('[postmark][recording][error]', err.response.data);
      return {
        status: 'error',
        error: err.response.data.ErrorCode,
        message: err.response.data.Message,
      };
    });

    if (send.status === 'error') {
      /* error – catch */
      return send;
    } else {
      return {
        status: 'ok',
        message: 'email sent',
      };
    }
  }
}
