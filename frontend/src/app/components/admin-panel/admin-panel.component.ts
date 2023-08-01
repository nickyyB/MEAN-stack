import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../model/user";
import {Worker} from "../../model/worker"
import {AdminService} from "../../service/admin/admin.service";
import {Router} from "@angular/router";
import {MatTabGroup} from "@angular/material/tabs";
import {ResponseUser} from "../../model/response.user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Job} from "../../model/job";
import {PopupComponent} from "../popup/popup.component";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {WorkerComponent} from "../worker/worker.component";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  providers: [DatePipe]
})
export class AdminPanelComponent implements OnInit {

  passwordRegex: RegExp = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{7,12}$/;
  numbersOnlyRegex: RegExp = /^\d+$/;

  displayedColumns: string[] = ['status', 'dateFrom', 'dateTo', 'agency', 'actions', 'price'];
  displayedColumns1: string[] = ['username', 'actions'];
  displayedColumns2: string[] = ['name', 'surname', 'phone', "busy", "email", "speciality", 'actions'];

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  index: number = 0;

  admin: User;

  waitingUsers: User[] = null;
  activeUsers: User[] = null;
  jobs:Job[] = null;
  filteredJobs:Job[] = null;
  agencies: User[] = null;
  workers:Worker[] = null;

  selectedStatus:string;
  selectedAgency:string;

  form: FormGroup;
  agencyForm: FormGroup;
  private formSubmitAttempt: boolean;
  message: string;
  success: string;
  type: string = 'client';
  image: string;

