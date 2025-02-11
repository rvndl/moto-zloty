import { Point } from "./point";

interface IconOptions {
  iconUrl?: string | null;
  iconRetinaUrl?: string | null;
  iconSize?: Point | [number, number] | null;
  iconAnchor?: Point | [number, number] | null;
  popupAnchor?: [number, number];
  tooltipAnchor?: [number, number];
  shadowUrl?: string | null;
  shadowRetinaUrl?: string | null;
  shadowSize?: Point | [number, number] | null;
  shadowAnchor?: Point | [number, number] | null;
  className?: string;
  crossOrigin?: boolean | string;
}

export class Icon {
  options: IconOptions;

  constructor(options: Partial<IconOptions> = {}) {
    this.options = Object.assign(
      {
        popupAnchor: [0, 0],
        tooltipAnchor: [0, 0],
        className: "",
        crossOrigin: false,
      },
      options
    );
  }

  createIcon(oldIcon?: HTMLElement | null): HTMLElement | null {
    return this._createIcon("icon", oldIcon);
  }

  createShadow(oldIcon?: HTMLElement | null): HTMLElement | null {
    return this._createIcon("shadow", oldIcon);
  }

  private _createIcon(
    name: string,
    oldIcon?: HTMLElement | null
  ): HTMLElement | null {
    const src = this._getIconUrl(name);
    if (!src) {
      if (name === "icon") {
        throw new Error("iconUrl not set in Icon options (see the docs).");
      }
      return null;
    }

    const img = this._createImg(
      src,
      oldIcon instanceof HTMLImageElement ? oldIcon : null
    );
    this._setIconStyles(img, name);

    if (this.options.crossOrigin || this.options.crossOrigin === "") {
      img.crossOrigin =
        this.options.crossOrigin === true ? "" : this.options.crossOrigin;
    }

    return img;
  }

  private _setIconStyles(img: HTMLImageElement, name: string): void {
    const sizeOption = this.options[(name + "Size") as keyof IconOptions];
    const size =
      sizeOption instanceof Point
        ? sizeOption
        : Array.isArray(sizeOption)
        ? new Point(sizeOption[0], sizeOption[1])
        : null;
    const anchorOption =
      this.options[
        name === "shadow" ? "shadowAnchor" : ("iconAnchor" as keyof IconOptions)
      ];
    const anchor =
      anchorOption instanceof Point
        ? anchorOption
        : Array.isArray(anchorOption)
        ? new Point(anchorOption[0], anchorOption[1])
        : size
        ? size.divideBy(2)
        : null;

    img.className = `leaflet-marker-${name} ${this.options.className || ""}`;

    if (anchor) {
      img.style.marginLeft = `${-anchor.x}px`;
      img.style.marginTop = `${-anchor.y}px`;
    }

    if (size) {
      img.style.width = `${size.x}px`;
      img.style.height = `${size.y}px`;
    }
  }

  private _createImg(
    src: string,
    el?: HTMLImageElement | null
  ): HTMLImageElement {
    el = el || document.createElement("img");
    el.src = src;
    return el;
  }

  private _getIconUrl(name: string): string {
    return (this.options[(name + "RetinaUrl") as keyof IconOptions] ||
      this.options[(name + "Url") as keyof IconOptions]) as string;
  }
}
