import { Injectable, Inject, Component } from '@angular/core';
import { Observable, interval, pipe } from 'rxjs';
import { switchMap, map, takeWhile } from 'rxjs/operators';
/*import { environment } from '../../environments/environment';*/
import { HttpClient, HttpHeaders} from '@angular/common/http';
/*import { JwtHelperService } from '@auth0/angular-jwt';
// import { LoggedinService } from '../loggedin.service';*/
import { CookieService } from 'ngx-cookie-service';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import {environment} from '../environments/environment';

@Injectable()
export class ApiService {
  public nodesslurl =  environment["api_url"];
  constructor(private _http: HttpClient,public cookie:CookieService) {}

  /* read site setting data */
  public getSiteSettingData(url): Observable<any> {
    return this._http.get(url);
  }

  getData(endpoint:string){
    var result = this._http.get(this.getEndpointUrl(endpoint)).pipe(map(res => res));

		return result;
  } //end getData

  
  postData(endpoint:string, source, condition){
      var result =this._http.post(this.getEndpointUrl(endpoint),{source:source,condition:condition}/*JSON.stringify(data)*/).pipe(map(res => res));
      return result;
  } //end postData

  /* call api via post method */
  httpViaPost(endpoint, jsonData): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'woking'
      })
    };
    return this._http.post(endpoint, jsonData).pipe(map(res => res));
  }
  
  
  putData(endpoint:string,data,id:string,is_cache_buster=true){
    if (is_cache_buster==true){
      let ran = Math.floor(Math.random() * 10000) + 1;
      var cache_buster = '?cache=' + ran.toString();
      endpoint = endpoint + cache_buster;
    }
  
    var result =this._http.put(this.getEndpointUrl(endpoint)+'/'+id,JSON.stringify(data)).pipe(map(res => res));
  
    return result;
  } //end putData
 
  
  // deleteData(endpoint:string,id:string){
  //   var result = this._http.delete(this.getEndpointUrl(endpoint)+"/"+id).pipe(map(res => res));
	// 	return result;
  // } //end deleteData

  private getEndpointUrl(endpoint:string){
      return this.nodesslurl + endpoint+'?token='+this.cookie.get('jwttoken');
  }
  customRequest(requestdata: any, endpoint: any) {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': this.cookie.get('jwttoken')
    //   })
    // };
    if (this.cookie.get('jwttoken') !=null && this.cookie.get('jwttoken') !='') {
      var result = this._http.post( this.nodesslurl+endpoint+'?token='+this.cookie.get('jwttoken'), requestdata).pipe(map(res => res));
    return result;
    }else{
      var result = this._http.post( this.nodesslurl+endpoint, requestdata).pipe(map(res => res));
      return result;
    }
   
  }
  


}
