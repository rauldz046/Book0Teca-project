import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInFormUserComponent } from './sign-in-form-user.component';

describe('SignInFormUserComponent', () => {
  let component: SignInFormUserComponent;
  let fixture: ComponentFixture<SignInFormUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInFormUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInFormUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
