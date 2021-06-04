import { TestBed } from '@angular/core/testing';

import { CityConfigService } from './city-config.service';

describe('CityConfigService', () => {
  let service: CityConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
