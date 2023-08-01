import {Component, OnInit} from '@angular/core';
import {PropertyService} from "../../service/properties/property.service";
import {Router} from "@angular/router";
import {User} from "../../model/user";
import {ObjectModel} from "../../model/property";
import {MatDialog} from "@angular/material/dialog";
import {PopupComponent} from "../popup/popup.component";

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {

  user:User;

  objects:ObjectModel[];

  displayedColumns: string[] = ['type', 'address', 'numberOfRooms', 'squareFootage', 'actions'];

  image:string;

  constructor(private propertyService: PropertyService, private router:Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user === undefined || user === null) {
      this.router.navigate(['/']);
    }

    this.user = user;

    this.propertyService.getObjects(this.user.username, this.user.token).subscribe({next:(objects:ObjectModel[])=>{
      console.log(objects);
      this.objects=objects;
      }, error:(err)=>{
      console.log(err);
      }})
  }

  viewSketch(id:string) {
    console.log(id);
    this.image = this.objects.find(element => element._id == id).sketch;

    const dialogRef = this.dialog.open(PopupComponent, {
      width: '400px',
      data: this.image
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }

  deleteObject(id:string) {
    this.propertyService.deleteObject(id, this.user.token).subscribe({next:(res:any)=>{
        this.ngOnInit();
      }, error:(err)=>{
        console.log(err);
      }})
  }

}
