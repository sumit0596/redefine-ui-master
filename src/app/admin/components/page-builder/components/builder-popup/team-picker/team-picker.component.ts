import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FrontendService } from 'src/app/frontend/services/frontend.service';
import { CONSTANTS } from 'src/app/models/constants';
import { EncryptionService } from 'src/app/services/encryption.service';

@Component({
  selector: 'app-team-picker',
  standalone: true,
  templateUrl: './team-picker.component.html',
  styleUrls: ['./team-picker.component.scss'],
  imports: [CommonModule],
})
export class TeamPickerComponent implements OnInit {
  teamMembers$!: Observable<any>;
  @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private frontendService: FrontendService,
    private encryptionService: EncryptionService
  ) {}
  ngOnInit(): void {
    this.getTeamMembers();
  }
  getTeamMembers() {
    this.teamMembers$ = this.frontendService.getTeamMembers();
  }
  onSelect(member: any) {
    let userCard: any = {
      id: member.InvestorContactsId,
      name: member.EmployeeName?.replaceAll(' ', '-'),
      image: member.Image,
      components: [
        {
          selectable: false,
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
                  type: 'text',
                  attributes: {
                    class: 'rd-heading rd-heading-xs rd-text-white ',
                  },
                  content: member.EmployeeName,
                  selectable: false,
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
                  type: 'text',
                  content: member.JobTitle,
                  selectable: false,
                },
              ],
            },
            {
              type: 'div',
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
                  selectable: false,
                  editable: false,
                },
                {
                  type: 'Icon',
                  attributes: { class: 'btn-icon' },
                  selectable: false,
                  editable: false,
                  content:
                    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-93.66a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32-11.32L148.69,136H88a8,8,0,0,1,0-16h60.69l-18.35-18.34a8,8,0,0,1,11.32-11.32Z"></path></svg>',
                },
              ],
            },
          ],
        },
      ],
    };
    this.submitEvent.emit(userCard);
  }
}
