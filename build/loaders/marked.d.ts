interface MarkedOptions {
  /**
   * A prefix URL for any relative link.
   */
  baseUrl?: string;

  /**
   * Enable GFM line breaks. This option requires the gfm option to be true.
   */
  breaks?: boolean;

  /**
   * Enable GitHub flavored markdown.
   */
  gfm?: boolean;

  /**
   * Include an id attribute when emitting headings.
   */
  headerIds?: boolean;

  /**
   * Set the prefix for header tag ids.
   */
  headerPrefix?: string;

  /**
   * A function to highlight code blocks. The function takes three arguments: code, lang, and callback.
   */
  highlight?(code: string, lang: string, callback?: (error: any | undefined, code: string) => void): string;

  /**
   * Set the prefix for code block classes.
   */
  langPrefix?: string;

  /**
   * Mangle autolinks (<email@domain.com>).
   */
  mangle?: boolean;

  /**
   * Conform to obscure parts of markdown.pl as much as possible. Don't fix any of the original markdown bugs or poor behavior.
   */
  pedantic?: boolean;

  /**
   * Type: object Default: new Renderer()
   *
   * An object containing functions to render tokens to HTML.
   */
  renderer?: object;

  /**
   * Sanitize the output. Ignore any HTML that has been input.
   */
  sanitize?: boolean;

  /**
   * Optionally sanitize found HTML with a sanitizer function.
   */
  sanitizer?(html: string): string;

  /**
   * Shows an HTML error message when rendering fails.
   */
  silent?: boolean;

  /**
   * Use smarter list behavior than the original markdown. May eventually be default with the old behavior moved into pedantic.
   */
  smartLists?: boolean;

  /**
   * Use "smart" typograhic punctuation for things like quotes and dashes.
   */
  smartypants?: boolean;

  /**
   * Enable GFM tables. This option requires the gfm option to be true.
   */
  tables?: boolean;

  /**
   * Generate closing slash for self-closing tags (<br/> instead of <br>)
   */
  xhtml?: boolean;
}

interface Rules {
  [ruleName: string]: any;
}

interface Link {
  href: string;
  title: string;
}

type TokensList = Token[] & {
  links: {
      [key: string]: { href: string; title: string; }
  }
};

type Token =
  Tokens.Space
  | Tokens.Code
  | Tokens.Heading
  | Tokens.Table
  | Tokens.Hr
  | Tokens.BlockquoteStart
  | Tokens.BlockquoteEnd
  | Tokens.ListStart
  | Tokens.LooseItemStart
  | Tokens.ListItemStart
  | Tokens.ListItemEnd
  | Tokens.ListEnd
  | Tokens.Paragraph
  | Tokens.HTML
  | Tokens.Text;

namespace Tokens {
  export interface Space {
      type: 'space';
  }

  export interface Code {
      type: 'code';
      lang?: string;
      text: string;
      escaped?: boolean;
  }

  export interface Heading {
      type: 'heading';
      depth: number;
      text: string;
  }

  export interface Table {
      type: 'table';
      header: string[];
      align: Array<'center' | 'left' | 'right' | null>;
      cells: string[][];
  }

  export interface Hr {
      type: 'hr';
  }

  export interface BlockquoteStart {
      type: 'blockquote_start';
  }

  export interface BlockquoteEnd {
      type: 'blockquote_end';
  }

  export interface ListStart {
      type: 'list_start';
      ordered: boolean;
  }

  export interface LooseItemStart {
      type: 'loose_item_start';
  }

  export interface ListItemStart {
      type: 'list_item_start';
  }

  export interface ListItemEnd {
      type: 'list_item_end';
  }

  export interface ListEnd {
      type: 'list_end';
  }

  export interface Paragraph {
      type: 'paragraph';
      pre?: boolean;
      text: string;
  }

  export interface HTML {
      type: 'html';
      pre: boolean;
      text: string;
  }

  export interface Text {
      type: 'text';
      text: string;
  }
}

declare var marked: MarkedOptions;
