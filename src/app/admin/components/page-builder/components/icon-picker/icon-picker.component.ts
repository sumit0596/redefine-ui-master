import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import * as feather from 'feather-icons';
import { FormBase } from 'src/app/utilities/form-base';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { colors } from 'src/app/utilities/colors';
import { PageBuilderService } from '../../services/page-builder.service';
import { CommonModule } from '@angular/common';
import { InputModule } from 'src/app/shared/modules/input/input.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectModule } from 'src/app/shared/modules/select/select.module';

@Component({
  selector: 'app-icon-picker',
  standalone: true,
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
    SelectModule,
    SharedModule,
  ],
})
export class IconPickerComponent extends FormBase implements OnInit {
  icons: string[] = [];
  phosphorIcons: any[] = [];
  sizes$: Observable<any[]> = of([
    { Name: 'X Small', Value: 'rd-icon-xs' },
    { Name: 'Small', Value: 'rd-icon-sm' },
    { Name: 'Medium', Value: 'rd-icon-md' },
    { Name: 'Large', Value: 'rd-icon-lg' },
    { Name: 'X Large', Value: 'rd-icon-xl' },
    { Name: 'XX Large', Value: 'rd-icon-xxl' },
  ]);
  colors$: Observable<any[]> = of(colors);

  @Input() iconData: any;
  @Output() saveEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('iconEditor') elementToScroll!: ElementRef;

  constructor(fb: FormBuilder, private pageBuilderService: PageBuilderService) {
    super(fb);
  }

  ngOnInit(): void {
    this.getIcons();
    this.form = this.fb.group({
      icon: [null],
      size: [null],
      color: [null],
      search: [null],
    });
    if (this.iconData) {
      this.form.patchValue(this.iconData);
    }
  }
  getIcons() {
    this.icons = Object.keys(feather.icons);
    this.pageBuilderService.getIcons().subscribe((res: any) => {
      this.phosphorIcons = Object.keys(res).map((name: string) => {
        return { name: name, svg: res[name] };
      });
    });
  }
  getIconSVG(iconName: string, custom: boolean = false): string | undefined {
    let svgString: string = '';
    const icons: any = feather.icons;
    if (custom) {
      svgString = icons[iconName].toSvg({ width: '100%', height: '100%' });
    } else {
      svgString = icons[iconName].toSvg();
    }
    return svgString;
  }
  submit() {
    if (this.form.valid) {
      this.saveEvent.emit(this.form.value);
    } else {
      this.validateForm();
    }
  }
  onChange(event: any) {
    this.icons = Object.keys(feather.icons).filter((iconName: string) =>
      iconName.includes(event.value.toLowerCase())
    );
  }
  onSelect() {}
}
