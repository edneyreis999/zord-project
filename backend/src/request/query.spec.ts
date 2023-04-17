import { PaginateQueryPage, BasicFilterDto } from './query';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { QueryManyBookDto } from '../book/dto/query.dto';

describe('query', () => {
  describe('PaginateQueryPage', () => {
    it('should have default values for offset and limit', () => {
      const page = new PaginateQueryPage();

      expect(page.offset).toEqual(0);
      expect(page.limit).toEqual(10);
    });

    it('should cast offset and limit to numbers when provided as strings', () => {
      const page = plainToClass(PaginateQueryPage, {
        offset: '0',
        limit: '1',
      });

      expect(page.offset).toEqual(0);
      expect(page.limit).toEqual(1);
      expect(typeof page.offset).toBe('number');
      expect(typeof page.limit).toBe('number');
    });
  });

  describe('Sort Transform', () => {
    it('should transform sort string into array', () => {
      const sortString = 'title,-createdAt';

      const queryDto = plainToClass(QueryManyBookDto, {
        sort: sortString,
      });

      expect(queryDto.sort).toEqual(['title', '-createdAt']);
    });
  });

  describe('Include Transform', () => {
    it('should transform include string into array', () => {
      const includeString = 'book,author';

      const queryDto = plainToClass(QueryManyBookDto, {
        include: includeString,
      });

      expect(queryDto.include).toEqual(['book', 'author']);
    });
  });

  describe('Page Transform', () => {
    it('should transform page object into PaginateQueryPage instance', () => {
      const pageObject = {
        offset: 0,
        limit: 10,
      };

      const queryDto = plainToClass(QueryManyBookDto, {
        page: pageObject,
      });

      expect(queryDto.page).toBeInstanceOf(PaginateQueryPage);
      expect(queryDto.page.offset).toEqual(0);
      expect(queryDto.page.limit).toEqual(10);
    });
  });

  describe('Filter Transform', () => {
    it('should transform filter object into BasicFilterDto instance', () => {
      const filterObject = {
        id: '6431a7c0272aea5bdcfa550f',
      };

      const queryDto = plainToClass(QueryManyBookDto, {
        filter: filterObject,
      });

      expect(queryDto.filter).toBeInstanceOf(BasicFilterDto);
      expect(queryDto.filter.id).toEqual('6431a7c0272aea5bdcfa550f');
    });
  });

  describe('BasicFilterDto', () => {
    it('should validate id as a string', async () => {
      const basicFilterDto = new BasicFilterDto();
      basicFilterDto.id = '6431a7c0272aea5bdcfa550f';

      const errors = await validate(basicFilterDto);

      expect(errors.length).toBe(0);
    });

    it('should not validate id as a number', async () => {
      const basicFilterDto = new BasicFilterDto();
      basicFilterDto.id = 6431 as any;

      const errors = await validate(basicFilterDto);

      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
