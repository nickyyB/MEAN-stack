import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Router} from "@angular/router";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isMobile: boolean = false;
  guest:boolean = true;
  userType:string = "guest";

  constructor(private breakpointObserver: BreakpointObserver, private router:Router) { }

  ngOnInit() {

    const user = JSON.parse(localStorage.getItem('user'));

    if (user !== undefined && user !== null) {
      this.guest = false;
      this.userType = user.type;
    }

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  logout() {
    localStorage.setItem('user', JSON.stringify(null));
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
}
