import { IsArray, IsISO31661Alpha2, IsNumber, IsOptional, IsString } from "class-validator";

export class AddHolidaysDto {
    @IsISO31661Alpha2()
    countryCode!: string;
  
    @IsNumber()
    year!: number;
  
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    holidays?: string[];
}