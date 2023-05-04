import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { ChapterService } from '../../chapter/chapter.service';
import { IZordContext } from '../../interfaces/cls.store';

@Injectable()
export class FetchChapterByIdPipe implements PipeTransform {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly cls: ClsService<IZordContext>,
  ) {}

  async transform(chapterId: string) {
    const contextChapter = this.cls.get('chapter');
    if (contextChapter && contextChapter._id.toString() === chapterId) {
      return contextChapter;
    }
    const chapter = await this.chapterService.findById(chapterId);
    if (!chapter) {
      throw new NotFoundException(`Chapter with id ${chapterId} not found.`);
    }

    return chapter;
  }
}
