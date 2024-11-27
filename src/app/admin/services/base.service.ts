import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  getPayload(data: any) {}
  getFormData(data: any) {}
  getParams(data: any) {}
}
