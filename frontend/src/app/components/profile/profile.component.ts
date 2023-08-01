import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../service/users/users.service";
import {Agency} from "../../model/agency";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {ResponseUser} from "../../model/response.user";
import {User} from "../../model/user";
import {Client} from "../../model/client";
import {MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  passwordRegex: RegExp = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{7,12}$/;

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  index: number = 0;

  type:string = null;
  form: FormGroup;

  message: string;
  success:string;

  private formSubmitAttempt: boolean;

  image:string;
  agencyUser:Agency;
  clientUser:Client;

  tempUser:User;

  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;

  constructor(private router:Router,private fb: FormBuilder, private usersService: UsersService, private _sanitizer:DomSanitizer) { }

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('user'));

    if (user === undefined || user === null) {
      this.router.navigate(['/']);
    }

    this.type = user.type;
    this.tempUser = user;

    this.usersService.getUserByUsername(this.type, user.username, user.token).subscribe({
      next: (res: any) => {
        if(this.type==='agency') {
          this.agencyUser = res;
          this.image=this.agencyUser.image;
          this.patchAgencyForm();
        } else {
          this.clientUser = res;
          this.image=this.clientUser.image;
          this.patchClientForm();
        }

      }, error: (err) => {
        console.log(err);
      }
    });

    if (this.type === 'client' || this.type === 'admin') {
      this.form = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phone: ['', Validators.required],
        avatar: ['', null],
      });
    } else {
      this.form = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
        email: ['', [Validators.required, Validators.email]],
        name: ['', Validators.required],
        phone: ['', Validators.required],
        description: ['', Validators.required],
        street: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        number: ['', Validators.required],
        avatar: ['', null],
      });

    }

  }

  imgUrl(data:string): SafeResourceUrl {
    if (data) {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + data);
    } else {
      return "../../assets/logo.jpg";
    }
  }


  isFieldInvalid(field: string) {

    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );

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

      reader.onload =  () => {
        const img = new Image();
        if (typeof reader.result === "string") {
          img.src = reader.result;
        }

        img.onload =  ()=> {
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

  resetError() {
    this.message = null;
  }

  onSubmitAgency() {
    if (this.form.valid) {
      if (this.type !== 'agency') {
        return;
      }

      const email = this.form.get('email').value;
      const username = this.form.get('username').value;
      const phone = this.form.get('phone')?.value;
      const name = this.form.get('name').value;
      const description = this.form.get('description')?.value;

      const address = {
        city: this.form.get('city').value,
        street: this.form.get('street').value,
        country: this.form.get('country').value,
        number: this.form.get('number').value,
      };

      this.usersService.updateAgencyProfile(username, this.agencyUser.password, email, name, this.agencyUser.PIB, phone, description, address, this.image, this.tempUser.token).subscribe({
        next: (res: Agency) => {
          console.log(res);

          const user: User = {
            username: res.username,
            type: res.type,
            token: this.tempUser.token,
            name: res.name,
            firstName: null,
            active: 1
          };
          localStorage.setItem('user', JSON.stringify(user));

          this.ngOnInit();
        }, error: (err) => {
          this.message = err.message;
        }
      });

    }
  }

  onSubmitClient() {
    if (this.form.valid) {
      if(this.type!='client') {
        return;
      }

      const phone = this.form.get('phone').value;
      const firstName = this.form.get('firstName').value;
      const lastName = this.form.get('lastName').value;

      this.usersService.updateUserProfile(this.clientUser.username, this.clientUser.password, this.clientUser.email, firstName, lastName, phone, this.image, this.tempUser.token).subscribe({
        next:(res:Client)=>{
          console.log(res);

          const user: User = {
            username: res.username,
            type: res.type,
            token: this.tempUser.token,
            name: null,
            firstName: res.firstName,
            active: 1
          };
          localStorage.setItem('user', JSON.stringify(user));

          this.ngOnInit();
        }, error:(err)=>{
          this.message = err.message;
        }});

    }
    this.formSubmitAttempt = true;
  }

  onSubmitAdmin() {
    if (this.form.valid) {
      if(this.type!='admin') {
        return;
      }

      const phone = this.form.get('phone').value;
      const firstName = this.form.get('firstName').value;
      const lastName = this.form.get('lastName').value;

      this.usersService.updateAdminProfile(this.clientUser.username, this.clientUser.password, this.clientUser.email, firstName, lastName, phone, this.image, this.tempUser.token).subscribe({
        next:(res:Client)=>{
          console.log(res);

          const user: User = {
            username: res.username,
            type: res.type,
            token: this.tempUser.token,
            name: null,
            firstName: res.firstName,
            active: 1
          };
          localStorage.setItem('user', JSON.stringify(user));

          this.ngOnInit();
        }, error:(err)=>{
          this.message = err.message;
        }});

    }
    this.formSubmitAttempt = true;
  }

  patchAgencyForm() {
    this.form.controls['username'].setValue(this.agencyUser.username);
    this.form.controls['email'].setValue(this.agencyUser.email);
    this.form.controls['name'].setValue(this.agencyUser.name);
    this.form.controls['phone'].setValue(this.agencyUser.phone);
    this.form.controls['description'].setValue(this.agencyUser.description);
    this.form.controls['street'].setValue(this.agencyUser.address.street);
    this.form.controls['country'].setValue(this.agencyUser.address.country);
    this.form.controls['number'].setValue(this.agencyUser.address.number);
    this.form.controls['city'].setValue(this.agencyUser.address.city);

    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
  }

  patchClientForm() {
    this.form.controls['username'].setValue(this.clientUser.username);
    this.form.controls['email'].setValue(this.clientUser.email);
    this.form.controls['phone'].setValue(this.clientUser.phone);
    this.form.controls['firstName'].setValue(this.clientUser.firstName);
    this.form.controls['lastName'].setValue(this.clientUser.lastName);

    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
  }

  changePassword() {
    if (this.newPassword !== this.confirmNewPassword) {
      this.message = "Please, insert same password twice"
      return;
    }

    if (!this.passwordRegex.test(this.newPassword)) {
      this.message = "7-12 chars, 1 big letter, 1 special char, has to start with a letter"
      return;
    }

    this.usersService.changePassword(this.tempUser.username, this.oldPassword, this.newPassword, this.confirmNewPassword, this.tempUser.token).subscribe({next:(res:any)=>{
      this.logout();
      }, error:(err)=>{
      console.log(err);
      }});

  }

  onTabChange(event) {
    console.log(event);
    this.index = event.index;
    this.resetError();
  }

  logout() {
    localStorage.setItem('user', JSON.stringify(null));
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

}
