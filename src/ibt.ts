import * as fs from 'node:fs';
import { VAR_TYPE_MAP } from './constants.js';
import { DiskSubHeader, Header, VarHeader } from './structs.js';

export class IBT {
  private ibtFile: fs.ReadStream | null = null;
  private fileData: Buffer | null = null;
  private header: Header | null = null;
  private diskHeader: DiskSubHeader | null = null;
  private varHeaders: VarHeader[] | null = null;
  private varHeadersDict: Map<string, VarHeader> = new Map();
  private varHeadersNames: string[] | null = null;

  get varHeadersNamesList(): string[] | null {
    if (!this.header) {
      return null;
    }

    if (!this.varHeadersNames) {
      this.varHeadersNames = this.getVarHeaders().map((h) => h.name);
    }

    return this.varHeadersNames;
  }

  /**
   * Open an IBT file
   */
  open(ibtFilePath: string): void {
    this.ibtFile = fs.createReadStream(ibtFilePath);
    this.fileData = fs.readFileSync(ibtFilePath);

    if (this.fileData) {
      this.header = new Header(this.fileData);
      this.diskHeader = new DiskSubHeader(this.fileData, 112);
    }
  }

  /**
   * Close the IBT file
   */
  close(): void {
    if (this.ibtFile) {
      this.ibtFile.destroy();
      this.ibtFile = null;
    }

    this.fileData = null;
    this.header = null;
    this.diskHeader = null;

    this.varHeaders = null;
    this.varHeadersDict.clear();
    this.varHeadersNames = null;
  }

  // biome-ignore lint/suspicious/noExplicitAny: Telemetry data is dynamically typed
  get(index: number, key: string): any {
    if (!this.header || !this.diskHeader || !this.fileData) {
      return null;
    }

    if (index < 0 || index >= this.diskHeader.sessionRecordCount) {
      return null;
    }

    const varHeader = this.varHeadersDict.get(key);
    if (!varHeader) {
      return null;
    }

    const typeChar = VAR_TYPE_MAP[varHeader.type];
    const varOffset =
      varHeader.offset +
      this.header.varBuf[0]._bufOffset +
      index * this.header.bufLen;

    return this.unpackValues(varOffset, typeChar, varHeader.count);
  }

  // biome-ignore lint/suspicious/noExplicitAny: Telemetry data is dynamically typed
  getAll(key: string): any[] | null {
    if (!this.header || !this.diskHeader || !this.fileData) {
      return null;
    }

    const varHeader = this.varHeadersDict.get(key);
    if (!varHeader) {
      return null;
    }

    const typeChar = VAR_TYPE_MAP[varHeader.type];
    // biome-ignore lint/suspicious/noExplicitAny: Telemetry data is dynamically typed
    const results: any[] = [];
    const bufLen = this.header.bufLen;
    const varOffset = varHeader.offset + this.header.varBuf[0]._bufOffset;

    for (let i = 0; i < this.diskHeader.sessionRecordCount; i++) {
      const value = this.unpackValues(
        varOffset + i * bufLen,
        typeChar,
        varHeader.count,
      );
      results.push(value);
    }

    return results;
  }

  // Private methods

  private getVarHeaders(): VarHeader[] {
    if (!this.varHeaders && this.header && this.fileData) {
      this.varHeaders = [];
      this.varHeadersDict.clear();

      for (let i = 0; i < this.header.numVars; i++) {
        const varHeader = new VarHeader(
          this.fileData,
          this.header.varHeaderOffset + i * 144,
        );
        this.varHeaders.push(varHeader);
        this.varHeadersDict.set(varHeader.name, varHeader);
      }
    }

    return this.varHeaders || [];
  }

  // biome-ignore lint/suspicious/noExplicitAny: Telemetry data is dynamically typed
  private unpackValues(offset: number, typeChar: string, count: number): any {
    if (!this.fileData) {
      return null;
    }

    if (count === 1) {
      return this.unpackSingleValue(offset, typeChar);
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: Telemetry data is dynamically typed
      const results: any[] = [];
      const typeSize = this.getTypeSize(typeChar);
      for (let i = 0; i < count; i++) {
        results.push(this.unpackSingleValue(offset + i * typeSize, typeChar));
      }
      return results;
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: Telemetry data is dynamically typed
  private unpackSingleValue(offset: number, typeChar: string): any {
    if (!this.fileData) {
      return null;
    }

    switch (typeChar) {
      case 'i':
        return this.fileData.readInt32LE(offset);
      case 'I':
        return this.fileData.readUInt32LE(offset);
      case 'f':
        return this.fileData.readFloatLE(offset);
      case 'd':
        return this.fileData.readDoubleLE(offset);
      case '?':
        return this.fileData.readUInt8(offset) !== 0;
      case 'c':
        return this.fileData.readUInt8(offset);
      default:
        return 0;
    }
  }

  private getTypeSize(typeChar: string): number {
    switch (typeChar) {
      case 'i':
      case 'I':
      case 'f':
        return 4;
      case 'd':
        return 8;
      case '?':
      case 'c':
        return 1;
      default:
        return 0;
    }
  }
}
