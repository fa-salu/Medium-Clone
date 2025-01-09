declare module "medium-editor" {
  interface MediumEditorOptions {
    toolbar?: boolean | object;
    placeholder?: { text: string; hideOnClick: boolean };
    disableReturn?: boolean;
  }

  class MediumEditor {
    constructor(selector: string | HTMLElement, options?: MediumEditorOptions);

    setContent(content: string): void;
    getContent(): string;

    // You can add more methods as you need
  }

  export default MediumEditor;
}
