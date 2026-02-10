import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciamentoFinanceiroComponent } from './gerenciamento-financeiro.component';

describe('GerenciamentoFinanceiroComponent', () => {
  let component: GerenciamentoFinanceiroComponent;
  let fixture: ComponentFixture<GerenciamentoFinanceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerenciamentoFinanceiroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciamentoFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
