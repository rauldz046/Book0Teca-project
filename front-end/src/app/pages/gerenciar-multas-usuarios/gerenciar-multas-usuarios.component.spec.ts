import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarMultasUsuariosComponent } from './gerenciar-multas-usuarios.component';

describe('GerenciarMultasUsuariosComponent', () => {
  let component: GerenciarMultasUsuariosComponent;
  let fixture: ComponentFixture<GerenciarMultasUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerenciarMultasUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarMultasUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
