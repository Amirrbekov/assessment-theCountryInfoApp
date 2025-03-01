import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https'
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarEvent } from './models/calendar-event.entity';

@Injectable()
export class CalendarService {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(CalendarEvent)
        private readonly calendarEventRepository: Repository<CalendarEvent>,
    ) {}

    public async saveHolidays(userId: number, holidays: any[]): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw new Error('User not found');
        }


        const events = holidays.map((holiday) => {
            const event = new CalendarEvent();
            event.title = holiday.name;
            event.date = new Date(holiday.date);
            event.description = `Public holiday in ${holiday.countryCode}`;
            event.user = user;
            return event;
        });
    
        await this.calendarEventRepository.save(events);
    }

    public async getHolidays(year: number, countryCode: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            https.get(`${this.configService.getOrThrow<string>('COUNTRY_PUBLIC_HOLIDAYS_URL')}/${year}/${countryCode}`, (response) => {
                let data = '';

                response.on('data', (c) => {
                    data += c
                })

                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data)

                        resolve(parsedData)
                    } catch (error) {
                        reject(error)
                    }
                })

                response.on('error', (error) => {
                    reject(error)
                })
            })
        })
    }

    async filterHolidays(holidays: any[], selectedHolidays: string[]): Promise<any[]> {
        if (!selectedHolidays || selectedHolidays.length === 0) {
          return holidays;
        }
      
        return holidays.filter((holiday) => selectedHolidays.includes(holiday.name));
      }
}
