import { User } from '../user/user.entity';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Role } from '../../types';

export const validateActivationCredentials = (
  user: User,
  registerToken: string,
) => {
  if (!user) {
    throw new BadRequestException(
      'The account with the given id does not exist.',
    );
  }
  if (user.role !== Role.STUDENT) {
    throw new ForbiddenException('Only for student activation.');
  }
  if (user.isActive) {
    throw new ForbiddenException(
      'The account is already active. Please log in.',
    );
  }
  if (user.registerToken !== registerToken) {
    throw new BadRequestException('Invalid register token.');
  }
};
