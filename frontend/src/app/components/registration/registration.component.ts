import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {ResponseUser} from "../../model/response.user";
import {SafeResourceUrl} from "@angular/platform-browser";


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  form: FormGroup;
  agencyForm : FormGroup;
  private formSubmitAttempt: boolean;
  message: string;
  success:string;
  type: string = 'client';
  image:string;
  disableSubmit:boolean = false;

  passwordRegex: RegExp = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{7,12}$/;
  numbersOnlyRegex: RegExp = /^\d+$/;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {

    const user = JSON.parse(localStorage.getItem('user'));

    if (user !== undefined && user !== null) {
      this.router.navigate(['/']);
    }

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

  onChangeType() {

    this.resetError();
    this.resetSuccess();

    if(this.type === 'client') {
      this.type= this.form.get('type').value;
    } else {
      this.type= this.agencyForm.get('type').value;
    }

  }

  isFieldInvalid(field: string) {

    if(this.type==='client') {
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
      if(this.type!='client') {
        return;
      }
      if( this.form.get('password1').value !==   this.form.get('password2').value) {
        this.message = "Please confirm the same password twice."
      }

      const email = this.form.get('email').value;
      const username = this.form.get('username').value;
      const password = this.form.get('password1').value;
      const phone = this.form.get('phone').value;
      const firstName = this.form.get('firstName').value;
      const lastName = this.form.get('lastName').value;

      this.authService.clientRegistration(username, password, email, firstName, lastName, phone, this.image).subscribe({
        next:(res:ResponseUser)=>{
          this.ngOnInit();
          this.success = "Please wait until admin approve your registration request."
        }, error:(err)=>{
          this.ngOnInit();
          this.message = "User with that username/email already exist!";
        }});

    }
    this.formSubmitAttempt = true;
  }

  onSubmitAgency() {
    if (this.agencyForm.valid) {
      if(this.type!=='agency') {
        return;
      }
      if( this.form.get('password1').value !==   this.form.get('password2').value) {
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

      this.authService.agencyRegistration(username, password, email, name, pib, phone, description, address, this.image).subscribe({
        next:(res:ResponseUser)=>{
          this.ngOnInit();
          this.type = 'agency';
          this.success = "Please wait until admin approve your registration request."
        }, error:(err)=>{
          this.message = "User with that username/email already exist!";
          this.form.reset();
        }});

    }
  }

  resetForm(field: string) {
    this.form.controls[field].reset();
  }

  resetError() {
    this.message = null;
  }

  resetSuccess() {
    this.success=null;
  }

  handleImageUpload(input) {
    this.disableSubmit=true;

    let file = input.target.files[0];

    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
      const reader = new FileReader();

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

          if (width >= minDimension && height >= minDimension && width <= maxDimension && height <= maxDimension) {

            if (typeof reader.result === "string") {
              this.image = reader.result.split(',')[1];
            } else {
              this.image = null;
              alert('Image upload error.');
            }
          } else {
            alert('Image dimensions should be between 100x100 and 300x300 pixels.');
            this.resetForm('avatar');
          }
        };
      };
    }
    this.disableSubmit=false;
  }

}
