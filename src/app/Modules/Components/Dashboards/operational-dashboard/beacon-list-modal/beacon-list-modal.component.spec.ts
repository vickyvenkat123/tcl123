import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeaconListModalComponent } from './beacon-list-modal.component';

describe('BeaconListModalComponent', () => {
  let component: BeaconListModalComponent;
  let fixture: ComponentFixture<BeaconListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeaconListModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeaconListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
