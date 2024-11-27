import { Editor, Plugin } from 'grapesjs';
import { PageBuilderService } from '../../../services/page-builder.service';

export const imageUpload: Plugin = (editor: Editor, opts: any = {}) => {
  const { uploadService } = opts;
  editor.Commands.add('replace-image-src', {
    run: (editor, sender, options) => {
      // Get the selected component
      const selectedComponent = editor.getSelected();
      if (selectedComponent && selectedComponent.is('img')) {
        // Get the new image URL from your API
        const newImageUrl = fetch(uploadService)
          .then((response) => response.json())
          .then((data) => data.imageUrl)
          .catch((error) => {
            console.error('Error fetching image URL:', error);
          });
        // Update the src attribute of the image component
        selectedComponent.setAttributes({ src: newImageUrl });
      }
    },
  });
};
