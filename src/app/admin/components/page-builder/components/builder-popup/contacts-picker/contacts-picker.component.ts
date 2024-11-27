import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FrontendService } from 'src/app/frontend/services/frontend.service';
import { CONSTANTS } from 'src/app/models/constants';
import { EncryptionService } from 'src/app/services/encryption.service';

@Component({
  selector: 'app-contacts-picker',
  standalone: true,
  templateUrl: './contacts-picker.component.html',
  styleUrls: ['./contacts-picker.component.scss'],
  imports: [CommonModule],
})
export class ContactsPickerComponent implements OnInit {
  teamMembers$!: Observable<any>;
  selectedMembers: any[] = [];
  selectedInvestors: any[] = [];
  investorsList: any[] = [];
  isChecked: boolean = false;
  selectedmem: any = [];
  teammem: any = [];
  defaultImageUrl: string = 'assets/images/image-placeholder.png';
  @Input() selectedIds!: string[];
  @Output() submitEvent: EventEmitter<any[]> = new EventEmitter<any[]>();

  storedSelectedMembers: any[] = [];

  constructor(
    private frontendService: FrontendService,
    private encryptionService: EncryptionService
  ) {}

  ngOnInit(): void {
    this.getTeamMembers();
  }

  getTeamMembers() {
    this.teamMembers$ = this.frontendService.getTeamMembers().pipe(
      map((members) => {
        return members.map((member: any) => {
          const isExist = this.selectedIds.includes(
            `${member.InvestorContactsId}`
          );
          if (isExist) {
            this.createUserCard(member);
          }
          return {
            ...member,

            isChecked: isExist,
          };
        });
      })
    );
  }

  onCheckboxChange(event: Event, member: any) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.selectedMembers.includes(member.InvestorContactsId)) {
        this.createUserCard(member);
      }
    } else {
      this.selectedMembers = this.selectedMembers.filter(
        (m) => m.id !== member.InvestorContactsId
      );
    }
  }

  createUserCard(member: any) {
    let userCard: any = {
      isChecked: true,
      id: member.InvestorContactsId,
      name: member.EmployeeName?.replaceAll(' ', '-'),
      image: member.Image,
      checked: true,
      component: {
        attributes: {
          class: 'people-card',
          'data-people-id': member.InvestorContactsId,
          'data-people-name': `${member.EmployeeName?.replaceAll(' ', '-')}_${
            member.InvestorContactsId
          }`,
        },
        components: {
          type: 'link',
          attributes: {
            class: ' people-card-content',
            href: `${CONSTANTS.USER_ROUTE}/${member.EmployeeName?.normalize(
              'NFKD'
            )
              .trim()
              .toLowerCase()
              .replace(/[^a-zA-Z0-9 \u00C0-\u00FF]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')}?${
              CONSTANTS.ROUTE_ID
            }=${this.encryptionService.encrypt(member.InvestorContactsId)}`,
          },
          components: [
            {
              attributes: { class: 'position-relative mb-4' },
              components: [
                {
                  attributes: {
                    class: 'rd-heading rd-heading-xs rd-text-white ',
                  },
                  content: member.EmployeeName,
                },
                {
                  content: `<span class="rd-indicator rd-indicator-lg">
                    <span class="rd-indicator-content rd-indicator-primary"></span>
                    </span>`,
                },
              ],
            },
            {
              attributes: {
                class: 'd-flex align-items-center rd-text-white ',
              },
              components: [
                {
                  content: member.JobTitle,
                },
              ],
            },
            {
              attributes: {
                href: `${CONSTANTS.USER_ROUTE}/${member.EmployeeName?.normalize(
                  'NFKD'
                )
                  .trim()
                  .toLowerCase()
                  .replace(/[^a-zA-Z0-9 \u00C0-\u00FF]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')}?${
                  CONSTANTS.ROUTE_ID
                }=${this.encryptionService.encrypt(member.InvestorContactsId)}`,
                class: 'rd-btn rd-btn-text rd-text-white people-card-action',
              },
              components: [
                {
                  tagName: 'span',
                  content: 'Read more',
                  attributes: {
                    class: 'btn-text read-more-btn',
                    'data-btn-type': 'rd-btn-text',
                    'data-type-id': 'rd-link-button',
                  },
                },
                {
                  type: 'Icon',
                  attributes: { class: 'btn-icon' },
                  content:
                    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-93.66a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32-11.32L148.69,136H88a8,8,0,0,1,0-16h60.69l-18.35-18.34a8,8,0,0,1,11.32-11.32Z"></path></svg>',
                },
              ],
            },
          ],
        },
      },
    };
    this.selectedMembers.push(userCard);
  }
  onSubmit() {
    this.submitEvent.emit(this.selectedMembers);
  }
}
