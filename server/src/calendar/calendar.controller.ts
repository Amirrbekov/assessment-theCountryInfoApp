import { Body, Controller, Param, Post } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { AddHolidaysDto } from './dtos/add-holiday.dto';

@Controller('users/:userId/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('holidays')
  async addHolidays(
    @Param('userId') userId: number,
    @Body() addHolidaysDto: AddHolidaysDto,
  ) {
    const { countryCode, year, holidays } = addHolidaysDto;

    const allHolidays = await this.calendarService.getHolidays(year, countryCode);

    const filteredHolidays = await this.calendarService.filterHolidays(
      allHolidays,
      holidays!,
    );

    await this.calendarService.saveHolidays(userId, filteredHolidays);

    return {
      message: 'Holidays added to calendar successfully',
      holidays: filteredHolidays,
    };
  }
}
