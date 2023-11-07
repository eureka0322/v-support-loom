import { Injectable } from '@nestjs/common';

import { DatabaseRepository } from '../database.repository';
import { ROICalculation, collection, converter } from './roicalculator.model';

@Injectable()
export class ROICalculatorRepository extends DatabaseRepository<ROICalculation> {
  collection = collection;
  converter = converter;

  async submitCalculation(ROICalculation: ROICalculation) {
    const data = await this.add(ROICalculation);
    return data.id;
  }

  async getROICalculationByEmail(email: string) {
    const snapshot = await this.where('email', '==', email).get();
    const data = this.extractOne(snapshot);
    return data;
  }
}
