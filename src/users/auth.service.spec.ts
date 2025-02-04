import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // 테스트 모듈 생성
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@naver.com', '1234');

    expect(user.password).not.toEqual('1234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // find 함수를 'creates a new user with a salted and hashed password' 테스트에서는 빈 값이 있어야 성공이고,
    // 이 테스트에서는 동일한 값이 있어야 성공이기 (exception 발생) 때문에 find 함수 재정의
    // fakeUsersService.find = () => {
    //   return Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    // };
    await service.signup('asdf1@asdf.com', 'asdf');
    await expect(service.signup('asdf1@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('test@naver.com', '1234')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
    //   ]);
    await service.signup('1111@2222.com', 'passowrd');
    await expect(service.signin('1111@2222.com', 'passowrd2')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    // fakeUsersService.find = () => {
    //   return Promise.resolve([
    //     {
    //       id: 1,
    //       email: 'a@a.com',
    //       password:
    //         '042b248cce388ee5.f72a28364bd3c30a183c352f849d7101f043413f9fd4776d4d2fc1009da1cbb0',
    //     } as User,
    //   ]);
    // };
    await service.signup('test@naver.com', '1234');

    const user = await service.signin('test@naver.com', '1234');
    expect(user).toBeDefined();
  });
});
