import { Async } from "./Async";
import { Color } from "./Basic Types/Color";
import { Quaternion } from "./Basic Types/Quaternion";
import { Vector3 } from "./Basic Types/Vector3";
import { Crypto } from "./Crypto";
import { Entity } from "./Entity/Entity";
import { Files } from "./Files";
import { registerStart } from "./RegisterStart";


// needs to be changed to set get long term
// need warn/error/info/etc


const orgLog = console.log;

let isInitialized = false;
let startedTime = Date.now();
let isMainVM = false;
let consoleLogFileName = Crypto.generateRandomV4UUID();
let logName = 'MainVM';

registerStart(start, 0);
function start() {
  if (!isInitialized) {
    isInitialized = true;

    const vmPath = Godot.files.folder.getVMPath();

    if ('user://worlds/defaultFiles' === vmPath) {
      Files.folder.deleteContents('user://cache', 'console');

      isMainVM = true;

      Async.setInterval(() => { updateText(); }, 3_000);
    }
    else {
      logName = vmPath.substring(28);
    }

    console.log = (...args: any[]) => {
      orgLog(...args);

      let stringArgs = '';

      args.forEach((arg) => {
        stringArgs += arg + ' ';
      });

      stringArgs = stringArgs.substring(0, stringArgs.length - 1);

      history.push({ timestamp: Date.now(), args: stringArgs });

      if (history.length > 10_000) {
        history.shift();
      }

      const logJSON: LogJSON = {
        name: logName,
        logs: [...history],
      }

      updateText();
      
      Files.text.update('user://cache', 'console', consoleLogFileName, 'json', JSON.stringify(logJSON));
    };
  }
}


export const inWorldConsole = {
  visible,
  toggle,
  getHistory,
}


type LogEntry = {
  timestamp: number,
  args: string,
}

type LogJSON = {
  name: string,
  logs: LogEntry[],
}

const history: LogEntry[] = [];


let entity: Entity | undefined;
let isVisibleStored = false;

/**
 * Toggle the console visibility on or off
 * @param isVisible or not
 * @param position to place
 * @param rotation to use
 */
function visible(isVisible: boolean, position: Vector3 = Vector3.up, rotation: Quaternion = Quaternion.one) {
  isVisibleStored = isVisible;

  if (entity === undefined) {
    entity = new Entity(position, rotation, Vector3.one, undefined, 'Static');

    entity.text.create("", 4, 0);
    entity.text.color.set(Color.black);
  }
  else {
    entity.pos = position;
    entity.rot = rotation;
  }

  entity.visible.set(isVisible);

  if (isVisible) {
    updateText();
  }
}

/**
 * Toggle the console on or off
 * @param position to place
 * @param rotation to use
 * @returns boolean true if turned on
 */
function toggle(position: Vector3 = Vector3.up, rotation: Quaternion = Quaternion.one) {
  visible(!isVisibleStored, position, rotation);

  return isVisibleStored;
}

function updateText() {
  if (entity && isVisibleStored) {
    let display = "Console:\n";

    const displayHistory: LogEntry[] = [];

    if (isMainVM) {
      const cacheConsoleFolderContents = Files.folder.getContents('user://cache', 'console', false);

      cacheConsoleFolderContents.forEach(([directoryPath, fileName, extension]) => {
        if (extension === 'json') {
          const contents = Files.text.get('user://cache', 'console', fileName, extension);

          if (contents) {
            const logJSON: LogJSON = JSON.parse(contents);

            for (let i = Math.max(0, logJSON.logs.length - 20); i < logJSON.logs.length; i++) {
              displayHistory.push({ timestamp: logJSON.logs[i].timestamp, args: logJSON.name + ': ' + logJSON.logs[i].args });
            }
          }
        }
      });

      displayHistory.sort((a, b) => (a.timestamp - b.timestamp));
    }
    else {
      displayHistory.push(...history);
    }

    const historyLength = displayHistory.length;

    for (let i = Math.max(0, historyLength - 20); i < historyLength; i++) {
      const logEntry = displayHistory[i];

      display += "\n" + ((logEntry.timestamp - startedTime) / 1_000) + ":";

      display += ' ' + logEntry.args;
    }

    entity.text.display.set(display);
  }
}


/**
 * Get the console log history
 * @returns array of JSON objects, with timestamp being since the epoch, and args being a concatenated string with " " between each
 */
function getHistory(): LogEntry[] {
  return [...history];
}
