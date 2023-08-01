import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Client} from "../../model/client";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  url = 'http://localhost:4000/api/admin';

  constructor(private httpClient: HttpClient) {
  }

  getWaitingUsers(token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.get(this.url + `/users/waiting`, {headers: headers});

  }

  approveRegistration(username: string, token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const data = {
      'username': username,
    }

    return this.httpClient.post(this.url + `/users/activate`, data, {headers: headers});

  }


  rejectRegistration(username: string, token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const data = {
      'username': username,
    }

    return this.httpClient.post(this.url + `/users/reject`, data, {headers: headers});

  }

  deactivateUser(username: string, token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const data = {
      'username': username,
    }

    return this.httpClient.post(this.url + `/users/deactivate`, data, {headers: headers});

  }

  deleteUser(username: string, token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.delete(this.url + `/users/${username}`, {headers: headers});

  }

  getUsers(token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.get(this.url + `/users`, {headers: headers});

  }

  createClient(token:string, username:string, password:string, email:string, firstName:string, lastName:string, phone:string, image:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

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

    console.log(data);

    return this.httpClient.post(this.url + `/users/clients`, data, {headers: headers});

  }

  createAgency(token:string, username:string, password:string, email:string, name:string, pib:string, phone:string, description:string, address:any, image:string) {

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

    return this.httpClient.post(this.url + `/users/agencies`, data, {headers: headers});

  }

  getJobs(token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.get(this.url + `/jobs`, {headers: headers});

  }

  getWorkersByAgency(agencyUsername:string, token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.get(this.url + `/workers/agency/${agencyUsername}`, {headers: headers});

  }

  createWorker(token:string, agencyUsername:string, contactPhone:string, email:string, name:string, surname:string, speciality:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const data = {
      agencyUsername: agencyUsername,
      contactPhone: contactPhone,
      busy: false,
      email: email,
      name: name,
      surname: surname,
      speciality: speciality,
    };

    return this.httpClient.post(this.url + `/workers`, data, {headers: headers});

  }

  deleteWorker(email: string, token: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.delete(this.url + `/workers/${email}`, {headers: headers});

  }

  updateWorker(token:string, agencyUsername:string, contactPhone:string, email:string, name:string, surname:string, speciality:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const data = {
      agencyUsername: agencyUsername,
      contactPhone: contactPhone,
      busy: false,
      email: email,
      name: name,
      surname: surname,
      speciality: speciality,
    };

    return this.httpClient.put(this.url + `/workers/${email}`, data,{headers: headers});

  }

}
