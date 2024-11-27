import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';

@Component({
  selector: 'rd-editor',
  standalone: true,
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  imports: [CommonModule, AngularEditorModule, ReactiveFormsModule],
})
export class EditorComponent implements OnInit {

  @Input() id!: string;
  @Input() label!: string;
  @Input() form!: FormGroup;
  @Input() placeholder!: string;
  @Input() controlName!: string;
  @Input() editable: boolean = true;
  @Input() required: boolean = false;
  @Input() enableForm: boolean = true;
  @Input() height: string = "10rem";
  @Input() enableSource : boolean = false;
  @Output() onChange = new EventEmitter<any>();

  editorConfig: AngularEditorConfig = {
    editable: true,
    height: this.height,
    minHeight: '0',
    maxHeight: 'auto',
    width: '100',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'please provide',
    defaultParagraphSeparator: '',
    sanitize: true,
    outline: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['subscript', 'superscript', 'indent', 'outdent', 'fontName'],
      [
        'fontSize',
        // 'textColor',
        'backgroundColor',
        'customClasses',
        // 'link',
        // 'unlink',
        //'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ],
  };

  constructor(protected sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    
    this.editorConfig.height = this.height;
    
    if(this.enableSource){
      this.editorConfig.sanitize = false;
      this.editorConfig.toolbarHiddenButtons?.filter((item) => {
        item.filter((option)=> {
            const index = item.indexOf("toggleEditorMode", 0);
            if (index > -1) {
              item.splice(index, 1);
            }
        });
      });
    }else{
      this.editorConfig.sanitize = true;
    }
    
    this.editorConfig = {
      ...this.editorConfig,
      editable: this.editable,
      enableToolbar: this.editable,
      placeholder: this.placeholder,
    };
    this.form?.get(this.controlName)?.valueChanges.subscribe((result: any) => {
      let sanitizedResult = this.sanitizer.bypassSecurityTrustHtml(result);
      this.onChange.emit({
        form: this.form,
        control: this.controlName,
        value: sanitizedResult,
      });
    });
  }
}
