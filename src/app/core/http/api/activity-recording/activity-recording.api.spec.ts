import { TestBed } from '@angular/core/testing';
import { ActivityRecordingApi } from './activity-recording.api';

describe('ActivityRecordingApi', () => {
  let service: ActivityRecordingApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityRecordingApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
