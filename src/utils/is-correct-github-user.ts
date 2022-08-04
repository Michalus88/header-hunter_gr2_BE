import { NotFoundException } from '@nestjs/common';
import fetch from 'node-fetch';

export const isCorrectGitHubUserAccount = async (
  userGitHubAccount: string,
): Promise<boolean> => {
  if (typeof userGitHubAccount != 'string') return false;

  try {
    const res = await fetch(
      `https://api.github.com/users/${userGitHubAccount}`,
    );
    const json = await res.json();
    return json?.login ? true : false;
  } catch {
    throw new NotFoundException('Connection GitHub error.');
  }
};
