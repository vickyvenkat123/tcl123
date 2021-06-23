import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRuleStatusComponent } from './change-rule-status.component';

describe('ChangeRuleStatusComponent', () => {
  let component: ChangeRuleStatusComponent;
  let fixture: ComponentFixture<ChangeRuleStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRuleStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRuleStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
