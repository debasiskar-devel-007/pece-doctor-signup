import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MetaService } from '@ngx-meta/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { MatSnackBar } from '@angular/material';
import { SuccessModalComponent } from './success-modal/success-modal.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  // scroll(el: HTMLElement) {
  //   el.scrollIntoView({behavior: "smooth"});
  // }

  email = new FormControl('', [Validators.required, Validators.email]);
  public reportView: any = [
    { id: '1', images: 'https://all-frontend-assets.s3.amazonaws.com/pece-doctor-signup/assets/images/report1.jpg' },
    { id: '2', images: 'https://all-frontend-assets.s3.amazonaws.com/pece-doctor-signup/assets/images/report2.jpg' },
    { id: '3', images: 'https://all-frontend-assets.s3.amazonaws.com/pece-doctor-signup/assets/images/report3.jpg' },
    { id: '4', images: 'https://all-frontend-assets.s3.amazonaws.com/pece-doctor-signup/assets/images/report4.jpg' },
  ];

  public userId: string = '';
  public parentType: string = 'admin';
  public doctorSignUpForm: FormGroup;
  public states: any;
  public allCities: any;
  public cities: any;

  constructor(public dialog: MatDialog, public meta: MetaService, private route: ActivatedRoute, public formBuilder: FormBuilder, public apiService: ApiService, public matSnackBar: MatSnackBar) {
    /* Set Meta Data */
    this.meta.setTitle('AWS - Diagnostic Center Services');
    this.meta.setTag('description', 'The Advanced Wellness Solutions Smart Engagement Form available to doctors through Diagnostic Center Services offers Actionable Data for Doctors and Physicians to utilize for better treatment of their patients.');
    this.meta.setTag('keywords', 'Diagnostic Center Services AWS, AWS Diagnostic Center Services, Advanced Wellness Solutions Diagnostic Center Services.');

    // Get data from routes
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');

      // fetch parent data
      let postData: any = {
        user_id: this.userId
      };
      this.apiService.httpViaPost('https://trtss4n5ff.execute-api.us-east-1.amazonaws.com/dev/api1/list-doctorsignup-data', postData).subscribe((response: any) => {
        if (response.status == "success") {
          this.userId = response.res[0]._id;
          this.parentType = response.res[0].user_type;
          if(this.parentType == 'sales_person') {
            // code            
          }
        }
      }, (error) => {
        console.log("Error occord.");
      });
    });

    this.doctorSignUpForm = this.formBuilder.group({
      "firstname":        ['', [ Validators.required, Validators.maxLength(100) ]],
      "lastname":         ['', [ Validators.required, Validators.maxLength(100) ]],
      "email":            ['', [ Validators.required, Validators.email, Validators.maxLength(100) ]],
      "phone":            ['', [ Validators.required, Validators.maxLength(30) ]],
      "fax":              ['', [ Validators.maxLength(30) ]],
      "practice_name":    ['', [ Validators.required, Validators.maxLength(100) ]],
      "npi":              ['', [ Validators.required, Validators.maxLength(100) ]],
      "address":          ['', [ Validators.required, Validators.maxLength(200) ]],
      "zip":              ['', [ Validators.required, Validators.maxLength(20) ]],
      "city":             ['', [ Validators.required, Validators.maxLength(50) ]],
      "state":            ['', [ Validators.required, Validators.maxLength(50) ]],
      "user_type":        ['doctor', [] ],
      "taxo_list":        ['', []],
      "status":           [0, [] ],
      "password":         ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(20) ]],
      "confirmpassword":  ['', [ Validators.required ]],
      "parent_id":        ['', [] ],
      "parent_type":      ['', []],
      "cpt_validate_amount": [12, []]
    },
    { validators: this.matchpassword('password', 'confirmpassword') });

    // Get all city and state data
    this.allStateCityData();
  }

  matchpassword(passwordkye: string, confirmpasswordkye: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordkye],
        confirmpasswordInput = group.controls[confirmpasswordkye];
      if (passwordInput.value !== confirmpasswordInput.value) {
        return confirmpasswordInput.setErrors({ notEquivalent: true });
      } else {
        return confirmpasswordInput.setErrors(null);
      }
    };
  }

  createDoctor() {
    for (let x in this.doctorSignUpForm.controls) {
      this.doctorSignUpForm.controls[x].markAsTouched();
    }

    /* stop here if form is invalid */
    if (this.doctorSignUpForm.valid) {
      delete this.doctorSignUpForm.value.confirmpassword;

      if (this.doctorSignUpForm.value.status) {
        this.doctorSignUpForm.value.status = parseInt("1");
      } else {
        this.doctorSignUpForm.value.status = parseInt("0");;
      }

      /* start process to submited data */
      var postData: any = {
        "source": "data_pece",
        "data": this.doctorSignUpForm.value
      };

      postData.data.parent_id = this.userId;
      postData.data.parent_type = this.parentType;

      this.apiService.httpViaPost('https://trtss4n5ff.execute-api.us-east-1.amazonaws.com/dev/api1/add-doctorsignup-data', postData).subscribe((response: any) => {
        if (response.status == "success") {
          const dialogRef = this.dialog.open(SuccessModalComponent, {
            data: { 
              header: "Successfully Submitted !!", 
              message: "Thank you for your interest. We will contact you soon."
            },
            panelClass:'successModal'
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log("Modal Close.");
          });

          this.doctorSignUpForm.reset();
        } else {
          const dialogRef = this.dialog.open(SuccessModalComponent, {
            data: { 
              header: "Sorry !!", 
              message: response.message 
            },
            panelClass:'successModal'
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log("Modal Close.");
          });
        }
      }, (error) => {
        this.matSnackBar.open("Some error occurred. Please try again.", "", {
          duration: 4000,
        });
      });
    }
  }

  ngOnInit() {}

  allStateCityData() {
    this.apiService.getSiteSettingData("./assets/data-set/state.json").subscribe(response => {
      this.states = response;
    });

    this.apiService.getSiteSettingData("./assets/data-set/city.json").subscribe(response => {
      this.allCities = response;    
    });
  }

  getCity(event) {
    var val = event;
    this.cities = this.allCities[val];
  }

  viewMore(val: any) {
    const dialogRef = this.dialog.open(ViewDetails, {
      data: val,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  scrollToElement($element) {
    $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

}


@Component({
  selector: 'view-details',
  templateUrl: './../viewDetails.html',
  styleUrls: ['./landing-page.component.css']
})
export class ViewDetails {
  public activeId = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}