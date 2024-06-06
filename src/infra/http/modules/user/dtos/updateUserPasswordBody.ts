import { IsNotEmptyCustom } from '../../../classValidator/decorators/IsNotEmptyCustom';
import { IsStringCustom } from '../../../classValidator/decorators/IsStringCustom';
import { MinLengthCustom } from '../../../classValidator/decorators/MinLengthCustom';

export class UpdateUserPasswordBody {
  @IsNotEmptyCustom()
  @IsStringCustom()
  @MinLengthCustom(8)
  password: string;
}
