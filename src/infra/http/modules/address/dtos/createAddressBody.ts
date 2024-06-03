import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressBody {
  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsInt()
  houseNumber: number;

  @IsOptional()
  @IsString()
  description?: string;
}
