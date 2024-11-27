import {} from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

export const TestingModules = [HttpClientTestingModule, RouterTestingModule];

@Component({ selector: 'app-dashboard', template: '' })
export class DashboardStubComponent {}
@Component({ selector: 'app-page-builder', template: '' })
export class PageBuilderStubComponent {}
@Component({ selector: 'app-sidenav', template: '' })
export class SidenavStubComponent {}
@Component({ selector: 'app-header', template: '' })
export class HeaderStubComponent {}
@Component({ selector: 'app-manage-user', template: '' })
export class ManageUserStubComponent {}
@Component({ selector: 'app-user-form', template: '' })
export class UserFormStubComponent {}
