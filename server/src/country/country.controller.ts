import { Controller, Get, Post, Query } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('available-countries')
  public async getAvailableCountries() {
    return await this.countryService.getAvailableCountries()
  }

  @Get('get-country-info')
  public async getDetailedInformationCountry(@Query('countryCode') countryCode: string) {
    return await this.countryService.getDetailedInformationCountry(countryCode)
  }
}
