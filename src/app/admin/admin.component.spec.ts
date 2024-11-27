import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DashboardStubComponent,
  HeaderStubComponent,
  ManageUserStubComponent,
  PageBuilderStubComponent,
  SidenavStubComponent,
  TestingModules,
} from '../testing/mocks';

import { AdminComponent } from './admin.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminComponent,
        DashboardStubComponent,
        PageBuilderStubComponent,
        SidenavStubComponent,
        HeaderStubComponent,
        ManageUserStubComponent,
      ],
      imports: [TestingModules],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
