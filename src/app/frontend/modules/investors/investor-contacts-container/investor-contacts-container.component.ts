import { Component, Input, OnInit } from '@angular/core';
import { FrontendService } from 'src/app/frontend/services/frontend.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { CONSTANTS } from 'src/app/models/constants';
import { EncryptionService } from 'src/app/services/encryption.service';

@Component({
  selector: 'app-investor-contacts-container',
  templateUrl: './investor-contacts-container.component.html',
  styleUrls: ['./investor-contacts-container.component.scss'],
})
export class InvestorContactsContainerComponent implements OnInit {
  @Input() contactIds!: number[];
  contactDetails: any[] = [];
  defaultImageUrl: string = 'assets/images/image-placeholder.png';
  constructor(
    private frontendService: FrontendService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService
  ) {}

  ngOnInit(): void {
    this.contactIds = this.contactIds.map((id) => Number(id));
    this.getInvestorContacts();
  }

  navigate(link: string): void {
    this.router.navigate([link], { relativeTo: this.activatedRoute });
  }
  getInvestorContacts(): void {
    this.frontendService
      .getSelectedInvestorContacts(this.contactIds.join(','))
      .pipe(
        map((res: any[]) => {
          return res.map((member: any) => {
            return {
              ...member,
              link: `${this.router.url}/${
                CONSTANTS.USER_ROUTE
              }/${member.EmployeeName?.normalize('NFKD')
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z0-9 \u00C0-\u00FF]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')}?${
                CONSTANTS.ROUTE_ID
              }=${this.encryptionService.encrypt(member.InvestorContactsId)}`,
            };
          });
        })
      )
      .subscribe({
        next: (people: any[]) => {
          this.contactDetails = people.filter((person) => {
            return this.contactIds.includes(person.InvestorContactsId);
          });
        },
        error: (err) => {
          console.error('Error fetching investor contacts:', err);
        },
      });
  }
}
