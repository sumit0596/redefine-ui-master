import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBase } from 'src/app/utilities/form-base';
import { FormBuilder } from '@angular/forms';
import grapesjs, { Block } from 'grapesjs';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-picker',
  standalone: true,
  templateUrl: './card-picker.component.html',
  styleUrls: ['./card-picker.component.scss'],
  imports:[CommonModule]
})
export class CardPickerComponent extends FormBase implements OnInit {
  @Input() cardData: any;
  @Output() saveEvent: EventEmitter<any> = new EventEmitter<any>();

  cardList: any[] = [
    {
      label: 'Feature Card 1',
      media: `/assets/images/builder/svg/feature-card.svg`,
      content: {
        tagName: 'div',
        attributes: { class: 'feature-card' },
        components: [
          {
            type: 'Icon',
            draggable: false,
          },
          {
            tagName: 'p',
            type: 'text',
            draggable: false,
            attributes: { class: 'feature-description1' },
            content: 'Sample text',
          },
        ],
      },
    },
    {
      label: 'Feature Card 2',
      media: `/assets/images/builder/svg/image-with-desc.svg`,
      content: {
        tagName: 'div',
        attributes: { class: 'cards ' },
        components: {
          tagName: 'div',
          attributes: { class: ' feature-card-2' },
          components: [
            {
              tagName: 'img',
              type: 'image',
              draggable: false,
              attributes: { class: 'feature-icon' },
            },
            {
              tagName: 'p',
              type: 'text',
              draggable: false,
              attributes: { class: 'feature-description-2' },
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            },
          ],
        },
      },
    },
    {
      label: 'Feature Card 3',
      media: `/assets/images/builder/svg/desc-with-image.svg`,
      content: {
        tagName: 'div',
        attributes: { class: 'cards ' },
        components: {
          tagName: 'div',
          attributes: { class: 'feature-card-2' },
          components: [
            {
              tagName: 'p',
              type: 'text',
              draggable: false,
              attributes: { class: 'feature-description-2' },
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            },
            {
              tagName: 'img',
              type: 'image',
              draggable: false,
              attributes: { class: 'feature-icon' },
            },
          ],
        },
      },
    },
    {
      label: 'Icon Text Card',
      media: `/assets/images/builder/svg/icon-with-label.svg`,
      content: {
        tagName: 'div',
        attributes: { class: 'cards card-drop-shadow p-3 ' },
        components: [
          {
            type: 'Icon',
            draggable: false,
          },
          {
            type: 'text',
            attributes: { class: 'pt-3' },
            content: 'Group Life Risk Benefits',
          },
        ],
      },
    },
    {
      label: 'Centered Square Card',
      media: '/assets/images/builder/svg/icon-with-desc.svg',
      content: {
        tagName: 'div',
        attributes: {
          class:
            'cards col-md-12 row justify-content-center align-items-center square-box p-4',
        },
        components: [
          {
            tagName: 'div',
            draggable: false,
            attributes: {
              class: ' card card-square padding-square shadow-sm margin-right',
            },
            components: [
              {
                tagName: 'div',
                draggable: false,
                attributes: { class: 'card-body  text-center' },
                activate: true,
                components: [
                  {
                    type: 'Icon',
                    draggable: false,
                    attributes: {
                      class: 'sm-card-icon text-center m-auto mb-3 ',
                    },
                  },
                  {
                    tagName: 'p',
                    type: 'text',
                    draggable: false,
                    attributes: { class: 'description m-auto mt-2' },
                    content: 'Sample text',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      label: 'Perks card',
      media: '/assets/images/builder/svg/icon-with-desc.svg',
      content: {
        tagName: 'div',
        attributes: {
          class: 'perks-card',
        },
        components: [
          {
            tagName: 'div',
            attributes: { class: 'perks-card__icon' },
            components: {
              type: 'Icon',
              draggable: false,
              attributes: { class: 'rd-icon rd-icon-lg' },
            },
          },
          {
            tagName: 'div',
            type: 'text',
            draggable: false,
            attributes: { class: 'perks-card__content' },
            content: 'Sample text',
          },
        ],
      },
    },
    {
      label: 'Enquiry Card',
      media: `/assets/images/builder/svg/enquiry-card.svg`,
      content: {
        tagName: 'div',

        attributes: { class: 'cards enquiry-card', id: 'enquiry-card-1' },

        components: [
          {
            tagName: 'img',
            type: 'image',
            draggable: false,
            attributes: { class: 'enquiry-card-image' },
          },
          {
            tagName: 'div',
            draggable: false,
            attributes: { class: 'enquiry-card-body' },
            components: [
              {
                attributes: { class: 'position-relative' },
                components: [
                  {
                    tagName: 'div',
                    type: 'text',
                    attributes: {
                      class:
                        'rd-heading rd-heading-lg-normal rd-text-white mb-4',
                    },
                    content: 'Heading here',
                  },
                  {
                    components: `<span class="rd-indicator rd-indicator-lg">
                    <span class="rd-indicator-content rd-indicator-primary"></span>
                    </span>`,
                  },
                ],
              },
              {
                tagName: 'div',
                attributes: { class: ' enquiry-card__action' },
                components: [
                  {
                    type: 'Link',
                    attributes: {
                      class: 'rd-btn rd-btn-text',
                      'data-btn-type': 'rd-btn-text',
                      'data-type-id': 'rd-link-button',
                    },
                    components: [
                      {
                        type: 'text',
                        tagName: 'span',
                        attributes: { class: 'btn-text' },
                        content: 'Learn more',
                      },
                      {
                        type: 'Icon',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      label: 'Link cards',
      media: `/assets/images/builder/svg/investor-information-card.svg`,
      content: {
        tagName: 'div',
        attributes: { class: 'row' },
        components: [
          {
            tagName: 'div',
            attributes: { class: 'col-lg-3 col-12' },
            components: [
              {
                tagName: 'div',
                attributes: { class: 'position-relative' },
                components: [
                  {
                    tagName: 'div',
                    type: 'text',
                    attributes: {
                      class: 'rd-heading rd-heading-lg-normal',
                    },
                    content: 'Heading here',
                  },
                  {
                    components: `<span class="rd-indicator rd-indicator-lg">
                    <span class="rd-indicator-content rd-indicator-primary"></span>
                  </span>`,
                  },
                ],
              },
            ],
          },
          {
            tagName: 'div',
            attributes: {
              class: 'col-lg-9 col-12  link-card-group',
            },
            components: {
              attributes: {
                class: 'link-card',
              },
              components: [
                {
                  type: 'link',
                  attributes: { class: 'link-card__link' },
                },
                {
                  tagName: 'div',
                  attributes: {
                    class: 'link-card__title-wrapper',
                  },
                  components: [
                    {
                      tagName: 'div',
                      type: 'text',
                      editable: true,
                      attributes: {
                        class:
                          'rd-heading rd-heading-sm rd-text-white link-card__title',
                      },
                      content: 'Heading here',
                    },
                    {
                      content: `<span class="rd-indicator rd-indicator-lg">
                          <span class="rd-indicator-content rd-border__white"></span>
                        </span>`,
                    },
                  ],
                },
                {
                  attributes: { class: 'link-card__action' },
                  tagName: 'div',
                  type: 'text',
                  editable: true,
                  content: 'View',
                },
              ],
            },
          },
        ],
      },
    },
    {
      label: 'video Link card ',
      media: `/assets/images/builder/svg/investor-information-card.svg`,
      content: {
        tagName: 'div',
        attributes: { class: 'row justify-content-end' },
        components: [
          {
            tagName: 'div',
            attributes: {
              class: 'col-lg-12 col-12  link-card-group',
            },
            components: {
              attributes: {
                class: 'link-card',
              },
              components: [
                {
                  type: 'link',
                  attributes: {
                    class: 'link-card__link',
                    
                  },
                },
                {
                  tagName: 'div',
                  attributes: {
                    class: 'link-card__title-wrapper',
                  },
                  components: [
                    {
                      tagName: 'div',
                      type: 'text',
                      editable: true,
                      attributes: {
                        class:
                          'rd-heading rd-heading-sm rd-text-white link-card__title',
                      },
                      content: 'Heading here',
                    },
                    {
                      content: `<span class="rd-indicator rd-indicator-lg">
                          <span class="rd-indicator-content rd-border__white"></span>
                        </span>`,
                    },
                  ],
                },
                {
                  attributes: { class: 'link-card__action' },
                  tagName: 'div',
                  type: 'text',
                  editable: true,
                  content: 'View',
                },
              ],
            },
          },
        ],
      },
    },
    {
      label: 'About us card',
      media: `/assets/images/builder/svg/about-us-card.svg`,
      content: {
        tagName: 'div',
        attributes: { class: 'rd-about-us-card' },
        components: [
          {
            attributes: { class: 'rd-about-us-card__header' },
            components: [
              {
                attributes: { class: 'rd-about-us-card__image' },
                components: [
                  {
                    type: 'image',
                  },
                ],
              },
            ],
          },
          {
            attributes: { class: 'rd-about-us-card__body' },
            components: [
              {
                attributes: { class: 'position-relative' },
                components: [
                  {
                    tagName: 'div',
                    type: 'text',
                    attributes: {
                      class: 'rd-heading rd-heading-md',
                    },
                    content: 'Heading here',
                  },
                  {
                    tagName: 'span',
                    attributes: { class: 'rd-indicator rd-indicator-lg z-1' },
                    components: [
                      {
                        tagName: 'span',
                        attributes: {
                          class: 'rd-indicator-content rd-indicator-primary',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                type: 'text',
                attributes: {
                  class: 'rd-text-grey-mid rd-about-us-card_overflow',
                },
                content:
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
              },
            ],
          },
          {
            attributes: { class: 'rd-about-us-card__action' },
            components: [
              {
                type: 'Link',
                attributes: {
                  class: 'rd-btn rd-btn-text',
                  'data-btn-type': 'rd-btn-text',
                  'data-type-id': 'rd-link-button',
                },
                components: [
                  {
                    tagName: 'span',
                    attributes: { class: 'btn-text' },
                    content: 'Learn more',
                  },
                  {
                    type: 'Icon',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      label: 'Our values',
      media: `/assets/images/builder/svg/our-values.svg`,
      content: {
        tagName: 'div',
        attributes: { class: 'row' },
        components: [
          {
            attributes: {
              class:
                'col-md-2 d-flex justify-content-left justify-content-md-center',
            },
            components: {
              type: 'Icon',
            },
          },
          {
            type: 'text',
            attributes: { class: 'col-md-10 rd-text-grey-mid' },
            content:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
          },
        ],
      },
    },
    {
      label: 'Strategy card',
      media: `/assets/images/builder/svg/strategy-card.svg`,
      content: {
        tagName: 'div',
        attributes: { class: 'strategy-card' },
        components: [
          {
            tagName: 'div',
            type: 'text',
            attributes: {
              class: 'strategy-card__icon rd-heading rd-heading-sm-bold',
            },
            content: 'OE',
          },
          {
            tagName: 'div',
            type: 'text',
            attributes: {
              class: 'strategy-card__content rd-heading rd-heading-sm',
            },
            content: 'Operate efficiently',
          },
        ],
      },
    },
    {
      label: 'Our goal',
      media: `/assets/images/builder/svg/our-goal-card.svg`,
      content: {
        tagName: 'div',
        attributes: { class: 'our-goal-card' },
        components: [
          {
            type: 'Icon',
          },
          {
            type: 'text',
            attributes: {
              class: 'our-goal-card__badge',
            },
            content: 'Tenants',
          },
          {
            type: 'text',
            attributes: {
              class: 'our-goal-card__label rd-heading rd-heading-md-bold',
            },
            content: 'Our Goal',
          },
          {
            type: 'text',
            attributes: {
              class: 'our-goal-card__desc',
            },
            content:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
          },
        ],
      },
    },
    {
      label: 'Go to',
      media: `/assets/images/builder/svg/inline-card-with-link.svg`,
      content: {
        attributes: { class: 'go-to-card' },
        components: [
          {
            attributes: {
              class: 'go-to-card__content',
            },
            components: {
              type: 'text',
              content:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            },
          },
          {
            attributes: {
              class: 'go-to-card__action ',
            },
            components: {
              type: 'Link',
            },
          },
        ],
      },
    },
    {
      label: '4 Image Columns',
      media: `/assets/images/builder/svg/home_page_4columns.svg`,

      content: {
        tagName: 'div',
        attributes: { class: 'container-fluid' },
        components: {
          tagName: 'div',
          attributes: { class: 'row' },
          components: [
            {
              tagName: 'div',
              copyable: false,
              editable: true,
              draggable: false,
              attributes: {
                class:
                  'col-sm-12 col-md-6 col-lg-3 d-flex align-items-center home-card-4-columns',
              },
              components: {
                type: 'text',
                attributes: { class: 'rd-text-dark home-propcard-text ' },
                content: 'Learn more about our property offerings',
              },
            },
            {
              tagName: 'div',
              editable: true,
              draggable: false,
              attributes: {
                class:
                  'col-4 col-md-6 col-lg-3 pd-no position-relative home-property',
              },
              components: [
                {
                  tagName: 'img',
                  type: 'image',
                  draggable: false,
                  attributes: { class: 'home-property-img' },
                },
                {
                  attributes: { class: 'home-prop-text' },
                  components: [
                    {
                      tagName: 'div',
                      type: 'text',
                      attributes: {
                        class: 'rd-heading rd-heading-lg-normal',
                      },
                      content: 'Heading here',
                    },
                    {
                      components: `<span class="rd-indicator rd-indicator-lg">
            <span class="rd-indicator-content "></span>
            </span>`,
                    },
                  ],
                },

                {
                  attributes: { class: 'new-text rd-text-white' },
                  components: [
                    {
                      type: 'Link',
                      attributes: {
                        class: 'rd-btn rd-btn-text rd-text-white',
                        'data-btn-type': 'rd-btn-text',
                        'data-type-id': 'rd-link-button',
                      },
                      components: [
                        {
                          tagName: 'span',
                          attributes: { class: 'btn-text' },
                          content: 'Learn more',
                        },
                        {
                          //attributes:'new-text',
                          type: 'Icon',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              tagName: 'div',
              editable: true,
              draggable: false,
              attributes: {
                class:
                  'col-4 col-md-6 col-lg-3 pd-no position-relative home-property',
              },
              components: [
                {
                  tagName: 'img',
                  type: 'image',
                  draggable: false,
                  attributes: { class: 'home-property-img' },
                },
                {
                  attributes: { class: 'home-prop-text' },
                  components: [
                    {
                      tagName: 'div',
                      type: 'text',
                      attributes: {
                        class: 'rd-heading rd-heading-lg-normal',
                      },
                      content: 'Heading here',
                    },
                    {
                      components: `<span class="rd-indicator rd-indicator-lg">
            <span class="rd-indicator-content "></span>
            </span>`,
                    },
                  ],
                },

                {
                  attributes: { class: 'new-text rd-text-white' },
                  components: [
                    {
                      type: 'Link',
                      attributes: {
                        class: 'rd-btn rd-btn-text rd-text-white',
                        'data-btn-type': 'rd-btn-text',
                        'data-type-id': 'rd-link-button',
                      },
                      components: [
                        {
                          tagName: 'span',
                          attributes: { class: 'btn-text' },
                          content: 'Learn more',
                        },
                        {
                          //attributes:'new-text',
                          type: 'Icon',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              tagName: 'div',
              editable: true,
              draggable: false,
              attributes: {
                class:
                  'col-4 col-md-6 col-lg-3 pd-no position-relative home-property',
              },
              components: [
                {
                  tagName: 'img',
                  type: 'image',
                  draggable: false,
                  attributes: { class: 'home-property-img' },
                },
                {
                  attributes: { class: 'home-prop-text' },
                  components: [
                    {
                      tagName: 'div',
                      type: 'text',
                      attributes: {
                        class: 'rd-heading rd-heading-lg-normal',
                      },
                      content: 'Heading here',
                    },
                    {
                      components: `<span class="rd-indicator rd-indicator-lg">
            <span class="rd-indicator-content "></span>
            </span>`,
                    },
                  ],
                },

                {
                  attributes: { class: 'new-text rd-text-white' },
                  components: [
                    {
                      type: 'Link',
                      attributes: {
                        class: 'rd-btn rd-btn-text rd-text-white',
                        'data-btn-type': 'rd-btn-text',
                        'data-type-id': 'rd-link-button',
                      },
                      components: [
                        {
                          tagName: 'span',
                          attributes: { class: 'btn-text' },
                          content: 'Learn more',
                        },
                        {
                          //attributes:'new-text',
                          type: 'Icon',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
    {
      id: 'rd-contact-card',
      label: 'Contact card',
      media: `/assets/images/builder/svg/contact-card.svg`,
      content: {
        tagName: 'div',
        attributes: { class: 'contact-card' },
        components: [
          {
            tagName: 'div',
            attributes: { class: 'contact-card__header' },
            components: [
              {
                tagName: 'div',
                type: 'text',
                attributes: {
                  class: 'rd-heading rd-heading-xs',
                },
                content: 'Heading here',
              },
              {
                tagName: 'span',
                attributes: { class: 'rd-indicator rd-indicator-lg' },
                components: {
                  tagName: 'span',
                  attributes: {
                    class: 'rd-indicator-content',
                  },
                },
              },
            ],
          },
          {
            tagName: 'div',
            type: 'text',
            attributes: { class: 'contact-card__body rd-text-grey-mid' },
            content:
              '4th floor, 155 West Street, Sandown, Sandton Johannesburg, South Africa, 2196 PostNet Suite 264, Saxonwold, 2132 ',
          },
          {
            tagName: 'div',
            attributes: { class: 'contact-card__footer' },
            components: [
              {
                tagName: 'div',
                attributes: { class: 'contact-card__footer-actions' },
                components: [
                  {
                    type: 'link',
                    attributes: { class: 'contact-card__footer-action' },
                    components: [
                      {
                        tagName: 'span',
                        content: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path></svg>`,
                      },
                      {
                        tagName: 'span',
                        type: 'text',
                        content: '012 345 6789',
                      },
                    ],
                  },
                  {
                    type: 'link',
                    attributes: { class: 'contact-card__footer-action' },
                    components: [
                      {
                        tagName: 'span',
                        content: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path></svg>`,
                      },
                      {
                        tagName: 'span',
                        type: 'text',
                        content: 'name@email.co.za',
                      },
                    ],
                  },
                ],
              },
              {
                tagName: 'div',
                attributes: { class: 'overlay' },
              },
            ],
          },
        ],
      },
    },
    {
      label: 'Image Square Card',
      media: `/assets/images/builder/svg/our-goal-card.svg`,
      content: {
        tagName: 'div',
        attributes: { class: 'image-square-card-wrapper ' },
        components: [
          {
            tagName: 'div',
            attributes: { class: 'image-square-card' },
            components: [
              {
                type: 'image',
                attributes: {
                  class: 'image-square-card__icon',
                  alt: 'Image Square Icon'
                },
              },
              {
                tagName: 'div',
                type: 'text',
                attributes: {
                  class:
                    'image-square-card__label rd-heading rd-heading-md-bold',
                },
                content: 'Our Goal',
              },
              {
                type: 'text',
                attributes: {
                  class: 'image-square-card__desc',
                },
                content: 'Primary',
              },
            ],
          },
        ],
      },
    },
    {
      label: 'Social strategy card',
      media: `/assets/images/builder/svg/about-us-card.svg`,
      content: {
        tagName: 'div',
        attributes: { class: 'rd-social-strategy-card-wrapper ' },
        components: [
          {
            tagName: 'div',
            attributes: { class: 'rd-social-strategy-card ' },
            components: [
              {
                attributes: { class: 'rd-social-strategy-card__header' },
                components: [
                  {
                    attributes: { class: '.rd-social-strategy-card__image' },
                    components: [
                      {
                        type: 'image',
                      },
                    ],
                  },
                ],
              },
              {
                attributes: { class: 'rd-social-strategy-card__body' },
                components: [
                  {
                    attributes: {
                      class:
                        'position-relative rd-social-strategy-innerheading',
                    },
                    components: [
                      {
                        tagName: 'div',
                        type: 'text',
                        attributes: {
                          class: 'rd-heading rd-heading-md',
                        },
                        content: 'Heading here',
                      },
                      {
                        content: `<span class="rd-indicator rd-indicator-lg">
                    <span class="rd-indicator-content rd-indicator-secondary"></span>
                    </span>`,
                      },
                    ],
                  },
                  {
                    type: 'text',
                    attributes: {
                      class: 'rd-text-grey-mid rd-sociostartegy-card_overflow',
                    },
                    content:
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                  },
                ],
              },
              {
                attributes: { class: 'rd-social-strategy-card__action' },
                components: [
                  {
                    type: 'Link',
                    attributes: {
                      class: 'rd-btn rd-btn-text',
                      'data-btn-type': 'rd-btn-text',
                      'data-type-id': 'rd-link-button',
                    },
                    components: [
                      {
                        tagName: 'span',
                        attributes: { class: 'btn-text' },
                        content: 'Learn more',
                      },
                      {
                        type: 'Icon',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      label: 'Accordian',
      editable: true,
      attributes: { class: 'open' },
      content: {
        components: [
          {
            editable: true,
            tagName: 'details',
            attributes: { open },
            components: [
              {
                tagName: 'summary',
                attributes: { class: 'd-flex' },
                components: [
                  {
                    type: 'image',
                    attributes: { class: 'col-md-2' },
                    style: {
                      width: '100px',
                      height: '100px',
                      'object-fit': 'contain',
                    },
                  },
                  {
                    type: 'text',
                    attributes: { class: 'col-md-2' },
                    content: 'Primary',
                    // style: {

                    //   'padding-left':'20px',

                    // },
                  },
                ],
              },

              {
                tagName: 'div',
                attributes: { class: 'faq__content' },
                components: [
                  {
                    tagName: 'p',
                    type: 'text',
                    content: 'Answer',
                  },
                ],
              },
            ],
          },
        ],
      },
      // Add any custom attributes or classes
    },
    // Add more card objects as needed
  ];

  constructor(fb: FormBuilder) {
    super(fb);
  }

  selectCard(card: any) {
    this.saveEvent.emit(card);
  }

  getComponentHTML(component: Block) {}

  ngOnInit(): void {
    if (this.cardData) {
      this.form.patchValue(this.cardData);
    }
  }

  submit() {
    if (this.form.valid) {
      this.saveEvent.emit(this.form.value);
    } else {
      this.validateForm();
    }
  }
}
