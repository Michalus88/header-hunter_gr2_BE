import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { isCorrectGitHubUserAccount } from 'src/utils/is-correct-github-user';

@Injectable()
export class GithubUserValidate implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const [req] = context.getArgs();

    const { githubUsername } = req.body;

    if (!(await isCorrectGitHubUserAccount(githubUsername))) {
      try {
        const res = await fetch(
          `https://api.github.com/users/${githubUsername}`,
        );
        const json = await res.json();

        if (json.resources.core.remaining == 0) throw new Error();
      } catch {
        throw new BadRequestException(
          `GitHub user validation error. GitHub remaining limit request is 0. Try later.`,
        );
      }
    } else {
      throw new BadRequestException(
        'GitHub user validation error. GitHub user not exist or not connection to GitHub website.',
      );
    }

    return next.handle();
  }
}
