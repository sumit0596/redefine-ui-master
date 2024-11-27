import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormBase } from 'src/app/utilities/form-base';
import { BUILDER_CONSTANTS } from '../../builder/models/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner-picker',
  standalone: true,
  templateUrl: './banner-picker.component.html',
  styleUrls: ['./banner-picker.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class BannerPickerComponent extends FormBase {
  banners: any[] = [
    {
      name: 'rd-title-banner',
      type: 'rd-title-banner',
      label: 'Page title',
      svg: '/assets/images/builder/svg/page-title-banner.svg',
      content: {
        tagName: 'div',
        attributes: { class: 'banner' },
        droppable: false,
        components: [
          {
            tagName: 'img',
            type: 'image',
            copyable: false,
            draggable: false,
            droppable: false,
            stylable: false,
            attributes: { class: 'banner-img object-fit-cover' },
          },
          {
            id: BUILDER_CONSTANTS.BANNER_TITLE,
            tagName: 'p',
            type: 'text',
            copyable: false,
            editable: true,
            draggable: false,
            droppable: false,
            stylable: ['color'],
            attributes: { class: 'banner-title' },
            content: `This is sample title`,
          },
        ],
      },
    },
    {
      name: 'rd-contact-banner',
      type: 'rd-contact-banner',
      label: 'Contact',
      svg: '/assets/images/builder/svg/contact-banner.svg',
      content: {
        tagName: 'div',
        attributes: {
          'data-type-id': 'rd-banner',
          class: 'rd-banner__contact',
        },
        components: [
          {
            tagName: 'p',
            type: 'text',
            copyable: false,
            editable: true,
            draggable: false,
            droppable: false,
            attributes: { class: 'banner-title' },
            content: `This is sample title`,
          },
          {
            attributes: { class: 'banner-content' },
            components: [
              {
                tagName: 'p',
                type: 'text',
                content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit`,
              },
              {
                tagName: 'div',
                attributes: {
                  class: 'flex-wrap d-flex gap-4 rd-align-item-center-banner',
                },
                components: [
                  {
                    tagName: 'div',
                    attributes: {
                      class:
                        'rd-inline-block d-flex rd-align-item-center-banner gap-1',
                    },
                    components: [
                      {
                        type: 'Icon',
                      },
                      {
                        type: 'text',
                        content: 'Sample text here',
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
      name: 'rd-banner__about-us',
      type: 'rd-banner__about-us',
      label: 'About us',
      svg: '/assets/images/builder/svg/about_us-banner.svg',
      content: {
        tagName: 'div',
        attributes: {
          'data-type-id': 'rd-banner',
          class: 'rd-banner__about-us',
        },
        components: [
          {
            type: 'image',
            attributes: { class: 'rd-banner__about-us__image' },
          },
          {
            attributes: { class: 'rd-banner__about-us__content' },
            components: [
              {
                attributes: { class: 'position-relative' },
                components: [
                  {
                    tagName: 'h1',
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
              {
                type: 'text',
                content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
              },
              {
                attributes: { class: 'rd-banner__about-us__cta' },
                components: [
                  {
                    type: 'Link',
                    attributes: {
                      class: 'rd-btn rd-btn-dark rd-btn-xl',
                    },
                  },
                  {
                    type: 'Link',
                    attributes: {
                      class: 'rd-btn rd-btn-outline-light rd-btn-xl',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      name: 'rd-graph-banner',
      type: 'rd-graph-banner',
      label: 'Page title',
      svg: '/assets/images/builder/svg/page-title-banner.svg',
      content: {
        tagName: 'div',
        attributes: { class: 'rd-graph-banner' },
        droppable: false,
        components: [
          {
            tagName: 'img',
            type: 'image',
            copyable: false,
            draggable: false,
            droppable: false,
            stylable: false,
            attributes: { class: 'banner-img object-fit-cover' },
          },
          {
            tagName: 'p',
            type: 'text',
            copyable: false,
            editable: true,
            draggable: false,
            droppable: false,
            attributes: { class: 'banner-title' },
            content: `Let the numbers do the talking`,
          },
          {
            tagName: 'div',
            editable: true,
            draggable: false,
            droppable: false,
            copyable: false,
            attributes: { class:'banner-content row' },
            components: [
              { 
               tagName: 'div',
               attributes: { class: 'col-sm-12 col-lg-4 col-md-6 rd-graph-content' },
               editable: true,
               draggable: false,
               droppable: false,
               copyable: true,
               components:{
                tagName: 'div',
                components: [
                  {
                    tagName: 'p',
                    type:'text',
                    attributes: { class: 'rd-graph-content-head' },
                    content: `South African Properties`,
                  },
                  {
                    tagName: 'h2',
                    type:'text',
                    attributes: { class: 'rd-graph-number-font' },
                    content: `224`,
                  },
                  {
                   tagName: 'div',
                   attributes: { class: 'rd-hr-line2' },
                 },
                  {
                    tagName: 'p',
                    type:'text',
                    attributes: { class: 'pt-2 rd-graph-txt-desc' },
                    content: `Total across all sectors`,
                  }
                 ],
              }

              },
              { 
                tagName: 'div',
                attributes: { class: ' col-lg-4 col-md-6 col-sm-12 rd-graph-content' },
                editable: true,
                draggable: false,
                droppable: false,
                copyable: true,
                components:{
                  tagName: 'div',
                  components:{
                    tagName: 'div',
                    components: [
                      {
                        tagName: 'p',
                        type:'text',
                        attributes: { class: 'rd-graph-content-head' },
                        content: `Tenant Grade`,
                      },
                      {
                        tagName: 'h2',
                        type:'text',
                        attributes: { class: 'rd-graph-number-font' },
                        content: `100`,
                      },
                      {
                       tagName: 'div',
                       attributes: { class: 'rd-hr-line2' },
                     },
                      {
                        tagName: 'p',
                        type:'text',
                        attributes: { class: 'pt-2 rd-graph-txt-desc' },
                        content: `Percentage (%)`,
                      }
                     ],
                  }
                }
 
               },
               { 
                tagName: 'div',
                attributes: { class: ' col-lg-4 col-md-6 col-sm-12 rd-graph-content' },
                editable: true,
                draggable: false,
                droppable: false,
                copyable: true,
                components:{
                  tagName: 'div',
                  components: [
                    {
                      tagName: 'p',
                      type:'text',
                      attributes: { class: 'rd-graph-content-head' },
                      content: `South African Asset Portfolio`,
                    },
                    {
                      tagName: 'h2',
                      type:'text',
                      attributes: { class: 'rd-graph-number-font' },
                      content: `R58.4`,
                    },
                    {
                     tagName: 'div',
                     attributes: { class: 'rd-hr-line2' },
                   },
                    {
                      tagName: 'p',
                      type:'text',
                      attributes: { class: 'pt-2 rd-graph-txt-desc' },
                      content: `Billion`,
                    }
                   ],
                }
 
               },
               { 
                tagName: 'div',
                attributes: { class: ' col-lg-4 col-md-6 col-sm-12 rd-graph-content' },
                editable: true,
                draggable: false,
                droppable: false,
                copyable: true,
                components:{
                  tagName: 'div',
                  components: [
                    {
                      tagName: 'p',
                      type:'text',
                      attributes: { class: 'rd-graph-content-head' },
                      content: `Occupancy Rate`,
                    },
                    {
                      tagName: 'h2',
                      type:'text',
                      attributes: { class: 'rd-graph-number-font' },
                      content: `100`,
                    },
                    {
                     tagName: 'div',
                     attributes: { class: 'rd-hr-line2' },
                   },
                    {
                      tagName: 'p',
                      type:'text',
                      attributes: { class: 'pt-2 rd-graph-txt-desc' },
                      content: `Percentage (%)`,
                    }
                   ],
                }
 
               },
               { 
                tagName: 'div',
                attributes: { class: ' col-lg-4 col-md-6 col-sm-12 rd-graph-content' },
                editable: true,
                draggable: false,
                droppable: false,
                copyable: true,
                components:{
                  tagName: 'div',
                  components: [
                    {
                      tagName: 'p',
                      type:'text',
                      attributes: { class: 'rd-graph-content-head' },
                      content: `Green Star Rating`,
                    },
                    {
                      tagName: 'h2',
                      type:'text',
                      attributes: { class: 'rd-graph-number-font' },
                      content: `72`,
                    },
                    {
                     tagName: 'div',
                     attributes: { class: 'rd-hr-line2' },
                   },
                    {
                      tagName: 'p',
                      type:'text',
                      attributes: { class: 'pt-2 rd-graph-txt-desc' },
                      content: `Certified Buildings`,
                    }
                   ],
                }
 
               },
               { 
                tagName: 'div',
                attributes: { class: 'col-lg-4 col-md-6 col-sm-12 rd-graph-content' },
                editable: true,
                draggable: false,
                droppable: false,
                copyable: true,
                components:{
                  tagName: 'div',
                  components: [
                    {
                      tagName: 'p',
                      type:'text',
                      attributes: { class: 'rd-graph-content-head' },
                      content: `Net Zero Buildings`,
                    },
                    {
                      tagName: 'h2',
                      type:'text',
                      attributes: { class: 'rd-graph-number-font' },
                      content: `3`,
                    },
                    {
                     tagName: 'div',
                     attributes: { class: 'rd-hr-line2' },
                   },
                    {
                      tagName: 'p',
                      type:'text',
                      attributes: { class: 'pt-2 rd-graph-txt-desc' },
                      content: `Certified Buildings`,
                    }
                   ],
                }
 
               },

            ],
          },
        ],
      },
    },
    {
      name: 'rd-title-banner-link',
      type: 'rd-title-banner-link',
      label: 'Page title',
      svg: '/assets/images/builder/svg/page-title-banner.svg',
      content: {
        tagName: 'a',
        type: 'link',
        attributes: { 
          class: 'banner-link-image', 
        },
        droppable: false,
        components: [
          {
            tagName: 'div',
            attributes: { class: 'banner-image' },
            droppable: false,
            components: [
              {
                tagName: 'img',
                type: 'image',
                copyable: false,
                draggable: false,
                droppable: false,
                stylable: false,
                attributes: { class: 'banner-link-image-main' },
              },
            ],
          },
        ],
      },
    }
    
  ];

  @Input() bannerData: any;
  @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
  constructor(fb: FormBuilder) {
    super(fb);
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      type: [null],
    });
    if (this.bannerData) {
      this.form.patchValue(this.bannerData);
    }
  }
  selectBanner(banner: any) {
    this.submitEvent.emit({ ...this.form.value, content: banner.content });
  }
}
