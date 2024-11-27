import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdaLookupComponent } from './mda-lookup.component';

describe('MdaLookupComponent', () => {
  let component: MdaLookupComponent;
  let fixture: ComponentFixture<MdaLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdaLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdaLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
