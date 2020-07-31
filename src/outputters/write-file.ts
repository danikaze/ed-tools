import { writeFileSync } from 'fs';
import { basename } from 'path';
import { Outputter } from '.';

export interface WriteFileOutputterOptions {
  verbose: boolean;
  clearOnStart: boolean;
  clearOnEnd: boolean;
}

export class WriteFileOutputter extends Outputter {
  public static readonly defaultOptions: WriteFileOutputterOptions = {
    verbose: true,
    clearOnStart: true,
    clearOnEnd: true,
  };

  protected readonly path: string;
  protected readonly options: WriteFileOutputterOptions;

  constructor(path: string, options?: Partial<WriteFileOutputterOptions>) {
    super();

    this.path = path;
    this.options = {
      ...WriteFileOutputter.defaultOptions,
      ...options,
    };

    if (!this.options.clearOnStart) return;
    try {
      writeFileSync(this.path, '');
    } catch (e) {
      console.error(`Error clearing ${this.path}`);
    }
  }

  protected async process(info: string): Promise<void> {
    try {
      writeFileSync(this.path, info);
      if (this.options.verbose) {
        console.log(`${basename(this.path)} => ${info}`);
      }
    } catch (e) {
      console.error(`Error writting to ${this.path}`);
    }
  }

  protected async destroy(): Promise<void> {
    if (!this.options.clearOnEnd) return;
    try {
      writeFileSync(this.path, '');
    } catch (e) {
      console.error(`Error clearing ${this.path}`);
    }
  }
}
