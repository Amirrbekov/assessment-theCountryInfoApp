import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https'
import { CountryInfoDto } from './dtos/country-info.dto';

@Injectable()
export class CountryService {
    constructor(private readonly configService: ConfigService) {}

    public async getAvailableCountries(): Promise<Object[]> {
        return new Promise((resolve, reject) => {
            https.get(this.configService.getOrThrow<string>('AVAILABLE_COUNTRIES_URL'), (response) => {
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

    public async getDetailedInformationCountry(countryCode: string): Promise<CountryInfoDto> {
        
        const borderCountries = await this.getBorderCountries(countryCode);

        const populationData = await this.getPopulationData(countryCode);

        const flagUrl = await this.getFlagUrl(countryCode);

        return {
            borderCountries,
            populationData,
            flagUrl
        }
    }

    private async getBorderCountries(countryCode: string): Promise<Object[]> {
        return new Promise((resolve, reject) => {
            https.get(`${this.configService.getOrThrow<string>('COUNTRY_INFO_URL')}/${countryCode}`, (response) => {
                let data = '';

                response.on('data', (c) => {
                    data += c
                })

                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data)

                        resolve(parsedData.borders)
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

    private async getPopulationData(countryCode: string): Promise<{ year: number; value: number }[]> {
        return new Promise((resolve, reject) => {
            https.get(this.configService.getOrThrow<string>('POPULATION_DATA_URL'), (response) => {
                let data = '';

                response.on('data', (c) => {
                    data += c
                })

                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data)

                        const countryData = parsedData.data.find(
                            (country) => country.code === countryCode
                        )

                        if (!countryData) {
                            reject(new Error(`Country with code ${countryCode} not found`));
                            return;
                        }

                        resolve(countryData.populationCounts)
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

    private async getFlagUrl(countryCode: string): Promise<string> {
        return new Promise((resolve, reject) => {
            https.get(this.configService.getOrThrow<string>('COUNTRY_FLAG_URL'), (response) => {
                let data = '';

                response.on('data', (c) => {
                    data += c
                })

                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data)

                        const countryData = parsedData.data.find(
                            (country) => country.iso3 === countryCode
                        )

                        resolve(countryData.flag)
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
}
