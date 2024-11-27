import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalpropertydialogComponent } from './internationalpropertydialog.component';

describe('InternationalpropertydialogComponent', () => {
  let component: InternationalpropertydialogComponent;
  let fixture: ComponentFixture<InternationalpropertydialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternationalpropertydialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternationalpropertydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
