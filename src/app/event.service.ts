import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs';

@Injectable()
export class EventService {

  private _eventsUrl = "http://localhost:3000/api/events";
  private _specialEventsUrl = "http://localhost:3000/api/special";

  constructor(private http: HttpClient) { }

  getEvents() : any 
  {
    return this.http.get<any>(this._eventsUrl)
  }

  countObject()
  {
    return this.http.get<any>("http://localhost:3000/api/count");
  }

  countBatches()
  {
    return this.http.get<any>("http://localhost:3000/api/countEventUserBatches");
  }

  eventsubmitForm(data:any):any
  {
    return this.http.post<any>("http://localhost:3000/api/insertEventBatchUserData",data).pipe(map((res:any)=>{
      return res;
    }))
  }

  getSpecialEvents() : any {
    return this.http.get<any>(this._specialEventsUrl)
  }  

  specialsubmitForm(data:any):any
  {
    return this.http.post<any>("http://localhost:3000/api/insertSpecialBatchUserData",data).pipe(map((res:any)=>{
      return res;
    }))
  }

  countSpecialUsers()
  {
    return this.http.get<any>("http://localhost:3000/api/countSpecialEventUsers");
  }

  countSpecialBatches()
  {
    return this.http.get<any>("http://localhost:3000/api/countSpecialUserBatches");
  }
}
