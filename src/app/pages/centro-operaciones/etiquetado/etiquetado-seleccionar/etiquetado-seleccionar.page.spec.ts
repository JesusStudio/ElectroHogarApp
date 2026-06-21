import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EtiquetadoSeleccionarPage } from './etiquetado-seleccionar.page';

describe('EtiquetadoSeleccionarPage', () => {
  let component: EtiquetadoSeleccionarPage;
  let fixture: ComponentFixture<EtiquetadoSeleccionarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EtiquetadoSeleccionarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
