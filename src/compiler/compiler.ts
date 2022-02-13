import { Compiler } from './models.ts';

export class DinovelCompilers {
  private readonly _compilers = new Map<string, Compiler>();

  public set(compiler: Compiler) {
    if (!compiler) { return; }
    this._compilers.set(compiler.name, compiler);
  }

  public get(key: string): Compiler | undefined {
    return this._compilers.get(key);
  }

  public getAll(): Compiler[] {
    return Array.from(this._compilers.values());
  }

  public has(key: string): boolean {
    return this._compilers.has(key);
  }

  public delete(key: string): boolean {
    return this._compilers.delete(key);
  }

  public startWatchers() {
    this._compilers
      .forEach(compiler => compiler.startWatch());
  }
}
