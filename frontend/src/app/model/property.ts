export interface ObjectModel {
  type: string;
  address: string;
  numberOfRooms: number;
  squareFootage: number;
  sketch: string;
  squaresMap: Map<Number, Square>;
  _id: string;
  username: string;
}

export class Square {
  x: number = 0;
  y: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;
  doors: Map<Number, Door> = new Map<Number, Door>();

  constructor(public width: number, public height: number) {
  }
}

export class Door {
  x: number;
  y: number;
  offsetX: number = 0;
  offsetY: number = 0;
  width: number = 15;
  height: number = 15;
  symbol: string;

  constructor(x: number, y: number, symbol:string) {
    this.x = x;
    this.y = y;
    this.symbol=symbol;
  }
}
