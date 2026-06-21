import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EtiquetadoListadoPage } from './etiquetado-listado.page';

describe('EtiquetadoListadoPage', () => {
  let component: EtiquetadoListadoPage;
  let fixture: ComponentFixture<EtiquetadoListadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EtiquetadoListadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
