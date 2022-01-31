import { TestBed } from '@angular/core/testing';

import { WavesService } from './waves.service';

describe('WavesService', () => {
  let service: WavesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WavesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
