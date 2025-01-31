import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  // 조건이 falsy일 때 아래 데이터로 자동 반환
  // {
  //     "message": "Forbidden resource",
  //     "error": "Forbidden",
  //     "statusCode": 403
  //   }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return request.session.userId;
  }
}
