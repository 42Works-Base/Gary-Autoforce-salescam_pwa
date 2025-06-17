import { Component, OnInit } from '@angular/core';
import {CommonService} from '../services/common.service';
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

  group_id:any;
  location_id:any;
  location:any;

  error_msg = null;
  success_msg = null;
  animate = null;
  loading: boolean = false;

  constructor(
     private commonService: CommonService,
     private router: Router,
     private activatedRoute: ActivatedRoute
  ) { 
   
   	  this.locationDetailCallback = this.locationDetailCallback.bind(this);

      this.activatedRoute.params.subscribe(params => {
        this.group_id = params.group_id;   
        this.location_id = params.location_id;   
      });
  }

  ngOnInit() {
  		 let data:any={};
        data.location_id = this.location_id;

       // this.commonService.getLocationDetails(data,this.locationDetailCallback);
  }
  locationDetailCallback(response){
 
    this.location = response.location;

   if(this.location.business_logo_url=="" || this.location.business_logo_url==undefined){
              this.location.business_logo_url=null;
    }
  }
}
