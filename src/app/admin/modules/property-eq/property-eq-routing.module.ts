import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyEqComponent } from './property-eq.component';
import { ManagePropertyEqComponent } from './components/manage-property-eq/manage-property-eq.component';
import { PropertyEqFormComponent } from './components/property-eq-form/property-eq-form.component';
import { ManagePropertyEqTagComponent } from './components/property-eq-tag/manage-property-eq-tag/manage-property-eq-tag.component';
import { PropertyEqTagFormComponent } from './components/property-eq-tag/property-eq-tag-form/property-eq-tag-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {path:'', component:PropertyEqComponent, children:[
    {
      path: '',
      component: DashboardComponent,
    },
    {
      path: 'manage-content',
      component: ManagePropertyEqComponent,
    },
    {
      path: 'create-content',
      component: PropertyEqFormComponent,
    },    
    {
      path: 'edit-content',
      component: PropertyEqFormComponent,
    },
    {
      path: 'view-content',
      component: PropertyEqFormComponent,
    },
    {
      path: 'manage-tags',
      component: ManagePropertyEqTagComponent,
    },
    {
      path: 'create-tag',
      component: PropertyEqTagFormComponent,
    },
    {
      path: 'view-tag',
      component: PropertyEqTagFormComponent,
    },
    {
      path: 'edit-tag',
      component: PropertyEqTagFormComponent,
    },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyEqRoutingModule { }
