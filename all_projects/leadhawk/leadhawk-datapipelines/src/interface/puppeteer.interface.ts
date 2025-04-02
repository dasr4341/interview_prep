export interface IPuppeteerConfiguration {
  args: string[];
  [key: string]: boolean | number | null | {};
}
