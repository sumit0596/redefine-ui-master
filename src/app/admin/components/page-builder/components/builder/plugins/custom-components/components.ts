import { Editor } from 'grapesjs';
import {
  BUILDER_CONSTANTS,
  POPUP_TYPE,
  BUTTON,
  POPUP,
} from '../../models/constants';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment.dev';
import { COMPONENT } from 'src/app/models/custom-components';
declare const accordian: any;
import { Component, Components } from 'grapesjs';

export default (editor: Editor, opts: any = {}) => {
  const iconClassPrefix: string = 'rd-icon';
  const typeIdAttribute: string = 'data-type-id';
  const { builderPopupService } = opts;
  const components = editor.DomComponents;
  var defaultType = editor.DomComponents.getType('default');
  var _initialize = defaultType.model.prototype.initialize;

  defaultType.model.prototype.initialize = function () {
    _initialize.apply(this, arguments);
    setTimeout(() => {
      this.get('traits').add(
        [
          {
            type: 'color',
            label: 'Color',
          },

        ]);
    }, 100);
  };

  components.addType('Icon', {
    isComponent: (el: HTMLElement) => {
      if (
        el.tagName === 'SPAN' &&
        el.getAttribute(typeIdAttribute) === 'rd-custom-icon'
      ) {
        return { type: 'Icon' };
      }
      return false;
    },
    model: {
      defaults: {
        tagName: 'span',
        name: 'Icon',
        attributes: { [typeIdAttribute]: 'rd-custom-icon', class: 'rd-icon' },
        content: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right-circle"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
      },
    },
    view: {
      init: ({ model, el }: any) => {
        el.innerHTML = model.get('content');
      },
      events: {
        dblclick: 'onActive',
      } as any,
      onActive(ev: Event) {
        if (ev) {
          ev.stopPropagation();
        }
        const { model } = this;
        let selectedComponent: any = editor.getSelected();
        const elClass: any = [...model.getClasses()].find((c: string) =>
          c.includes(`${iconClassPrefix}-`)
        );
        let data = {
          icon: model.content,
          size: elClass,
          color: model.getEl()?.style['color'],
        };

        const dialogRef: MatDialogRef<any> = builderPopupService.openModal({
          data: {
            title: 'Icon picker',
            type: POPUP_TYPE.ICON,
            iconData: data,
          },
          maxWidth: '80vw',
          minHeight: '300px',
          maxHeight: '80vh',
        });

        dialogRef.afterClosed().subscribe((result: any) => {
          if (selectedComponent && result) {
            model.components(result.icon);
            if (model) {
              model.setClass(`${iconClassPrefix} ${result.size}`);
              model.addAttributes({
                style: result.color ? `color: ${result.color}` : null,
              });
              model.view?.render();
            }
          }
        });
      },
    },
  });

  components.addType('Popup', {
    isComponent: (el: HTMLElement) => {
      if (el.tagName && el.getAttribute(typeIdAttribute) === 'rd-popup') {
        return { type: 'Popup' };
      }
      return false;
    },
    model: {
      defaults: {
        tagName: 'div',
        name: 'Popup',
        attributes: {
          [typeIdAttribute]: 'rd-popup',
          class: 'rd-popup',
          [POPUP.NAME]: 'Default',
        },
        components: [
          {
            tagName: 'span',
            type: 'text',
            attributes: {
              class: 'rd-link',
              'data-bs-toggle': 'modal',
              'data-bs-target': `#${BUILDER_CONSTANTS.POPUP_ID}`,
              [POPUP.LABEL]: 'popup',
            },
            content: `popup`,
          },
          {
            tagName: 'div',
            attributes: {
              class: 'modal fade',
              tabindex: '-1',
              id: `${BUILDER_CONSTANTS.POPUP_ID}`,
              'aria-hidden': 'true',
            },
            components: [
              {
                tagName: 'div',
                attributes: {
                  class:
                    'modal-dialog modal-dialog-centered modal-dialog-scrollable model-sm',
                  [POPUP.SIZE]: 'model-sm',
                },
                components: [
                  {
                    tagName: 'div',
                    attributes: {
                      class: 'modal-content',
                    },
                    components: [
                      {
                        tagName: 'div',
                        attributes: {
                          class: 'modal-header',
                        },
                        components: [
                          {
                            type: 'text',
                            content: '<h5 class="modal-title">Modal Title</h5>',
                          },
                          {
                            tagName: 'button',
                            attributes: {
                              type: 'button',
                              class: 'rd-btn-sm btn-close rd-text-red',
                              'data-bs-dismiss': 'modal',
                              'aria-label': 'Close',
                            },
                            removable: false,
                            draggable: false,
                          },
                        ],
                      },
                      {
                        tagName: 'div',
                        attributes: {
                          class: 'modal-body',
                        },
                        components: [
                          {
                            type: 'text',
                            content: '<p>Modal body text goes here.</p>',
                          },
                        ],
                      },
                      {
                        tagName: 'div',
                        attributes: {
                          class: 'modal-footer',
                        },
                        components: [
                          {
                            tagName: 'button',
                            attributes: {
                              type: 'button',
                              class: 'btn btn-secondary',
                              'data-bs-dismiss': 'modal',
                            },
                            content: 'Close',
                          },
                          {
                            tagName: 'button',
                            attributes: {
                              type: 'button',
                              class: 'btn btn-primary',
                            },
                            content: 'Save changes',
                          },
                        ],
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
    view: {
      events: {
        dblclick: 'onActive',
      } as any,
      onActive(ev: Event) {
        if (ev) {
          ev.stopPropagation();
        }
        editor.runCommand('rd-popup:popup', this);
      },

      onEdit(ev: Event) {
        editor.runCommand('rd-popup:popup', this);
      },
    },
  });

  components.addType('Spacer', {
    isComponent: (el: HTMLElement) => {
      return (
        el.tagName === 'DIV' && el.getAttribute(typeIdAttribute) === 'rd-spacer'
      );
    },
    model: {
      defaults: {
        attributes: { class: 'rd-spacer', [typeIdAttribute]: 'rd-spacer' },
        name: 'Spacer',
      },
    },
  });

  components.addType('Link', {
    extend: 'link text',

    isComponent: (el: HTMLElement) => {
      return (
        el.tagName === 'A' &&
        el.getAttribute(typeIdAttribute) === 'rd-link-button'
      );
    },

    model: {
      defaults: {
        tagName: 'a',
        attributes: {
          class: 'rd-btn rd-btn-dark',
          [BUTTON.TYPE_ATTR]: 'rd-btn-dark',
          [typeIdAttribute]: 'rd-link-button',
        },
        components: [
          {
            tagName: 'span',
            type: 'text',
            attributes: {
              class: 'btn-text',
            },
            content: 'Go to',
            editable: true,
            draggable: false,
            activate: true,
            select: true,
          },
        ],
        traits: [
          ...(editor.DomComponents.getType('link')?.model.prototype.defaults.traits || []),
          {
            type: 'text',
            label: 'Aria Label',
            name: 'aria-label',
            placeholder: 'Add a label for accessibility',
          },
          {
            label: 'New window',
            type: 'checkbox',
            name: 'target',
            valueTrue: '_blank',
            valueFalse: undefined,
          },
          {
            label: 'Download Track',
            type: 'download',
            name: 'downloadanalytics',

          },

        ],

      },
    },

    view: {
      events: {
        dblclick: 'onActive',
      } as any,

      onActive(ev: Event) {
        if (ev) {
          ev.stopPropagation();
        }
        editor.runCommand('rd-popup:button', this);
      },

      onEdit(ev: Event) {
        editor.runCommand('rd-popup:button', this);
      },
    },
  });

  components.addType('Heading', {
    extend: 'link text',
    isComponent: (el: HTMLElement) => {
      return (
        el.tagName === 'DIV' &&
        el.getAttribute(typeIdAttribute) === 'rd-link-heading'
      );
    },
    model: {
      defaults: {
        tagName: 'div',
        attributes: {
          class: 'rd-heading',
          [typeIdAttribute]: 'rd-link-heading',
        },
        content: {
          attributes: {
            class:
              'com-md-12 row justify-content-center align-items-center heading-primary',
          },
          content: ` <div class="col-md-12"><div class="card"></div></div>`,
          editable: true,
          draggable: false,
          activate: true,
          select: true,
        },
      },
    },
    view: {
      events: {
        dblclick: 'onEdit',
      } as any,

      onActive(ev: Event) {
        editor.runCommand('rd-popup:heading', this);
      },

      onEdit(ev: Event) {
        editor.runCommand('rd-popup:heading', {
          el: this.model.getEl(),
          model: this.model,
        });
      },
    },
  });

  components.addType('Card', {
    extend: 'link text',
    isComponent: (el: HTMLElement) => {
      return (
        el.tagName === 'DIV' &&
        el.getAttribute(typeIdAttribute) === 'rd-link-cards'
      );
    },
    model: {
      defaults: {},
    },
    view: {
      events: {
        dblclick: 'onEdit',
      } as any,

      onActive(ev: Event) {
        if (ev) {
          ev.stopPropagation();
        }
        editor.runCommand('rd-popup:cards', this);
      },
      onEdit(ev: Event) {
        editor.runCommand('rd-popup:cards', {
          el: this.model.getEl(),
          model: this.model,
        });
      },
    },
  });

  components.addType('Layout', {
    extend: 'link text',
    isComponent: (el: HTMLElement) => {
      return (
        el.tagName === 'DIV' &&
        el.getAttribute(typeIdAttribute) === 'rd-link-layouts'
      );
    },
    model: {
      defaults: {
        tagName: 'div',
        attributes: { [typeIdAttribute]: 'rd-link-layouts', class: 'layouts' },
        content: {
          attributes: {
            class:
              'com-md-12 row justify-content-center align-items-center square-box',
          },
          content: ` <div data-gjs-highlightable="true" id="ihzc" data-gjs-type="default" draggable="true" class="container container-xl container-lg"><div data-gjs-highlightable="true" id="iezz5" data-gjs-type="default" class="row"><div data-gjs-highlightable="true" id="ihjy6" data-gjs-type="default" class="col-12"></div></div></div>`,
          editable: true,
          draggable: false,
          activate: true,
          select: true,
        },
      },
    },
    view: {
      events: {
        dblclick: 'onEdit',
      } as any,

      onActive(ev: Event) {
        editor.runCommand('rd-popup:layouts', this);
      },
      onEdit(ev: Event) {
        editor.runCommand('rd-popup:layouts', {
          el: this.model.getEl(),
          model: this.model,
        });
      },
    },
  });

  components.addType('Banner', {
    isComponent: (el: HTMLElement) => {
      return (
        el.tagName === 'DIV' && el.getAttribute(typeIdAttribute) === 'rd-banner'
      );
    },

    view: {
      events: {
        dblclick: 'onEdit',
      } as any,

      onActive(ev: Event) {
        editor.runCommand('rd-popup:banner', this);
      },
      onEdit(ev: Event) {
        editor.runCommand('rd-popup:banner', this);
      },
    },
  });

  components.addType('UserCard', {
    isComponent: (el: HTMLElement) => {
      return (
        el.tagName === 'DIV' &&
        el?.getAttribute(typeIdAttribute) === 'rd-user-card'
      );
    },
    model: {
      defaults: {
        name: 'User',
        label: 'User Card',
        attributes: { class: 'people-card', [typeIdAttribute]: 'rd-user-card' },
        components: [
          {
            attributes: { class: 'people-card-content' },
            components: [
              {
                attributes: { class: 'position-relative mb-4' },
                components: [
                  {
                    type: 'text',
                    attributes: {
                      class: 'rd-heading rd-heading-xs',
                    },
                    content: 'Person name',
                    selectable: false,
                    editable: false,
                    draggable: false,
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
                  class: 'd-flex align-items-center',
                },
                components: [
                  {
                    type: 'text',
                    content: 'Role name',
                    selectable: false,
                  },
                ],
              },
              {
                type: 'Link',
                attributes: {
                  href: '#',
                  class: 'rd-btn rd-btn-text  rd-text-white people-card-action',
                },
                components: [
                  {
                    tagName: 'span',
                    type: 'text',
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
      },
    },
    view: {
      events: {
        dblclick: 'onActive',
      } as any,
      onActive(ev: Event) {
        if (ev) {
          ev.stopPropagation();
        }
        editor.runCommand('rd-popup:user-card', this);
      },
    },
  });

  components.addType('ContactCard', {
    isComponent: (el: HTMLElement) => {
      return (
        el.tagName === 'DIV' &&
        el?.getAttribute(typeIdAttribute) === 'rd-contact-card'
      );
    },
    model: {
      defaults: {
        name: 'Contact',
        label: 'Contact Card',
        editable: false,
        propagate: ['editable'],
        droppable:false,
        attributes: {
          class:
            'w-full p-4 d-flex flex-wrap align-items-start justify-content-start gap-3',
          id: COMPONENT.INVESTOR_CONTACTS,
          [typeIdAttribute]: 'rd-contact-card',
        },
        components: [
          {
            attributes: { class: 'people-card-content' },
            droppable:false,
            components: [
              {
                attributes: { class: 'position-relative mb-4' },
                droppable:false,
                components: [
                  {
                    type: 'text',
                    attributes: {
                      class: 'rd-heading rd-heading-xs',
                    },
                    droppable:false,
                    content: 'Person name',
                    selectable: false,
                    draggable: false,
                  },
                  { droppable:false,
                    content: `<span class="rd-indicator rd-indicator-lg">
                    <span class="rd-indicator-content rd-indicator-primary"></span>
                    </span>`,
                  },
                ],
              },
              {
                attributes: {
                  class: 'd-flex align-items-center',
                },
                droppable:false,
                components: [
                  {
                    type: 'text',
                    content: 'Role name',
                    selectable: false,
                    draggable: false,
                    droppable:false,
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    view: {
      events: {
        dblclick: 'onActive',
      } as any,
      onActive(ev: Event) {
        if (ev) {
          ev.stopPropagation();
        }
        editor.runCommand('rd-popup:contact-card', this);
      },
    },
  });

  components.addType('Carousel', {
    extend: 'link text',
    isComponent: (el: HTMLElement) => {
      return (
        el.tagName === 'DIV' &&
        el.getAttribute(typeIdAttribute) === 'rd-carousel'
      );
    },
    model: {
      defaults: {
        attributes: { [typeIdAttribute]: 'rd-carousel' },
      },
    },
    view: {
      events: {
        dblclick: 'onEdit',
      } as any,

      onActive(ev: Event) {
        if (ev) {
          ev.stopPropagation();
        }
        editor.runCommand('rd-popup:carousels', this);
      },
      onEdit(ev: Event) {
        if (ev) {
          ev.stopPropagation();
        }
        editor.runCommand('rd-popup:carousels', {
          el: this.model.getEl(),
          model: this.model,
        });
      },
    },
  });

  if (environment.CUSTOM_SLIDER_CAROUSEL) {
    components.addType('slider-carousel', {
      isComponent: (el: HTMLElement) => {
        return (
          el.tagName === 'DIV' &&
          el.getAttribute(typeIdAttribute) === 'slider-carousel'
        );
      },
      model: {
        defaults: {
          tagName: 'div',
          attributes: {
            class: 'carousel slide',
            id: `${BUILDER_CONSTANTS.SLIDER_CAROUSEL_ID}`,
            'data-bs-ride': 'carousel',
            'data-type-id': 'slider-carousel',
          },
          components: [
            {
              tagName: 'div',
              attributes: {
                class: 'carousel-inner',
                'data-type-id': 'rd-carousel-inner',
              },
              components: [
                {
                  tagName: 'div',
                  draggable: false,
                  attributes: {
                    class: 'carousel-item active',
                    'data-type-id': 'sliderInner',
                  },
                  components: [
                    {
                      tagName: 'img',
                      type: 'image',
                      attributes: {
                        src: '/assets/images/builder/slider-placeholder.png',
                        class: 'd-block w-100',
                        alt: 'Slide Image',
                      },
                    },
                    {
                      tagName: 'div',
                      attributes: { class: 'rd-slider_carousel-caption' },
                      draggable: false,
                      components: [
                        {
                          tagName: 'div',
                          attributes: {
                            class: 'd-flex align-items-center w-100',
                          },
                          components: [
                            {
                              tagName: 'div',
                              draggable: false,
                              attributes: { class: 'before-title' },
                              components: [
                                {
                                  tagName: 'div',
                                  draggable: false,
                                  attributes: { class: 'before-title-line' },
                                },
                              ],
                            },
                            {
                              tagName: 'div',
                              draggable: false,
                              attributes: { class: 'banner-title' },
                              components: [
                                {
                                  type: 'text',
                                  tagName: 'div',
                                  content: 'Add Slide',
                                  draggable: false,
                                  editable: true,
                                },
                                {
                                  type: 'text',
                                  tagName: 'div',
                                  content: 'content',
                                  draggable: false,
                                  editable: true,
                                },
                              ],
                            },
                            {
                              tagName: 'div',
                              attributes: { class: 'after-title' },
                              draggable: false,
                              components: [
                                {
                                  tagName: 'div',
                                  draggable: false,
                                  attributes: { class: 'after-title-line' },
                                },
                              ],
                            },
                          ],
                        },
                        {
                          tagName: 'div',
                          attributes: { class: 'custom-slider-btn' },
                          draggable: false,
                          components: [
                            {
                              tagName: 'button',
                              attributes: {
                                class:
                                  'rd-btn rd-slider-btn-info rd-btn-light rd-btn-lg',
                              },
                              draggable: false,
                              components: [
                                {
                                  type: 'text',
                                  tagName: 'span',
                                  attributes: { class: 'btn-text' },
                                  content: 'Click',
                                  draggable: false,
                                  editable: true,
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              tagName: 'button',
              attributes: {
                class: 'carousel-control-prev',
                type: 'button',
                'data-bs-target': `#${BUILDER_CONSTANTS.SLIDER_CAROUSEL_ID}`,
                'data-bs-slide': 'prev',
              },
              components: [
                {
                  tagName: 'span',
                  draggable: false,
                  attributes: {
                    class: 'carousel-control-prev-icon',
                    'aria-hidden': 'true',
                  },
                },
                {
                  tagName: 'span',
                  attributes: { class: 'visually-hidden' },
                  content: 'Previous',
                },
              ],
            },
            {
              tagName: 'button',
              attributes: {
                class: 'carousel-control-next',
                type: 'button',
                'data-bs-target': `#${BUILDER_CONSTANTS.SLIDER_CAROUSEL_ID}`,
                'data-bs-slide': 'next',
              },
              components: [
                {
                  tagName: 'span',
                  draggable: false,
                  attributes: {
                    class: 'carousel-control-next-icon',
                    'aria-hidden': 'true',
                  },
                },
                {
                  tagName: 'span',
                  attributes: { class: 'visually-hidden' },
                  content: 'Next',
                },
              ],
            },
          ],
        },
      },
    });
  }

  components.addType('Accordian', {
    isComponent: (el: HTMLElement) => {
      return (
        el.tagName === 'DIV' &&
        el.getAttribute(typeIdAttribute) === 'rd-accordian'
      );
    },
    model: {
      defaults: {
        name: 'Accordian',
        label: 'Accordian',
        tagName: 'section',
        attributes: { class: 'holder', [typeIdAttribute]: 'rd-accordian' },
        components: [
          {
            editable: true,
            tagName: 'div',
            attributes: { class: 'item' },
            components: [
              {
                tagName: 'div',
                attributes: { class: 'd-flex accordion' },
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
                    attributes: { class: 'col-md-2 ' },
                    content: 'Primary',
                    // style: {

                    //   'padding-left':'20px',

                    // },
                  },
                ],
              },

              {
                tagName: 'div',
                attributes: { class: 'accordion-content' },
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
    },
  });

  // if (environment.PAGE_BUILDER_ANCHOR) {
  //   components.addType("custom-link", {
  //     extend: "link",
  //     isComponent: el => el.tagName == 'A',
  //     model: {
  //       defaults: {
  //         info2: "default value for info 2",
  //         media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#60f594" viewBox="0 0 256 256"><path d="M80,120h96a8,8,0,0,1,0,16H80a8,8,0,0,1,0-16Zm24,48H64a40,40,0,0,1,0-80h40a8,8,0,0,0,0-16H64a56,56,0,0,0,0,112h40a8,8,0,0,0,0-16Zm88-96H152a8,8,0,0,0,0,16h40a40,40,0,0,1,0,80H152a8,8,0,0,0,0,16h40a56,56,0,0,0,0-112Z"></path></svg>`,
  //         traits: [
  //           {
  //             label: 'Url',
  //             type: 'anchor',
  //             name: 'href',
  //           },
  //           {
  //             label: 'New window',
  //             type: 'checkbox',
  //             name: 'target',
  //             valueTrue: '_blank',
  //             valueFalse: undefined,
  //           },
  //           {
  //             label: 'Download Track',
  //             type: 'download',
  //             name: 'downloadanalytics',

  //           },

  //         ],
  //         attributes: { class: "rd-link" }
  //       },

  //     },

  //   });
  // }

};
