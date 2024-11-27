import { Component, Input, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LoaderService } from '../../services/loader/loader.service';
import { ILoader } from 'src/app/interfaces/loader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnDestroy {
  @Input() loader$!: Observable<ILoader>;
  destroySubject: Subject<void> = new Subject<void>();
  constructor(private loaderService: LoaderService) {
    this.loader$ = loaderService
      .getLoaderData()
      .pipe(takeUntil(this.destroySubject));
  }
  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
