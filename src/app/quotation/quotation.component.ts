import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {

  constructor() { }

  dolarCards:any[]=[["5","6","5"]]
  realCards:any[]=[["5","6","5"]]
  pesoCards:any[]=[["5","6","5"]]

  ngOnInit() {
  }

}
