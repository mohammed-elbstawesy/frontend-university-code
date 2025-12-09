import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { notloginGuard } from './notlogin-guard';

describe('notloginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => notloginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
