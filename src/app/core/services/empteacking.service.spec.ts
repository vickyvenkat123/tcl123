import { TestBed } from '@angular/core/testing';

import { EmpteackingService } from './empteacking.service';

describe('EmpteackingService', () => {
  let service: EmpteackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpteackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
