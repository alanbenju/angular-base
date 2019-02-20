import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AppConfigService } from './app-config.service';
import { mock } from '../../assets/quote.mock'

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  constructor(private http: HttpClient, private config:AppConfigService) { }

  url = this.config.getConfig()["serverUrl"] + "/:quote/quote"

  /**
   * 
   * @param quote : Can be pesos/dolar/real
   */
  get(quote:string,useMock:boolean=false):Promise<any[]> {
    if(useMock) return Promise.resolve(mock[quote])
    return this.http.get<any[]>(this.url.replace(":quote",quote)).toPromise()
  }

}
