import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEvent } from './models/calendar-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEvent])],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
