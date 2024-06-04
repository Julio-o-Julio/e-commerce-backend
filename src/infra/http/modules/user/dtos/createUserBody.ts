import { MinLengthCustom } from '../../../classValidator/decorators/MinLengthCustom';
import { IsStringCustom } from '../../../classValidator/decorators/IsStringCustom';
import { IsNotEmptyCustom } from '../../../classValidator/decorators/IsNotEmptyCustom';
import { IsEmailCustom } from '../../../classValidator/decorators/IsEmailCustom';

export class CreateUserBody {
  @IsNotEmptyCustom()
  @IsStringCustom()
  name: string;

  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsEmailCustom()
  email: string;

  @IsNotEmptyCustom()
  @IsStringCustom()
  @MinLengthCustom(8)
  password: string;
}
