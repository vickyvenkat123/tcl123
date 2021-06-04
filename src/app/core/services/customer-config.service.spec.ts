import { TestBed } from '@angular/core/testing';

import { CustomerConfigService } from './customer-config.service';

describe('CustomerConfigService', () => {
  let service: CustomerConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
