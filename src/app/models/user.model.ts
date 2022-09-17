export default interface IUser {
  email: string;
  name: string;
  password?: string;
  age: number;
  phoneNumber: string;
}

// we can use classes instead of interfaces, if we need methods.But classes increses bundle size
// export default class IUser {
//   email?: string;
//   name?: string;
//   password?: string;
//   age?: number;
//   phoneNumber?: string;
// }
