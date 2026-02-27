import { TestBed } from '@angular/core/testing';

import { DowmloadFileService } from './dowmload-file.service';

describe('DowmloadFileService', () => {
  let service: DowmloadFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DowmloadFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
