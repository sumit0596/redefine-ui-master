import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { PATTERN, UNIT_FORM } from 'src/app/models/constants';
import { UnitService } from '../../services/unit.service';

@Component({
  selector: 'app-space-spec-calculator',
  templateUrl: './space-spec-calculator.component.html',
  styleUrls: ['./space-spec-calculator.component.scss'],
})
export class SpaceSpecCalculatorComponent {
  rentalEscalations$: Observable<any> = of([
    { Id: 1, Name: '6%' },
    { Id: 2, Name: '6.25%' },
    { Id: 3, Name: '6.75%' },
    { Id: 4, Name: '7%' },
    { Id: 5, Name: '7.25%' },
    { Id: 6, Name: '7.50%' },
    { Id: 7, Name: '7.75%' },
    { Id: 8, Name: '8%' },
    { Id: 9, Name: '8.25%' },
    { Id: 10, Name: '8.50%' },
    { Id: 11, Name: '8.75%' },
    { Id: 12, Name: '9%' },
    { Id: 13, Name: '9.25%' },
    { Id: 14, Name: '9.50%' },
    { Id: 15, Name: '9.75%' },
    { Id: 16, Name: '10%' },
    { Id: 17, Name: '10.25%' },
    { Id: 18, Name: '10.50%' },
    { Id: 19, Name: '10.75%' },
    { Id: 20, Name: '11%' },
    { Id: 21, Name: '11.25%' },
    { Id: 22, Name: '11.50%' },
    { Id: 23, Name: '11.75%' },
    { Id: 24, Name: '12%' },
  ]);
  spaceSpecForm!: FormGroup;
  unitValues: any;
  leaseValues = {
    threeYearsLease: '',
    fiveYearsLease: '',
    threeYearsmSquare: 0,
    fiveYearsmSquare: 0,
  };
  openPanel: boolean = false;

  constructor(private fb: FormBuilder, private unitService: UnitService) {}

  async ngOnInit() {
    this.spaceSpecForm = this.fb.group({
      UnitSize: [
        '',
        [Validators.maxLength(10), Validators.pattern(PATTERN.NUMERIC.PATTERN)],
      ],
      BaseRental: [
        '',
        [Validators.maxLength(10), Validators.pattern(PATTERN.NUMBER_DECIMAL)],
      ],
      OperationalCost: [
        '',
        [Validators.maxLength(10), Validators.pattern(PATTERN.NUMBER_DECIMAL)],
      ],
      Rates: [
        '',
        [Validators.maxLength(10), Validators.pattern(PATTERN.NUMBER_DECIMAL)],
      ],
      GrossRental: ['', Validators.pattern(PATTERN.NUMBER_DECIMAL)],
      NetRental: [null],
      OpsRental: [null],
      ThreeYearsLease: [{ value: '0.00', disabled: true }],
      FiveYearsLease: [{ value: '0.00', disabled: true }],
    });
  }
  get threeYearsLease(): any {
    return this.spaceSpecForm.get('ThreeYearsLease') as FormControl;
  }
  get fiveYearsLease() {
    return this.spaceSpecForm.get('FiveYearsLease') as FormControl;
  }

  onChange(event: any) {
    this.resetLeaseValues();
    this.validateFormField(event);
    if (
      event.control === UNIT_FORM.BASE_RENTAL.NAME ||
      event.control === UNIT_FORM.OPERATIONAL_COST.NAME ||
      event.control === UNIT_FORM.RATES.NAME ||
      event.control === UNIT_FORM.UNIT_SIZE.NAME
    ) {
      this.calculateGrossRental();
      this.onNetRentalSelect(event);
    }
  }

