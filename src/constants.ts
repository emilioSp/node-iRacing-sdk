export const VERSION = '1.3.5';

export const SIM_STATUS_URL =
  'http://127.0.0.1:32034/get_sim_status?object=simStatus';

export const DATAVALIDEVENTNAME = 'Local\\IRSDKDataValidEvent';
export const MEMMAPFILE = 'Local\\IRSDKMemMapFileName';
export const MEMMAPFILESIZE = 1164 * 1024;
export const BROADCASTMSGNAME = 'IRSDK_BROADCASTMSG';

export const VAR_TYPE_MAP = ['c', '?', 'i', 'I', 'f', 'd'];

export const YAML_TRANSLATER: { [key: number]: number } = {
  129: 0x20,
  141: 0x20,
  143: 0x20,
  144: 0x20,
  157: 0x20,
};

// Status Fields
export const STATUS_FIELD = {
  STATUS_CONNECTED: 1,
} as const;

// Engine Warnings
export const ENGINE_WARNINGS = {
  WATER_TEMP_WARNING: 0x01,
  FUEL_PRESSURE_WARNING: 0x02,
  OIL_PRESSURE_WARNING: 0x04,
  ENGINE_STALLED: 0x08,
  PIT_SPEED_LIMITER: 0x10,
  REV_LIMITER_ACTIVE: 0x20,
  OIL_TEMP_WARNING: 0x40,
} as const;

// Flags
export const FLAGS = {
  // global flags
  CHECKERED: 0x0001,
  WHITE: 0x0002,
  GREEN: 0x0004,
  YELLOW: 0x0008,
  RED: 0x0010,
  BLUE: 0x0020,
  DEBRIS: 0x0040,
  CROSSED: 0x0080,
  YELLOW_WAVING: 0x0100,
  ONE_LAP_TO_GREEN: 0x0200,
  GREEN_HELD: 0x0400,
  TEN_TO_GO: 0x0800,
  FIVE_TO_GO: 0x1000,
  RANDOM_WAVING: 0x2000,
  CAUTION: 0x4000,
  CAUTION_WAVING: 0x8000,
  // drivers black flags
  BLACK: 0x010000,
  DISQUALIFY: 0x020000,
  SERVICIBLE: 0x040000, // car is allowed service (not a flag)
  FURLED: 0x080000,
  REPAIR: 0x100000,
  // start lights
  START_HIDDEN: 0x10000000,
  START_READY: 0x20000000,
  START_SET: 0x40000000,
  START_GO: 0x80000000,
} as const;

// Track Location
export const TRK_LOC = {
  NOT_IN_WORLD: -1,
  OFF_TRACK: 0,
  IN_PIT_STALL: 1,
  APROACHING_PITS: 2,
  ON_TRACK: 3,
} as const;

// Track Surface
export const TRK_SURF = {
  NOT_IN_WORLD: -1,
  UNDEFINED: 0,
  ASPHALT_1: 1,
  ASPHALT_2: 2,
  ASPHALT_3: 3,
  ASPHALT_4: 4,
  CONCRETE_1: 5,
  CONCRETE_2: 6,
  RACING_DIRT_1: 7,
  RACING_DIRT_2: 8,
  PAINT_1: 9,
  PAINT_2: 10,
  RUMBLE_1: 11,
  RUMBLE_2: 12,
  RUMBLE_3: 13,
  RUMBLE_4: 14,
  GRASS_1: 15,
  GRASS_2: 16,
  GRASS_3: 17,
  GRASS_4: 18,
  DIRT_1: 19,
  DIRT_2: 20,
  DIRT_3: 21,
  DIRT_4: 22,
  SAND: 23,
  GRAVEL_1: 24,
  GRAVEL_2: 25,
  GRASSCRETE: 26,
  ASTROTURF: 27,
} as const;

