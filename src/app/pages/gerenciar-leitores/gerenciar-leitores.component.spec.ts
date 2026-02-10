import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarLeitoresComponent } from './gerenciar-leitores.component';

describe('GerenciarLeitoresComponent', () => {
  let component: GerenciarLeitoresComponent;
  let fixture: ComponentFixture<GerenciarLeitoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerenciarLeitoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarLeitoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
