import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, debounceTime, map } from 'rxjs';
import { PageBuilderService } from '../../services/page-builder.service';
import { IMenu } from '../../model/interfaces';
import { FormBase } from 'src/app/utilities/form-base';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss'],
})
export class PageFormComponent extends FormBase implements OnInit {
  menuName: string | undefined;
  menus$!: Observable<IMenu[]>;
  //  = of([
  //   {
  //     MenuId: 1,
  //     Title: 'Generic portal',
  //     Route: '',
  //     Position: 1,
  //     ParentId: 1,
  //   },
  //   {
  //     MenuId: 4,
  //     Title: 'Investors',
  //     Route: '',
  //     Position: 1,
  //     ParentId: 1,
  //   },
  //   {
  //     MenuId: 5,
  //     Title: 'Careers',
  //     Route: '',
  //     Position: 1,
  //     ParentId: 1,
  //   },
  // ]);
  constructor(
    public dialogRef: MatDialogRef<PageFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    private route: ActivatedRoute,
    private pageBuilderService: PageBuilderService
  ) {
    super(fb);
  }
  ngOnInit(): void {
    this.initializeForm();
    this.getMenuList();
    this.titleControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value: string) => {
        if (value) {
          value = value.replaceAll(' ', '-');
          this.routeControl.setValue(value.toLowerCase());
        }
      });
  }
  initializeForm() {
    this.form = this.fb.group({
      Title: [null, [Validators.required]],
      Route: [null, [Validators.required]],
      ParentId: [null],
      Portal: [null],
    });
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }
  get titleControl() {
    return this.form.get('Title') as FormControl;
  }
  get menuControl() {
    return this.form.get('ParentId') as FormControl;
  }
  get routeControl() {
    return this.form.get('Route') as FormControl;
  }
  getMenuList() {
    this.menus$ = this.pageBuilderService.getMenuList(this.data.Portal)
    .pipe(
      map((result: any[]) => {
        return result.map((menu: any) => {
          return {
            ...menu,
            child: [menu, ...menu.child],
          };
        });
      })
    );
  }
  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    } else {
      this.validateForm();
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
  onMenuChange(event: any) {
    this.menuName = event.Title;
  }
}
