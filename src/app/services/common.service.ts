import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  constructor(private http: HttpClient) {}

  getServiceRequestDetails(data, serviceRequestCallback) {
    this.http
      .post(environment.apiUrl + "cam/get_service_request", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .subscribe(
        (data) => {
          serviceRequestCallback(data);
        },
        (error) => {
          serviceRequestCallback(error.error);
        }
      );
  }
  
  clickChat(data, clickChatCallback) {
    this.http
      .post(environment.apiUrl + "cam/click_chat", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .subscribe(
        (data) => {
          clickChatCallback(data);
        },
        (error) => {
          clickChatCallback(error.error);
        }
      );
  }

  updateStats(data, callback = null) {
    this.http
      .post(environment.apiUrl + "cam/update_stats", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .subscribe(
        (data) => {
          if (callback != null) {
            callback(data);
          }
        },
        (error) => {
          callback(error.error);
        }
      );
  }
}
