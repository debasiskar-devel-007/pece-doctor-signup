import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import { MetaService } from '@ngx-meta/core';

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
  {id:'1', images:'https://all-frontend-assets.s3.amazonaws.com/pece-doctor-signup/assets/images/report1.jpg'},
  {id:'2', images:'https://all-frontend-assets.s3.amazonaws.com/pece-doctor-signup/assets/images/report2.jpg'},
  {id:'3', images:'https://all-frontend-assets.s3.amazonaws.com/pece-doctor-signup/assets/images/report3.jpg'},
  {id:'4', images:'https://all-frontend-assets.s3.amazonaws.com/pece-doctor-signup/assets/images/report4.jpg'},
];
  constructor(public dialog: MatDialog, public meta: MetaService) {
    /* Set Meta Data */
    this.meta.setTitle('AWS - Diagnostic Center Services');
    this.meta.setTag('description', 'The Advanced Wellness Solutions Smart Engagement Form available to doctors through Diagnostic Center Services offers Actionable Data for Doctors and Physicians to utilize for better treatment of their patients.');
    this.meta.setTag('keywords', 'Diagnostic Center Services AWS, AWS Diagnostic Center Services, Advanced Wellness Solutions Diagnostic Center Services.');
  }

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