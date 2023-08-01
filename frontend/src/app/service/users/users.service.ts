import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Agency} from "../../model/agency";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url = "http://localhost:4000/api/";

  constructor(private http:HttpClient) { }

  getUserByUsername(type:string, username:string, token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const data ={
      username:username,
    }

    return this.http.post(this.url + `${type}/users`, data, { headers: headers });
  }

  updateAgencyProfile(username:string, password:string, email:string, name:string, pib:string, phone:string, description:string, address:any, image:string, token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

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

    return this.http.put(this.url + 'agency/users', data, { headers: headers });
  }

  updateUserProfile(username:string, password:string, email:string, firstName:string, lastName:string, phone:string, image:string, token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const data = {
      username: username,
      password: password,
      type: 'client',
      email: email,
      phone: phone,
      image: image,
      firstName:firstName,
      lastName:lastName,
    };

    return this.http.put(this.url + 'client/users', data, { headers: headers });
  }

  updateAdminProfile(username:string, password:string, email:string, firstName:string, lastName:string, phone:string, image:string, token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const data = {
      username: username,
      password: password,
      type: 'admin',
      email: email,
      phone: phone,
      image: image,
      firstName:firstName,
      lastName:lastName,
    };

    console.log(data);

    return this.http.put(this.url + 'admin/users', data, { headers: headers });
  }

  changePassword(username:string, oldPassword:string, newPassword:string, newCPassword:string, token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const data = {
      username: username,
      oldPassword: oldPassword,
      newPassword: newPassword,
      newCPassword: newCPassword
    };

    return this.http.post(this.url + 'changePassword', data, { headers: headers });

  }

}
