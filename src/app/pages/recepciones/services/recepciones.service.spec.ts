import { TestBed } from '@angular/core/testing';

import { Recepciones } from './recepciones.service';

describe('Recepciones', () => {
  let service: Recepciones;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Recepciones);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
