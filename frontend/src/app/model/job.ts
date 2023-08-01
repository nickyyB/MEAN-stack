import {Door} from "./property";

export interface Job {
  _id:string;
  property:{
    id:string;
    sketch:string;
    squaresMap:[ObjectSquares];
  };
  status:string;
  agencyUsername:string;
  clientUsername:string;
  dateFrom:Date;
  dateTo:Date;
  price:number;
  review: {
    comment:string;
    rate:number;
  }
}


export interface ObjectSquares {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  status:string;
  doors: [Door]
}
