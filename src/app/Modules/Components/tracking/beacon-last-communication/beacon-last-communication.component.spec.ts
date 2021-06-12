import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeaconLastCommunicationComponent } from './beacon-last-communication.component';

describe('BeaconLastCommunicationComponent', () => {
  let component: BeaconLastCommunicationComponent;
  let fixture: ComponentFixture<BeaconLastCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeaconLastCommunicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeaconLastCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
