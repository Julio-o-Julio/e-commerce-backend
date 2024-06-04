export const ExceptionsMessage = {
  IsNotEmpty: (property: string) => `O campo ${property} é obrigatório`,
  IsEmail: (property: string) => `O campo ${property} deve ser um email válido`,
  IsString: (property: string) => `O campo ${property} deve ser um texto`,
  IsInt: (property: string) => `O campo ${property} deve ser um número inteiro`,
  MinLength: (property: string, min: number) =>
    `O campo ${property} deve ter no mínimo ${min} caracteres`,
};
