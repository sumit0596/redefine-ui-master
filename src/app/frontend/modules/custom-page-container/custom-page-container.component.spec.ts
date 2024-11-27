import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPageContainerComponent } from './custom-page-container.component';

describe('CustomPageContainerComponent', () => {
  let component: CustomPageContainerComponent;
  let fixture: ComponentFixture<CustomPageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomPageContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
