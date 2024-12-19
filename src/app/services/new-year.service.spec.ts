import { TestBed } from '@angular/core/testing';

import { NewYearService } from './new-year.service';

describe('NewYearService', () => {
  let service: NewYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewYearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
