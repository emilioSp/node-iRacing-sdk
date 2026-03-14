import { getVars, parseHeader, parseVarBuffer, type VarBuffer, type Vars } from './structs.ts';
import { VAR_TYPE_MAP } from './vars.ts';

export class SharedMemory {
  private data: number[];

  readonly version: number;
  readonly status: number;
  readonly tickRate: number;
  readonly sessionInfoUpdate: number;
  readonly sessionInfoLen: number;
  readonly sessionInfoOffset: number;
  readonly numVars: number;
  readonly varHeaderOffset: number;
  readonly bufLen: number;
  readonly numBuf: number;

  private varHeadersList: Vars[] | null = null;
  private varHeadersMap: Map<string, Vars> | null = null;

  constructor(data: number[]) {
    this.data = data;
    const header = parseHeader(data);
    this.version = header.version;
    this.status = header.status;
    this.tickRate = header.tickRate;
    this.sessionInfoUpdate = header.sessionInfoUpdate;
    this.sessionInfoLen = header.sessionInfoLen;
    this.sessionInfoOffset = header.sessionInfoOffset;
    this.numVars = header.numVars;
    this.varHeaderOffset = header.varHeaderOffset;
    this.bufLen = header.bufLen;
    this.numBuf = header.numBuf;
  }

  getVarHeaders(): Map<string, Vars> {
    if (!this.varHeadersMap) {
      this.varHeadersList = [];
      this.varHeadersMap = new Map();

      for (let i = 0; i < this.numVars; i++) {
        const varHeader = getVars(this.data, this.varHeaderOffset + i * 144);
        this.varHeadersList.push(varHeader);
        this.varHeadersMap.set(varHeader.name, varHeader);
      }
    }
    return this.varHeadersMap;
  }

  getVarHeadersList(): string[] {
    const headers = this.getVarHeaders();
    // biome-ignore lint/style/noNonNullAssertion: initialized by getVarHeaders()
    return this.varHeadersList!.map((h) => h.name);
  }

  getVarBuffer(): VarBuffer {
    const buffers: VarBuffer[] = [];
    for (let i = 0; i < this.numBuf; i++) {
      buffers.push(parseVarBuffer(this.data, 48 + i * 16));
    }
    const sorted = buffers.sort((a, b) => b.tickCount - a.tickCount);
    return sorted.length > 1 ? sorted[1] : sorted[0];
  }

  // biome-ignore lint/suspicious/noExplicitAny: Telemetry data is dynamically typed
  readVar(key: string): any {
    const varHeader = this.getVarHeaders().get(key);
    if (!varHeader) {
      throw new Error(`Key ${key} not found in var headers`);
    }

    const varBuffer = this.getVarBuffer();
    const offset = varBuffer.bufOffset + varHeader.offset;
    const typeChar = VAR_TYPE_MAP[varHeader.type];

    if (varHeader.count === 1) {
      return this.unpackValue(offset, typeChar);
    }

    // biome-ignore lint/suspicious/noExplicitAny: Telemetry data is dynamically typed
    const result: any[] = [];
    const typeSize = getTypeSize(typeChar);
    for (let i = 0; i < varHeader.count; i++) {
      result.push(this.unpackValue(offset + i * typeSize, typeChar));
    }
    return result;
  }

  /**
   * Read a var at a specific record index (for IBT file access).
   * Returns the unpacked value(s) for the given var at the given record.
   */
  // biome-ignore lint/suspicious/noExplicitAny: Telemetry data is dynamically typed
  readVarAtIndex(key: string, index: number): any {
    const varHeader = this.getVarHeaders().get(key);
    if (!varHeader) {
      return null;
    }

    const typeChar = VAR_TYPE_MAP[varHeader.type];
    const varOffset =
      varHeader.offset + this.getVarBuffer().bufOffset + index * this.bufLen;

    if (varHeader.count === 1) {
      return this.unpackValue(varOffset, typeChar);
    }

    // biome-ignore lint/suspicious/noExplicitAny: Telemetry data is dynamically typed
    const results: any[] = [];
    const typeSize = getTypeSize(typeChar);
    for (let i = 0; i < varHeader.count; i++) {
      results.push(this.unpackValue(varOffset + i * typeSize, typeChar));
    }
    return results;
  }

  unpackValue(offset: number, typeChar: string): number | boolean {
    const bytes = new Uint8Array(this.data.slice(offset, offset + 8));
    const view = new DataView(bytes.buffer);

    switch (typeChar) {
      case 'i':
        return view.getInt32(0, true);
      case 'I':
        return view.getUint32(0, true);
      case 'f':
        return view.getFloat32(0, true);
      case 'd':
        return view.getFloat64(0, true);
      case '?':
        return this.data[offset] !== 0;
      case 'c':
        return this.data[offset] & 0xff;
      default:
        return 0;
    }
  }

  slice(offset: number, length: number): number[] {
    return this.data.slice(offset, offset + length);
  }

  updateData(fresh: number[]): void {
    for (let i = 0; i < fresh.length; i++) {
      this.data[i] = fresh[i];
    }
  }
}

export function getTypeSize(typeChar: string): number {
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
