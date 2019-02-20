import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  constructor(private http: HttpClient, private config:AppConfigService) { }

  url = this.config.getConfig()["serverUrl"] + "/:quote/quote"
  mock = {
    dolar:["1","2","0"],
    pesos:["3","4","0"],
    real:["5","6","0"]
}

  /**
   * 
   * @param quote : Can be pesos/dolar/real
   */
  get(quote:string,useMock:boolean=false):Promise<any[]> {
    if(useMock) return Promise.resolve(this.mock[quote])
    return this.http.get<any[]>(this.url.replace(":quote",quote)).toPromise()
  }

}
