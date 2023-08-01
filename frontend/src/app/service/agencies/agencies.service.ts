import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";

function mapToObject(map: Map<any, any>) {
  const out = Object.create(null)
  map.forEach((value, key) => {
    if (value instanceof Map) {
      out[key] = mapToObject(value)
    } else {
      out[key] = value
    }
  });
  return out
}

@Injectable({
  providedIn: 'root'
})
export class AgenciesService {

  url = 'http://localhost:4000/api/agencies';

  constructor(private httpClient: HttpClient) {}

  getAgencies(page: number, pageSize: number, sortBy: string, order: string) {

    let paramsMap = new Map<any, any>();

    if (page !== undefined) {
      paramsMap.set('page', page);
    }
    if (sortBy !== undefined && order !== undefined) {
      paramsMap.set('sort', `${sortBy}:${order}`);
    }
    if (pageSize !== undefined) {
      paramsMap.set('pageSize', pageSize);
    }

    return this.httpClient.get(this.url, {params: mapToObject(paramsMap)});
  }

  searchAgencies(name: string, address: string, sortBy: string, order: string, pageSize: number) {

    let paramsMap = new Map<any, any>();

    if (name !== undefined) {
      paramsMap.set('name', name);
    }
    if (address !== undefined) {
      paramsMap.set('address', address);
    }
    if (sortBy !== undefined && order !== undefined) {
      paramsMap.set('sort', `${sortBy}:${order}`);
    }
    if (pageSize !== undefined) {
      paramsMap.set('pageSize', pageSize);
    }

    return this.httpClient.get(this.url + '/search', {params: mapToObject(paramsMap)});
  }

  getAgencyByPIB(pib:number) {
    return this.httpClient.get(`${this.url}/${pib}`);
  }

}
