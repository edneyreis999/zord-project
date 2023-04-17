import { StoryElementFilterDto } from './story.element.query.filter.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { QueryManyBookDto } from '../../book/dto/query.dto';
import { QueryOneChapterDto } from '../../chapter/dto/query.dto';
import { BasicFilterDto } from '../../request/query';

describe('StoryElementFilterDto', () => {
  describe('StoryElementFilterDto', () => {
    it('should validate title and slug as strings', async () => {
      const filterDto = new StoryElementFilterDto({
        title: 'Ghork',
        slug: 'ghork',
      });

      const errors = await validate(filterDto);

      expect(errors.length).toBe(0);
    });

    it('should not validate title and slug as numbers', async () => {
      const filterDto = new StoryElementFilterDto({
        title: 123 as any,
        slug: 123 as any,
      });

      const errors = await validate(filterDto);

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('StoryElementQueryManyDto', () => {
    it('should transform filter object into StoryElementFilterDto instance', () => {
      const filterObject = {
        title: 'Ghork',
        slug: 'ghork',
      };

      const queryManyDto = plainToClass(QueryManyBookDto, {
        filter: filterObject,
      });

      expect(queryManyDto.filter).toBeInstanceOf(StoryElementFilterDto);
      expect(queryManyDto.filter.title).toEqual('Ghork');
      expect(queryManyDto.filter.slug).toEqual('ghork');
    });
  });

  describe('StoryElementQueryOneDto', () => {
    it('should transform filter object into BasicFilterDto instance', () => {
      const filterObject = {
        id: '6431a7c0272aea5bdcfa550f',
      };

      const queryOneDto = plainToClass(QueryOneChapterDto, {
        filter: filterObject,
      });

      expect(queryOneDto.filter).toBeInstanceOf(BasicFilterDto);
      expect(queryOneDto.filter.id).toEqual('6431a7c0272aea5bdcfa550f');
    });
  });
});
