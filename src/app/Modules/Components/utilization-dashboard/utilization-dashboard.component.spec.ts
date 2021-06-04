import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilizationDashboardComponent } from './utilization-dashboard.component';

describe('UtilizationDashboardComponent', () => {
  let component: UtilizationDashboardComponent;
  let fixture: ComponentFixture<UtilizationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilizationDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilizationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
