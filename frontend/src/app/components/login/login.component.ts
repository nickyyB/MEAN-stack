import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth/auth.service';
import {User} from "../../model/user";
import {Router} from "@angular/router";
import {ResponseUser} from "../../model/response.user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection:ChangeDetectionStrategy.Default
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  private formSubmitAttempt: boolean;
  message:string;

  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router) {}

  ngOnInit() {

    const user = JSON.parse(localStorage.getItem('user'));

    if (user !== undefined && user !== null) {
      this.router.navigate(['/']);
    }

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      type: ['client', Validators.required]
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
      const type = this.form.get('type').value;

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
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });;

        }, error: (err) => {
          this.resetForm('password');
          this.message = 'Wrong username/password';
          this.formSubmitAttempt = false;
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
