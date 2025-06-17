import { Component, OnInit, NgZone } from '@angular/core';
import {CommonService} from '../services/common.service';
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import { ConnectionService } from 'ng-connection-service';
import { environment } from '../../environments/environment';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

declare function setPlayCallback(callback): any;
declare function reviewPopup(): any;
declare function updateVideoPlayStats(): any;
var window:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent implements OnInit {

  environment:any = environment;
  service_request_id:any;
  location_id:any = null;
  review_location_link = null;
  location:any;
  
  error_msg = null;
  success_msg = null;
  animate = null;
  loading: boolean = false;

  status = 'ONLINE';
  isConnected = true;

  isIos=false;
  service_request:any = {};
  settings:any = {};
  safeSrc: SafeResourceUrl;
  safeSMSSrc: SafeResourceUrl;
  chat_offline:boolean = true;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private connectionService: ConnectionService,
    private sanitizer: DomSanitizer,
    private ngZone: NgZone,
  ) { 
	  this.loading = true;
    this.serviceRequestCallback = this.serviceRequestCallback.bind(this);
    this.updatePlayVideoStats = this.updatePlayVideoStats.bind(this);

    if (location.protocol != 'https:' && location.href.indexOf("localhost") ===-1){
      location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }
    this.activatedRoute.params.subscribe(params => {
      this.service_request_id = params.request_id;   
      this.location_id = params.location_id;   
    });

    if(this.location_id==null){        
      this.router.navigate(['/404']);  
    }

	  this.review_location_link = environment.reviewLink+'/'+this.service_request_id+'/'+this.location_id;

    let data:any={};
    data.location_id = this.location_id;
    data.service_request_id = this.service_request_id;

    this.commonService.getServiceRequestDetails(data,this.serviceRequestCallback);
      
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
        this.commonService.getServiceRequestDetails(data,this.serviceRequestCallback);
      } else {
        this.status = "OFFLINE";
      }
    })

    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
      this.isIos = true;
    }
    //setPlayCallback(this.updatePlayVideoStats);
  }

  ngOnInit() {
    localStorage.setItem('service_request_id',this.service_request_id);
    localStorage.setItem('location_id',this.location_id);
    //setPlayCallback(this.updatePlayVideoStats);
  }
  
  checkIfNotMobile(){	  
    var check;

    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    
    if(!check){
      alert("Text is only available on mobile");
    }    
  }

  serviceRequestCallback(response){
	  
    this.loading = false;   
    this.hideMessages();

    if(response.success){

      this.service_request = response.data.service_request;

      if(this.service_request.video_view < 1){
        setPlayCallback(this.updatePlayVideoStats);
      }
	  
      /*if(this.service_request.isLandingPageExpired == 1){
      document.location.href = environment.cmsUrl;
      }*/
	  
      this.settings = response.data.settings;
      this.chat_offline = response.data.chat_offline;

       this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/video/"+this.service_request.post_id+"&title=0&byline=0&portrait=0"); 
		
       this.safeSMSSrc =  this.sanitizer.bypassSecurityTrustResourceUrl("sms:"+ (this.service_request.text_mobile_number));   

      setTimeout(function(){
        updateVideoPlayStats();
      },500);

      //var object = this;
      setTimeout(function(){
        if(response.data.service_request.show_review == 1){
          reviewPopup();
        }
      },1000);

      var data:any = {};
      data.request_id = this.service_request_id;

    } else {
      this.router.navigate(['/404']);
    }
  }
  /*
  /*getCustomStyle(){
    if(this.settings.theme=="Custom"){
      return {
        'background-color': this.hexToRgb(),
      };
    } else {
      return {};
    }
  }*/
  updatePlayVideoStats(){
    let data:any={};
    data.location_id = this.location_id;
    data.request_id = this.service_request_id;
    data.section = "play_video";
    this.commonService.updateStats(data);
  }
  initCall(){
    let data:any={};
    data.location_id = this.location_id;
    data.service_request_id = this.service_request_id;
    //data.section = "call";
    //this.commonService.updateStats(data); 
  }
  /*hexToRgb() {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.settings.hex_color);
    return result ? "rgba("+parseInt(result[1], 16)+","+parseInt(result[2], 16)+","+parseInt(result[3], 16)+","+((100-this.settings.transparency)/100)+")" : null;
  }*/
  hideMessages(){
    this.error_msg = null;
    this.success_msg = null;
  }
}