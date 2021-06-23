import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertRuleComponent } from './alert-rule.component';

describe('AlertRuleComponent', () => {
  let component: AlertRuleComponent;
  let fixture: ComponentFixture<AlertRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
