import { MatDialogRef } from '@angular/material/dialog';
import { Editor, PluginOptions, Component } from 'grapesjs';
import { POPUP_TYPE, BUTTON, POPUP } from '../../models/constants';
import { IPopup } from '../../models/interfaces';
import { findComponentWithAttribute, replaceClass } from '../utilities/common';
import { environment } from 'src/environments/environment.dev';

export default (editor: Editor, opts: PluginOptions = {}) => {
  const { builderPopupService } = opts;
  const commands = editor.Commands;

  editor.on('component:selected', (component: any) => {
    if (component.get('type') === 'Link') {
      const toolbar = component.get('toolbar');
      const id = 'rd-link-button ';

      if (!toolbar.filter((tlb: any) => tlb.id === id).length) {
        toolbar.unshift({
          id,
          command: () => {
            editor.runCommand('rd-popup:button', { el: component.getEl() });
          },
          label: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
        });
      }
    }
    if (component.get('type') === 'Heading') {
      const toolbar = component.get('toolbar');
      const id = 'rd-link-heading ';

      if (!toolbar.filter((tlb: any) => tlb.id === id).length) {
        toolbar.unshift({
          id,
          command: () => {
            editor.runCommand('rd-popup:heading', { el: component.getEl() });
          },
          label: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
        });
      }
    }
    if (component.get('type') === 'Card') {
      const toolbar = component.get('toolbar');
      const id = 'rd-link-cards ';

      if (!toolbar.filter((tlb: any) => tlb.id === id).length) {
        toolbar.unshift({
          id,
          command: () => {
            editor.runCommand('rd-popup:cards', { el: component.getEl() });
          },
          label: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
        });
      }
    }
    if (component.get('type') === 'Carousel') {
      const toolbar = component.get('toolbar');
      const id = 'rd-carousel ';

      if (!toolbar.filter((tlb: any) => tlb.id === id).length) {
        toolbar.unshift({
          id,
          command: () => {
            editor.runCommand('rd-popup:carousels', { el: component.getEl() });
          },
          label: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
        });
      }
    }
    if (component.get('type') === 'Layout') {
      const toolbar = component.get('toolbar');
      const id = 'rd-link-layouts ';

      if (!toolbar.filter((tlb: any) => tlb.id === id).length) {
        toolbar.unshift({
          id,
          command: () => {
            editor.runCommand('rd-popup:layouts', { el: component.getEl() });
          },
          label: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
        });
      }
    }
    if (environment.CUSTOM_SLIDER_CAROUSEL) {
      if (component.get('type') === 'slider-carousel') {
        const toolbar = component.get('toolbar');
        const id = 'sliderCarousel ';

        if (!toolbar.filter((tlb: any) => tlb.id === id).length) {
          toolbar.unshift({
            id,
            command: () => {
              component.getChildAt(0).append({
                tagName: 'div',
                draggable: false,
                attributes: {
                  class: 'carousel-item',
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
              });
            },
            label: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>`,
          });
        }
      }
    }
  });

  commands.add('rd-popup:button', {
    run(em: Editor, sender: any, options: any) {
      // const { model } = options;
      const model = options.model as Component;
      let el = model.getEl() as HTMLElement;

      const dialogRef: MatDialogRef<any> = builderPopupService.openModal({
        data: {
          title: 'Button picker',
          type: POPUP_TYPE.BUTTON,
          buttonData: {
            title: '',
            size: el?.hasAttribute(BUTTON.SIZE_ATTR)
              ? el?.getAttribute(BUTTON.SIZE_ATTR)
              : null,
            type: el?.getAttribute(BUTTON.TYPE_ATTR),
            leadingIcon: JSON.parse(
              el?.getAttribute(BUTTON.ICON_POSITION_ATTR) || 'false'
            ),
            link: el.hasAttribute(BUTTON.LINK_ATTR)
              ? el?.getAttribute(BUTTON.HREF)
              : '',
            target: el.hasAttribute(BUTTON.TARGET)
              ? el?.getAttribute(BUTTON.TARGET)
              : '',
            isDownload: el.hasAttribute(BUTTON.DOWNLOAD),
          },
        },
        maxWidth: '80vw',
        maxHeight: '80vh',
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        if (res) {
          let iconComponent = model.find("span[data-gjs-type='Icon']");
          if (res.type === 'rd-btn-text' && res.leadingIcon) {
            if (iconComponent.length) {
              iconComponent[0].remove();
              model.components().add(iconComponent, { at: 0 });
            } else {
              model.components().add({ type: 'Icon' }, { at: 0 });
            }
          } else if (res.type === 'rd-btn-text' && !res.leadingIcon) {
            if (iconComponent.length) {
              iconComponent[0].remove();
              model
                .components()
                .add(iconComponent, { at: model.getLastChild().index() + 1 });
            } else {
              model.components().add({ type: 'Icon' });
            }
          }
          model.setAttributes({
            ...model.getAttributes(),
            [`${BUTTON.TYPE_ATTR}`]: `${res.type}`,
            [`${BUTTON.ICON_POSITION_ATTR}`]: `${res.leadingIcon}`,
            [`${BUTTON.SIZE_ATTR}`]: res.size ? res.size : null,
            ...(res.link
              ? {
                  [`${BUTTON.LINK_ATTR}`]: `${res.link}`,
                  [`${BUTTON.HREF}`]: `${res.link}`,
                }
              : null),
            [`${BUTTON.TARGET}`]: res.target ? '_blank' : null,
            [`${BUTTON.DOWNLOAD}`]: res.target ? '' : null,
          });
          if (!res.link) {
            model.removeAttributes([BUTTON.HREF, BUTTON.LINK_ATTR]);
          }
          if (!res.isDownload) {
            model.removeAttributes([BUTTON.DOWNLOAD]);
          }
          model.setClass(`rd-btn ${res.type} ${res.size}`);
          model.view?.render();
        }
      });
    },
  });

  commands.add('rd-popup:heading', {
    run(em: Editor, sender: any, options: any) {
      const { el, model }: any = options;
      editor.Components;
      let selectedComponent: any = editor.getSelected();
      let data = {
        heading: selectedComponent.content,
      };

      const dialogRef: MatDialogRef<any> = builderPopupService.openModal({
        data: {
          title: 'Header Picker',
          type: POPUP_TYPE.HEADING,
          headingData: data,
        },
        maxWidth: '30vw',
        maxHeight: '80vh',
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          const selectedLayout = result.content;
          const selectedComponent: any = editor.getSelected();
          if (selectedComponent && selectedLayout) {
            selectedComponent.components(selectedLayout);
            selectedComponent.view.render();
          }
        }
      });
    },
  });

  commands.add('rd-popup:cards', {
    run(em: Editor, sender: any, options: any) {
      const { el, model }: any = options;
      editor.Components;
      let selectedComponent: any = editor.getSelected();
      let data = {
        card: selectedComponent.content,
      };

      const dialogRef: MatDialogRef<any> = builderPopupService.openModal({
        data: {
          title: 'Cards Picker',
          type: POPUP_TYPE.CARDS,
          cardData: data,
        },
        maxWidth: '80vw',
        maxHeight: '80vh',
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          model.components(result.content);
        }
      });
    },
  });

  commands.add('rd-popup:layouts', {
    run(em: Editor, sender: any, options: any) {
      const { el, model }: any = options;
      editor.Components;
      let selectedComponent: any = editor.getSelected();
      let data = {
        layout: selectedComponent.content,
      };

      const dialogRef: MatDialogRef<any> = builderPopupService.openModal({
        data: {
          title: 'Layouts Picker',
          type: POPUP_TYPE.LAYOUTS,
          cardData: data,
        },
        maxWidth: '80vw',
        maxHeight: '80vh',
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          const selectedLayout = result.content;
          const selectedComponent: any = editor.getSelected();
          if (selectedComponent && selectedLayout) {
            selectedComponent.components(selectedLayout);
            selectedComponent.view.render();
          }
        }
      });
    },
  });

  // Banner
  commands.add('rd-popup:banner', {
    run(em: Editor, sender: any, options: any) {
      const model = options.model as Component;
      const el = options.el as HTMLElement;
      const dialogRef: MatDialogRef<any> = builderPopupService.openModal({
        data: {
          title: 'Banner Picker',
          type: POPUP_TYPE.BANNER,
          bannerData: { type: el?.getAttribute('id') },
        },
        maxWidth: '80vw',
        maxHeight: '80vh',
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result && model) {
          model.components(result.content);
        } else {
          throw new Error('Model not found');
        }
      });
    },
  });

  commands.add('rd-popup:user-card', {
    run(em: Editor, sender: any, options: any) {
      const model = options.model as Component;
      const el = options.el as HTMLElement;
      const dialogRef: MatDialogRef<any> = builderPopupService.openModal({
        data: {
          title: 'Team members',
          type: POPUP_TYPE.TEAM_MEMBER,
        },
        maxWidth: '80vw',
        maxHeight: '80vh',
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result && model) {
          if (result.image) {
            em.Css.setRule(`[data-people-name="${result.name}_${result.id}"]`, {
              'background-image': `url(${result.image}) !important`,
            });
          }
          model.setAttributes({
            ...model.getAttributes(),
            'data-people-id': result.id,
            'data-people-name': `${result.name}_${result.id}`,
          });
          model.components(result.components);
        }
      });
    },
  });

  commands.add('rd-popup:contact-card', {
    run(em: Editor, sender: any, options: any) {
      const model = options.model as Component;
      const el = options.el as HTMLElement;
      console.log(el.querySelectorAll(`[data-people-id]`), 'element');
      const idscontacts = el.querySelectorAll(`[data-people-id]`);
      let selectedIds = Array.from(idscontacts).map((child) =>
        child.getAttribute('data-people-id')
      );

      const dialogRef: MatDialogRef<any> = builderPopupService.openModal({
        data: {
          title: 'Investor members',
          type: POPUP_TYPE.INVESTORS_LIST,
          selectedIds,
        },
        maxWidth: '80vw',
        maxHeight: '80vh',
      });
      dialogRef.afterClosed().subscribe((result: any[]) => {
        if (result && result.length && model) {
          let components = result.map((investorContact: any) => {
            console.log(investorContact.id);
            em.Css.setRule(
              `[data-people-name="${investorContact.name}_${investorContact.id}"]`,
              {
                'background-image': `url(${investorContact.image}) !important`,
              }
            );
            return investorContact.component;
          });
          model.components(components);
        }
      });
    },
  });

  commands.add('rd-popup:carousels', {
    run(em: Editor, sender: any, options: any) {
      const { el, model }: any = options;
      let selectedComponent: any = editor.getSelected();
      let data = {
        id: el.getAttribute('data-carousel-type'),
      };

      const dialogRef: MatDialogRef<any> = builderPopupService.openModal({
        data: {
          title: 'Carousel Picker',
          type: POPUP_TYPE.CAROUSEL,
          carouselData: data,
        },
        maxWidth: '60vw',
        maxHeight: '80vh',
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          model.components(result.content);
          // model.setAttributes({
          //   ...model.getAttributes(),
          //   'data-carousel-type': result.id,
          // });
        }
      });
    },
  });

  commands.add('rd-popup:popup', {
    run(em: Editor, sender: any, options: any) {
      let component = editor.getSelected();
      let trigger = findComponentWithAttribute(component, POPUP.LABEL);
      let popup = findComponentWithAttribute(component, POPUP.SIZE);

      let data: IPopup = {
        label: trigger?.getAttributes()[POPUP.LABEL] || '',
        name: component?.getAttributes()[POPUP.NAME] || '',
        size: popup?.getAttributes()[POPUP.SIZE] || '',
      };

      const dialogRef: MatDialogRef<any> = builderPopupService.openModal({
        data: {
          title: 'Popup picker',
          type: POPUP_TYPE.POPUP,
          popupData: data,
        },
        maxWidth: '80vw',
        minHeight: '300px',
        maxHeight: '80vh',
      });

      dialogRef.afterClosed().subscribe((result: IPopup) => {
        if (result) {
          trigger?.setAttributes({
            ...trigger.getAttributes(),
            [POPUP.LABEL]: result.label,
          });
          trigger.set({ content: result.label });
          component?.setAttributes({
            ...component.getAttributes(),
            [POPUP.NAME]: result.name,
          });
          popup?.setAttributes({
            ...popup.getAttributes(),
            [POPUP.SIZE]: result.size,
            class: replaceClass(popup, result.size, data.size),
          });
        }
      });
    },
  });

  if (environment.PREVIEW_CHANGES) {
    commands.add('page-preview', {
      run(em: Editor, sender: any, options: any) {
        const { el, model }: any = options;
        const data = {
          details: { Html: editor.getHtml(), Css: editor.getCss() },
          pageDetails: options.pageDetails,
          pageConfig: options.pageConfig,
        };
        const dialogRef: MatDialogRef<any> = builderPopupService.openModal({
          data: {
            title: 'Preview',
            type: POPUP_TYPE.PREVIEW,
            previewData: data,
          },
          maxWidth: '100vw',
          maxHeight: '100vh',
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
            model.components(result.content);
          }
        });
      },
    });
  }
};
