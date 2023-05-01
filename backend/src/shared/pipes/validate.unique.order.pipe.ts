import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {
  generateUniqueOrder,
  isValidUniqueOrder,
} from '../story-element/story.element.utils';

@Injectable()
export class ValidateUniqueOrderPipe implements PipeTransform {
  transform({
    neighborsOrder,
    suggestedOrder,
  }: {
    neighborsOrder: number[];
    suggestedOrder: number | string;
  }): number {
    if (suggestedOrder === undefined || suggestedOrder === null) {
      const newOrder = generateUniqueOrder();
      suggestedOrder = newOrder;

      while (!isValidUniqueOrder(suggestedOrder, neighborsOrder)) {
        const newOrder = generateUniqueOrder(suggestedOrder);
        suggestedOrder = newOrder;
      }
    } else {
      suggestedOrder = parseInt(suggestedOrder as string, 10);
      if (!isValidUniqueOrder(suggestedOrder, neighborsOrder)) {
        throw new BadRequestException(
          `Chapter order '${suggestedOrder}' need to be unique for book`,
        );
      }
    }

    return suggestedOrder;
  }
}
