import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmprestimosAtivosComponent } from './emprestimos-ativos.component';

describe('EmprestimosAtivosComponent', () => {
  let component: EmprestimosAtivosComponent;
  let fixture: ComponentFixture<EmprestimosAtivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmprestimosAtivosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmprestimosAtivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
