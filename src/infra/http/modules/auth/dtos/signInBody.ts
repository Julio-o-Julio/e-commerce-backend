import { IsNotEmptyCustom } from '../../../classValidator/decorators/IsNotEmptyCustom';
import { IsStringCustom } from '../../../classValidator/decorators/IsStringCustom';
import { IsEmailCustom } from '../../../classValidator/decorators/IsEmailCustom';
import { MinLengthCustom } from '../../../classValidator/decorators/MinLengthCustom';

export class SignInBody {
  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsEmailCustom()
  email: string;

  @IsNotEmptyCustom()
  @IsStringCustom()
  @MinLengthCustom(8)
  password: string;
}
