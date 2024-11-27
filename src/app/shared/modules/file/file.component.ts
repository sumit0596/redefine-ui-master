import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FILETYPE } from 'src/app/models/constants';
import { FILE_UPLOADS } from 'src/app/models/enum';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'rd-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
})
export class FileComponent implements OnInit {
  invalidMessage!: any;
  @Input() fileList: any[] = [];
  @Input() uploads: any[] = [];
  @Input() label!: string;
  @Input() id!: string;
  @Input() note!: string;
  @Input() controlName!: string;
  @Input() types!: string[];
  @Input() required: boolean = false;
  @Input() multiple: boolean = false;
  @Input() form!: FormGroup;
  @Output() onSelect = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit(): void {}

  selectFile(event: any, isDrop: boolean) {
    let files: any = isDrop
      ? event.files
      : (event.target as HTMLInputElement).files;
    if (this.checkExtension(files, this.controlName)) {
      this.onSelect.emit(files);
    } else {
      // this.onSelect.emit([]);
    }
    this.fileInput.nativeElement.value = '';
  }
  checkExtension(fileList: any[], controlName: string): boolean {
    let isValid: boolean = false;
    if (fileList && fileList.length > 0) {
      let result = [...fileList].filter(
        (f: any) => !this.types.includes(f.type)
      );
      let isValidFileSize = [...fileList].some((f: File) => {
        let size = Math.round(f.size / 1024);
        return size <= environment.FILE_SIZE.DEFAULT * 1024;
      });
      let isValidFIleSizeCv: any;
      if (controlName == FILE_UPLOADS.CV) {
        isValidFIleSizeCv = [...fileList].some((f: File) => {
          let size = Math.round(f.size / 1024);
          return size <= environment.FILE_SIZE.CV * 1024;
        });
      }
      let isValidFIleSizeEDUCATIONAL_CERTIFICATE: any;
      if (controlName == FILE_UPLOADS.CV) {
        isValidFIleSizeEDUCATIONAL_CERTIFICATE = [...fileList].some(
          (f: File) => {
            let size = Math.round(f.size / 1024);
            return size <= environment.FILE_SIZE.CV * 1024;
          }
        );
      }
      let isValidFIleSizeID: any;
      if (controlName == FILE_UPLOADS.ID) {
        isValidFIleSizeID = [...fileList].some((f: File) => {
          let size = Math.round(f.size / 1024);
          return size <= environment.FILE_SIZE.CV * 1024;
        });
      }
      let isValidFIleSizeMotivation: any;
      if (controlName == FILE_UPLOADS.ID) {
        isValidFIleSizeMotivation = [...fileList].some((f: File) => {
          let size = Math.round(f.size / 1024);
          return size <= environment.FILE_SIZE.CV * 1024;
        });
      }
      if (result?.length > 0) {
        this.invalidMessage = `Please select valid file format. Allowed: ${this.getFileType()}`;
      } else if (!isValidFIleSizeCv && controlName == FILE_UPLOADS.CV) {
        this.invalidMessage = `Selected file exceeds the maximum size limit of ${environment.FILE_SIZE.CV}Mb`;
      } else if (!isValidFileSize && controlName != FILE_UPLOADS.CV) {
        this.invalidMessage = `Selected file exceeds the maximum size limit of ${environment.FILE_SIZE.DEFAULT}Mb`;
      } else if (
        !isValidFIleSizeEDUCATIONAL_CERTIFICATE &&
        controlName == FILE_UPLOADS.QualificationCertificate
      ) {
        this.invalidMessage = `Selected file exceeds the maximum size limit of ${environment.FILE_SIZE.QualificationCertificate}Mb`;
      } else if (!isValidFIleSizeID && controlName == FILE_UPLOADS.ID) {
        this.invalidMessage = `Selected file exceeds the maximum size limit of ${environment.FILE_SIZE.ID}Mb`;
      } else if (!isValidFIleSizeID && controlName == FILE_UPLOADS.MOTIVATION) {
        this.invalidMessage = `Selected file exceeds the maximum size limit of ${environment.FILE_SIZE.MOTIVATION}Mb`;
      } else {
        isValid = true;
        this.invalidMessage = undefined;
      }
    }
    return isValid;
  }
  getFileType() {
    let message: string = '';
    this.types.forEach((type) => {
      switch (type) {
        case FILETYPE.PDF:
          message = message.includes('pdf') ? message : message + 'pdf, ';
          break;
        case FILETYPE.EXCEL_SPREADSHEET:
        case FILETYPE.MS_EXCEL:
          message = message.includes('xlsx, xls')
            ? message
            : message + 'xlsx, xls, ';
          break;
        case FILETYPE.IMAGE_PNG:
        case FILETYPE.IMAGE_JPEG:
          message = message.includes('png, jpeg')
            ? message
            : message + 'png, jpeg, ';
          break;
        case FILETYPE.VIDEO_MP4:
        case FILETYPE.VIDEO_XM4V:
        case FILETYPE.VIDEO_ALL:
          message = message.includes('mp4') ? message : message + 'mp4, ';
          break;
        case FILETYPE.ICS:
          message = message.includes('ics') ? message : message + 'ics, ';
          break;
        case FILETYPE.MS_WORD_XML:
        case FILETYPE.MS_WORD:
          message = message.includes('docx, doc')
            ? message
            : message + 'docx, doc, ';
          break;
      }
    });
    return message.substring(0, message.length - 2);
  }
  deleteFile(event: any) {
    this.onDelete.emit(event);
  }
}
