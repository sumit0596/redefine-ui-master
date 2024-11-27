import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[DragAndDrop]',
})
export class DragAndDropDirective {
  @Output() fileDropped = new EventEmitter<any>();
  constructor() {}
  ngOnInit() {}
  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    (evt.target as HTMLElement).classList.add('active');
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    (evt.target as HTMLElement).classList.remove('active');
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    (evt.target as HTMLElement).classList.remove('active');
    this.fileDropped.emit(evt.dataTransfer);
  }
}
