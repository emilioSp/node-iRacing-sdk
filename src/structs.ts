/**
 * Helper functions to read binary values from a plain number[] array.
 * These replace Node.js Buffer methods (readInt32LE, readFloatLE, etc.)
 * so the codebase works with plain JavaScript arrays from koffi.decode().
 */

// Low-level readers from a plain number[] (e.g. from koffi.decode())

function readUInt8(data: number[], offset: number): number {
  return data[offset] & 0xff;
}

function readInt32LE(data: number[], offset: number): number {
  return (
    data[offset] |
    (data[offset + 1] << 8) |
    (data[offset + 2] << 16) |
    (data[offset + 3] << 24)
  );
}

function readDoubleLE(data: number[], offset: number): number {
  const bytes = new Uint8Array([
    data[offset],
    data[offset + 1],
    data[offset + 2],
    data[offset + 3],
    data[offset + 4],
    data[offset + 5],
    data[offset + 6],
    data[offset + 7],
  ]);
  return new DataView(bytes.buffer).getFloat64(0, true);
}

function readString(data: number[], offset: number, maxLength: number): string {
  const chars: number[] = [];
  for (let i = 0; i < maxLength; i++) {
    const byte = data[offset + i];
    if (byte === 0) break;
    chars.push(byte);
  }
  return String.fromCharCode(...chars);
}

// Plain types

export type VarBuffer = {
  tickCount: number;
  bufOffset: number;
};

export type Header = {
  version: number;
  status: number;
  tickRate: number;
  sessionInfoUpdate: number;
  sessionInfoLen: number;
  sessionInfoOffset: number;
  numVars: number;
  varHeaderOffset: number;
  bufLen: number;
  numBuf: number;
  getVarBuffer(): VarBuffer;
};

export type Vars = {
  type: number;
  offset: number;
  count: number;
  countAsTime: boolean;
  name: string;
  desc: string;
  unit: string;
};

export type DiskSubHeader = {
  sessionStartDate: number;
  sessionStartTime: number;
  sessionEndTime: number;
  sessionLapCount: number;
  sessionRecordCount: number;
};

export const parseHeader = (data: number[]): Header => {
  const numBuf = readInt32LE(data, 32);

  return {
    version: readInt32LE(data, 0),
    status: readInt32LE(data, 4),
    tickRate: readInt32LE(data, 8),
    sessionInfoUpdate: readInt32LE(data, 12),
    sessionInfoLen: readInt32LE(data, 16),
    sessionInfoOffset: readInt32LE(data, 20),
    numVars: readInt32LE(data, 24),
    varHeaderOffset: readInt32LE(data, 28),
    bufLen: readInt32LE(data, 36),
    numBuf,
    getVarBuffer: (): VarBuffer => {
      const buffers: VarBuffer[] = [];
      for (let i = 0; i < numBuf; i++) {
        buffers.push(parseVarBuffer(data, 48 + i * 16));
      }
      // Return 2nd most recent buffer to avoid partially updated buffers
      const sorted = buffers.sort((a, b) => b.tickCount - a.tickCount);
      return sorted.length > 1 ? sorted[1] : sorted[0];
    },
  };
};

export const parseVarBuffer = (data: number[], offset: number): VarBuffer => {
  return {
    tickCount: readInt32LE(data, offset),
    bufOffset: readInt32LE(data, offset + 4),
  };
};

// Vars
export const getVars = (data: number[], offset: number): Vars => {
  return {
    type: readInt32LE(data, offset),
    offset: readInt32LE(data, offset + 4),
    count: readInt32LE(data, offset + 8),
    countAsTime: readUInt8(data, offset + 12) !== 0,
    name: readString(data, offset + 16, 32),
    desc: readString(data, offset + 48, 64),
    unit: readString(data, offset + 112, 32),
  };
};

export const parseDiskSubHeader = (
  data: number[],
  offset: number,
): DiskSubHeader => {
  const lo = readInt32LE(data, offset);
  const hi = readInt32LE(data, offset + 4);
  return {
    sessionStartDate: hi * 0x100000000 + (lo >>> 0),
    sessionStartTime: readDoubleLE(data, offset + 8),
    sessionEndTime: readDoubleLE(data, offset + 16),
    sessionLapCount: readInt32LE(data, offset + 24),
    sessionRecordCount: readInt32LE(data, offset + 28),
  };
};
