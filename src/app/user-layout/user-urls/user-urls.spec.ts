import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUrls } from './user-urls';

describe('UserUrls', () => {
  let component: UserUrls;
  let fixture: ComponentFixture<UserUrls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUrls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUrls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
