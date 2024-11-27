import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationContainerComponent } from './components/information-container/information-container.component';



const routes: Routes = [
  {path: 'about-us',  component: InformationContainerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformationsRoutingModule { }
