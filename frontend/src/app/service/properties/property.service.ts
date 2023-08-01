import { Injectable } from '@angular/core';
import {Door, ObjectModel, Square} from "../../model/property";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Job} from "../../model/job";

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  url = "http://localhost:4000/api/properties";

  constructor(private http:HttpClient) { }

  addObject(object:ObjectModel, username:string, token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    debugger;

    let objectModelDTO = this.objectModelToObjectModelDTO(object);

    const data = {
      property: objectModelDTO,
      username: username,
    }

    return this.http.post(this.url , data, { headers: headers });
  }

  getObjects(username:string, token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.url}/${username}`, { headers: headers });
  }

  deleteObject(id:string, token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.url}/${id}`, { headers: headers });

  }

  requestService(object:ObjectModel, from:Date, to:Date, agencyUsername:string, clientUsername:string, token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const objectModelDTO = this.objectModelToObjectModelDTO(object);

    const data = {
      property: objectModelDTO,
      dateFrom: from,
      dateTo: to,
      agencyUsername: agencyUsername,
      clientUsername: clientUsername,
    }

    console.log(data);

    return this.http.post(this.url + '/jobs' , data, { headers: headers });

  }

  getMyJobs(username:string, token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.get(this.url + `/jobs/${username}` , { headers: headers });
  }

  updateJob(id:string, status:string, token:string, price:number) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const data = {
      status:status,
      id:id,
      price:price
    };

    return this.http.put(this.url + '/jobs' , data, { headers: headers });

  }

  getJob(id:string, token:string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.get(this.url + `/jobs/agency/${id}` , { headers: headers });
  }

  updateJobProgress(job:Job, token:string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const id = job._id;

    return this.http.put(this.url + `/jobs/agency/${id}`, job, { headers: headers });

  }

  deleteJob(id:string, token:string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(this.url + `/jobs/${id}`, { headers: headers });
  }

  reviewAgency(id:string, comment:string, rate:number, token) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const data = {
      id: id,
      comment: comment,
      rate: rate
    }

    return this.http.post("http://localhost:4000/api/client/review", data, { headers: headers });
  }

  private objectModelToObjectModelDTO(object:ObjectModel) {
    let objectModelDTO = new ObjectModelDTO();
    objectModelDTO.id = object._id;
    objectModelDTO.type = object.type;
    objectModelDTO.sketch = object.sketch;
    objectModelDTO.numberOfRooms = object.numberOfRooms;
    objectModelDTO.address = object.address;
    objectModelDTO.username = object.username;
    objectModelDTO.squareFootage = object.squareFootage;
    objectModelDTO.squaresMap = [];
    let index = 0;

    object.squaresMap.forEach(element => {
      const squareDTO = new SquareModelDTO();
      squareDTO.x = element.x;
      squareDTO.y = element.y;
      squareDTO.offsetX = element.offsetX;
      squareDTO.offsetY = element.offsetY;
      squareDTO.height = element.height;
      squareDTO.width = element.width;
      squareDTO.doors = this.convertMapToObj(element.doors);
      objectModelDTO.squaresMap[index++] = squareDTO;
    })
    return objectModelDTO;
  }


  private convertMapToObj(map: Map<Number, any>): { [key: number]: any } {
    const obj: { [key: number]: any } = [];
    let indexer = 0;

    for (const [key, value] of map.entries()) {
      if (value instanceof Map) {
        // @ts-ignore
        obj[indexer++] = this.convertMapToObj(value);
      } else {
        // @ts-ignore
        obj[indexer++] = value;
      }
    }

    return obj;
  }

}

class ObjectModelDTO {
  type: string;
  address: string;
  numberOfRooms: number;
  squareFootage: number;
  sketch: string;
  squaresMap: { [key: number]: SquareModelDTO };
  id: string;
  username: string;
}

class SquareModelDTO {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  doors: { [key: number]: Door };
}

