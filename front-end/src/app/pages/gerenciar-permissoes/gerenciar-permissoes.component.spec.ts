import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarPermissoesComponent } from './gerenciar-permissoes.component';

describe('GerenciarPermissoesComponent', () => {
  let component: GerenciarPermissoesComponent;
  let fixture: ComponentFixture<GerenciarPermissoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerenciarPermissoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarPermissoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
