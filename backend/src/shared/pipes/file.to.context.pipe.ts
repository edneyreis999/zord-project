import { Injectable, PipeTransform } from '@nestjs/common';
import { TextFileService } from '../../text-file/text-file.service';

@Injectable()
export class FileToStringPipe implements PipeTransform {
  constructor(private readonly textFileService: TextFileService) {}
  async transform(file: Express.Multer.File): Promise<string> {
    const content = await this.textFileService.readFile(file);
    return content;
  }
}
