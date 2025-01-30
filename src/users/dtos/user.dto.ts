import { Expose } from 'class-transformer';

// interceptor 응답 dto
export class UserDto {
  @Expose() // 이 프로퍼티를 포함하라
  id: number;

  @Expose()
  email: string;
}
