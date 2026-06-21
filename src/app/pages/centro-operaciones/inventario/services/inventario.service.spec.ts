import { TestBed } from '@angular/core/testing';

import { Inventario } from './inventario.service';

describe('Inventario', () => {
  let service: Inventario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Inventario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
