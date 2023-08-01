import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AdminService} from "../../service/admin/admin.service";
import {Worker} from "../../model/worker";

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css']
})
export class WorkerComponent implements OnInit {

  name:string;
  surname:string;
  contactPhone:string;
  email:string;
  speciality:string;
  agencyUsername:string;

  worker:Worker;

  action:string = 'create';

  constructor(private adminService: AdminService, public dialogRef: MatDialogRef<WorkerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.agencyUsername = this.data.agencyUsername;
    if (this.data.email !== undefined && this.data.email !== null) {
      this.worker = this.data.worker;
      this.action = 'update';
    }
  }

  createWorker() {
    this.adminService.createWorker(this.data.token, this.agencyUsername, this.contactPhone, this.email, this.name, this.surname, this.speciality).subscribe({
      next: (res: any) => {
        this.dialogRef.close();
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  updateWorker() {
    this.adminService.updateWorker(this.data.token, this.worker.agencyUsername, this.worker.contactPhone, this.worker.email, this.worker.name, this.worker.surname, this.worker.speciality).subscribe({
      next: (res: any) => {
        this.dialogRef.close();
      }, error: (err) => {
        console.log(err);
      }
    })
  }
}
