import { TestBed, inject } from '@angular/core/testing';

import { TiltscoreService } from './tiltscore.service';

describe('TiltscoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TiltscoreService]
    });
  });

  it('should be created', inject([TiltscoreService], (service: TiltscoreService) => {
    expect(service).toBeTruthy();
  }));
});
