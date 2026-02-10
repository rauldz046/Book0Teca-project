import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteTitleComponent } from './componente-title.component';

describe('ComponenteTitleComponent', () => {
  let component: ComponenteTitleComponent;
  let fixture: ComponentFixture<ComponenteTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponenteTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
