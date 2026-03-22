import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucaoUsuariosComponent } from './devolucao-usuarios.component';

describe('DevolucaoUsuariosComponent', () => {
  let component: DevolucaoUsuariosComponent;
  let fixture: ComponentFixture<DevolucaoUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevolucaoUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevolucaoUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
