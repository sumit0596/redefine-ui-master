import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTenContentComponent } from './top-ten-content.component';

describe('TopTenContentComponent', () => {
  let component: TopTenContentComponent;
  let fixture: ComponentFixture<TopTenContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopTenContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopTenContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
