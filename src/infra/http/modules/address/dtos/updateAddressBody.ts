import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAddressBody {
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
