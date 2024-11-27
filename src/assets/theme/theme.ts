export interface Theme {
  name: string;
  properties: any;
}

export const user: Theme = {
  name: 'user',
  properties: {
    '--border-width': '1px',
    '--input-border-color': 'transparent',
    '--checkbox-border-color': 'var(--red-color)',
    '--radio-border-color': 'var(--red-color)',
  },
};

export const admin: Theme = {
  name: 'admin',
  properties: {
    '--border-width': '1px',
    '--input-border-color': 'transparent',
    '--checkbox-border-color': 'var(--black)',
    '--radio-border-color': 'var(--black)',
  },
};
