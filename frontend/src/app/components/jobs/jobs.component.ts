import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {PropertyService} from "../../service/properties/property.service";
import {Router} from "@angular/router";
import {Job} from "../../model/job";
import {DatePipe} from "@angular/common";
import {PopupComponent} from "../popup/popup.component";
import {MatDialog} from "@angular/material/dialog";
import {PopupFormComponent} from "../popup-form/popup-form.component";

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
  providers: [DatePipe]
})
export class JobsComponent implements OnInit {

  user:User;

  jobs:Job[];
  filteredJobs:Job[];


  displayedColumns: string[] = ['status', 'dateFrom', 'dateTo', 'agency', 'actions', 'price'];
  selectedStatus:string;

  constructor(private propertyService: PropertyService, private router:Router, public datePipe: DatePipe, private dialog: MatDialog) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user === undefined || user === null) {
      this.router.navigate(['/']);
    }

    this.user = user;

    this.propertyService.getMyJobs(this.user.username, this.user.token).subscribe({next:(jobs:Job[])=>{
      console.log(jobs);
      if(this.user.type==='agency') {
        this.jobs= jobs.filter( (job) => job.status!='rejected');
        this.filteredJobs= jobs.filter( (job) => job.status!='rejected');;
      } else {
        this.jobs=jobs;
        this.filteredJobs=jobs;
      }

      }, error:(err)=>{
        console.log(err);
      }})
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'waiting':
        return 'status-yellow';
      case 'in progress':
        return 'status-green';
      case 'completed':
        return 'status-blue';
      case 'rejected':
        return 'status-red';
      case 'paid':
        return 'status-purple';
      default:
        return '';
    }
  }

  filterJobs() {
    if (this.selectedStatus === 'all') {
      this.filteredJobs = this.jobs;
    }
    else {
      this.filteredJobs = this.jobs.filter(elem => elem.status===this.selectedStatus);
    }
  }

  viewSketch(image:string) {

    const dialogRef = this.dialog.open(PopupComponent, {
      width: '500px',
      data: image
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }

  acceptJobAgency(id:string) {

    const data = {
      id:id,
      user:this.user,
      action: "acceptJob"
    }

    const dialogRef = this.dialog.open(PopupFormComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });

  }

  rejectJob(id:string) {
    this.propertyService.updateJob(id, "rejected", this.user.token, 0).subscribe({next:(res:Job)=>{
        this.ngOnInit();
      }, error:(err)=>{
        console.log(err);
      }})
  }

  acceptJobClient(id:string) {
    this.propertyService.updateJob(id, "in progress", this.user.token, 0).subscribe({next:(res:Job)=>{
        this.ngOnInit();
      }, error:(err)=>{
        console.log(err);
      }})
  }

  declineJobClient(id:string) {
    this.propertyService.deleteJob(id, this.user.token).subscribe({next:(res:Job)=>{
        this.ngOnInit();
      }, error:(err)=>{
        console.log(err);
      }})
  }

  payAgency(id:string) {
    this.propertyService.updateJob(id, "paid", this.user.token, 0).subscribe({next:(res:Job)=>{
        this.ngOnInit();
      }, error:(err)=>{
        console.log(err);
      }})
  }

  postComment(id:string) {
    const data = {
      id:id,
      user:this.user,
      action: "reviewJob"
    }

    const dialogRef = this.dialog.open(PopupFormComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  editProgress(id:string) {
    this.router.navigate([`/jobs/${id}`]);
  }


  protected readonly String = String;
}

