interface UserSchema {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export class User {
  props: UserSchema;

  constructor() {
    
  }
}
