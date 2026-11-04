import { Quaternion } from "../Basic Types/Quaternion";
import { Vector3 } from "../Basic Types/Vector3";
import { Entity } from "../Entity/Entity";
import { registerStart } from "../RegisterStart";
import { uiData } from "./UI_Data";


registerStart(start);
function start() {
  const parentForUI = new Entity(new Vector3(0, -100, 0), Quaternion.one, Vector3.one, undefined, 'Empty');

  uiData.parentID = parentForUI.nodeID ?? -1;
}