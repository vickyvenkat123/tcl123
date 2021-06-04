import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayDashboardComponent } from './gateway-dashboard.component';

describe('GatewayDashboardComponent', () => {
  let component: GatewayDashboardComponent;
  let fixture: ComponentFixture<GatewayDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatewayDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
