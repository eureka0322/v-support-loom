import { Injectable } from '@nestjs/common';

import { DatabaseRepository } from '../database.repository';
import { Feedback, collection, converter } from './feedback.model';

@Injectable()
export class FeedbackRepository extends DatabaseRepository<Feedback> {
  collection = collection;
  converter = converter;

  async submitUserFeedback(feedback: Feedback) {
    const data = await this.add(feedback);
    return data.id;
  }

  async getFeedback() {
    const snapshot = await this.get();
    const data = this.extract(snapshot);
    return data;
  }
}
