import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionComercialPage } from './gestion-comercial.page';

describe('GestionComercialPage', () => {
  let component: GestionComercialPage;
  let fixture: ComponentFixture<GestionComercialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionComercialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
