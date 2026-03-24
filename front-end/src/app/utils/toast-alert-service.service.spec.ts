import { TestBed } from '@angular/core/testing';

import { ToastAlertServiceService } from './toast-alert-service.service';

describe('ToastAlertServiceService', () => {
  let service: ToastAlertServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastAlertServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
