import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBase } from 'src/app/utilities/form-base';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Block, Blocks, ComponentDefinition } from 'grapesjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heading-picker',
  standalone: true,
  templateUrl: './heading-picker.component.html',
  styleUrls: ['./heading-picker.component.scss'],
  imports: [CommonModule],
})
export class HeadingPickerComponent extends FormBase implements OnInit {
  @Input() headingData: any;
  @Output() saveEvent: EventEmitter<any> = new EventEmitter<any>();
  headingList: any[] = [
    {
      label: 'Heading',
      media:
        '<div class="col-md-12"><img src="assets/images/builder/svg/Heading1.svg" width="100%" /></div>',

      content: {
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
            <span class="rd-indicator-content "></span>
            </span>`,
          },
        ],
      },
    },
    {
      label: 'Heading Small',
      media:
        '<div class="col-md-12"><img src="assets/images/builder/svg/Heading1.svg" width="100%" /></div>',

      content: {
        tagName: 'div',
        attributes: { class: 'rd-heading rd-heading-sm' },
        components: [
          {
            tagName: 'div',
            type: 'text',
            draggable: false,
            attributes: { class: 'heading-small indicator' },
            content: 'This is a sample heading',
          },
        ],
      },
    },

    {
      label: 'Heading & Sub Heading',
      media:
        '<div class="col-md-12"><img src="assets/images/builder/svg/Headingandsubheading.svg" width="100%" /></div>',
      content: {
        attributes: { class: 'position-relative' },
        components: [
          {
            tagName: 'div',
            type: 'text',
            draggable: false,
            attributes: {
              class: 'rd-heading rd-heading-md rd-heading-secondary',
            },
            content: 'This is a sample sub heading',
          },
          {
            tagName: 'div',
            type: 'text',
            attributes: {
              class: 'rd-heading rd-heading-lg-normal',
            },
            content: 'Heading here',
          },
          {
            content: `<span class="rd-indicator rd-indicator-lg">
            <span class="rd-indicator-content "></span>
            </span>`,
          },
        ],
      },
    },
    {
      label: 'Sub Heading',
      media:
        '<div class="col-md-12"><img src="assets/images/builder/svg/Sub_heading.svg" width="100%" /></div>',
      category: 'Headings',

      content: {
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
            content: `<span class="rd-indicator rd-indicator-lg">
            <span class="rd-indicator-content rd-indicator-secondary"></span>
            </span>`,
          },
        ],
      },
    },
    {
      label: 'Sub Heading bold',
      media:
        '<div class="col-md-12"><img src="assets/images/builder/svg/Sub_heading.svg" width="100%" /></div>',
      category: 'Headings',

      content: {
        attributes: { class: 'position-relative' },
        components: [
          {
            tagName: 'div',
            type: 'text',
            attributes: {
              class: 'rd-heading rd-heading-md-bold',
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
    },
    {
      label: 'Medium',
      media:
        '<div class="col-md-12"><img src="assets/images/builder/svg/Sub_heading2.svg" width="100%" /></div>',

      content: {
        tagName: 'div',
        type: 'text',
        attributes: {
          class: 'rd-heading rd-heading-md',
        },
        content: 'Heading here',
      },
    },
    {
      label: 'Medium bold',
      media:
        '<div class="col-md-12"><img src="assets/images/builder/svg/Sub_heading2.svg" width="100%" /></div>',

      content: {
        type: 'text',
        tagName: 'div',
        attributes: {
          class: 'rd-heading rd-heading-md-bold',
        },
        content: 'Heading here',
      },
    },
    {
      label: 'Small',
      media:
        '<div class="col-md-12"><img src="assets/images/builder/svg/Sub_heading2.svg" width="100%" /></div>',

      content: {
        tagName: 'div',
        type: 'text',
        attributes: {
          class: 'rd-heading rd-heading-sm',
        },
        content: 'Heading here',
      },
    },
    {
      label: 'Small bold',
      media:
        '<div class="col-md-12"><img src="assets/images/builder/svg/Sub_heading2.svg" width="100%" /></div>',

      content: {
        tagName: 'div',
        type: 'text',
        attributes: {
          class: 'rd-heading rd-heading-sm-bold',
        },
        content: 'Heading here',
      },
    },
    {
      label: 'X Small',
      media:
        '<div class="col-md-12"><img src="assets/images/builder/svg/Sub_heading2.svg" width="100%" /></div>',

      content: {
        tagName: 'div',
        type: 'text',
        attributes: {
          class: 'rd-heading rd-heading-xs',
        },
        content: 'Heading here',
      },
    },

    // Add more card objects as needed
  ];
  constructor(fb: FormBuilder) {
    super(fb);
  }

  selectHeading(heading: any) {
    this.saveEvent.emit(heading);
  }
  getComponentHTML(component: Block) {}
  ngOnInit(): void {
    if (this.headingData) {
      this.form.patchValue(this.headingData);
    }
  }
}
