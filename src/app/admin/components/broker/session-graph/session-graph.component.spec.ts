import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionGraphComponent } from './session-graph.component';

describe('SessionGraphComponent', () => {
  let component: SessionGraphComponent;
  let fixture: ComponentFixture<SessionGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SessionGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
