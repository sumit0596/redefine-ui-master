import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SESSION } from '../models/constants';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  userSubject = new BehaviorSubject<User | any>({});
  user$: Observable<any> = this.userSubject.asObservable();
  constructor() {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(sessionStorage.getItem(SESSION.USER) || '{}')
    );
    this.user$ = this.userSubject.asObservable();
  }

  async getUser(): Promise<Observable<any>> {
    return this.user$;
  }
  async setUser(user: any) {
    sessionStorage.setItem(SESSION.USER, JSON.stringify(user));
    this.userSubject.next(user);
  }
}
