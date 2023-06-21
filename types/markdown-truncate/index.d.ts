declare module "markdown-truncate" {
  type TruncateMarkdownOptions = {
    limit: number;
    ellipsis: boolean;
  };

  declare function truncateMarkdown(text: string, options: TruncateMarkdownOptions): string;

  export default truncateMarkdown;
}