// Session State
export const SESSION_STATE = {
  INVALID: 0,
  GET_IN_CAR: 1,
  WARMUP: 2,
  PARADE_LAPS: 3,
  RACING: 4,
  CHECKERED: 5,
  COOL_DOWN: 6,
} as const;

// Camera State
export const CAMERA_STATE = {
  IS_SESSION_SCREEN: 0x0001, // the camera tool can only be activated if viewing the session screen (out of car)
  IS_SCENIC_ACTIVE: 0x0002, // the scenic camera is active (no focus car)
  // these can be changed with a broadcast message
  CAM_TOOL_ACTIVE: 0x0004,
  UI_HIDDEN: 0x0008,
  USE_AUTO_SHOT_SELECTION: 0x0010,
  USE_TEMPORARY_EDITS: 0x0020,
  USE_KEY_ACCELERATION: 0x0040,
  USE_KEY10X_ACCELERATION: 0x0080,
  USE_MOUSE_AIM_MODE: 0x0100,
} as const;

// Broadcast Message Types
export const BROADCAST_MSG = {
  CAM_SWITCH_POS: 0, // car position, group, camera
  CAM_SWITCH_NUM: 1, // driver #, group, camera
  CAM_SET_STATE: 2, // CAMERA_STATE, unused, unused
  REPLAY_SET_PLAY_SPEED: 3, // speed, slowMotion, unused
  REPLAY_SET_PLAY_POSITION: 4, // RPY_POS_MODE, Frame Number (high, low)
  REPLAY_SEARCH: 5, // RPY_SRCH_MODE, unused, unused
  REPLAY_SET_STATE: 6, // RPY_STATE_MODE, unused, unused
  RELOAD_TEXTURES: 7, // RELOAD_TEXTURES_MODE, carIdx, unused
  CHAT_COMMAND: 8, // CHAT_COMMAND_MODE, subCommand, unused
  PIT_COMMAND: 9, // PIT_COMMAND_MODE, parameter
  TELEM_COMMAND: 10, // irsdk_TelemCommandMode, unused, unused
  FFB_COMMAND: 11, // irsdk_FFBCommandMode, value (float, high, low)
  REPLAY_SEARCH_SESSION_TIME: 12, // sessionNum, sessionTimeMS (high, low)
  VIDEO_CAPTURE: 13, // irsdk_VideoCaptureMode, unused, unused
} as const;

// Chat Command Mode
export const CHAT_COMMAND_MODE = {
  MACRO: 0, // pass in a number from 1-15 representing the chat macro to launch
  BEGIN_CHAT: 1, // Open up a new chat window
  REPLY: 2, // Reply to last private chat
  CANCEL: 3, // Close chat window
} as const;

// Pit Command Mode (only works when the driver is in the car)
export const PIT_COMMAND_MODE = {
  CLEAR: 0, // Clear all pit checkboxes
  WS: 1, // Clean the winshield, using one tear off
  FUEL: 2, // Add fuel, optionally specify the amount to add in liters or pass '0' to use existing amount
  LF: 3, // Change the left front tire, optionally specifying the pressure in KPa or pass '0' to use existing pressure
  RF: 4, // right front
  LR: 5, // left rear
  RR: 6, // right rear
  CLEAR_TIRES: 7, // Clear tire pit checkboxes
  FR: 8, // Request a fast repair
  CLEAR_WS: 9, // Uncheck Clean the winshield checkbox
  CLEAR_FR: 10, // Uncheck request a fast repair
  CLEAR_FUEL: 11, // Uncheck add fuel
} as const;

// Telemetry Command Mode (can be called anytime, but telemetry only records when driver is in car)
export const TELEM_COMMAND_MODE = {
  STOP: 0, // Turn telemetry recording off
  START: 1, // Turn telemetry recording on
  RESTART: 2, // Write current file to disk and start a new one
} as const;

// Replay State Mode
export const RPY_STATE_MODE = {
  ERASE_TAPE: 0, // clear any data in the replay tape
} as const;

