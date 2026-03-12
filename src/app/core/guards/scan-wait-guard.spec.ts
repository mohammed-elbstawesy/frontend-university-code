import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { scanWaitGuard } from './scan-wait-guard';

describe('scanWaitGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => scanWaitGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
