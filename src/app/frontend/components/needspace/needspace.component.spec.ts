import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedspaceComponent } from './needspace.component';

describe('NeedspaceComponent', () => {
  let component: NeedspaceComponent;
  let fixture: ComponentFixture<NeedspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeedspaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeedspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
