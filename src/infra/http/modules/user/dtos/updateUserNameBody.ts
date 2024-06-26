import { IsNotEmptyCustom } from '../../../classValidator/decorators/IsNotEmptyCustom';
import { IsStringCustom } from '../../../classValidator/decorators/IsStringCustom';

export class UpdateUserNameBody {
  @IsStringCustom()
  @IsNotEmptyCustom()
  name: string;
}
