import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Door, ObjectModel, Square} from "../../model/property";
import {PropertyService} from "../../service/properties/property.service";
import {MatTabGroup} from "@angular/material/tabs";
import {Router} from "@angular/router";
import {User} from "../../model/user";

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  index: number = 0;

  step1: boolean = false;
  step2: boolean = false;

  user:User;

  object: ObjectModel = {
    type: '',
    address: '',
    numberOfRooms: 0,
    squareFootage: 0,
    squaresMap: new Map<Number, Square>(),
    sketch: '',
    username: '',
    _id: ''
  };

  activeSquare: Square | null = null;
  activeSquareIndex: Number | null = null;
  squareWidth: number = 100;
  squareHeight: number = 100;
  squaresMap: Map<Number, Square> = null;
  squareIndexer: number = 0;
  squareCounter: number = 0;

  activeDoor: Door | null = null;
  activeDoorIndex: Number | null = null;
  doorIndex: number = 0;

  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('canvasContainer') canvasContainerRef: ElementRef;
  @ViewChild('canvas2') canvasRef2: ElementRef;
  @ViewChild('canvasContainer2') canvasContainerRef2: ElementRef;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  drawing = false;

  selectedFile: File | null = null;

  errorMessage: string;

  constructor(private propertyService: PropertyService, private router:Router) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user === undefined || user === null) {
      this.router.navigate(['/']);
    }

    this.user = user;

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsText(this.selectedFile);
      let data;
      reader.onload = () => {
        data = reader.result;

        this.propertyService.addObject(JSON.parse(data), this.user.username, this.user.token).subscribe({next:(res:any)=>{
            this.router.navigate(['/properties']);
          }, error:(err)=>{
            console.log(err);
          }})
      }
    }
  }

  onTabChange(event) {
    this.index = event.index;
    if (event.index === 0) {
      this.ngOnInit();
    }
    if (event.index === 1) {
      const canvasContainer: HTMLDivElement = this.canvasContainerRef.nativeElement;
      this.canvasWidth = canvasContainer.offsetWidth;
      this.canvasHeight = canvasContainer.offsetHeight;
      this.canvas = this.canvasRef.nativeElement;
      this.context = this.canvas.getContext('2d');
      this.squaresMap = new Map<Number, Square>();
    }
    if (event.index === 2) {
      console.log(this.squaresMap);
      const canvasContainer: HTMLDivElement = this.canvasContainerRef2.nativeElement;
      this.canvas = this.canvasRef2.nativeElement;
      this.context = this.canvas.getContext('2d');
      this.canvasWidth = canvasContainer.offsetWidth;
      this.canvasHeight = canvasContainer.offsetHeight;

      const image = new Image();
      image.src = this.object.sketch;
      image.onload = () => {
        this.context.drawImage(image, 0, 0);
      };

    }
  }

  submitBasicInfo() {
    if (this.object.type !== 'house' && this.object.type !== 'condo') {
      this.errorMessage = "Object has to be type House or Condo";
      return;
    }
    if (this.object.address === '') {
      this.errorMessage = "Address is required";
      return;
    }
    if (Number(this.object.numberOfRooms) > 3) {
      this.errorMessage = "Number or rooms can't be bigger than 3";
      return;
    }
    if (!(Number(this.object.numberOfRooms) > 0) || !(Number(this.object.squareFootage) > 0)) {
      this.errorMessage = "Number or rooms and square footage has to be bigger than 0";
      return;
    }
    this.step1 = true;
    this.index = 1;
  }

  submitSketch() {
    console.log(this.object);
    const canvas = this.canvasRef.nativeElement;
    this.object.sketch = canvas.toDataURL();
    this.object.squaresMap = new Map<Number, Square>(this.squaresMap);
    this.redrawCanvas();

    this.step2 = true;
    this.index = 2;
  }

  submitObject() {
    const canvas = this.canvasRef2.nativeElement;
    this.object.sketch = canvas.toDataURL();

    this.propertyService.addObject(this.object, this.user.username, this.user.token).subscribe({next:(res:any)=>{
      this.router.navigate(['/properties']);
      }, error:(err)=>{
      console.log(err);
      }})
  }

  resetError() {
    this.errorMessage = null;
  }

  addSquare() {
    if (this.squareCounter >= this.object.numberOfRooms) {
      this.errorMessage = "Cant put more rooms!";
      return;
    }
    this.errorMessage = null;
    const square = new Square(this.squareWidth, this.squareHeight);
    this.squaresMap.set(this.squareIndexer++, square);
    this.squareCounter++;
    this.redrawCanvas();
  }

  addDoor() {
    if(this.activeSquare === null || this.activeSquare === undefined) {
      this.errorMessage = "Please select square for which you want to add doors";
      return;
    }
    this.errorMessage = null;
    const door = new Door(this.activeSquare.x, this.activeSquare.y, 'D');
    this.object.squaresMap.get(this.activeSquareIndex).doors.set(this.doorIndex++, door);
    this.redrawCanvas();
  }

  onCanvasMouseDown(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    this.activeSquare = this.getSquareAtPosition(offsetX, offsetY);
    this.activeDoor = this.getDoorAtPosition(offsetX, offsetY);

    if (this.activeDoor) {
      this.drawing = true;
      this.activeDoor.offsetX = offsetX - this.activeDoor.x;
      this.activeDoor.offsetY = offsetY - this.activeDoor.y;
    }
    else if (this.activeSquare) {
      this.drawing = true;
      this.activeSquare.offsetX = offsetX - this.activeSquare.x;
      this.activeSquare.offsetY = offsetY - this.activeSquare.y;
    }
  }

  onCanvasMouseMove(event: MouseEvent) {
    if (!this.drawing || !this.activeSquare) return;

    const rect = this.canvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    if (this.activeDoor) {
      const potentialX = offsetX - this.activeDoor.offsetX;
      const potentialY = offsetY - this.activeDoor.offsetY;
      this.activeDoor.x = potentialX;
      this.activeDoor.y = potentialY;
    }
    else if (this.index==1) {
      const potentialX = offsetX - this.activeSquare.offsetX;
      const potentialY = offsetY - this.activeSquare.offsetY;
      this.activeSquare.x = potentialX;
      this.activeSquare.y = potentialY;
    }

    this.redrawCanvas();
  }

  onCanvasMouseUp(event: MouseEvent) {

    if(this.activeSquare) {
      const overlappingSquare = this.checkOverlap(this.activeSquare);

      if (overlappingSquare) {
        this.squareCounter--;
        this.errorMessage = "Object rooms can't overlap";
        this.squaresMap.delete(this.activeSquareIndex);
      }
    }

    this.drawing = false;
    this.activeSquare = null;
    this.activeSquareIndex = null;
  }

  onCanvasMouseUp2(event: MouseEvent) {

    if (this.activeDoor) {
      const doorOutOfSquare = this.checkDoorBoundaries();
      if (!doorOutOfSquare) {
        this.doorIndex--;
        this.errorMessage = "Doors has to be on border of squares";
        this.squaresMap.get(this.activeSquareIndex).doors.delete(this.activeDoorIndex);
        this.redrawCanvas();
      }
    }
    this.drawing = false;
    this.activeDoorIndex=null;
  }

  redrawCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.squaresMap.forEach(square => {
      this.context.fillStyle = 'rgb(218, 165, 32, 0.8)';
      this.context.fillRect(square.x, square.y, square.width, square.height);
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 2;
      this.context.strokeRect(square.x, square.y, square.width, square.height);

      square.doors.forEach(door => {
        this.context.fillStyle = 'rgba(255,234,0,0.8)';
        this.context.fillRect(door.x, door.y, door.width, door.height);
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 2;
        this.context.strokeRect(door.x, door.y, door.width, door.height);
        this.context.fillStyle = 'red';
        this.context.font = '16px Arial';
        this.context.fillText(door.symbol, door.x+(door.width/5), door.y+(door.height));
      });
    });
  }

  getSquareAtPosition(x: number, y: number): Square | null {
    for (let [key, value] of this.squaresMap) {
      let square = this.squaresMap.get(key);
      if (x >= square.x && x <= square.x + square.width && y >= square.y && y <= square.y + square.height) {
        this.activeSquareIndex = key;
        return square;
      }
    }
    return null;
  }

  getDoorAtPosition(x: number, y: number): Door | null {
    for (let [key, value] of this.squaresMap) {
      let square = this.squaresMap.get(key);
      for (let [key, value] of square.doors) {
        const door = square.doors.get(key);
        if (x >= door.x && x <= door.x + door.width && y >= door.y && y <= door.y + door.height) {
          this.activeDoorIndex = key;
          return door;
        }
      }
    }
    return null;
  }

  checkOverlap(activeSquare: Square) {
    for (const square of this.squaresMap.values()) {
      if (square !== activeSquare && this.isOverlapping(activeSquare, square)) {
        activeSquare.x = square.x;
        activeSquare.y = square.y;
        this.redrawCanvas();
        return true;
      }
    }
    return false;
  }

  isOverlapping(square1: Square, square2: Square): boolean {
    return !(
      square2.x > square1.x + square1.width ||
      square2.x + square2.width < square1.x ||
      square2.y > square1.y + square1.height ||
      square2.y + square2.height < square1.y
    );
  }

  checkDoorBoundaries(): boolean {
    const door = this.activeDoor;
    const square = this.activeSquare;

    if (square===undefined || square === null) {
      return false;
    }

    return (
      (door.x >= square.x && door.x+door.width <= square.x+square.width && door.y === square.y) ||
      (door.y >= square.y && door.y+door.height <= square.y + square.height && door.x === square.x) ||
      (door.x + door.width === square.x + square.width && door.y >= square.y && door.y + door.height <= square.y + square.height) || // Right border
      (door.y + door.height === square.y + square.height && door.x >= square.x && door.x + door.width <= square.x + square.width) // Bottom border
    );
  }

}
