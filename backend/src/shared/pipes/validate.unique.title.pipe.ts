import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidUniqueTitle } from '../story-element/story.element.utils';

@Injectable()
export class ValidateUniqueTitlePipe implements PipeTransform {
  transform({
    neighborsTitle,
    suggestedTitle,
  }: {
    neighborsTitle: string[];
    suggestedTitle: string;
  }) {
    if (isValidUniqueTitle(suggestedTitle, neighborsTitle)) {
      return suggestedTitle;
    }

    throw new BadRequestException(
      `Chapter title '${suggestedTitle}' need to be unique for book`,
    );
  }
}
