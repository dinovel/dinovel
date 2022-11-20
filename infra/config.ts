/** Configuration for dinovel */
export interface DinovelConfig {
  /** Game title */
  title: string;
  /** Entry file, default: ./main.ts */
  entry: string;
  /** Extra scripts to load */
  scripts: string[];
  /** Extra styles to load */
  styles: string[];
  /** Assets folder */
  assets: string;
  /** Development server options */
  devServer: {
    /** Port to listen on, default: 8666 */
    port: number;
    /** If defined, use this start file insted of main entry */
    entry?: string;
    /** Auto configure server params, if false, entry must manually call runServer */
    auto: boolean;
  };
}
