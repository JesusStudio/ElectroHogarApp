import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosListadoPage } from './productos-listado.page';

describe('ProductosListadoPage', () => {
  let component: ProductosListadoPage;
  let fixture: ComponentFixture<ProductosListadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosListadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
