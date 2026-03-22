import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmprestimosUsuariosComponent } from './emprestimos-usuarios.component';

describe('EmprestimosUsuariosComponent', () => {
  let component: EmprestimosUsuariosComponent;
  let fixture: ComponentFixture<EmprestimosUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmprestimosUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmprestimosUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
