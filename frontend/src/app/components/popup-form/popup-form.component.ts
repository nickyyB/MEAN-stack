import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Job} from "../../model/job";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PropertyService} from "../../service/properties/property.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-popup-form',
  templateUrl: './popup-form.component.html',
  styleUrls: ['./popup-form.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PopupFormComponent implements OnInit {

  @Input('rating') rating: number = 3;
  @Input('starCount') starCount: number = 5;
  @Output() ratingUpdated = new EventEmitter();
  snackBarDuration: number = 2000;
  ratingArr = [];

  sum:number;
  comment:string;
  rate:number;

  constructor(public dialogRef: MatDialogRef<PopupFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private propertyService: PropertyService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  onSubmit() {
    this.acceptJob();
  }

  acceptJob() {
    this.propertyService.updateJob(this.data.id, "accepted", this.data.user.token, this.sum).subscribe({next:(res:Job)=>{
        this.dialogRef.close();
      }, error:(err)=>{
        console.log(err);
      }})
  }

  postComment() {
    this.propertyService.reviewAgency(this.data.id, this.comment, this.rate, this.data.user.token).subscribe({next:(res:Job)=>{
        this.dialogRef.close();
      }, error:(err)=>{
        console.log(err);
      }});
  }

  onClick(rating:number) {
    this.snackBar.open('You rated ' + rating + ' / ' + this.starCount, '', {
      duration: this.snackBarDuration
    });
    this.ratingUpdated.emit(rating);
    this.rating=rating;
    return false;
  }

  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

}
