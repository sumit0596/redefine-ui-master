import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-enquiry-dialog',
  standalone : true,
  templateUrl: './enquiry-dialog.component.html',
  styleUrls: ['./enquiry-dialog.component.scss'],
  imports : [CommonModule, FormsModule]
})
export class EnquiryDialogComponent implements OnInit{

  selectedOption: string = 'option1';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EnquiryDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  continueEnquiry(){
    this.dialogRef.close(this.selectedOption);
  }

   close() {
    this.dialogRef.close();
  }

}
