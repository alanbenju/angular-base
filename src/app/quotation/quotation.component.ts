import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { AppConfigService } from '../services/app-config.service';
import * as moment from 'moment';



@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {

  constructor(private quoteService:QuotationService, private config:AppConfigService) { }

  dolarCards:any[]=[]
  realCards:any[]=[]
  pesoCards:any[]=[]
  refreshQuoteTime:Number
  oscillation:Number
  useMock = false

  editQuotation() {
    let p1 = this.quoteService.get("pesos",this.useMock).then((response)=>{
      response[2] = Date()//moment()
      this.pesoCards.unshift(response)
    }).catch((err)=>{
      console.log(err)
    })
    let p2 = this.quoteService.get("dolar",this.useMock).then((response)=>{
      response[2] = Date()//moment().unix()
      this.dolarCards.unshift(response)
    }).catch((err)=>{
      console.log(err)
    })
    let p3 = this.quoteService.get("real",this.useMock).then((response)=>{
      response[2] = Date()
      this.realCards.unshift(response)
    }).catch((err)=>{
      console.log(err)
    })
    return Promise.all([p1,p2,p3])
  }


  ngOnInit() {
    this.refreshQuoteTime = this.config.getConfig()["refreshQuoteTime"]
    this.oscillation = this.config.getConfig()["oscillation"]

    this.editQuotation().then(()=>{
      var self = this
      setInterval(function () {
        self.editQuotation()
      }, this.refreshQuoteTime);
    })
  }
}