// Reload Textures Mode
export const RELOAD_TEXTURES_MODE = {
  ALL: 0, // reload all textures
  CAR_IDX: 1, // reload only textures for the specific carIdx
} as const;

// Replay Search Mode
export const RPY_SRCH_MODE = {
  TO_START: 0,
  TO_END: 1,
  PREV_SESSION: 2,
  NEXT_SESSION: 3,
  PREV_LAP: 4,
  NEXT_LAP: 5,
  PREV_FRAME: 6,
  NEXT_FRAME: 7,
  PREV_INCIDENT: 8,
  NEXT_INCIDENT: 9,
} as const;

// Replay Position Mode
export const RPY_POS_MODE = {
  BEGIN: 0,
  CURRENT: 1,
  END: 2,
} as const;

// Camera Switch Mode
export const CS_MODE = {
  AT_INCIDENT: -3,
  AT_LEADER: -2,
  AT_EXCITING: -1,
} as const;

// Pit Service Flags
export const PIT_SV_FLAGS = {
  LF_TIRE_CHANGE: 0x01,
  RF_TIRE_CHANGE: 0x02,
  LR_TIRE_CHANGE: 0x04,
  RR_TIRE_CHANGE: 0x08,
  FUEL_FILL: 0x10,
  WINDSHIELD_TEAROFF: 0x20,
  FAST_REPAIR: 0x40,
} as const;

// Pit Service Status
export const PIT_SV_STATUS = {
  // status
  NONE: 0,
  IN_PROGRESS: 1,
  COMPLETE: 2,
  // errors
  TOO_FAR_LEFT: 100,
  TOO_FAR_RIGHT: 101,
  TOO_FAR_FORWARD: 102,
  TOO_FAR_BACK: 103,
  BAD_ANGLE: 104,
  CANT_FIX_THAT: 105,
} as const;

// Pace Mode
export const PACE_MODE = {
  SINGLE_FILE_START: 0,
  DOUBLE_FILE_START: 1,
  SINGLE_FILE_RESTART: 2,
  DOUBLE_FILE_RESTART: 3,
  NOT_PACING: 4,
} as const;

// Pace Flags
export const PACE_FLAGS = {
  END_OF_LINE: 0x0001,
  FREE_PASS: 0x0002,
  WAVED_AROUND: 0x0004,
} as const;

// Car Left Right
export const CAR_LEFT_RIGHT = {
  OFF: 0,
  CLEAR: 1, // no cars around us.
  CAR_LEFT: 2, // there is a car to our left.
  CAR_RIGHT: 3, // there is a car to our right.
  CAR_LEFT_RIGHT: 4, // there are cars on each side.
  TWO_CARS_LEFT: 5, // there are two cars to our left.
  TWO_CARS_RIGHT: 6, // there are two cars to our right.
} as const;

// FFB Command Mode (can be called anytime)
export const FFB_COMMAND_MODE = {
  FFB_COMMAND_MAX_FORCE: 0, // Set the maximum force when mapping steering torque force to direct input units (float in Nm)
} as const;

// Video Capture Mode
export const VIDEO_CAPTURE_MODE = {
  TRIGGER_SCREEN_SHOT: 0, // save a screenshot to disk
  START_VIDEO_CAPTURE: 1, // start capturing video
  END_VIDEO_CAPTURE: 2, // stop capturing video
  TOGGLE_VIDEO_CAPTURE: 3, // toggle video capture on/off
  SHOW_VIDEO_TIMER: 4, // show video timer in upper left corner of display
  HIDE_VIDEO_TIMER: 5, // hide video timer
} as const;

// Track Wetness
export const TRACK_WETNESS = {
  UNKNOWN: 0,
  DRY: 1,
  MOSTLY_DRY: 2,
  VERY_LIGHTLY_WET: 3,
  LIGHTLY_WET: 4,
  MODERATELY_WET: 5,
  VERY_WET: 6,
  EXTREMELY_WET: 7,
} as const;
