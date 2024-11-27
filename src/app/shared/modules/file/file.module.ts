import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FileComponent } from './file.component';
import { FileContainerComponent } from './file-container/file-container.component';
import { DragAndDropDirective } from './drag-and-drop.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [FileComponent, FileContainerComponent, DragAndDropDirective],
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  exports: [FileComponent, FileContainerComponent],
  providers:[TitleCasePipe]
})
export class FileModule {}