  validateFormField(data: any) {
    let control: FormControl = this.getControl(data.form, data.control);
    if (control.hasError('required')) {
      control?.setErrors({
        ...control.errors,
        invalid: `${this.getControlLabel(data.control)} is required`,
      });
    } else if (control.hasError('minlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Minimum ${
          control.getError('minlength')?.requiredLength
        }  characters are allowed`,
      });
    } else if (control.hasError('maxlength')) {
      control?.setErrors({
        ...control.errors,
        invalid: `Maximum ${
          control.getError('maxlength')?.requiredLength
        } characters are allowed`,
      });
    } else if (control.hasError('pattern')) {
      control?.setErrors({
        ...control.errors,
        invalid: this.getControlPatternMessage(data.control),
      });
    }
  }

  getControl(form: any, control: string): FormControl {
    return form.get(control) as FormControl;
  }

  getControlPatternMessage(control: string): any {
    let result: any = Object.values(UNIT_FORM).find(
      (res: any) => res.NAME == control
    );
    return result
      ? result.PATTERN_MESSAGE
        ? result.PATTERN_MESSAGE
        : `Please provide valid ${control}`
      : `Please provide valid ${control}`;
  }

  getControlLabel(control: string) {
    let result: any = Object.values(UNIT_FORM).find(
      (res: any) => res.NAME == control
    );
    return result ? result.LABEL : control;
  }

  calculateGrossRental() {
    this.unitValues = this.unitService.getFormValues(
      this.spaceSpecForm.get('BaseRental')?.value,
      this.spaceSpecForm.get('OperationalCost')?.value,
      this.spaceSpecForm.get('Rates')?.value,
      this.spaceSpecForm.get('UnitSize')?.value,
      this.spaceSpecForm.get('NetRental')?.value,
      this.spaceSpecForm.get('OpsRental')?.value
    );
    this.spaceSpecForm
      .get('GrossRental')
      ?.setValue(
        this.sum(
          this.unitValues.baseRental,
          this.unitValues.operationalCost,
          this.unitValues.rates
        ).toFixed(2)
      );
  }

  sum(num1: number, num2: number, num3: number) {
    return num1 + num2 + num3;
  }

  onNetRentalSelect(event: any) {
    this.resetLeaseValues();
    const unitValues = this.unitService.getFormValues(
      this.spaceSpecForm.get('BaseRental')?.value,
      this.spaceSpecForm.get('OperationalCost')?.value,
      this.spaceSpecForm.get('Rates')?.value,
      this.spaceSpecForm.get('UnitSize')?.value,
      this.spaceSpecForm.get('NetRental')?.value,
      this.spaceSpecForm.get('OpsRental')?.value
    );
    if (
      unitValues.netRental != '0.00' &&
      unitValues.netRental !== undefined &&
      unitValues.opsRental != '0.00' &&
      unitValues.opsRental !== undefined &&
      unitValues.unitSize != '' &&
      unitValues.unitSize != null &&
      unitValues.baseRental != '0' &&
      unitValues.netRental != '0' &&
      unitValues.rates != '0' &&
      this.spaceSpecForm.valid
    ) {
      this.leaseValues = this.unitService.onNetRentalSelect(
        this.unitValues['baseRental'],
        this.unitValues['operationalCost'],
        this.unitValues['rates'],
        this.unitValues['unitSize'],
        this.unitValues['netRental'],
        this.unitValues['opsRental']
      );
      this.spaceSpecForm
        .get('ThreeYearsLease')
        ?.setValue(this.leaseValues.threeYearsLease);
      this.spaceSpecForm
        .get('FiveYearsLease')
        ?.setValue(this.leaseValues.fiveYearsLease);
    }
  }

  clear() {
    this.spaceSpecForm.reset({
      ThreeYearsLease: '0.00',
      FiveYearsLease: '0.00',
    });
    // let control: FormControl = this.getControl(this.spaceSpecForm, 'NetRental');
    // if (control.hasError('required')) {
    //   control?.setErrors({
    //     ...control.errors,
    //     invalid: `Net rental is required`,
    //   });
    // }
    // let control2: FormControl = this.getControl(this.spaceSpecForm, 'OpsRental');
    // if (control2.hasError('required')) {
    //   control2?.setErrors({
    //     ...control2.errors,
    //     invalid: `Ops rental is required`,
    //   });
    //  }
    this.leaseValues.threeYearsmSquare = 0;
    this.leaseValues.fiveYearsmSquare = 0;
  }

  spaceCal(panel: any) {
    if (panel == false) {
      this.openPanel = true;
    } else {
      this.openPanel = false;
    }
  }

  resetLeaseValues() {
    if (
      this.spaceSpecForm.get('BaseRental')?.value == '' ||
      this.spaceSpecForm.get('OperationalCost')?.value == '' ||
      this.spaceSpecForm.get('Rates')?.value == '' ||
      this.spaceSpecForm.get('UnitSize')?.value == '' ||
      this.spaceSpecForm.get('NetRental')?.value == null ||
      this.spaceSpecForm.get('OpsRental')?.value == null
    ) {
      this.threeYearsLease.setValue('0.00');
      this.fiveYearsLease.setValue('0.00');
      this.leaseValues.threeYearsmSquare = 0;
      this.leaseValues.fiveYearsmSquare = 0;
    }
  }
}
