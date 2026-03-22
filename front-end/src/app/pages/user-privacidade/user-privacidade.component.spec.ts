import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrivacidadeComponent } from './user-privacidade.component';

describe('UserPrivacidadeComponent', () => {
  let component: UserPrivacidadeComponent;
  let fixture: ComponentFixture<UserPrivacidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPrivacidadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPrivacidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
