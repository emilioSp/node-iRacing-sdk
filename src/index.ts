/**
 * iRacing SDK for Node.js
 * Main entry point
 */

// Export constants and enums
export {
  BROADCASTMSGNAME,
  BroadcastMsg,
  CameraState,
  CarLeftRight,
  ChatCommandMode,
  csMode,
  DATAVALIDEVENTNAME,
  EngineWarnings,
  FFBCommandMode,
  Flags,
  MEMMAPFILE,
  MEMMAPFILESIZE,
  PaceFlags,
  PaceMode,
  PitCommandMode,
  PitSvFlags,
  PitSvStatus,
  ReloadTexturesMode,
  RpyPosMode,
  RpySrchMode,
  RpyStateMode,
  SessionState,
  SIM_STATUS_URL,
  StatusField,
  TelemCommandMode,
  TrackWetness,
  TrkLoc,
  TrkSurf,
  VAR_TYPE_MAP,
  VERSION,
  VideoCaptureMode,
} from './constants.js';
export { IBT } from './ibt.js';
// Export main classes
export { default, IRSDK } from './irsdk.js';

// Export struct classes for advanced usage
export {
  DiskSubHeader,
  Header,
  IRSDKStruct,
  VarBuffer,
  VarHeader,
} from './structs.js';

// Export utilities
export {
  checkSimStatus,
  extractYamlSection,
  padCarNumber,
  parseIRSDKYaml,
  translateYamlData,
} from './utils.js';
