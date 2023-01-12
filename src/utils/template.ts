import ejs from 'ejs';

export interface TemplateData {
  projectName: string;
  version: string;
}

export function render(content: string, data: TemplateData) {
  return ejs.render(content, data);
}
