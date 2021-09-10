import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AnalitController } from './analit.controller';
import { AnalitService } from './analit.service';

@Module({
	imports: [HttpModule],
	controllers: [AnalitController],
	providers: [AnalitService],
	exports: [AnalitService],
})
export class AnalitModule {}
