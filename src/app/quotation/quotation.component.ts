import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { AppConfigService } from '../services/app-config.service';
import * as moment from 'moment';
var Promise = require('bluebird');



@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {

  constructor(private quoteService: QuotationService, private config: AppConfigService) { }

  dollarCards: any[] = []
  realCards: any[] = []
  pesoCards: any[] = []
  refreshQuoteTime: number
  oscillation: number
  useMock = false

  editQuotation() {
    let p1 = this.quoteService.get("pesos", this.useMock).catch((err) => {
        console.log(err)
        return []

      })
    let p2 = this.quoteService.get("dolar", this.useMock).catch((err) => {
        console.log(err)
        return []
      })
    let p3 = this.quoteService.get("real", this.useMock).catch((err) => {
        console.log(err)
        return []
      })
    return Promise.all([p1, p2, p3]).spread((pesos, dollar, real) => {
      let now =new Date()
      if (pesos[2])pesos[2]=now
      if (dollar[2])dollar[2]=now
      if (real[2])real[2]=now
      if (this.useMock) {
        this.addOscillation(this.pesoCards, pesos)
        this.addOscillation(this.dollarCards, dollar)
        this.addOscillation(this.realCards, real)
      }
      else{
        if (pesos.length>0)this.pesoCards.unshift(pesos.slice())
        if (dollar.length>0)this.dollarCards.unshift(dollar.slice())
        if(real.length>0)this.realCards.unshift(real.slice())
      }
      this.setData()
      return Promise.resolve()
    })
  }

  addOscillation(arrayToShow, newElement) {
    if (arrayToShow.length > 0) newElement[0] = Number(arrayToShow[0][0]) + this.oscillation
    if (arrayToShow.length > 0) newElement[1] = Number(arrayToShow[0][1]) + this.oscillation
    newElement = newElement.slice()
    arrayToShow.unshift(newElement)
  }


  ngOnInit() {
    this.refreshQuoteTime = this.config.getConfig()["refreshQuoteTime"]
    this.oscillation = this.config.getConfig()["oscillation"]
    this.getPersistedData()

    this.editQuotation().then(() => {
      var self = this
      setInterval(function () {
        self.editQuotation()
      }, this.refreshQuoteTime);
    })
  }

  changeMock() {
    this.dollarCards = []
    this.pesoCards = []
    this.realCards = []
    this.setData()
  }

  getPersistedData() {
    var dollarData = localStorage.getItem("dollar");
    if (dollarData && dollarData != "undefined") this.dollarCards = JSON.parse(dollarData)
    var pesosData = localStorage.getItem("pesos");
    if (pesosData && pesosData != "undefined") this.pesoCards = JSON.parse(pesosData)
    var realData = localStorage.getItem("real");
    if (realData && realData != "undefined") this.realCards = JSON.parse(realData)
    this.useMock = localStorage.getItem("useMock") == "true"
  }

  setData() {
    localStorage.setItem("dollar", JSON.stringify(this.dollarCards));
    localStorage.setItem("pesos", JSON.stringify(this.pesoCards));
    localStorage.setItem("real", JSON.stringify(this.realCards));
    localStorage.setItem("useMock", this.useMock.toString());
  }
}
