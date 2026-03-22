import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtividadeUsuariosComponent } from './atividade-usuarios.component';

describe('AtividadeUsuariosComponent', () => {
  let component: AtividadeUsuariosComponent;
  let fixture: ComponentFixture<AtividadeUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtividadeUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtividadeUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
