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

  dolarCards: any[] = []
  realCards: any[] = []
  pesoCards: any[] = []
  refreshQuoteTime: Number
  oscillation: Number
  useMock = false

  editQuotation() {
    let p1 = this.quoteService.get("pesos", this.useMock)/*.then((response)=>{
      response[2] = Date()
      if (this.pesoCards.length>0) response[0] = Number(this.pesoCards[0][0])+Number(this.oscillation)
      if (this.pesoCards.length>0) response[1] = Number(this.pesoCards[0][1])+Number(this.oscillation)
      response = response.slice()
      this.pesoCards.unshift(response)
    })*/.catch((err) => {
        console.log(err)
        return []

      })
    let p2 = this.quoteService.get("dolar", this.useMock)/*.then((response)=>{
      response[2] = Date()
      if (this.dolarCards.length>0) response[0] = Number(this.dolarCards[0][0])+Number(this.oscillation)
      if (this.dolarCards.length>0) response[1] = Number(this.dolarCards[0][1])+Number(this.oscillation)
      response = response.slice()
      this.dolarCards.unshift(response)
    })*/.catch((err) => {
        console.log(err)
        return []
      })
    let p3 = this.quoteService.get("real", this.useMock)/*.then((response)=>{
      response[2] = Date()
      if (this.realCards.length>0) response[0] = Number(this.realCards[0][0])+Number(this.oscillation)
      if (this.realCards.length>0) response[1] = Number(this.realCards[0][1])+Number(this.oscillation)
      response = response.slice()
      this.realCards.unshift(response)
    })*/.catch((err) => {
        console.log(err)
        return []
      })
    return Promise.all([p1, p2, p3]).spread((pesos, dolar, real) => {
      let now =new Date()
      if (pesos[2])pesos[2]=now
      if (dolar[2])dolar[2]=now
      if (real[2])real[2]=now
      if (this.useMock) {
        this.addOscillation(this.pesoCards, pesos)
        this.addOscillation(this.dolarCards, dolar)
        this.addOscillation(this.realCards, real)
      }
      else{
        if (pesos.length>0)this.pesoCards.unshift(pesos.slice())
        if (dolar.length>0)this.dolarCards.unshift(dolar.slice())
        if(real.length>0)this.realCards.unshift(real.slice())
      }
      this.setData()
      return Promise.resolve()
    })
  }

  addOscillation(arrayToShow, newElement) {
    //newElement[2] = Date()
    if (arrayToShow.length > 0) newElement[0] = Number(arrayToShow[0][0]) + Number(this.oscillation)
    if (arrayToShow.length > 0) newElement[1] = Number(arrayToShow[0][1]) + Number(this.oscillation)
    newElement = newElement.slice()
    arrayToShow.unshift(newElement)
  }


  ngOnInit() {
    this.refreshQuoteTime = this.config.getConfig()["refreshQuoteTime"]
    this.oscillation = this.config.getConfig()["oscillation"]
    this.getPersistedData()

    this.editQuotation().then(() => {
      // store array to localstorage      
      var self = this
      setInterval(function () {
        self.editQuotation()
      }, this.refreshQuoteTime);
    })
  }

  changeMock() {
    this.dolarCards = []
    this.pesoCards = []
    this.realCards = []
  }

  getPersistedData() {
    var dolarData = localStorage.getItem("dolar");
    if (dolarData && dolarData != "undefined") this.dolarCards = JSON.parse(dolarData)
    var pesosData = localStorage.getItem("pesos");
    if (pesosData && pesosData != "undefined") this.pesoCards = JSON.parse(pesosData)
    var realData = localStorage.getItem("real");
    if (realData && realData != "undefined") this.realCards = JSON.parse(realData)
    this.useMock = localStorage.getItem("useMock") == "true"
  }

  setData() {
    localStorage.setItem("dolar", JSON.stringify(this.dolarCards));
    localStorage.setItem("pesos", JSON.stringify(this.pesoCards));
    localStorage.setItem("real", JSON.stringify(this.realCards));
    localStorage.setItem("useMock", this.useMock.toString());
  }
}
