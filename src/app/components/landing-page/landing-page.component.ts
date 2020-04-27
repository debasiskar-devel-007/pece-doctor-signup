import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  // scroll(el: HTMLElement) {
  //   el.scrollIntoView({behavior: "smooth"});
  // }


public reportView:any=[
  {id:'1', images:'../../../assets/images/report1.jpg'},
  {id:'2', images:'../../../assets/images/report2.jpg'},
  {id:'3', images:'../../../assets/images/report3.jpg'},
  {id:'4', images:'../../../assets/images/report4.jpg'},
];
  constructor( public dialog:MatDialog) { }

  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
  ngOnInit() {
    
  }

  viewMore(val:any){ 
    const dialogRef = this.dialog.open(ViewDetails, {
      data:val,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  scrollToElement($element) {
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
  
 
}


@Component({ 
  selector: 'view-details',
  templateUrl: './../viewDetails.html',
  styleUrls: ['./landing-page.component.css']
})
export class ViewDetails {
  public activeId = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any){ }
 
}