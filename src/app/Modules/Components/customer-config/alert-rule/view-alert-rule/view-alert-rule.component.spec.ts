import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAlertRuleComponent } from './view-alert-rule.component';

describe('ViewAlertRuleComponent', () => {
  let component: ViewAlertRuleComponent;
  let fixture: ComponentFixture<ViewAlertRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAlertRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAlertRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
