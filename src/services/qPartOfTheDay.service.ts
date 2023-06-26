import { Injectable, Inject, Scope } from '@nestjs/common';
import { QPart } from '../models/qPart.entity';
import { QPartsService } from './qPart.service';

@Injectable({ scope: Scope.DEFAULT })
export class QPartOfTheDayService {
  constructor(private qpartService: QPartsService) {
    this.qpotd = this.qpartService.getRandom();
  }

  public qpotd: Promise<QPart>;
}
