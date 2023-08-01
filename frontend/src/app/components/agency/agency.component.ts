import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Agency} from "../../model/agency";
import {AgenciesService} from "../../service/agencies/agencies.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {ObjectModel} from "../../model/property";
import {User} from "../../model/user";
import {PropertyService} from "../../service/properties/property.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Comment} from "../../model/comment";

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css']
})
export class AgencyComponent implements OnInit {

  pib:number;

  agency:Agency | null = null;
  reviews:Comment[] =null;

  objects:ObjectModel[] = null;
  user:User;
  form: FormGroup;

  errorMessage:string;

  constructor(private route: ActivatedRoute,
              private agenciesService: AgenciesService,
              private _sanitizer: DomSanitizer,
              private router:Router,
              private propertyService:PropertyService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.pib = Number(this.route.snapshot.paramMap.get('pib'));

    this.agenciesService.getAgencyByPIB(this.pib).subscribe({
      next: (res: any) => {
        this.agency = res.agency;
        this.reviews = res.reviews;
        console.log(this.reviews);
      }, error: (err) => {
        console.log(err);
      }
    });

    this.user = JSON.parse(localStorage.getItem('user'));

    if (this.user !== undefined && this.user !== null && this.user.type === 'client') {
      this.getClientForm();
    }

  }

  imgUrl(data): SafeResourceUrl {
    if (data) {
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + data);
    } else {
      return "../../assets/logo.jpg";
    }
  }

  resetError() {
    this.errorMessage = null;
  }

  onSubmit() {
    debugger;
    const objectId = this.form.get('selectedObject').value;
    const from = this.form.get('from').value;
    const to = this.form.get('to').value;

    const object = this.objects.find(elem => elem._id==objectId);

    this.propertyService.requestService(object, from, to, this.agency.username, this.user.username, this.user.token).subscribe({next:(res:any)=>{
      this.router.navigate(['/jobs']);
      }, error:(err)=>{
      console.log(err);
      }});

  }

  getClientForm() {
    this.propertyService.getObjects(this.user.username, this.user.token).subscribe({next:(objects:ObjectModel[])=>{
      console.log(objects);
        this.objects=objects;
      }, error:(err)=>{
        console.log(err);
      }})

    this.form = new FormGroup({
      selectedObject: new FormControl(),
      from: new FormControl(new Date(), [
        Validators.required
      ]),
      to: new FormControl(new Date(), [
        Validators.required
      ])
    });
  }

}
