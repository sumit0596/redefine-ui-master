export const findComponentWithAttribute = (
  component: any,
  attributeName: string
) => {
  let components: any = {};

  component?.forEachChild((childComponent: any) => {
    const attributes = childComponent.getAttributes();
    if (Object.prototype.hasOwnProperty.call(attributes, attributeName)) {
      components = childComponent;
      return;
    }
  });
  return components;
};

/**
 * @description Add
 */
export const replaceClass = (
  component: any,
  newClassName: string,
  oldClassName: string
) => {
  let classes = component.getClasses();
  const index = classes.indexOf(oldClassName);
  if (index !== -1) {
    classes[index] = newClassName;
  } else {
    classes = [...classes, newClassName];
  }
  return classes;
};
