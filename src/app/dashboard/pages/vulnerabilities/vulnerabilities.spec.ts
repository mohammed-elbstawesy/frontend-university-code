import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vulnerabilities } from './vulnerabilities';

describe('Vulnerabilities', () => {
  let component: Vulnerabilities;
  let fixture: ComponentFixture<Vulnerabilities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vulnerabilities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vulnerabilities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
