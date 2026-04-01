import { Injectable } from '@nestjs/common';

@Injectable()
export class SanctionsPolicyService {
  // Can be moved to ConfigService later.
  readonly warningThreshold = 3;
  readonly warningWindowDays = 30;
  readonly defaultSuspendDays = 7;
}
