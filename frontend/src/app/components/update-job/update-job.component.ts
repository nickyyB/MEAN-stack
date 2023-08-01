import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from "../../model/user";
import {PropertyService} from "../../service/properties/property.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Job, ObjectSquares} from "../../model/job";
import {Square} from "../../model/property";

@Component({
  selector: 'app-update-job',
  templateUrl: './update-job.component.html',
  styleUrls: ['./update-job.component.css']
})
export class UpdateJobComponent implements OnInit {

  user:User;
  job:Job;

  errorMessage:string;

  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('canvasContainer') canvasContainerRef: ElementRef;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;

  activeSquare: ObjectSquares | null = null;
  activeSquareIndex: Number | null = null;
  squaresMap: Map<Number, ObjectSquares> = null;

  constructor(private route: ActivatedRoute, private propertyService: PropertyService, private router:Router) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user === undefined || user === null) {
      this.router.navigate(['/']);
    }

    this.user = user;

    const id = this.route.snapshot.paramMap.get('id');

    this.propertyService.getJob(id, this.user.token).subscribe({next: (job: Job) => {
        this.job = job;
        const image = new Image();
        image.src = this.job.property.sketch;

        image.onload = () => {
          this.canvas.width = image.width;
          this.canvas.height = image.height;
          this.context.drawImage(image, 0, 0);
        };

        this.squaresMap = new Map<Number, ObjectSquares>();
        this.populateSquaresMap();

      }, error: (err) => {
        console.log(err);
      }
    });

    const canvasContainer: HTMLDivElement = this.canvasContainerRef.nativeElement;
    this.canvasWidth = canvasContainer.offsetWidth;
    this.canvasHeight = canvasContainer.offsetHeight;

  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.redrawCanvas();
  }

  populateSquaresMap() {
    let indexer = 0;
    this.job.property.squaresMap.forEach(element=>{
      this.squaresMap.set(indexer++, element);
    });
    console.log(this.squaresMap);
  }


  onCanvasMouseMove(event: MouseEvent) {

  }

  onCanvasMouseDown(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    this.activeSquare = this.getSquareAtPosition(offsetX, offsetY);
  }

  onCanvasMouseUp(event: MouseEvent) {

  }

  onSubmit() {
    const canvas = this.canvasRef.nativeElement;
    this.job.property.sketch = canvas.toDataURL();

    this.propertyService.updateJobProgress(this.job, this.user.token).subscribe({next:(res:any)=>{
        console.log('success');
        this.router.navigate(['/jobs']);
      }, error:(err)=>{
        console.log(err);
      }})
  }

  redrawCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.squaresMap.forEach(square => {
      if(square.status === 'completed') {
        this.context.fillStyle = 'rgba(103,218,32,0.8)';
      } else if (square.status === 'in progress') {
        this.context.fillStyle = 'rgba(218,32,79,0.8)';
      } else {
        this.context.fillStyle = 'rgb(218, 165, 32, 0.8)';
      }
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

  getSquareAtPosition(x: number, y: number): ObjectSquares | null {
    for (let [key, value] of this.squaresMap) {
      let square = this.squaresMap.get(key);
      if (x >= square.x && x <= square.x + square.width && y >= square.y && y <= square.y + square.height) {
        this.activeSquareIndex = key;
        return square;
      }
    }
    return null;
  }

  paintInRed() {
    if (!this.activeSquare) return;
    this.squaresMap.get(this.activeSquareIndex).status = "in progress";
    this.redrawCanvas();
  }

  paintInGreen() {
    if (!this.activeSquare) return;
    this.squaresMap.get(this.activeSquareIndex).status = "completed";
    this.redrawCanvas();
  }


  protected readonly onsubmit = onsubmit;
}
