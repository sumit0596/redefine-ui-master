import { Editor } from 'grapesjs';
import { colors } from 'src/app/utilities/colors';

export default (editor: Editor, opts: any = {}) => {
  const tm = editor.TraitManager;

  tm.addType('href-next', {
    // Expects as return a simple HTML string or an HTML element
    createInput({ trait }) {
      // Here we can decide to use properties from the trait
      const traitOpts = trait.getOptions() || [];
      const options = traitOpts.length
        ? traitOpts
        : [
            { id: 'url', name: 'URL' },
            { id: 'email', name: 'Email' },
          ];

      // Create a new element container and add some content
      const el = document.createElement('div');
      el.innerHTML = `
        <select class="href-next__type">
          ${options
            .map((opt: any) => `<option value="${opt.id}">${opt.name}</option>`)
            .join('')}
        </select>
        <div class="href-next__url-inputs">
          <input class="href-next__url" placeholder="Insert URL"/>
        </div>
        <div class="href-next__email-inputs">
          <input class="href-next__email" placeholder="Insert email"/>
          <input class="href-next__email-subject" placeholder="Insert subject"/>
        </div>
      `;

      // Let's make our content interactive
      const inputsUrl: any = el.querySelector('.href-next__url-inputs');
      const inputsEmail: any = el.querySelector('.href-next__email-inputs');
      const inputType: any = el.querySelector('.href-next__type');
      inputType.addEventListener('change', (ev: any) => {
        switch (ev.target.value) {
          case 'url':
            inputsUrl.classList.remove('d-none');
            inputsEmail.classList.add('d-none');
            break;
          case 'email':
            inputsUrl.classList.add('d-none');
            inputsEmail.classList.remove('d-none');
            break;
        }
      });

      return el;
    },
    onEvent({ elInput, component, event }: any) {
      const inputType: any = elInput.querySelector('.href-next__type');
      let href = '';

      switch (inputType.value) {
        case 'url':
          const valUrl = elInput.querySelector('.href-next__url').value;
          href = valUrl;
          break;
        case 'email':
          const valEmail = elInput.querySelector('.href-next__email').value;
          const valSubj = elInput.querySelector(
            '.href-next__email-subject'
          ).value;
          href = `mailto:${valEmail}${valSubj ? `?subject=${valSubj}` : ''}`;
          break;
      }

      component.addAttributes({ href });
    },
    // Update elements on the component change
    onUpdate({ elInput, component }: any) {
      const href = component.getAttributes().href || '';
      const inputType: any = elInput.querySelector('.href-next__type');
      let type = 'url';

      if (href.indexOf('mailto:') === 0) {
        const inputEmail: any = elInput.querySelector('.href-next__email');
        const inputSubject: any = elInput.querySelector(
          '.href-next__email-subject'
        );
        const mailTo = href.replace('mailto:', '').split('?');
        const email = mailTo[0];
        const params = (mailTo[1] || '')
          .split('&')
          .reduce((acc: any, item: any) => {
            const items = item.split('=');
            acc[items[0]] = items[1];
            return acc;
          }, {});
        type = 'email';

        inputEmail.value = email || '';
        inputSubject.value = params.subject || '';
      } else {
        elInput.querySelector('.href-next__url').value = href;
      }

      inputType.value = type;
      inputType.dispatchEvent(new CustomEvent('change'));
    },
  });
  tm.addType('color', {
    // Expects as return a simple HTML string or an HTML element
    createInput({ trait }) {
      // Here we can decide to use properties from the trait
      const traitOpts = trait.getOptions() || [];
      const options = traitOpts.length ? traitOpts : colors;

      // Create a new element container and add some content
      const el = document.createElement('div');
      el.innerHTML = `
        <select id="color-to-dropdown">
          <option value="" selected disabled>Please select</option>
          <option value="text">Text</option>
          <option value="background">Background</option>
          <option value="border">Border</option>
        </select>
        <select id="color-dropdown">
          ${options
            .map(
              (opt: any) => `<option value="${opt.class}">${opt.name}</option>`
            )
            .join('')}
        </select>
      `;

      // Let's make our content interactive
      const colorType: any = el.querySelector('#color-to-dropdown');
      const colorDropdown: any = el.querySelector('#color-dropdown');
      colorType?.addEventListener('change', (ev: any) => {
        switch (ev.target.value) {
          case 'text':
            colorDropdown.innerHTML = `
            ${options
              .map(
                (opt: any) =>
                  `<option value="${opt.class}">${opt.name}</option>`
              )
              .join('')}
            `;
            break;
          case 'background':
            colorDropdown.innerHTML = `
            ${options
              .map(
                (opt: any) =>
                  `<option value="${opt.bgClass}">${opt.name}</option>`
              )
              .join('')}
            `;
            break;
          case 'border':
            colorDropdown.innerHTML = `
            ${options
              .map(
                (opt: any) =>
                  `<option value="${opt.borderClass}">${opt.name}</option>`
              )
              .join('')}
            `;
            break;
        }
      });
      return el;
    },
    // Update the component based on element changes
    // `elInput` is the result HTMLElement you get from `createInput`
    onEvent({ elInput, component, event }: any) {
      const inputType: any = elInput.querySelector('#color-dropdown');
      const attrs = component.getAttributes();
      if (inputType.value) {
        if (component && attrs['data-color-trait']) {
          component.removeClass(attrs['data-color-trait']);
        }
        component.addClass(inputType.value);
        component.addAttributes({ 'data-color-trait': inputType.value });
      }
    },
    // Update elements on the component change
    onUpdate({ elInput, component }: any) {
      if (component && elInput) {
        const inputType: any = elInput.querySelector('#color-dropdown');
        const attrs = component.getAttributes();
        inputType.dispatchEvent(new CustomEvent('change'));
      }
    },
  });

  editor.DomComponents.addType('image', {
    isComponent: el => el.tagName === 'IMG',
    model: {
      defaults: {
        traits: [
          'alt',
          {
            type: 'text',
            label: 'Aria Label',
            name: 'aria-label',
            placeholder: 'Enter aria-label',
          },
        ],
      },
    },
  });
 
  editor.DomComponents.addType('custom-link', {
    model: {
      defaults: {
        traits: [
          {
                        label: 'Url',
                        type: 'anchor',
                        name: 'href',
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
                      {
                        type: 'text',
                        label: 'Aria Label',
                        name: 'aria-label',
                        placeholder: 'Add a label for accessibility',
                      },
         
         
        ],
      },
    },
  });
 
};
