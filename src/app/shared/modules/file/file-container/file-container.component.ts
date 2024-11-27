import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'rd-file-container',
  templateUrl: './file-container.component.html',
  styleUrls: ['./file-container.component.scss'],
})
export class FileContainerComponent {
  @Input() label!: string;
  @Input() file: any;
  @Input() delete: boolean = true;
  @Input() preview: boolean = false;
  @Input() reorder: boolean = false;
  @Input() fileList!: any[];
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() onReorder: EventEmitter<any> = new EventEmitter<any>();

  drop(event: any) {
    moveItemInArray(this.fileList, event.previousIndex, event.currentIndex);
    if (event.previousIndex != event.currentIndex) {
      this.onReorder.emit(this.fileList);
    }
  }

  deleteFile(event: any) {
    this.onDelete.emit(event);
  }
  getThumbnail(fileName: string): string {
    let extension = fileName.split('.')[1];
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'assets/images/jpg.svg';
      case 'png':
        return 'assets/images/png.svg';
      case 'pdf':
        return 'assets/images/pdf.svg';
      case 'xlsx':
        return 'assets/images/excel.svg';
      case 'xls':
        return 'assets/images/excel.svg';
      default:
        return 'assets/images/file.svg';
    }
  }
}
