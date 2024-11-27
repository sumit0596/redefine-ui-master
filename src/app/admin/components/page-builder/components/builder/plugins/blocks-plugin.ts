import type { BlockProperties, Editor, Plugin, PluginOptions } from 'grapesjs';
import { BUILDER_CONSTANTS } from '../models/constants';
import { COMPONENT } from 'src/app/models/custom-components';
import { List, quick_links } from 'src/app/models/svgs';
import { environment } from 'src/environments/environment.dev';

const blocks: BlockProperties[] = [
  {
    id: 'rd-text',
    label: 'Text',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b78847" viewBox="0 0 256 256"><path d="M208,56V88a8,8,0,0,1-16,0V64H136V192h24a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16h24V64H64V88a8,8,0,0,1-16,0V56a8,8,0,0,1,8-8H200A8,8,0,0,1,208,56Z"></path></svg>`,
    category: 'Basics',
    content: {
      tagName: 'span',
      type: 'text',
      attributes: {},
      content: 'This is a sample text',
    },
  },
  {
    id: 'rd-paragraph',
    label: 'Paragraph',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#60f594" viewBox="0 0 256 256"><path d="M208,40H96a64,64,0,0,0,0,128h40v40a8,8,0,0,0,16,0V56h24V208a8,8,0,0,0,16,0V56h16a8,8,0,0,0,0-16ZM136,152H96a48,48,0,0,1,0-96h40Z"></path></svg>`,
    category: 'Basics',
    content: {
      tagName: 'p',
      type: 'text',
      attributes: { class: 'rd-text-grey-mid' },
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`,
      traits : [
        {
          label: 'Next',
          type: 'href-next',
        },
      ]
    },
  },
  {
    id        : 'rd-image',
    label     : 'Image responsive',
    media     : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path></svg>',
    category  : 'Basics',
    activate  : true,
    content: {
      tagName: 'img',
      type: 'image',
      attributes: { class: 'w-100 h-100' },
    },
  },
  {
    id        : 'rd-image-resp',
    label     : 'Image responsive width',
    media     : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path></svg>',
    category  : 'Basics',
    activate  : true,
    content: {
      tagName: 'img',
      type: 'image',
      attributes: { class: 'w-100 ' },
    },
  },
  {
    id: 'rd-horizontal-line',
    label: 'Horizontal line',
    media:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path></svg>',
    category: 'Basics',
    activate: true,
    content: {
      tagName: 'div',
      attributes: { class: 'rd-hr-line' },
      traits : [
        {
          label: 'Next',
          type: 'href-next',
        },
      ]
    },
  },
  
  // {
  //   id: 'link-block',
  //   label: 'Link',
  //   media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#60f594" viewBox="0 0 256 256"><path d="M80,120h96a8,8,0,0,1,0,16H80a8,8,0,0,1,0-16Zm24,48H64a40,40,0,0,1,0-80h40a8,8,0,0,0,0-16H64a56,56,0,0,0,0,112h40a8,8,0,0,0,0-16Zm88-96H152a8,8,0,0,0,0,16h40a40,40,0,0,1,0,80H152a8,8,0,0,0,0,16h40a56,56,0,0,0,0-112Z"></path></svg>`,
  //   category: 'Basics',
  //   activate: true,
  //   content: {
  //     tagName: 'a',
  //     type: 'link',
  //     attributes: { class: 'rd-link' },
  //     content: 'Enter your link',
  //     traits: [ 
  //       {
  //         label: 'Url',
  //         type: 'text',
  //         name: 'href',
  //       },
  //       {
  //         label: 'New window',
  //         type: 'checkbox',
  //         name: 'target',
  //         valueTrue: '_blank',
  //         valueFalse: undefined,
  //       },
  //       {
  //         label: 'Download Track',
  //         type: 'download',
  //       },
  //       {
  //         label: 'Color',
  //         type: 'color',
  //         name : "color"
  //       },
  //     ],
  //   }, 
  // },
  {
    label: "Link",
    category: 'Basics',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#60f594" viewBox="0 0 256 256"><path d="M80,120h96a8,8,0,0,1,0,16H80a8,8,0,0,1,0-16Zm24,48H64a40,40,0,0,1,0-80h40a8,8,0,0,0,0-16H64a56,56,0,0,0,0,112h40a8,8,0,0,0,0-16Zm88-96H152a8,8,0,0,0,0,16h40a40,40,0,0,1,0,80H152a8,8,0,0,0,0,16h40a56,56,0,0,0,0-112Z"></path></svg>`,
    activate  : true,
    content: {
      editable:'true',
      type: "custom-link",
      content: 'Enter your link',
    
    }
  },
  {
    id: 'contact-us-form',
    label: 'Contact us',
    category: 'Placeholders',
    media: `<svg fill="#000000" version="1.1" id="Layer_1" xmlns:x="&amp;ns_extend;" xmlns:i="&amp;ns_ai;" xmlns:graph="&amp;ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <metadata> <sfw xmlns="&amp;ns_sfw;"> <slices> </slices> <slicesourcebounds width="505" height="984" bottomleftorigin="true" x="0" y="-552"> </slicesourcebounds> </sfw> </metadata> <g> <g> <g> <path d="M22,6H2C0.9,6,0,5.1,0,4V2c0-1.1,0.9-2,2-2h20c1.1,0,2,0.9,2,2v2C24,5.1,23.1,6,22,6z M22,4v1V4L22,4L22,4z M2,2v2h20 l0-2H2z"></path> </g> </g> <g> <g> <path d="M22,15H2c-1.1,0-2-0.9-2-2v-2c0-1.1,0.9-2,2-2h20c1.1,0,2,0.9,2,2v2C24,14.1,23.1,15,22,15z M22,13v1V13L22,13L22,13z M2,11v2h20l0-2H2z"></path> </g> </g> <g> <g> <path d="M11,23H2c-0.5,0-1-0.5-1-1v-2c0-0.5,0.5-1,1-1h9c0.6,0,1,0.5,1,1v2C12,22.5,11.6,23,11,23z"></path> </g> <g> <path d="M11,24H2c-1.1,0-2-0.9-2-2v-2c0-1.1,0.9-2,2-2h9c1.1,0,2,0.9,2,2v2C13,23.1,12.1,24,11,24z M11,22v1V22L11,22L11,22z M2,20v2h9l0-2H2z"></path> </g> </g> </g> </g></svg>`,
    content: {
      tagName: 'form',
      attributes: { class: 'contact-us-form', id: COMPONENT.CONTACT_US_FORM },
      components: [
        {
          tagName: 'div',
          attributes: { class: 'component-placeholder' },
          components: [
            {
              tagName: 'div',
              attributes: { class: 'placeholder-title' },
              content: 'Contact us form',
            },
            {
              tagName: 'div',
              attributes: { class: 'placeholder-note' },
              content:
                '*Note: This section will be replaced with the actual form on frontend',
            },
          ],
        },
        {
          content: `<div class="row">
            <div class="col-md-6">
              <input
                class="form-control"
                type="text"
                disabled
              />
            </div>
            <div class="col-md-6">
              <input
                class="form-control"
                type="text"
                disabled
              />
            </div>
            <div class="col-md-6">
              <input
                class="form-control"
                type="text"
                disabled
              />
            </div>
            <div class="col-md-6">
              <input
                class="form-control"
                type="text"
                disabled
              />
            </div>
            <div class="col-md-6">
              <button type="button" class="btn btn-secondary w-75 py-3" disabled></button>
            </div>
          </div>`,
        },
      ],
    },
  },
  {
    id        : 'media-enquiry-form',
    label     : 'Media enquiry',
    category  : 'Placeholders',
    media     : `<svg fill="#000000" version="1.1" id="Layer_1" xmlns:x="&amp;ns_extend;" xmlns:i="&amp;ns_ai;" xmlns:graph="&amp;ns_graphs;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <metadata> <sfw xmlns="&amp;ns_sfw;"> <slices> </slices> <slicesourcebounds width="505" height="984" bottomleftorigin="true" x="0" y="-552"> </slicesourcebounds> </sfw> </metadata> <g> <g> <g> <path d="M22,6H2C0.9,6,0,5.1,0,4V2c0-1.1,0.9-2,2-2h20c1.1,0,2,0.9,2,2v2C24,5.1,23.1,6,22,6z M22,4v1V4L22,4L22,4z M2,2v2h20 l0-2H2z"></path> </g> </g> <g> <g> <path d="M22,15H2c-1.1,0-2-0.9-2-2v-2c0-1.1,0.9-2,2-2h20c1.1,0,2,0.9,2,2v2C24,14.1,23.1,15,22,15z M22,13v1V13L22,13L22,13z M2,11v2h20l0-2H2z"></path> </g> </g> <g> <g> <path d="M11,23H2c-0.5,0-1-0.5-1-1v-2c0-0.5,0.5-1,1-1h9c0.6,0,1,0.5,1,1v2C12,22.5,11.6,23,11,23z"></path> </g> <g> <path d="M11,24H2c-1.1,0-2-0.9-2-2v-2c0-1.1,0.9-2,2-2h9c1.1,0,2,0.9,2,2v2C13,23.1,12.1,24,11,24z M11,22v1V22L11,22L11,22z M2,20v2h9l0-2H2z"></path> </g> </g> </g> </g></svg>`,
    content   : {
      tagName     : 'form',
      attributes  : {
        class     : 'media-enquiry-form',
        id        : COMPONENT.MEDIA_ENQUIRY_FORM,
      },
      components: [
        {
          tagName: 'div',
          attributes: { class: 'component-placeholder' },
          components: [
            {
              tagName: 'div',
              attributes: { class: 'placeholder-title' },
              content: 'Media enquiry form',
              editable: false,
              draggable: false,
              copyable: false,
            },
            {
              tagName: 'div',
              attributes: { class: 'placeholder-note' },
              content:
                '*Note: This section will be replaced with the actual form on frontend',
              editable: false,
              draggable: false,
              copyable: false,
            },
          ],
        },
        {
          content: `<div class="row">
            <div class="col-md-6">
              <input
                class="form-control"
                type="text"
                disabled
              />
            </div>
            <div class="col-md-6">
              <input
                class="form-control"
                type="text"
                disabled
              />
            </div>
            <div class="col-md-6">
              <input
                class="form-control"
                type="text"
                disabled
              />
            </div>
            <div class="col-md-6">
              <input
                class="form-control"
                type="text"
                disabled
              />
            </div>
            <div class="col-md-6">
              <button type="button" class="btn btn-secondary w-75 py-3" disabled></button>
            </div>
          </div>
          `,
        },
      ],
    },
  },
  {
    id        : 'our-offices',
    label     : 'Our offices',
    category  : 'Placeholders',
    media     : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M224,64H154.67L126.93,43.2a16.12,16.12,0,0,0-9.6-3.2H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H192.89A15.13,15.13,0,0,0,208,200.89V184h16.89A15.13,15.13,0,0,0,240,168.89V80A16,16,0,0,0,224,64ZM192,200H40V88H85.33l27.74,20.8a16.12,16.12,0,0,0,9.6,3.2H192Zm32-32H208V112a16,16,0,0,0-16-16H122.67L94.93,75.2a16.12,16.12,0,0,0-9.6-3.2H72V56h45.33l27.74,20.8a16.12,16.12,0,0,0,9.6,3.2H224Z"></path></svg>',
    content   : {
      attributes  : { class: 'our-offices', id: COMPONENT.OUR_OFFICES },
      components  : [
        {
          tagName     : 'div',
          attributes  : { class: 'component-placeholder' },
          components  : [
            {
              tagName     : 'div',
              attributes  : { class: 'placeholder-title' },
              content     : 'Our offices',
            },
            {
              tagName     : 'div',
              attributes  : { class: 'placeholder-note' },
              content     : '*Note: This section will be replaced with the actual office list',
            },
          ],
        },
        {
          content: `<div class="row py-2 component-placeholder">
            <div class="col-md-3 ">
              <div class="office-card card-placeholder"></div>
            </div>
            <div class="col-md-3">
              <div class="office-card card-placeholder"></div>
            </div>
            <div class="col-md-3">
              <div class="office-card card-placeholder"></div>
            </div>
            <div class="col-md-3">
              <div class="office-card card-placeholder"></div>
            </div>
          </div>
          `,
        },
      ],
    },
  },
  {
    id: 'rd-quick-links',
    label: 'Quick links',
    category: 'Placeholders',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#60f594" viewBox="0 0 256 256"><path d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L72.5,104.28A56,56,0,0,1,149.31,102a8,8,0,1,1-10.64,12,40,40,0,0,0-54.85,1.63L59.7,139.72a40,40,0,0,0,56.58,56.58l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56.08,56.08,0,0,0-79.22,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.58,56.58L172.18,140.4A40,40,0,0,1,117.33,142,8,8,0,1,0,106.69,154a56,56,0,0,0,76.81-2.26l24.12-24.12A56.08,56.08,0,0,0,207.62,48.38Z"></path></svg>`,
    content: {
      attributes: { id: COMPONENT.QUICK_LINKS },
      editable: false,
      selectable: false,
      copyable: false,
      content: `<div class="container">
      <div class="row">
        <div class="col-4">
          <div class="position-relative">
            <div class="rd-heading rd-heading-lg-normal">Quick Links</div>
            <span class="rd-indicator rd-indicator-lg">
              <span class="rd-indicator-content rd-indicator-primary"></span>
            </span>
          </div>
        </div>
        <div class="col-8">
          <div class="row">
            <div class="col-3">
              <div class="w-100 h-100 rd-bg__grey-very-light p-2 d-flex align-items-end ">Link 1</div>
            </div>
            <div class="col-3">
              <div class="w-100 h-100 rd-bg__grey-very-light p-2 d-flex align-items-end ">Link 1</div>
            </div>
            <div class="col-3">
              <div class="w-100 h-100 rd-bg__grey-very-light p-2 d-flex align-items-end ">Link 1</div>
            </div>
            <div class="col-3">
              <div class="w-100 h-100 rd-bg__grey-very-light p-2 d-flex align-items-end ">Link 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    },
  },
  // {
  //   id: 'rd-investor-contacts',
  //   label: 'Investors Contacts',
  //   category: 'Placeholders',
  //   media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#60f594" viewBox="0 0 256 256"><path d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L72.5,104.28A56,56,0,0,1,149.31,102a8,8,0,1,1-10.64,12,40,40,0,0,0-54.85,1.63L59.7,139.72a40,40,0,0,0,56.58,56.58l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56.08,56.08,0,0,0-79.22,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.58,56.58L172.18,140.4A40,40,0,0,1,117.33,142,8,8,0,1,0,106.69,154a56,56,0,0,0,76.81-2.26l24.12-24.12A56.08,56.08,0,0,0,207.62,48.38Z"></path></svg>`,
  //   content: {
  //     attributes: { id: COMPONENT.INVESTOR_CONTACTS },
  //     editable: false,
  //     selectable: false,
  //     copyable: false,
  //     content: `<div class="container">
  //     <div class="row">
  //       <div class="col-4">
  //         <div class="position-relative">
  //           <div class="rd-heading rd-heading-lg-normal">Investor Contacts</div>
  //           <span class="rd-indicator rd-indicator-lg">
  //             <span class="rd-indicator-content rd-indicator-primary"></span>
  //           </span>
  //         </div>
  //       </div>
  //       <div class="col-8">
  //         <div class="row">
  //           <div class="col-3">
  //             <div class="w-100 h-100 rd-bg__grey-very-light p-2 d-flex align-items-end ">Link 1</div>
  //           </div>
  //           <div class="col-3">
  //             <div class="w-100 h-100 rd-bg__grey-very-light p-2 d-flex align-items-end ">Link 1</div>
  //           </div>
  //           <div class="col-3">
  //             <div class="w-100 h-100 rd-bg__grey-very-light p-2 d-flex align-items-end ">Link 1</div>
  //           </div>
  //           <div class="col-3">
  //             <div class="w-100 h-100 rd-bg__grey-very-light p-2 d-flex align-items-end ">Link 1</div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>`,
  //   },
  // },
  {
    id: 'infonographic',
    label: 'Info No Grap',
    category: 'Placeholders',
    media:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path></svg>',
    content: {
      attributes: { class: 'infographic', id: COMPONENT.INFO_NO_GRAPH },
      components: [
        {
          tagName: 'div',
          attributes: { class: 'component-placeholder' },
          components: [
            {
              tagName: 'div',
              attributes: { class: 'placeholder-title' },
              content: 'Interesting fact No graph',
            },
            {
              tagName: 'div',
              attributes: { class: 'placeholder-note' },
              content:
                '*Note: This section will be replaced with the actual office list',
            },
          ],
        },
        {
          content: `<div class="row py-2 component-placeholder">
            <div class="col-md-4 ">
              <div class="office-card card-placeholder"></div>
            </div>
            <div class="col-md-4">
              <div class="office-card card-placeholder"></div>
            </div>
            <div class="col-md-4">
              <div class="office-card card-placeholder"></div>
            </div>
            
          </div>
          `,
        },
      ],
    },
  },
  {
    id: 'interestingfactscard',
    label: 'Graph Card',
    category: 'Placeholders',
    media:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path></svg>',
    content: {
      attributes: {
        class: 'interestingfactscard',
        id: COMPONENT.INTERESTING_FACTS_CARD,
      },
      components: [
        {
          tagName: 'div',
          attributes: { class: 'component-placeholder' },
          components: [
            {
              tagName: 'div',
              attributes: { class: 'placeholder-title' },
              content: 'Interesting Fact with Graph',
            },
            {
              tagName: 'div',
              attributes: { class: 'placeholder-note' },
              content:
                '*Note: This section will be replaced with the actual office list',
            },
          ],
        },
        {
          content: `<div class="row py-2 component-placeholder">
            <div class="col-md-3 ">
              <div class="office-card card-placeholder"></div>
            </div>
            <div class="col-md-3">
              <div class="office-card card-placeholder"></div>
            </div>
            <div class="col-md-3">
              <div class="office-card card-placeholder"></div>
            </div>
            <div class="col-md-3">
              <div class="office-card card-placeholder"></div>
            </div>
          </div>
          `,
        },
      ],
    },
  },

  {
    id: 'content-carousel',
    label: 'Content carousel',
    media: List,
    category: 'Placeholders',
    content: {
      attributes: { class: 'content-carousel', id: COMPONENT.CONTENT_CAROUSEL },
      components: [
        {
          tagName: 'div',
          attributes: { class: 'component-placeholder' },
          components: [
            {
              tagName: 'div',
              attributes: { class: 'placeholder-title' },
              content: 'content carousel',
            },
            {
              tagName: 'div',
              attributes: { class: 'placeholder-note' },
              content:
                '*Note: This section will be replaced with the actual content carousel',
            },
          ],
        },
        {
          content: `<div class="container ">
            <div class="row py-2">
              <div class="col-md-5 component-placeholder  ">
                  <div class="content-card  card-placeholder"></div>
              </div>
              <div class="col-md-7 component-placeholder">
              <div class="content-card  card-placeholder">
                Content awesome
              </div>
            </div>
           
          </div>
          `,
        },
      ],
    },
  },

  {
    id: 'home-banner',
    label: 'Banner carousel',
    category: 'Placeholders',
    media:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M192,48H64A16,16,0,0,0,48,64V192a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64A16,16,0,0,0,192,48Zm0,144H64V64H192V192ZM240,56V200a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0ZM32,56V200a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0Z"></path></svg>',
    content: {
      attributes: { class: 'home-banner', id: COMPONENT.HOME_BANNER },
      components: [
        {
          tagName: 'div',
          attributes: { class: 'component-placeholder' },
          components: [
            {
              tagName: 'div',
              attributes: { class: 'placeholder-title' },
              content: 'Banner Carousel',
            },
            {
              tagName: 'div',
              attributes: { class: 'placeholder-note' },
              content:
                '*Note: This section will be replaced with the actual Banner Carousel',
            },
          ],
        },
        {
          content: `
           
            <div class="row py-2 component-placeholder">
            <div class="col-md-12 ">
              <div class="office-card card-placeholder"></div>
            </div></div>
          `,
        },
      ],
    },
  },
  // {
  //   id: 'featured-properties',
  //   label: 'Featured Properties',
  //   category: 'Placeholders',
  //   media:
  //     '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M240,208H224V115.55a16,16,0,0,0-5.17-11.78l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM48,115.55l.11-.1L128,40l79.9,75.43.11.1V208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48ZM144,208H112V160h32Z"></path></svg>',
  //   content: {
  //     attributes: {
  //       class: 'container featured-properties',
  //       id: COMPONENT.FEATURED_PROPERTIES,
  //     },
  //     components: [
  //       {
  //         tagName: 'div',
  //         attributes: { class: 'component-placeholder' },
  //         components: [
  //           {
  //             tagName: 'div',
  //             attributes: { class: 'placeholder-title' },
  //             content: 'Featured Properties',
  //           },
  //           {
  //             tagName: 'div',
  //             attributes: { class: 'placeholder-note' },
  //             content:
  //               '*Note: This section will be replaced with the actual office list',
  //           },
  //         ],
  //       },
  //       {
  //         content: `<div class="row py-2 component-placeholder">
  //           <div class="col-md-4 ">
  //             <div class="office-card card-placeholder"></div>
  //           </div>
  //           <div class="col-md-4">
  //             <div class="office-card card-placeholder"></div>
  //           </div>
  //           <div class="col-md-4">
  //             <div class="office-card card-placeholder"></div>
  //           </div>
  //          =
  //         </div>
  //         `,
  //       },
  //     ],
  //   },
  // },
  {
    id: 'tabs',
    label: 'tabs',
    category: 'Placeholders',
    media:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M255.66,165.7h0v0a.24.24,0,0,0,0-.08L233.37,91.4A15.89,15.89,0,0,0,218.05,80H208a8,8,0,0,0,0,16h10.05l19.2,64H206L185.37,91.4A15.89,15.89,0,0,0,170.05,80H160a8,8,0,0,0,0,16h10.05l19.2,64H158L137.37,91.4A15.89,15.89,0,0,0,122.05,80H38A15.89,15.89,0,0,0,22.63,91.4L.37,165.6l0,.05v0s0,.05,0,.08A8.1,8.1,0,0,0,0,168a8,8,0,0,0,8,8H248a8,8,0,0,0,7.66-10.3ZM38,96h84.1l19.2,64H18.75Z"></path></svg>',
    content: {
      attributes: { class: 'tabs', id: COMPONENT.TABS },
      components: [
        {
          tagName: 'div',
          attributes: { class: 'component-placeholder' },
          components: [
            {
              tagName: 'div',
              attributes: { class: 'placeholder-title' },
              content: 'Related news articles',
            },
            {
              tagName: 'div',
              attributes: { class: 'placeholder-note' },
              content:
                '*Note: This section will be replaced with the Related news articles',
            },
          ],
        },
        {
          content: `<div class="container py-2">
            <div class="component-placeholder">
              <div class="tabs card-placeholder"></div>
            </div>
            </div>
          `,
        },
      ],
    },
  },
  {
    id: 'job-vacancies',
    label: 'Job list',
    category: 'Placeholders',
    media: List,
    content: {
      attributes: { class: 'job-list', id: COMPONENT.JOB_VACANCIES },
      components: [
        {
          tagName: 'div',
          attributes: { class: 'component-placeholder' },
          components: [
            {
              tagName: 'div',
              attributes: { class: 'placeholder-title' },
              content: 'Available jobs',
            },
            {
              tagName: 'div',
              attributes: { class: 'placeholder-note' },
              content:
                '*Note: This section will be replaced with the actual vacancy list',
            },
          ],
        },
        {
          content: `<div class="row py-2">
            <div class="col-md-3">
              <div class="office-card card-placeholder"></div>
            </div>
            <div class="col-md-3">
              <div class="office-card card-placeholder"></div>
            </div>
            <div class="col-md-3">
              <div class="office-card card-placeholder"></div>
            </div>
            <div class="col-md-3">
              <div class="office-card card-placeholder"></div>
            </div>
          </div>
          `,
        },
      ],
    },
  },
  {
    id: 'rd-bradcrumbs',
    label: 'Breadcrumbs',
    media: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="eQn6N1C3Oil1" viewBox="0 0 256 100" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M75.279526,70.225l-11.42728-20c-.795034-1.390165-2.132839-2.22504-3.565333-2.225h-42.143792c-.79684.00001-1.527873.515818-1.897885,1.339125s-.317894,1.81814.13531,2.58275L28.857872,73L16.380546,94.078125c-.453204.76461-.505322,1.759442-.13531,2.58275s1.101045,1.339115,1.897885,1.339125h42.143792c1.432494.00004,2.770299-.834835,3.565333-2.225l11.42728-20c.960898-1.680185.960898-3.869815,0-5.55ZM60.278877,93h-38.050756L32.407132,75.8125l.02143-.03125c.960898-1.680185.960898-3.869815,0-5.55L32.407132,70.2L22.228121,53.0125h38.058792L71.716872,73L60.278877,93Z" transform="translate(8.785484-23)"/><path d="M75.279526,70.225l-11.42728-20c-.795034-1.390165-2.132839-2.22504-3.565333-2.225h-42.143792c-.79684.00001-1.527873.515818-1.897885,1.339125s-.317894,1.81814.13531,2.58275L28.857872,73L16.380546,94.078125c-.453204.76461-.505322,1.759442-.13531,2.58275s1.101045,1.339115,1.897885,1.339125h42.143792c1.432494.00004,2.770299-.834835,3.565333-2.225l11.42728-20c.960898-1.680185.960898-3.869815,0-5.55ZM60.278877,93h-38.050756L32.407132,75.8125l.02143-.03125c.960898-1.680185.960898-3.869815,0-5.55L32.407132,70.2L22.228121,53.0125h38.058792L71.716872,73L60.278877,93Z" transform="translate(81.999796-23)"/><path d="M75.279526,70.225l-11.42728-20c-.795034-1.390165-2.132839-2.22504-3.565333-2.225h-42.143792c-.79684.00001-1.527873.515818-1.897885,1.339125s-.317894,1.81814.13531,2.58275L28.857872,73L16.380546,94.078125c-.453204.76461-.505322,1.759442-.13531,2.58275s1.101045,1.339115,1.897885,1.339125h42.143792c1.432494.00004,2.770299-.834835,3.565333-2.225l11.42728-20c.960898-1.680185.960898-3.869815,0-5.55ZM60.278877,93h-38.050756L32.407132,75.8125l.02143-.03125c.960898-1.680185.960898-3.869815,0-5.55L32.407132,70.2L22.228121,53.0125h38.058792L71.716872,73L60.278877,93Z" transform="translate(154.165771-23)"/></svg>
`,
    category: 'Placeholders',
    content: {
      attributes: {
        id: COMPONENT.BREADCRUMBS,
        class: 'container d-flex align-items-center',
      },
      components: {
        attributes: {
          class: 'w-100',
        },
        content: `
        <div class="d-flex align-items-center gap-2 ">
          <span>Home</span>
          <span>/</span>
          <span class="pt-2">***</span>
          <span>/</span>
          <span class="pt-2">***</span>
        </div>
      `,
      },
    },
  },
  {
    id: 'icon-block-1',
    label: 'Custom Icon Image',
    media:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b78847" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path></svg>',
    category: 'Basics',
    activate: true,
    content: {
      tagName: 'img',
      type: 'image',
      attributes: { class: 'sm-card-icon1' },
    },
  },
  // {
  //   id: 'home-images-feature',
  //   label: 'Flex images',
  //   media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z"></path></svg>',
  //   category: 'Banners',
  //   content: {
  //     tagName: 'div',
  //     attributes: { class: 'container' },
  //     components: {
  //       tagName: 'div',
  //       attributes: { class: 'row' },
  //       components: [
  //         {
  //           tagName: 'div',
  //           copyable: false,
  //           editable: false,
  //           draggable: false,
  //           attributes: { class: 'col-md-3' },
  //           components: [
  //             {
  //               tagName: 'p',
  //               type: 'text',
  //               draggable: false,
  //               attributes: { class: 'home-feature-description' },
  //               content: 'Learn more about our property offerings',
  //             },
  //           ],
  //         },
  //         {
  //           tagName: 'div',
  //           copyable: false,
  //           editable: false,
  //           draggable: false,
  //           attributes: { class: 'col-md-3 home-image' },
  //           components: [
  //             {
  //               tagName: 'img',
  //               type: 'image',
  //               draggable: false,
  //               attributes: { class: 'home-feature-icon' },
  //             },
  //           ],
  //         },
  //         {
  //           tagName: 'div',
  //           copyable: false,
  //           editable: false,
  //           draggable: false,
  //           attributes: { class: 'col-md-3' },
  //         },
  //         {
  //           tagName: 'div',
  //           copyable: false,
  //           editable: false,
  //           draggable: false,
  //           attributes: { class: 'col-md-3' },
  //         },
  //       ],
  //     },
  //   },
  // },
  {
    id: 'rd-video',
    label: 'Video',
    category: 'Basics',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#60f594" viewBox="0 0 256 256"><path d="M163.33,123l-48-32A6,6,0,0,0,106,96v64a6,6,0,0,0,9.33,5l48-32a6,6,0,0,0,0-10ZM118,148.79V107.21L149.18,128ZM232.4,70a22,22,0,0,0-13.28-15C185,41.79,130.27,42,128,42s-57-.21-91.16,13A22,22,0,0,0,23.6,70C21.05,79.89,18,98,18,128s3.05,48.11,5.6,58a22,22,0,0,0,13.28,15C71,214.21,125.72,214,128,214h.71c6.91,0,58-.44,90.45-13a22,22,0,0,0,13.28-15c2.55-9.87,5.6-27.93,5.6-58S235,79.89,232.4,70ZM220.78,183a10,10,0,0,1-6,6.86C182.78,202.19,128.58,202,128,202s-54.71.2-86.75-12.17a10,10,0,0,1-6-6.86C32.84,173.78,30,156.78,30,128s2.84-45.78,5.22-55a10,10,0,0,1,6-6.86C72.06,54.26,123.53,54,127.76,54H128c.54,0,54.71-.2,86.75,12.17a10,10,0,0,1,6,6.86c2.38,9.19,5.22,26.19,5.22,55S223.16,173.78,220.78,183Z"></path></svg>`,
    content: {
      type: 'video',
      src: 'https://www.youtube.com/embed/gGx5KRirets?si=VCToWlDhGZMdAD5J',
      attributes: { class: 'video-wrapper' },
      traits: [
        {
          type: 'text',
          label: 'Title',
          name: 'title',
          placeholder: 'Enter video title'
        }
      ]
    },
  },
  //
  {
    id: 'rd-list',
    label: 'List',
    media:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z"></path></svg>',
    category: 'Basics',
    content: {
      tagName: 'ul',
      type: 'text',
      editable: true,
      attributes: {},
      components: [
        {
          tagName: 'li',
          type: 'text',
          attributes: {},

          editable: true,
          draggable: false,
          droppable: false,
          content: '',
        },
      ],
    },
  },
  {
    id: 'rd-card-image-text',
    label: 'image with text',
    media:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M110.66,147.56a8,8,0,0,0-13.32,0L76.49,178.85l-9.76-15.18a8,8,0,0,0-13.46,0l-36,56A8,8,0,0,0,24,232H152a8,8,0,0,0,6.66-12.44ZM38.65,216,60,182.79l9.63,15a8,8,0,0,0,13.39.11l21-31.47L137.05,216Zm175-133.66-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40v96a8,8,0,0,0,16,0V40h88V88a8,8,0,0,0,8,8h48V216h-8a8,8,0,0,0,0,16h8a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160Z"></path></svg>',
    category: 'Basics',
    content: {
      tagName: 'div',
      attributes: { class: 'container' },
      components: [
        {
          tagName: 'img',
          type: 'image',
          attributes: { class: '' },
        },
      ],
    },
  },
  {
    label: 'home page Card 2',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24.00 24.00" fill="none" stroke="currentColor" stroke-width="0.00024000000000000003">
    <g id="SVGRepo_bgCarrier" stroke-width="0"/>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
    <g id="SVGRepo_iconCarrier"> <path d="M3.75 3C4.16421 3 4.5 3.33579 4.5 3.75V20.25C4.5 20.6642 4.16421 21 3.75 21C3.33579 21 3 20.6642 3 20.25V3.75C3 3.33579 3.33579 3 3.75 3Z" fill="#212121"/> <path d="M20.25 3C20.6642 3 21 3.33579 21 3.75V20.25C21 20.6642 20.6642 21 20.25 21C19.8358 21 19.5 20.6642 19.5 20.25V3.75C19.5 3.33579 19.8358 3 20.25 3Z" fill="#212121"/> <path d="M9.5 5C8.67157 5 8 5.67157 8 6.5V17.5C8 18.3284 8.67157 19 9.5 19H14.5C15.3284 19 16 18.3284 16 17.5V6.5C16 5.67157 15.3284 5 14.5 5H9.5Z" fill="#212121"/> </g>
    </svg>`,
    category: 'Basics',
    content: {
      tagName: 'div',
      attributes: { class: 'container no-pd ', id: 'enquiry-card-1' },
      components: [
        {
          tagName: 'div',
          attributes: {
            class: 'cards home-card col-md-12 col-sm-12 ',
            id: 'enquiry-card-1',
          },
          components: [
            {
              tagName: 'img',
              type: 'image',
              draggable: false,
              attributes: { class: 'home-card-image2 ' },
            },
            {
              tagName: 'div',
              draggable: false,
              attributes: { class: 'home-card-body rd-text-white' },
              components: [
                {
                  attributes: {
                    class: 'position-relative home-page-text-color mb-4',
                  },
                  components: [
                    {
                      tagName: 'div',
                      type: 'text',
                      attributes: {
                        class: 'rd-heading rd-heading-md rd-text-white',
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
                  type: 'Link',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    label: 'home page Card',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24.00 24.00" fill="none" stroke="currentColor" stroke-width="0.00024000000000000003">
    <g id="SVGRepo_bgCarrier" stroke-width="0"/>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
    <g id="SVGRepo_iconCarrier"> <path d="M3.75 3C4.16421 3 4.5 3.33579 4.5 3.75V20.25C4.5 20.6642 4.16421 21 3.75 21C3.33579 21 3 20.6642 3 20.25V3.75C3 3.33579 3.33579 3 3.75 3Z" fill="#212121"/> <path d="M20.25 3C20.6642 3 21 3.33579 21 3.75V20.25C21 20.6642 20.6642 21 20.25 21C19.8358 21 19.5 20.6642 19.5 20.25V3.75C19.5 3.33579 19.8358 3 20.25 3Z" fill="#212121"/> <path d="M9.5 5C8.67157 5 8 5.67157 8 6.5V17.5C8 18.3284 8.67157 19 9.5 19H14.5C15.3284 19 16 18.3284 16 17.5V6.5C16 5.67157 15.3284 5 14.5 5H9.5Z" fill="#212121"/> </g>
    </svg>`,
    category: 'Basics',
    content: {
      tagName: 'div',
      attributes: { class: 'container no-pd ', id: 'enquiry-card-1' },
      components: [
        {
          tagName: 'div',
          attributes: {
            class: 'cards home-card col-md-12 col-sm-12 ',
            id: 'enquiry-card-1',
          },
          components: [
            {
              tagName: 'img',
              type: 'image',
              draggable: false,
              attributes: { class: 'home-card-image ' },
            },
            {
              tagName: 'div',
              draggable: false,
              attributes: { class: 'home-card-body' },
              components: [
                {
                  tagName: 'div',
                  type: 'text',
                  draggable: false,
                  attributes: {
                    class:
                      'mb-3 heading-secondary indicator home-page-text-color ',
                  },
                  content: 'This is a sample sub heading ',
                },

                {
                  type: 'Link',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  //
  {
    id: 'rd-list',
    label: 'List',
    media:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z"></path></svg>',
    category: 'Basics',
    content: {
      tagName: 'ul',
      type: 'text',
      editable: true,
      attributes: {},
      components: [
        {
          tagName: 'li',
          type: 'text',
          attributes: {},

          editable: true,
          draggable: false,
          droppable: false,
          content: '',
        },
      ],
    },
  },
  {
    id: 'rd-card-image-text',
    label: 'image with text',
    media: '<i class="bg-text"></i>',
    category: 'Basics',
    content: {
      tagName: 'div',
      attributes: { class: 'container' },
      components: [
        {
          tagName: 'img',
          type: 'image',
          attributes: { class: '' },
        },
      ],
    },
  },
  // {
  //   label: 'home page Card',
  //   media: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24.00 24.00" fill="none" stroke="currentColor" stroke-width="0.00024000000000000003">
  //   <g id="SVGRepo_bgCarrier" stroke-width="0"/>
  //   <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
  //   <g id="SVGRepo_iconCarrier"> <path d="M3.75 3C4.16421 3 4.5 3.33579 4.5 3.75V20.25C4.5 20.6642 4.16421 21 3.75 21C3.33579 21 3 20.6642 3 20.25V3.75C3 3.33579 3.33579 3 3.75 3Z" fill="#212121"/> <path d="M20.25 3C20.6642 3 21 3.33579 21 3.75V20.25C21 20.6642 20.6642 21 20.25 21C19.8358 21 19.5 20.6642 19.5 20.25V3.75C19.5 3.33579 19.8358 3 20.25 3Z" fill="#212121"/> <path d="M9.5 5C8.67157 5 8 5.67157 8 6.5V17.5C8 18.3284 8.67157 19 9.5 19H14.5C15.3284 19 16 18.3284 16 17.5V6.5C16 5.67157 15.3284 5 14.5 5H9.5Z" fill="#212121"/> </g>
  //   </svg>`,

  //   content: {
  //     tagName: 'div',
  //     attributes: { class: 'container no-pd ', id: 'enquiry-card-1' },
  //     components:[{
  //     tagName: 'div',
  //     attributes: { class: 'cards home-card col-md-12 col-sm-12 ', id: 'enquiry-card-1' },
  //     components:
  //     [
  //       {
  //         tagName: 'img',
  //         type: 'image',
  //         draggable: false,
  //         attributes: { class: 'home-card-image ' },
  //       },
  //       {
  //         tagName: 'div',
  //         draggable: false,
  //         attributes: { class: 'home-card-body' },
  //         components: [
  //           {
  //             tagName: 'div',
  //             attributes: { class: 'heading' },
  //             components: [

  //               {
  //                 tagName: 'div',
  //                 type: 'text',
  //                 draggable: false,
  //                 attributes: { class: ' heading-secondary  home-page-text-color' },
  //                 content: 'This is a sample sub heading ',
  //               },
  //               {
  //                 tagName: 'div',
  //                 draggable: false,
  //                 attributes: { class: 'mb-3 .rd-indicator-content rd-indicator-secondary' },
  //                 content: ' ',
  //               },

  //               {
  //                 type: 'Link',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   },

  // ],
  //   },
  // },
  {
    id: 'rd-inline-block',
    label: 'Inline',
    category: 'Layout',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24.00 24.00" fill="none" stroke="currentColor" stroke-width="0.00024000000000000003">
    <g id="SVGRepo_bgCarrier" stroke-width="0"/>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="3.9839999999999995"/>
    <g id="SVGRepo_iconCarrier"> <path d="M6 17V7H8V17H6Z" fill="currentColor"/> <path d="M16 7V17H18V7H16Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3H22V21H2V3ZM4 5V19H20V5H4Z" fill="currentColor"/> </g>
    </svg>`,
    content: {
      tagName: 'div',
      attributes: {
        class:
          'd-inline-flex align-items-center flex-wrap gap-2 min-height-30 min-width-100',
      },
    },
  },
  {
    id: 'rd-block',
    label: 'Block',
    category: 'Layout',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24.00 24.00" fill="none" stroke="currentColor" stroke-width="0.00024000000000000003">
    <g id="SVGRepo_bgCarrier" stroke-width="0"/>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="3.9839999999999995"/>
    <g id="SVGRepo_iconCarrier"> <path d="M6 17V7H8V17H6Z" fill="currentColor"/> <path d="M16 7V17H18V7H16Z" fill="currentColor"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3H22V21H2V3ZM4 5V19H20V5H4Z" fill="currentColor"/> </g>
    </svg>`,
    content: {
      tagName: 'div',
      attributes: {
        class: 'd-flex flex-column min-height-30 min-width-100 py-1',
      },
    },
  },
  {
    id: 'rd-center-aligned-section',
    label: 'Center aligned',
    category: 'Layout',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b78847" viewBox="0 0 256 256"><path d="M224,120H208V72a16,16,0,0,0-16-16H152a16,16,0,0,0-16,16v48H120V48a16,16,0,0,0-16-16H64A16,16,0,0,0,48,48v72H32a8,8,0,0,0,0,16H48v72a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V136h16v48a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V136h16a8,8,0,0,0,0-16ZM104,208H64V48h40Zm88-24H152V72h40Z"></path></svg>`,
    content: {
      attributes: {
        class: 'rd-container__center-aligned',
      },
    },
  },
  {
    id: 'rd-left-aligned-section',
    label: 'Left aligned',
    category: 'Layout',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b78847" viewBox="0 0 256 256"><path d="M48,40V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0Zm16,64V64A16,16,0,0,1,80,48h96a16,16,0,0,1,16,16v40a16,16,0,0,1-16,16H80A16,16,0,0,1,64,104Zm16,0h96V64H80Zm152,48v40a16,16,0,0,1-16,16H80a16,16,0,0,1-16-16V152a16,16,0,0,1,16-16H216A16,16,0,0,1,232,152Zm-16,40V152H80v40H216Z"></path></svg>`,
    content: {
      attributes: {
        class: 'rd-container__left-aligned',
      },
    },
  },
  {
    id: 'rd-right-aligned-section',
    label: 'Right aligned',
    category: 'Layout',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b78847" viewBox="0 0 256 256"><path d="M224,40V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0ZM192,64v40a16,16,0,0,1-16,16H80a16,16,0,0,1-16-16V64A16,16,0,0,1,80,48h96A16,16,0,0,1,192,64Zm-16,0H80v40h96Zm16,88v40a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V152a16,16,0,0,1,16-16H176A16,16,0,0,1,192,152Zm-16,0H40v40H176Z"></path></svg>`,
    content: {
      attributes: {
        class: 'rd-container__right-aligned',
      },
    },
  },
  {
    id: 'rd-space-between-section',
    label: 'Space between',
    category: 'Layout',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b78847" viewBox="0 0 256 256"><path d="M224,40V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0ZM192,64v40a16,16,0,0,1-16,16H80a16,16,0,0,1-16-16V64A16,16,0,0,1,80,48h96A16,16,0,0,1,192,64Zm-16,0H80v40h96Zm16,88v40a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V152a16,16,0,0,1,16-16H176A16,16,0,0,1,192,152Zm-16,0H40v40H176Z"></path></svg>`,
    content: {
      attributes: {
        class: 'rd-container__space-between',
      },
    },
  },
  {
    id: 'rd-image-block',
    label: '480x480',
    category: 'Basics',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path></svg>`,
    content: {
      type: 'image',
      style: {
        width: '480px',
        height: '480px',
        'object-fit': 'contain',
      },
    },
  },
  {
    id: 'rd-100image-block',
    label: '100x100',
    category: 'Basics',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path></svg>`,
    content: {
      type: 'image',
      style: {
        width: '100px',
        height: '100px',
        'object-fit': 'contain',
      },
    },
  },
  {
    id: 'rd-60image-block',
    label: '60x60',
    category: 'Basics',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path></svg>`,
    content: {
      type: 'image',
      style: {
        width: '60px',
        height: '60px',
        'object-fit': 'contain',
      },
    },
  },
  {
    id: 'rd-40image-block',
    label: '40x40',
    category: 'Basics',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path></svg>`,
    content: {
      type: 'image',
      style: {
        width: '40px',
        height: '40px',
        'object-fit': 'contain',
      },
    },
  },
  {
    id: 'rd-scroll-to-top',
    label: 'Scroll To Top',
    category: 'Basics',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z"></path></svg>`,
    content: {
      tagname: 'a',
      attributes: { id: 'scrollToTopBtn' },
    },
  },
  {
    label: 'Image Content',
    media:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256"><path d="M208,32H80A16,16,0,0,0,64,48V64H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V192h16a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM80,48H208v69.38l-16.7-16.7a16,16,0,0,0-22.62,0L93.37,176H80Zm96,160H48V80H64v96a16,16,0,0,0,16,16h96Zm32-32H116l64-64,28,28v36Zm-88-64A24,24,0,1,0,96,88,24,24,0,0,0,120,112Zm0-32a8,8,0,1,1-8,8A8,8,0,0,1,120,80Z"></path></svg>',
    category: 'Basics',
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
            components: {
              type: 'image',
              style: {
                width: '480px',
                height: '480px',
                'object-fit': 'contain',
              },
            },
          },
          {
            tagName: 'div',
            copyable: false,
            editable: false,
            draggable: false,
            attributes: { class: 'col-md-7 vertical-center' },
            components: [
              {
                tagName: 'div',
                attributes: { class: 'heading' },
                components: [
                  {
                    tagName: 'div',
                    type: 'text',
                    draggable: false,
                    attributes: { class: 'heading-primary indicator' },
                    content: 'This is a sample heading',
                  },
                  {
                    tagName: 'div',
                    type: 'text',
                    attributes: { class: 'mt-2 mb-5 pt-2' },
                    content: 'This is a sample text',
                  },
                  {
                    type: 'Link',
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
    id: 'rd-image-content-block',
    label: 'Content 1',
    category: 'Content',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24.00 24.00" fill="none" stroke="currentColor" stroke-width="0.00024000000000000003">
    <g id="SVGRepo_bgCarrier" stroke-width="0"/>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
    <g id="SVGRepo_iconCarrier"> <path d="M3.75 3C4.16421 3 4.5 3.33579 4.5 3.75V20.25C4.5 20.6642 4.16421 21 3.75 21C3.33579 21 3 20.6642 3 20.25V3.75C3 3.33579 3.33579 3 3.75 3Z" fill="#212121"/> <path d="M20.25 3C20.6642 3 21 3.33579 21 3.75V20.25C21 20.6642 20.6642 21 20.25 21C19.8358 21 19.5 20.6642 19.5 20.25V3.75C19.5 3.33579 19.8358 3 20.25 3Z" fill="#212121"/> <path d="M9.5 5C8.67157 5 8 5.67157 8 6.5V17.5C8 18.3284 8.67157 19 9.5 19H14.5C15.3284 19 16 18.3284 16 17.5V6.5C16 5.67157 15.3284 5 14.5 5H9.5Z" fill="#212121"/> </g>
    </svg>`,
    content: {
      attributes: { class: 'rd-content-block__right row' },
      components: [
        {
          attributes: {
            class: 'rd-content-block__image col-md-5 ',
          },
          components: {
            type: 'image',
          },
        },
        {
          attributes: { class: 'col-md-7 rd-content-block__body ps-md-5' },
          components: [
            {
              attributes: { class: 'position-relative' },
              components: [
                {
                  tagName: 'h1',
                  attributes: {
                    class: 'rd-heading rd-heading-lg-normal',
                  },
                  type: 'text',
                  content: 'Heading here',
                },
                {
                  content: `<span class="rd-indicator rd-indicator-lg">
                  <span class="rd-indicator-content rd-indicator-primary"></span>
                  </span>`,
                },
              ],
            },
            {
              type: 'text',
              attributes: { class: 'rd-text-grey-mid' },
              content:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            },
            {
              type: 'Link',
              attributes: { class: 'rd-btn rd-btn-dark rd-btn-xl' },
            },
          ],
        },
      ],
    },
  },
  {
    id: 'rd-content-image-block',
    label: 'Content 2',
    category: 'Content',
    media: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24.00 24.00" fill="none" stroke="currentColor" stroke-width="0.00024000000000000003">
    <g id="SVGRepo_bgCarrier" stroke-width="0"/>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
    <g id="SVGRepo_iconCarrier"> <path d="M3.75 3C4.16421 3 4.5 3.33579 4.5 3.75V20.25C4.5 20.6642 4.16421 21 3.75 21C3.33579 21 3 20.6642 3 20.25V3.75C3 3.33579 3.33579 3 3.75 3Z" fill="#212121"/> <path d="M20.25 3C20.6642 3 21 3.33579 21 3.75V20.25C21 20.6642 20.6642 21 20.25 21C19.8358 21 19.5 20.6642 19.5 20.25V3.75C19.5 3.33579 19.8358 3 20.25 3Z" fill="#212121"/> <path d="M9.5 5C8.67157 5 8 5.67157 8 6.5V17.5C8 18.3284 8.67157 19 9.5 19H14.5C15.3284 19 16 18.3284 16 17.5V6.5C16 5.67157 15.3284 5 14.5 5H9.5Z" fill="#212121"/> </g>
    </svg>`,
    content: {
      attributes: { class: 'rd-content-block__left row' },
      components: [
        {
          attributes: {
            class: 'col-md-7 pe-md-5 rd-content-block__body order-2 order-sm-1',
          },
          components: [
            {
              attributes: { class: 'position-relative' },
              components: [
                {
                  tagName: 'h1',
                  attributes: {
                    class: 'rd-heading rd-heading-lg-normal',
                  },
                  type: 'text',
                  content: 'Heading here',
                },
                {
                  content: `<span class="rd-indicator rd-indicator-lg">
                  <span class="rd-indicator-content rd-indicator-primary"></span>
                  </span>`,
                },
              ],
            },
            {
              type: 'text',
              attributes: { class: 'rd-text-grey-mid' },
              content:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            },
            {
              type: 'Link',
              attributes: { class: 'rd-btn rd-btn-dark rd-btn-xl' },
            },
          ],
        },
        {
          attributes: {
            class: 'rd-content-block__image col-md-5 order-1 order-sm-2',
          },
          components: {
            type: 'image',
          },
        },
      ],
    },
  },
];

export const rdBlocks: Plugin = (editor: Editor, config: any ) => {
  
  editor.TraitManager.addType('a', {
    createInput({ trait }: any) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = trait.get();
      input.addEventListener('change', () => trait.set(input.value));
      return input;
    },
  });
  if(environment.PAGE_BUILDER_ANCHOR){
    editor.TraitManager.addType('anchor', {
      createInput({ trait }: any) {
        const input = document.createElement('input');
        input.type = 'text';
        if(trait.attributes.value!=''){
          input.value = trait.attributes.value;
        }else{
          input.value = "";
        }
        input.addEventListener('change', () => trait.set(input.value));
        return input;
      },
      onEvent({ elInput, component, event }: any) {
        let value = "";
        const attr = component.getAttributes();
        if((attr.href!=undefined || attr.href!="") && attr.downloadanalytics){
          let pageTitle = config.pageDetails.label;
          value = pageTitle+" ANALOAD "+ attr.href;
          component.addAttributes({downloadanalytics : value});
        }
        
      },
    });

    editor.TraitManager.addType('download', {
      createInput({ trait }: any) {
            let checked = "";
            if(trait.attributes.value!=''){
              checked = "checked";
            }
            const el = document.createElement('div');
            el.innerHTML = `<div class="gjs-field-wrp gjs-field-wrp--checkbox" data-input="">
                <label class="gjs-field gjs-field-checkbox" data-input="">
                <input type="checkbox" ${checked} placeholder="" class="href-next__type">
                  <i class="gjs-chk-icon"></i>
                </label>
              </div>
              <div class="href-next__url-inputs d-none">
              <input class="href-next__url" value="false" placeholder="Insert Filename"/></div>
              `;
              const inputsUrl: any = el.querySelector('.href-next__url-inputs');
              const inputType: any = el.querySelector('.href-next__type');
              const inputUrlValue: any = el.querySelector('.href-next__url');
              inputType.addEventListener('change', (ev: any) => {
                if(inputType.checked==true){
                  inputUrlValue.value = true;
                }
                if(inputType.checked==false){
                  inputUrlValue.value = false;
                }
              });
              return el;
      },
      onEvent({ elInput, component, event }: any) {
        let value = "";
        let check: any = elInput.querySelector('.href-next__url').value;
        const attr = component.getAttributes();

        if(attr.href!=undefined && check=="true"){
          let pageTitle = config.pageDetails.label;
          value = pageTitle+" ANALOAD "+ attr.href;
          component.addAttributes({downloadanalytics : value});
        }else{
          delete attr.downloadanalytics;
          component.setAttributes(attr);
        }

      },
      onUpdate({ elInput, component }: any) {

      }
    });
  }
  blocks.forEach((block: BlockProperties, index: number) => {
    editor.BlockManager.add(block.id || `custom-block-${index + 1}`, block);
  });

};
