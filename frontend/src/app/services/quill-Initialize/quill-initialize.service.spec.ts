import { TestBed } from '@angular/core/testing';

import { QuillInitializeService } from './quill-initialize.service';

describe('QuillInitializeService', () => {
  let service: QuillInitializeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuillInitializeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
