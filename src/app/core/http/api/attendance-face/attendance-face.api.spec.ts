import { TestBed } from '@angular/core/testing';
import { AttendanceFaceApi } from './attendance-face.api';

describe('AttendanceFaceApi', () => {
  let service: AttendanceFaceApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceFaceApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
