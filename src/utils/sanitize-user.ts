import { UserRes } from 'types';
import { User } from '../user/user.entity';

export const sanitizeUser = (user: User): UserRes => {
  const { id, role, email } = user;

  return { id, role, email };
};
