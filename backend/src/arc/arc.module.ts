import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArcController } from './arc.controller';
import { ArcService } from './arc.service';
import { Arc, ArcSchema } from './schemas/arc.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Arc.name, schema: ArcSchema }]),
    // ClsService,
  ],
  controllers: [ArcController],
  providers: [ArcService],
})
export class ArcModule {}
