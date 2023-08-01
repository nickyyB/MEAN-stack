import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth/auth.service";
import {Router} from "@angular/router";
import {ResponseUser} from "../../model/response.user";
import {User} from "../../model/user";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  form: FormGroup;
  private formSubmitAttempt: boolean;
  message:string;

  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router) {}

  ngOnInit() {

    const user = JSON.parse(localStorage.getItem('user'));

    if (user !== undefined && user !== null && user.type !== 'admin') {
      this.router.navigate(['/']);
    }

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    if (this.form.valid) {

      const username = this.form.get('username').value;
      const password = this.form.get('password').value;
      const type = 'admin';

      this.authService.login(username, password, type).subscribe({
        next: (res: ResponseUser) => {

          const user: User = {
            username: res.user.username,
            type: res.user.type,
            token: res.token,
            firstName: res.user.firstName,
            name: res.user.name,
            active: res.user.active
          };

          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/admin']).then(() => {
            window.location.reload();
          });

        }, error: (err) => {
          this.formSubmitAttempt = false;
          this.resetForm('password');
          this.message = 'User not found with that username/password';
        }
      });

    }
    this.formSubmitAttempt = true;
  }

  resetForm(field:string) {
    this.form.controls[field].reset();
  }

  resetError() {
    this.message=null;
  }

}
