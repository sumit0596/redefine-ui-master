import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBase } from 'src/app/utilities/form-base';
import { FormBuilder } from '@angular/forms';
import { Block } from 'grapesjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout-picker',
  standalone: true,
  templateUrl: './layout-picker.component.html',
  styleUrls: ['./layout-picker.component.scss'],
  imports: [CommonModule],
})
export class LayoutPickerComponent extends FormBase implements OnInit {
  @Input() layoutData: any;
  @Output() saveEvent: EventEmitter<any> = new EventEmitter<any>();
  layoutList: any[] = [
    {
      label: '1 Column',
      media: `'<i class="bg-column_1"></i>'`,

      content: {
        tagName: 'div',
        attributes: { class: 'container container-xl container-lg' },
        components: {
          tagName: 'div',
          draggable: false,
          attributes: { class: 'row' },
          components: [
            {
              tagName: 'div',
              draggable: false,
              attributes: { class: 'col-12' },
            },
          ],
        },
      },
    },
    {
      label: '2 Columns',
      media: '<i class="bg-column_2"></i>',

      content: {
        tagName: 'div',
        attributes: { class: 'container' },
        components: {
          tagName: 'div',
          attributes: { class: 'row' },
          components: [
            {
              tagName: 'div',
              draggable: false,
              attributes: { class: 'col-md-6 col-12' },
            },
            {
              tagName: 'div',
              draggable: false,
              attributes: { class: 'col-md-6 col-12' },
            },
          ],
        },
      },
    },
    {
      label: '3 Columns',
      media: '<i class="bg-column_3"></i>',

      content: {
        tagName: 'div',
        attributes: { class: 'container' },
        components: {
          tagName: 'div',
          attributes: { class: 'row' },
          components: [
            {
              tagName: 'div',

              editable: false,
              draggable: false,
              attributes: { class: 'col-md-4' },
            },
            {
              tagName: 'div',

              editable: false,
              draggable: false,
              attributes: { class: 'col-md-4' },
            },
            {
              tagName: 'div',

              editable: false,
              draggable: false,
              attributes: { class: 'col-md-4' },
            },
          ],
        },
      },
    },

    {
      label: '4 Columns',
      media: '<i class="bg-column_3"></i>',

      content: {
        tagName: 'div',
        attributes: { class: 'container' },
        components: {
          tagName: 'div',
          attributes: { class: 'row' },
          components: Array.from({ length: 4 }, () => {
            return {
              tagName: 'div',
              editable: false,
              draggable: false,
              attributes: { class: 'col-md-3' },
            };
          }),
        },
      },
    },
    {
      label: 'Auto',
      media: '<i class="bg-column_3"></i>',
      content: {
        tagName: 'div',
        attributes: { class: 'container' },
        components: {
          tagName: 'div',
          attributes: { class: 'row' },
          components: Array.from({ length: 5 }, () => {
            return {
              tagName: 'div',
              editable: false,
              draggable: false,
              attributes: { class: 'col-12 col-md-3 col-lg' },
            };
          }),
        },
      },
    },

    {
      label: '1/4 Columns',
      media: '<i class="bg-column_3"></i>',

      content: {
        tagName: 'div',
        attributes: { class: 'container' },
        components: {
          tagName: 'div',
          attributes: { class: 'row' },
          components: [
            {
              tagName: 'div',

              editable: false,
              draggable: false,
              attributes: { class: 'col-md-3' },
            },
            {
              tagName: 'div',

              editable: false,
              draggable: false,
              attributes: { class: 'col-md-9' },
            },
          ],
        },
      },
    },
    {
      label: '5/7 Columns',
      media: '<i class="bg-column_3"></i>',
      content: {
        tagName: 'div',
        attributes: { class: 'container' },
        components: {
          tagName: 'div',
          attributes: { class: 'row' },
          components: [
            {
              tagName: 'div',

              editable: false,
              draggable: false,
              attributes: { class: 'col-md-5' },
            },
            {
              tagName: 'div',

              editable: false,
              draggable: false,
              attributes: { class: 'col-md-7' },
            },
          ],
        },
      },
    },
    {
      label: '1/3 Columns',
      media: '<i class="bg-column_3"></i>',

      content: {
        tagName: 'div',
        attributes: { class: 'container' },
        components: {
          tagName: 'div',
          attributes: { class: 'row' },
          components: [
            {
              tagName: 'div',

              editable: false,
              draggable: false,
              attributes: { class: 'col-md-4' },
            },
            {
              tagName: 'div',

              editable: false,
              draggable: false,
              attributes: { class: 'col-md-8' },
            },
          ],
        },
      },
    },
    {
      label: '60*40 Columns',
      media: '<i class="bg-column_3"></i>',

      content: {
        tagName: 'div',
        attributes: { class: 'container' },
        components: {
          tagName: 'div',
          attributes: { class: 'row' },
          components: [
            {
              tagName: 'div',

              editable: false,
              draggable: false,
              attributes: { class: 'col-md-7' },
            },
            {
              tagName: 'div',

              editable: false,
              draggable: false,
              attributes: { class: 'col-md-5' },
            },
          ],
        },
      },
    },
    {
      label: '40*60 Columns',
      media: '<i class="bg-column_3"></i>',

      content: {
        tagName: 'div',
        attributes: { class: 'container' },
        components: {
          tagName: 'div',
          attributes: { class: 'row' },
          components: [
            {
              tagName: 'div',
              copyable: false,
              editable: false,
              draggable: false,
              attributes: { class: 'col-md-5' },
            },
            {
              tagName: 'div',
              copyable: false,
              editable: false,
              draggable: false,
              attributes: { class: 'col-md-7' },
            },
          ],
        },
      },
    },

    // Add more card objects as needed
  ];
  constructor(fb: FormBuilder) {
    super(fb);
  }

  selectLayout(layout: any) {
    this.saveEvent.emit(layout);
  }
  getComponentHTML(component: Block) {}
  ngOnInit(): void {
    if (this.layoutData) {
      this.form.patchValue(this.layoutData);
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
