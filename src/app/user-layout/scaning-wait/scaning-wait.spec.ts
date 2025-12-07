import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaningWait } from './scaning-wait';

describe('ScaningWait', () => {
  let component: ScaningWait;
  let fixture: ComponentFixture<ScaningWait>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaningWait]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScaningWait);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
