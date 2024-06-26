import { MinLengthCustom } from '../../../classValidator/decorators/MinLengthCustom';
import { IsStringCustom } from '../../../classValidator/decorators/IsStringCustom';
import { IsNotEmptyCustom } from '../../../classValidator/decorators/IsNotEmptyCustom';
import { IsEmailCustom } from '../../../classValidator/decorators/IsEmailCustom';

export class CreateUserBody {
  @IsStringCustom()
  @IsNotEmptyCustom()
  name: string;

  @IsEmailCustom()
  @IsStringCustom()
  @IsNotEmptyCustom()
  email: string;

  @MinLengthCustom(8)
  @IsStringCustom()
  @IsNotEmptyCustom()
  password: string;
}
