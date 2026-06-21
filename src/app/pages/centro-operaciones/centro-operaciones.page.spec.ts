import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CentroOperacionesPage } from './centro-operaciones.page';

describe('CentroOperacionesPage', () => {
  let component: CentroOperacionesPage;
  let fixture: ComponentFixture<CentroOperacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroOperacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
