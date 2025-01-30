import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../dtos/user.dto';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    // Run something before a request is handled
    // by the request handler
    console.log('context: ', context);

    return next.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        console.log('응답이 나가기 전에 실행: ', data);
        return plainToClass(UserDto, data, {
          excludeExtraneousValues: true, // expose 데코레이터가 적용되도록 하는 설정
        });
      }),
    );
  }
}
