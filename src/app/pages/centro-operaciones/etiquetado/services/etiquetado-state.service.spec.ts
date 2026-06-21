import { TestBed } from '@angular/core/testing';

import { EtiquetadoState } from './etiquetado-state.service';

describe('EtiquetadoState', () => {
  let service: EtiquetadoState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtiquetadoState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
