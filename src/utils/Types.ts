export type TodoType = {
  _id?: string;
  description: string;
  completed?: boolean
}

export type UserType = {
  name: string;
  email: string;
  password?: string;
  age: number;
  _id: string;
} | undefined