import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneViolationComponent } from './zone-violation.component';

describe('ZoneViolationComponent', () => {
  let component: ZoneViolationComponent;
  let fixture: ComponentFixture<ZoneViolationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneViolationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneViolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
