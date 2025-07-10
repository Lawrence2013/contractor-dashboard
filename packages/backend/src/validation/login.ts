export interface LoginInput {
  username: string;
  password: string;
}

export const loginSchema = {
  validate(data: any): { value?: LoginInput; error?: Error } {
    if (typeof data.username !== 'string' || data.username.length === 0) {
      return { error: new Error('username is required') };
    }
    if (typeof data.password !== 'string' || data.password.length === 0) {
      return { error: new Error('password is required') };
    }
    return { value: data as LoginInput };
  },
};
