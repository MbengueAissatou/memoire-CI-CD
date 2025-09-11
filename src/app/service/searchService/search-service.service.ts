import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchServiceService {
  filter: any = {
    text: ""
  }
  list: any[] = []
  data:any
  constructor() { }


  filter_change() {
    console.log("filter_change appelée avec texte:", this.filter.text);
    this.list = this.data.filter((one:any) => {
      let text = this.filter.text == "" || JSON.stringify(one).toLowerCase().includes(this.filter.text.toLowerCase())
    return text
    }
    );
    console.log("Liste après filtrage:", this.list);
  }
}
