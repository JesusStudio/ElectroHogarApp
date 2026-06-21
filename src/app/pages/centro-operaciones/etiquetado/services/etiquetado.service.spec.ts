import { TestBed } from '@angular/core/testing';

import { Etiquetado } from './etiquetado-state.service';

describe('Etiquetado', () => {
  let service: Etiquetado;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Etiquetado);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
