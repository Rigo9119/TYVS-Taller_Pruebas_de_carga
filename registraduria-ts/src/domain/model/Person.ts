import { Gender } from './Gender';

export interface Person {
  name: string;
  id: number;
  age: number;
  gender: Gender;
  alive: boolean;
}
