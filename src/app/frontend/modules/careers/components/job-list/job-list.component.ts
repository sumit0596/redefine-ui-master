import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FrontendService } from 'src/app/frontend/services/frontend.service';
import { IJobDetails } from 'src/app/interfaces/job';
import { ROUTE } from 'src/app/models/constants';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnInit {
  jobs$!: Observable<IJobDetails[]>;
  constructor(
    private frontendService: FrontendService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getJobs();
  }
  getJobs() {
    this.jobs$ = this.frontendService.getJobs();
  }
  openDetails(job: IJobDetails) {
    if (job && job.Slug && job.Slug.trim() !== '') {
      this.router.navigate([`${ROUTE.JOB_DETAILS}`, job.Slug]);
    }
  }
}
