import { Component, OnInit } from '@angular/core';
interface EduDoc {
  name: string;
  url: string
}

@Component({
  selector: 'app-edu',
  templateUrl: './edu.component.html',
  styleUrls: ['./edu.component.scss']
})

export class EduComponent implements OnInit {

  docs: Array<EduDoc> = [
    {
      name: 'Hemodialysis',
      url: 'https://drive.google.com/uc?export=download&id=1CE879x5KcMp7dlDNQOSLnpWBuaV7PJnt'
    },
    {
      name: 'Peritoneal dialysis',
      url: 'https://drive.google.com/uc?export=download&id=1ugHcXCBTmCHURIh8Z9U-EsR2E_ygrFrB',
    },
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
