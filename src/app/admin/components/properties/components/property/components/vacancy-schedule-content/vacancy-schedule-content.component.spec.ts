import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancyScheduleContentComponent } from './vacancy-schedule-content.component';

describe('VacancyScheduleContentComponent', () => {
  let component: VacancyScheduleContentComponent;
  let fixture: ComponentFixture<VacancyScheduleContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacancyScheduleContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacancyScheduleContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
