import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaidaLivrosComponent } from './saida-livros.component';

describe('SaidaLivrosComponent', () => {
  let component: SaidaLivrosComponent;
  let fixture: ComponentFixture<SaidaLivrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaidaLivrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaidaLivrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
