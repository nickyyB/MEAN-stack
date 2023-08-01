import {Component, OnInit} from '@angular/core';
import {Agency} from "../../model/agency";
import {AgenciesService} from "../../service/agencies/agencies.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-agencies',
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.css']
})
export class AgenciesComponent implements OnInit {

  agencies: Agency[] = [];
  pageSize:number;
  currentPage:number;
  totalCount:number;
  totalPages:number;
  pageEvent: PageEvent;

  addressQuery:string;
  nameQuery:string;
  sortingOption:string = "name";
  order:string = "asc";

  constructor(private agenciesService: AgenciesService, private _sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getAgencies(1, 6, this.sortingOption, this.order);
  }

  getAgencies(page: number, pageSize: number, sortBy:string, order:string) {

    this.agenciesService.getAgencies(page, pageSize, sortBy, order).subscribe({
      next: (res: any) => {
        this.agencies = res.agencies;
        this.totalCount = res.totalCount;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.pageSize = res.pageSize;
      }, error: (err) => {
        console.log(err);
      }

    });

  }

  imgUrl(data): SafeResourceUrl {
    if (data) {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + data);
    } else {
      return "../../assets/logo.jpg";
    }
  }

  getDisplayedAgencies(event?: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getAgencies(this.currentPage, this.pageSize, this.sortingOption, this.order);
    return event;
  }

  search() {
    this.agenciesService.searchAgencies(this.nameQuery, this.addressQuery, this.sortingOption, this.order, this.pageSize).subscribe({
      next: (res: any) => {
        console.log(res);
        this.agencies = res.agencies;
        this.totalCount = res.totalCount;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.pageSize = res.pageSize;
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  reset() {
    this.addressQuery = "";
    this.nameQuery = "";
    this.sortingOption = "name";
    this.order = "asc";
    this.search();
  }

}
