import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = "http://localhost:4000/api/";

  constructor(private http:HttpClient, private router: Router) { }

  login(username: string, password: string, type: string) {

    const data = {
      username: username,
      password: password,
      type: type
    };

    return this.http.post(this.url + "login", data);

  }

  clientRegistration(username:string, password:string, email:string, firstName:string, lastName:string, phone:string, image:string) {

    const data = {
      username: username,
      password: password,
      type: 'client',
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      image: image,
    }

    return this.http.post(this.url + "register", data);

  }

  agencyRegistration(username:string, password:string, email:string, name:string, pib:string, phone:string, description:string, address:any, image:string) {

    const data = {
      username: username,
      password: password,
      type: 'agency',
      email: email,
      name: name,
      PIB: Number(pib),
      phone: phone,
      image: image,
      description: description,
      address:address,
    };

    return this.http.post(this.url + "register", data);

  }

}
