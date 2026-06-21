import { TestBed } from '@angular/core/testing';

import { GestionComercial } from './gestion-comercial.service';

describe('GestionComercial', () => {
  let service: GestionComercial;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionComercial);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
