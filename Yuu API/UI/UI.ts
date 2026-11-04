import { arrayUtils } from "../ArrayUtils";
import { Color } from "../Basic Types/Color";
import { Vector2 } from "../Basic Types/Vector2";
import { uiData } from "./UI_Data";


// Are UIs destroyed automatically when the VM is closed? do they need to be, or is it different than images?
export class UI {
  public uiID: number;
  public width: number;
  public height: number;
  public elements: UIElement[] = [];

  /**
   * Creates a UI that can be applied as a texture to a mesh
   * @param width in pixels
   * @param height in pixels
   */
  constructor(width: number, height: number) {
    this.uiID = Godot.ui.create(uiData.parentID, Math.max(2, width), Math.max(2, height)) ?? -1;

    this.width = width;
    this.height = height;
  }

  delete() {
    if (this.uiID !== -1) {
      // Godot.ui.delete(this.uiID);

      this.uiID = -1;
    }
  }

  /**
   * Goes through elements and deletes them from the UI
   */
  deleteAllElements() {
    this.elements.forEach((element) => {
      element.delete();
    });

    this.elements.length = 0;
  }

  deleteElement(element: UIElement) {
    if (this.elements.includes(element)) {
      element.delete();

      arrayUtils.removeItemFromArray(this.elements, element);
    }
  }

  /**
   * Creates a UI element that can be drawn on
   * @returns a UIElement
   */
  createElement(): UIElement {
    const element = new UIElement(this);

    this.elements.push(element);

    return element;
  }
}


class UIElement {
  ui: UI;
  // elementID: number;
  elementID: number = -1;
  private useAntiAliasing: boolean = false;

  constructor(ui: UI) {
    this.ui = ui;

    // this.elementID = Godot.ui.createCanvasItem(ui.uiID) ?? -1;
  }

  delete() {
    // Godot.ui.deleteCanvasItem(this.uiID, this.elementID);
  }

  clear() {
    // Godot.ui.clearCanvasItem(this.uiID, this.elementID);
  }

  draw = {
    /**
     * Defines how future elements are drawn
     * Note: does not change already drawn elements
     * @param isUsed whether or not to use AntiAliasing
     */
    setAntiAliasingMode: (isUsed: boolean) => {
      this.useAntiAliasing = isUsed;
    },

    rect: (pos: Vector2, scaleInPixels: Vector2, color: Color) => {
      Godot.ui.draw.rect(this.ui.uiID, pos.x, pos.y, scaleInPixels.x, scaleInPixels.y, color.r, color.g, color.b, color.a, this.useAntiAliasing, this.elementID);
    },
  }
}