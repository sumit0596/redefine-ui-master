import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StepperService {
  stepSubject = new BehaviorSubject<any>(undefined);
  step: Observable<any> = this.stepSubject.asObservable();
  constructor() {}
  get getStep(): Observable<any> {
    return this.step;
  }
  setStep(step: any) {
    this.stepSubject.next(step);
  }
}
