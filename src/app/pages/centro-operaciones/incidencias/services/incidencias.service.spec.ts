import { TestBed } from '@angular/core/testing';

import { Incidencias } from './incidencias.service';

describe('Incidencias', () => {
  let service: Incidencias;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Incidencias);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
