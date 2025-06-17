import { Component, OnInit } from '@angular/core';
import {CommonService} from '../services/common.service';
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

group_id:any;
location_id:any;
location:any;
loading: boolean = false;
imageurl:any;
  isIos=false;
social:any= [
 
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/review-set-up-google-icon-active.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/review-set-up-fb-icon-active.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/yelplogo.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/yellow pages.jpg"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/Angies List.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/AutoScout24.jpg"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/manta.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/Edmunds.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/Product Reviews.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/TripAdvisor.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/better-business-bureau-logo-png-transparent.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/Foursquare.png"},

  /*{ 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/yelp.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/5pm.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/192.com.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/AgedCareReviewsAus.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/allagentsuk.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/angieslist.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/AVVO.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/beanhunter.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/bestcompany.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/better_business_bureau.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/buyer_score.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/cars.com.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/check-a-trade.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/dealerrater.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/edmonds.com.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/finda.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/foursqaure.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/getagent.co.uk.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/glassdoor.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/HappyCampers.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/healthgrades.com.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/here.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/HungryGoWhereSingapore.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/influenster.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/linternaute.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/manta.png"},

  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/nocowboys.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/NZAA.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/Open-table.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/powerreviews.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/product-reviews.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/Rankers.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/ratemds.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/startlocal.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/TripAdvisor.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/truelocal.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/trustpilot.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/TUV-DCTA-Auto.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/vitals-logo.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/womo.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/Yahoo.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/YellowPages.com.png"},
  { 'url':'','ischecked':0,'imageurl':"assets/img/review-logos/zomato.png"},*/


 ]; 

 constructor(
  	 private commonService: CommonService,
  	 private router: Router,
  	 private activatedRoute: ActivatedRoute,
     private sanitizer: DomSanitizer
  ) { 
   
      this.locationDetailCallback = this.locationDetailCallback.bind(this);
      this.updatePwaReviewSitesCountCallback = this.updatePwaReviewSitesCountCallback.bind(this);
      	
      this.activatedRoute.params.subscribe(params => {
        this.group_id = params.group_id;   
       	this.location_id = params.location_id;   
      });
        this.loading=true;
  }

  ngOnInit() {
      this.loading=true;
  		let data:any={};
  	  	data.location_id = this.location_id;

      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        this.isIos = true;
      }
        //this.commonService.getLocationDetails(data,this.locationDetailCallback);
  }
  locationDetailCallback(response){
    let this1=this;
    setTimeout(function(){
        this1.loading=false;
    },100)
  
  	this.location = response.location;
    this.social = JSON.parse(response.location.social_meta);

   if(this.location.business_logo_url=="" || this.location.business_logo_url==undefined){
              this.location.business_logo_url=null;
    }
  }

  updatePwaReviewSitesCount(imageurl){
      let data:any={};
      data.location_id = this.location_id;
      data.imageurl = imageurl;
      //this.commonService.updatePwaReviewSitesCount(data,this.updatePwaReviewSitesCountCallback);
  }
  updatePwaReviewSitesCountCallback(response){

  }
  sanitizeURL(url:string) {
     // console.log(this.sanitizer.bypassSecurityTrustResourceUrl(url));
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
