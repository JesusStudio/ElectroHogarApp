import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EtiquetadoPage } from './etiquetado.page';

describe('EtiquetadoPage', () => {
  let component: EtiquetadoPage;
  let fixture: ComponentFixture<EtiquetadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EtiquetadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
