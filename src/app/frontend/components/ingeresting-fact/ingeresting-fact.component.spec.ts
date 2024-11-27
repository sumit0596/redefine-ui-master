import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngerestingFactComponent } from './ingeresting-fact.component';

describe('IngerestingFactComponent', () => {
  let component: IngerestingFactComponent;
  let fixture: ComponentFixture<IngerestingFactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngerestingFactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngerestingFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
