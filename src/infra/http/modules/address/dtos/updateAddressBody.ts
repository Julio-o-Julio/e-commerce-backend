import { IsNotEmptyCustom } from '../../../classValidator/decorators/IsNotEmptyCustom';
import { IsStringCustom } from '../../../classValidator/decorators/IsStringCustom';
import { IsIntCustom } from '../../../classValidator/decorators/IsIntCustom';
import { IsOptional } from 'class-validator';

export class UpdateAddressBody {
  @IsNotEmptyCustom()
  @IsStringCustom()
  postalCode: string;

  @IsNotEmptyCustom()
  @IsIntCustom()
  houseNumber: number;

  @IsOptional()
  @IsStringCustom()
  description?: string;
}
