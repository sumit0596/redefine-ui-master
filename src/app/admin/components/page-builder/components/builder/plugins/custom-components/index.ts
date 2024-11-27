import { Editor, PluginOptions } from 'grapesjs';
import loadCommands from './commands';
import loadBlocks from './blocks';
import loadTraits from './traits';
import loadComponents from './components';

export const customComponent = (editor: Editor, opts: any = {}) => {
  const config: PluginOptions = {
    componentTypes: [
      {
        label: 'Icon',
        type: 'Icon',
        name: 'rdIcon',
        media: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
        category: 'Basics',
      },
      {
        label: 'Popup',
        type: 'Popup',
        name: 'rdPopup',
        media: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M0 1v14h16V1zm15 13H1V4h14zm0-11h-1V2h1z"/></svg>`,
        category: 'Basics',
      },
      {
        label: 'Contact Card',
        type: 'ContactCard',
        name: 'rdContactCard',
        media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#60f594" viewBox="0 0 256 256"><path d="M198,112a6,6,0,0,1-6,6H152a6,6,0,0,1,0-12h40A6,6,0,0,1,198,112Zm-6,26H152a6,6,0,0,0,0,12h40a6,6,0,0,0,0-12Zm38-82V200a14,14,0,0,1-14,14H40a14,14,0,0,1-14-14V56A14,14,0,0,1,40,42H216A14,14,0,0,1,230,56Zm-12,0a2,2,0,0,0-2-2H40a2,2,0,0,0-2,2V200a2,2,0,0,0,2,2H216a2,2,0,0,0,2-2ZM133.81,166.51a6,6,0,0,1-11.62,3C119.34,158.38,108.08,150,96,150s-23.33,8.38-26.19,19.5a6,6,0,0,1-11.62-3A38,38,0,0,1,76.78,143a30,30,0,1,1,38.45,0A38,38,0,0,1,133.81,166.51ZM96,138a18,18,0,1,0-18-18A18,18,0,0,0,96,138Z"></path></svg>`,
        category: 'Basics',
      },
      {
        label: 'Card',
        type: 'Card',
        name: 'rdCard',
        media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b78847" viewBox="0 0 256 256"><path d="M184,72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V88A16,16,0,0,0,184,72Zm0,128H40V88H184V200ZM232,56V176a8,8,0,0,1-16,0V56H64a8,8,0,0,1,0-16H216A16,16,0,0,1,232,56Z"></path></svg>`,
        category: 'Basics',
      },
      {
        label: 'Layout',
        type: 'Layout',
        name: 'rdlayout',
        media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b78847" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V96H40V56ZM40,112H96v88H40Zm176,88H112V112H216v88Z"></path></svg>`,
        category: 'Layout',
      },
      {
        label: 'Heading',
        type: 'Heading',
        name: 'rdheading',
        media: `<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
        <g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7.55228 5 8 5.44772 8 6V11.5H16V6C16 5.44772 16.4477 5 17 5C17.5523 5 18 5.44772 18 6V12.5V19C18 19.5523 17.5523 20 17 20C16.4477 20 16 19.5523 16 19V13.5H8V19C8 19.5523 7.55228 20 7 20C6.44772 20 6 19.5523 6 19V12.5V6C6 5.44772 6.44772 5 7 5Z" fill="currentColor"/></g>
        </svg>`,
        category: 'Basics',
      },
      {
        label: 'Spacer',
        type: 'Spacer',
        name: 'rdSpacer',
        media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b78847" viewBox="0 0 256 256"><path d="M216,152a8,8,0,0,1-8,8H136v52.69l18.34-18.35a8,8,0,0,1,11.32,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L120,212.69V160H48a8,8,0,0,1,0-16H208A8,8,0,0,1,216,152ZM48,112H208a8,8,0,0,0,0-16H136V43.31l18.34,18.35a8,8,0,0,0,11.32-11.32l-32-32a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L120,43.31V96H48a8,8,0,0,0,0,16Z"></path></svg>`,
        category: 'Basics',
        stylable: ['height'],
      },
      {
        label: 'Button',
        type: 'Link',
        name: 'rdButton',
        media: `<svg width="28px" height="28px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M20.5 17h-17A2.502 2.502 0 0 1 1 14.5v-4A2.502 2.502 0 0 1 3.5 8h17a2.502 2.502 0 0 1 2.5 2.5v4a2.502 2.502 0 0 1-2.5 2.5zm-17-8A1.502 1.502 0 0 0 2 10.5v4A1.502 1.502 0 0 0 3.5 16h17a1.502 1.502 0 0 0 1.5-1.5v-4A1.502 1.502 0 0 0 20.5 9zM17 12H7v1h10z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>`,
        category: 'Basics',
      },
      {
        label: 'Banner',
        type: 'Banner',
        name: 'rdBanner',
        media: `<svg fill="#000000" height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" stroke="#000000" stroke-width="0.00512"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M468.32,53.08H43.68C19.595,53.08,0,72.675,0,96.76v283.087c0,0.003,0,0.008,0,0.011v35.381 c0,24.085,19.595,43.68,43.68,43.68H468.32c24.085,0,43.68-19.595,43.68-43.68V96.76C512,72.675,492.405,53.08,468.32,53.08z M43.68,442.333c-14.94,0-27.093-12.154-27.093-27.093v-31.951l39.375-39.375h182.344c1.55,0,2.996-0.433,4.238-1.173 l99.592,99.592H43.68z M230.013,299.68v26.851c-0.004,0.155-0.004,0.31,0,0.463v0.332H60.821V299.68H230.013z M116.784,283.093 l13.9-13.899c5.117-5.117,11.92-7.935,19.156-7.935c7.237,0,14.04,2.818,19.156,7.935l13.9,13.899H116.784z M495.413,415.24 c0,14.939-12.153,27.093-27.093,27.093H365.596L255.978,332.715l131.259-131.259c5.117-5.117,11.92-7.935,19.156-7.935 s14.04,2.818,19.156,7.935l69.863,69.863V415.24z M495.413,247.86l-58.133-58.132c-8.251-8.251-19.219-12.794-30.887-12.794 c-11.668,0-22.636,4.544-30.887,12.793L246.6,318.633v-27.247c0-4.58-3.712-8.294-8.294-8.294h-31.951l-25.629-25.629 c-8.251-8.249-19.219-12.793-30.887-12.793c-11.668,0-22.636,4.544-30.887,12.793l-25.629,25.629H52.527 c-4.581,0-8.294,3.713-8.294,8.294v40.797L16.587,359.83V96.76c0-14.939,12.153-27.093,27.093-27.093H468.32 c14.94,0,27.093,12.154,27.093,27.093V247.86z"></path> </g> </g> <g> <g> <path d="M317.927,168.088h-19.046c-1.137-5.889-3.451-11.362-6.702-16.156l13.475-13.475c3.239-3.239,3.239-8.491,0-11.728 c-3.24-3.239-8.491-3.239-11.73,0l-13.475,13.475c-4.794-3.25-10.267-5.565-16.155-6.701v-19.048c0-4.58-3.712-8.294-8.294-8.294 s-8.294,3.713-8.294,8.294v19.046c-5.889,1.137-11.361,3.451-16.155,6.701l-13.475-13.475c-3.24-3.239-8.491-3.239-11.73,0 c-3.239,3.239-3.239,8.491,0,11.728l13.475,13.475c-3.25,4.794-5.566,10.268-6.702,16.156h-19.046 c-4.581,0-8.294,3.713-8.294,8.294s3.712,8.295,8.294,8.295h19.046c1.137,5.889,3.451,11.362,6.702,16.156l-13.475,13.475 c-3.239,3.239-3.239,8.491,0,11.728c1.62,1.619,3.743,2.43,5.865,2.43c2.122,0,4.245-0.809,5.865-2.43l13.475-13.475 c4.794,3.25,10.267,5.565,16.155,6.701v19.047c0,4.58,3.712,8.294,8.294,8.294s8.294-3.713,8.294-8.294v-19.046 c5.889-1.137,11.361-3.451,16.155-6.701l13.475,13.475c1.62,1.619,3.743,2.43,5.865,2.43s4.245-0.809,5.865-2.43 c3.239-3.239,3.239-8.491,0-11.728l-13.475-13.475c3.25-4.794,5.566-10.268,6.702-16.156h19.044c4.581,0,8.294-3.713,8.294-8.294 C326.22,171.801,322.508,168.088,317.927,168.088z M256,203.473c-14.94,0-27.093-12.154-27.093-27.093S241.06,149.287,256,149.287 s27.093,12.154,27.093,27.093S270.94,203.473,256,203.473z"></path> </g> </g> <g> <g> <path d="M238.307,362.713H52.527c-4.581,0-8.294,3.713-8.294,8.294s3.712,8.294,8.294,8.294h185.78 c4.581,0,8.294-3.713,8.294-8.294S242.888,362.713,238.307,362.713z"></path> </g> </g> <g> <g> <path d="M167.533,398.099H52.527c-4.581,0-8.294,3.713-8.294,8.294c0,4.58,3.712,8.294,8.294,8.294h115.006 c4.581,0,8.294-3.713,8.294-8.294C175.827,401.813,172.115,398.099,167.533,398.099z"></path> </g> </g> </g></svg>`,
        category: 'Basics',
      },
      {
        label: 'User',
        type: 'UserCard',
        name: 'rdUserCard',
        media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#60f594" viewBox="0 0 256 256"><path d="M198,112a6,6,0,0,1-6,6H152a6,6,0,0,1,0-12h40A6,6,0,0,1,198,112Zm-6,26H152a6,6,0,0,0,0,12h40a6,6,0,0,0,0-12Zm38-82V200a14,14,0,0,1-14,14H40a14,14,0,0,1-14-14V56A14,14,0,0,1,40,42H216A14,14,0,0,1,230,56Zm-12,0a2,2,0,0,0-2-2H40a2,2,0,0,0-2,2V200a2,2,0,0,0,2,2H216a2,2,0,0,0,2-2ZM133.81,166.51a6,6,0,0,1-11.62,3C119.34,158.38,108.08,150,96,150s-23.33,8.38-26.19,19.5a6,6,0,0,1-11.62-3A38,38,0,0,1,76.78,143a30,30,0,1,1,38.45,0A38,38,0,0,1,133.81,166.51ZM96,138a18,18,0,1,0-18-18A18,18,0,0,0,96,138Z"></path></svg>`,
        category: 'Basics',
      },
      {
        label: 'Carousel',
        type: 'Carousel',
        name: 'rdCarousel',
        media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b78847" viewBox="0 0 256 256"><path d="M184,72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V88A16,16,0,0,0,184,72Zm0,128H40V88H184V200ZM232,56V176a8,8,0,0,1-16,0V56H64a8,8,0,0,1,0-16H216A16,16,0,0,1,232,56Z"></path></svg>`,
        category: 'Basics',
      },
      {
        label: 'Slider Carousel',
        type: 'slider-carousel',
        name: 'slider-carousel',
        media: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#b78847" viewBox="0 0 256 256"><path d="M184,72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V88A16,16,0,0,0,184,72Zm0,128H40V88H184V200ZM232,56V176a8,8,0,0,1-16,0V56H64a8,8,0,0,1,0-16H216A16,16,0,0,1,232,56Z"></path></svg>`,
        category: 'Placeholders',
      },
    ],
  };

  for (let name in config) {
    if (!(name in opts)) opts[name] = config[name];
  }

  loadCommands(editor, opts);

  loadTraits(editor, opts);

  loadComponents(editor, opts);

  loadBlocks(editor, opts);
};
