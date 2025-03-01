import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CountryModule } from '../country/country.module';
import { CalendarModule } from '../calendar/calendar.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEvent } from '../calendar/models/calendar-event.entity';
import { User } from '../calendar/models/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        entities: [User, CalendarEvent],
        synchronize: true, 
      }),
    }),
    CountryModule,
    CalendarModule
  ],
})
export class CoreModule {}
