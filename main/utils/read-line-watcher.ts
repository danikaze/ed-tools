import EventEmitter from 'eventemitter3';
import { open, watch, FSWatcher, createReadStream } from 'fs';
import { O_RDONLY } from 'constants';
import { msgError, msgLog } from './msgs';

export interface ReadLineWatcherOptions {
  readOnlyNewChanges: boolean;
  crlf: string;
  bufferSize: number;
  method: 'watch' | 'poll';
  pollInterval: number;
}

/**
 * NodeJS' readline read lines but doesn't watch
 * fs' watch watches, but doesn't read line.
 * Combine both functionalities and get this class
 */
export class ReadLineWatcher extends EventEmitter<'line'> {
  public static readonly defaultOptions: ReadLineWatcherOptions = {
    readOnlyNewChanges: false,
    crlf: '\n',
    bufferSize: 0,
    method: 'poll',
    pollInterval: 1000,
  };

  protected readonly watcher?: FSWatcher;
  protected pollInterval?: number;
  protected readBytes = 0;
  protected isReading = false;

  protected path: string;
  protected readOnlyNewChanges: boolean;
  protected crlf: string;

  constructor(path: string, options?: Partial<ReadLineWatcherOptions>) {
    super();
    this.read = this.read.bind(this);

    const opt = { ...ReadLineWatcher.defaultOptions, ...options };
    this.path = path;
    this.readOnlyNewChanges = opt.readOnlyNewChanges;
    this.crlf = opt.crlf;

    if (opt.method === 'watch') {
      this.watcher = watch(path);
      this.watcher.addListener('change', this.read);
    } else if (opt.method === 'poll') {
      this.pollInterval = (setInterval(
        this.read,
        opt.pollInterval
      ) as unknown) as number;
    }

    if (!this.readOnlyNewChanges) {
      this.read();
    }
  }

  public stop(): void {
    this.watcher?.close();
    this.pollInterval && clearInterval(this.pollInterval);
  }

  protected read(): void {
    if (this.isReading) return;
    this.isReading = true;

    open(this.path, O_RDONLY, (err, fd) => {
      if (err) {
        msgError(`Error opening file ${this.path}`);
        this.isReading = false;
        return;
      }

      const rs = createReadStream(this.path, {
        fd,
        start: this.readBytes,
      });

      let previous = '';

      rs.on('data', (data) => {
        this.readBytes += data.length;
        const lines = (previous + data.toString()).split(this.crlf);
        previous = lines[lines.length - 1];
        lines.slice(0, -1).forEach((line) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return;
          this.emit('line', trimmedLine);
        });
      });

      rs.on('end', () => {
        if (previous) {
          const trimmedLine = previous.trim();
          if (!trimmedLine) return;
          this.emit('line', trimmedLine);
        }
        this.isReading = false;
      });
    });
  }
}
