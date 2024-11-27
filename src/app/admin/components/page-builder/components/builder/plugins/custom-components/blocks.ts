import { Editor } from 'grapesjs';

export default (editor: Editor, opts: any = {}) => {
  const bm = editor.BlockManager;

  for (let i = 0; i < opts.componentTypes.length; i++) {
    const componentType = opts.componentTypes[i];
    bm.add(componentType.name, {
      label: `${componentType.label}`,
      media: componentType.media,
      category: componentType.category,
      content: {
        type: componentType.type,
        ...(componentType.stylable
          ? { stylable: componentType.stylable }
          : null),
      },
      activate: true,
      select: true,
    });
  }
};
