import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { BarGraphComponent } from './components/bar-graph/bar-graph.component';

@NgModule({
  declarations: [LoaderComponent, SafeHtmlPipe, BarGraphComponent],
  imports: [CommonModule],
  exports: [LoaderComponent, SafeHtmlPipe, BarGraphComponent],
})
export class SharedModule {}