  constructor(private adminService: AdminService, private router: Router, private fb: FormBuilder, public datePipe: DatePipe, private dialog: MatDialog) {
  }

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('user'));

    if (user === undefined || user === null) {
      this.router.navigate(['/']);
    }

    this.admin = user;

    this.adminService.getWaitingUsers(this.admin.token).subscribe({
      next: (users: User[]) => {
        this.waitingUsers = users;
      }, error: (err) => {
        console.log(err);
      }
    })

    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      email: ['', [Validators.required, Validators.email]],
      password1: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      password2: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      type: ['client', Validators.required],
      avatar: ['', null],
    });

    this.agencyForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      email: ['', [Validators.required, Validators.email]],
      password1: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      password2: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      name: ['', Validators.required],
      pib: ['', [Validators.required, Validators.min(10000001), Validators.max(999999999), Validators.pattern(this.numbersOnlyRegex)]],
      phone: ['', Validators.required],
      type: ['agency', Validators.required],
      description: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      number: ['', Validators.required],
      avatar: ['', null],
    });

  }

  activateUser(username: string) {

    this.adminService.approveRegistration(username, this.admin.token).subscribe({
      next: (any) => {
        if (this.index === 0) {
          this.ngOnInit();
        } else if (this.index === 1) {
          this.getUsers();
        }
      }, error: (err) => {
        console.log(err);
      }
    })

  }

  rejectRegistration(username: string) {

    this.adminService.rejectRegistration(username, this.admin.token).subscribe({
      next: (any) => {
        this.getUsers();
        this.ngOnInit();
      }, error: (err) => {
        console.log(err);
      }
    })

  }

  deactivateUser(username: string) {
    this.adminService.deactivateUser(username, this.admin.token).subscribe({
      next: (any) => {
        this.getUsers();
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  deleteUser(username: string) {
    this.adminService.deleteUser(username, this.admin.token).subscribe({
      next: (any) => {
        this.getUsers();
      }, error: (err) => {
        console.log(err);
      }
    })
  }


  onTabChange(event) {
    console.log(event);
    this.index = event.index;
    if (event.index === 0) {
      this.ngOnInit();
    }
    if (event.index === 1) {
      this.getUsers();
    }
    if (event.index === 2) {
      this.getAgencies();
    }
    if (event.index === 3) {
      this.getJobs();
    }
  }

  refreshCurrentTab() {
    const currentTabIndex = this.tabGroup.selectedIndex;
    this.tabGroup.selectedIndex = -1; // Deselect the current tab
    this.tabGroup.selectedIndex = currentTabIndex; // Reselect the current tab
  }

  getUsers() {
    this.adminService.getUsers(this.admin.token).subscribe({
      next: (users: User[]) => {
        this.activeUsers = users;
      }, error: (err) => {
        console.log(err);
      }
    });

  }

  getAgencies() {
    this.adminService.getUsers(this.admin.token).subscribe({
      next: (users: User[]) => {
        this.agencies = users.filter((user) => user.type == 'agency');
        console.log(this.agencies);
      }, error: (err) => {
        console.log(err);
      }
    });

  }

  onChangeType() {

    this.resetError();
    this.resetSuccess();

    if (this.type === 'client') {
      this.type = this.form.get('type').value;
    } else {
      this.type = this.agencyForm.get('type').value;
    }

  }

  isFieldInvalid(field: string) {

    if (this.type === 'client') {
      return (
        (!this.form.get(field).valid && this.form.get(field).touched) ||
        (this.form.get(field).untouched && this.formSubmitAttempt)
      );
    } else {
      return (
        (!this.agencyForm.get(field).valid && this.agencyForm.get(field).touched) ||
        (this.agencyForm.get(field).untouched && this.formSubmitAttempt)
      );
    }

  }

  onSubmit() {
    if (this.form.valid) {
      if (this.type != 'client') {
        return;
      }
      if (this.form.get('password1').value !== this.form.get('password2').value) {
        this.message = "Please confirm the same password twice."
      }

      const email = this.form.get('email').value;
      const username = this.form.get('username').value;
      const password = this.form.get('password1').value;
      const phone = this.form.get('phone').value;
      const firstName = this.form.get('firstName').value;
      const lastName = this.form.get('lastName').value;

      this.adminService.createClient(this.admin.token, username, password, email, firstName, lastName, phone, this.image).subscribe({
        next: (res: ResponseUser) => {
          this.success = "User created."
          this.form.reset();
        }, error: (err) => {
          this.message = "User with that username/email already exist!";
          this.form.reset();
        }
      });

    }
    this.formSubmitAttempt = true;
  }

  onSubmitAgency() {
    if (this.agencyForm.valid) {
      if (this.type !== 'agency') {
        return;
      }
      if (this.form.get('password1').value !== this.form.get('password2').value) {
        this.message = "Please confirm the same password twice."
      }

      const email = this.agencyForm.get('email').value;
      const username = this.agencyForm.get('username').value;
      const password = this.agencyForm.get('password1').value;
      const phone = this.agencyForm.get('phone')?.value;
      const name = this.agencyForm.get('name').value;
      const pib = this.agencyForm.get('pib').value;
      const description = this.agencyForm.get('description')?.value;

      const address = {
        city: this.agencyForm.get('city').value,
        street: this.agencyForm.get('street').value,
        country: this.agencyForm.get('country').value,
        number: this.agencyForm.get('number').value,
      };

      this.adminService.createAgency(this.admin.token, username, password, email, name, pib, phone, description, address, this.image).subscribe({
        next: (res: ResponseUser) => {
          this.success = "User created."
          this.form.reset();
        }, error: (err) => {
          this.message = "User with that username/email already exist!";
          this.form.reset();
        }
      });

    }
  }

  resetForm(field: string) {
    this.form.controls[field].reset();
  }

  resetError() {
    this.message = null;
  }

  resetSuccess() {
    this.success = null;
  }

  handleImageUpload(input) {
    let file = input.target.files[0];

    // Check if the selected file is an image
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      // Define the dimensions constraints
      const minDimension = 100;
      const maxDimension = 300;

      // Read the image file as data URL
      reader.readAsDataURL(file);

      reader.onload = () => {
        const img = new Image();
        if (typeof reader.result === "string") {
          img.src = reader.result;
        }

        img.onload = () => {
          const width = img.width;
          const height = img.height;

          // Check if the image dimensions meet the constraints
          if (width >= minDimension && height >= minDimension && width <= maxDimension && height <= maxDimension) {
            // Convert the image to base64 string
            if (typeof reader.result === "string") {
              this.image = reader.result.split(',')[1];
            } else {
              this.image = null;
              alert('Image upload error.');
            }
          } else {
            // Display an error message if the image dimensions are not within the constraints
            alert('Image dimensions should be between 100x100 and 300x300 pixels.');
          }
        };
      };
    }
  }

  getJobs() {
    this.adminService.getJobs(this.admin.token).subscribe({
      next: (jobs: Job[]) => {
        console.log(jobs);
        this.jobs = jobs;
        this.filteredJobs=jobs;
      }, error: (err) => {
        console.log(err);
      }
    })
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

  filterJobs() {
    if (this.selectedStatus === 'all') {
      this.filteredJobs = this.jobs;
    }
    else {
      this.filteredJobs = this.jobs.filter(elem => elem.status===this.selectedStatus);
    }
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

  getWorkersByAgency() {
    this.adminService.getWorkersByAgency(this.selectedAgency, this.admin.token).subscribe({
      next: (workers: Worker[]) => {
        this.workers=workers;
        console.log(workers);
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  deleteWorker(email:string) {
    this.adminService.deleteWorker(email, this.admin.token).subscribe({
      next: (any) => {
        this.getWorkersByAgency();
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  createWorker(agencyUsername:string) {
    const data = {
      agencyUsername: agencyUsername,
      token: this.admin.token
    }

    const dialogRef = this.dialog.open(WorkerComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWorkersByAgency();
    });
  }

  updateWorker(worker:Worker) {

    const data = {
      agencyUsername: this.selectedAgency,
      token: this.admin.token,
      email: worker.email,
      worker:worker
    }

    const dialogRef = this.dialog.open(WorkerComponent, {
      width: '500px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getWorkersByAgency();
    });

  }

}
