import { Component,OnInit } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ExportService } from '../export.service';
import { HttpClient } from '@angular/common/http';

interface Nominee {
  nomineeName: string;
  nomineeRelation: string;
  nomineeAddress: string;
  nomineeAadharNo: string;
}

interface FamilyDetail {
  familyName: string;
  familyDob: Date;
  familyRelation: string;
  familyAadharNo: string;
}

interface FormDataModel {
  name: string;
  fatherName: string;
  dob: Date;
  aadharNo: string;
  mobileNo: string;
  maritalStatus: string;
  gender: string;
  pan: string;
  presentAddress: string;
  permanentAddress: string;
  appointmentDate: Date;
  dispensaryPreferences: string;
  accountNo: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  nominees: Nominee[];
  familyDetails: FamilyDetail[];
  existingUAN: string;
  existingIPN: string;
  
  
  
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  compositeForm: FormGroup;
  submissionMessage: string = '';
  isSubmitted: boolean = false;
  //  nomineeFileName: string = '';
  // familyFileName: string = ''; 
  nomineeFile: string | null = null;
  familyFile: string | null = null;

  // DataSources for tables
  nomineeDataSource = new MatTableDataSource<any>();
  familyDataSource = new MatTableDataSource<any>();
  nomineeDisplayedColumns: string[] = ['nomineeName', 'nomineeRelation', 'nomineeAadharNo', 'actions'];
  familyDisplayedColumns: string[] = ['familyName', 'familyRelation', 'familyDob', 'familyAadharNo','actions'];

  constructor(private fb: FormBuilder,private exportService: ExportService,private http:HttpClient) {
    this.compositeForm = this.fb.group({
      name: ['', Validators.required],
      fatherName: ['', Validators.required],
      dob: ['', Validators.required],
      aadharNo: ['', Validators.required],
      mobileNo: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      gender: ['', Validators.required],
      pan: ['', Validators.required],
      presentAddress: ['', Validators.required],
      permanentAddress: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      dispensaryPreferences: [''],
      accountNo: ['', Validators.required],
      bankName: ['', Validators.required],
      branchName:['',Validators.required],
      ifscCode: ['', Validators.required],
      nominees: this.fb.array([]), // FormArray for nominees
      familyDetails: this.fb.array([]), // FormArray for family details
      existingUAN: [''],
      existingIPN: [''],
      nomineeFile: [[]],
      familyFile: [[]],
      
     
    });
  }

  ngOnInit(): void {
    this.nomineeDataSource.data = this.nominees.value;
    this.familyDataSource.data = this.familyDetails.value;
  }

  get nominees(): FormArray {
    return this.compositeForm.get('nominees') as FormArray;
  }

  get familyDetails(): FormArray {
    return this.compositeForm.get('familyDetails') as FormArray;
  }

   addNominee() {
    this.nominees.push(this.fb.group({
       nomineeName: ['', Validators.required],
      nomineeRelation: ['', Validators.required],
      nomineeAddress: ['', Validators.required],
       nomineeAadharNo: ['', Validators.required],
       nomineeFile: [''] 
     }));
     this.updateNomineeDataSource();
   }

  deleteNominee(index: number) {
     this.nominees.removeAt(index);
    this.updateNomineeDataSource();
    }

    editNominee(index: number) {
    const nominee = this.nominees.at(index).value;
      console.log('Editing Nominee: ', nominee);
     // Implement your edit logic here
 }

    saveNominee(index: number) {
     const nominee = this.nominees.at(index).value;
      console.log('Saving Nominee: ', nominee);
    // Implement your save logic here
  }


   private updateNomineeDataSource() {
     this.nomineeDataSource.data = this.nominees.value;
    }

    

      onNomineeFileChange(event: any): void {
        const file = event.target.files[0];
      if (file) {
          this.compositeForm.patchValue({ nomineeFile: file });
          console.log(`Nominee file uploaded: ${file.name}`);
        }
      }

    

  addFamilyDetail() {
    this.familyDetails.push(this.fb.group({
      familyName: ['', Validators.required],
      familyRelation: ['', Validators.required],
      familyDob: ['', Validators.required],
      familyAadharNo: ['', Validators.required],
      familyFile: [''] 
    }));
    this.updateFamilyDataSource();
  }

  deleteFamilyDetail(index: number) {
    this.familyDetails.removeAt(index);
    this.updateFamilyDataSource();
  }

  editFamilyDetail(index: number) {
    const family = this.familyDetails.at(index).value;
    console.log('Editing Family Member: ', family);
    // Implement your edit logic here
  }

  saveFamilyDetail(index: number) {
    const family = this.familyDetails.at(index).value;
    console.log('Saving Family Member: ', family);
    // Implement your save logic here
  }

  private updateFamilyDataSource() {
    this.familyDataSource.data = this.familyDetails.value;
  }

  onSaveNominee(index: number, event: Event) {
    event.preventDefault();
    this.saveNominee(index);
  }

  onEditNominee(index: number, event: Event) {
    event.preventDefault();
    this.editNominee(index);
  }

  onSaveFamilyDetail(index: number, event: Event) {
    event.preventDefault();
    this.saveFamilyDetail(index);
  }

  onEditFamilyDetail(index: number, event: Event) {
    event.preventDefault();
    this.editFamilyDetail(index);
  }

    onFamilyFileChange(event: any): void {
      const file = event.target.files[0];
    if (file) {
       this.compositeForm.patchValue({ familyFile: file });
      console.log(`Family file uploaded: ${file.name}`);
     }
    }

  
 

//   onSubmit() {
//     this.isSubmitted = true;
  
//     if (this.compositeForm.valid) {
//       const formData = new FormData();
  
//       // Append individual form controls to formData
//       Object.keys(this.compositeForm.controls).forEach(key => {
//         const control = this.compositeForm.get(key);
  
//         if (control instanceof FormArray) {
//           // For FormArrays (nominees and familyDetails)
//           control.value.forEach((item: any, index: number) => {
//             for (const subKey in item) {
//               if (subKey === 'nomineeFile' || subKey === 'familyFile') {
//                 // Handle file inputs separately
//                 const fileControl = control.at(index).get(subKey);
//                 if (fileControl && fileControl.value) {
//                   formData.append(`${key}[${index}].${subKey}`, fileControl.value, fileControl.value.name);
//                 }
//               } else {
//                 formData.append(`${key}[${index}].${subKey}`, item[subKey]);
//               }
//             }
//           });
//         } else {
//           formData.append(key, control?.value);
//         }
//       });
  
//       // Call the export service to download the Excel file
//       this.exportService.downloadExcel(formData).subscribe(
//         (response: Blob) => {
//           const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//           const url = window.URL.createObjectURL(blob);
//           const a = document.createElement('a');
//           a.href = url;
//           a.download = 'FormData.xlsx'; // The filename for the downloaded file
//           document.body.appendChild(a);
//           a.click();
//           document.body.removeChild(a);
//           window.URL.revokeObjectURL(url); // Clean up the object URL
  
//           this.submissionMessage = 'Form submitted successfully! Excel file is downloading.';
//         },
//         (error) => {
//           console.error('Error downloading the file:', error);
//           this.submissionMessage = 'Error occurred while submitting the form.';
//         }
//       );
  
//       // Reset the form after submission
//       this.compositeForm.reset();
//       this.nominees.clear();
//       this.familyDetails.clear();
//       this.updateNomineeDataSource();
//       this.updateFamilyDataSource();
//     } else {
//       this.submissionMessage = 'Please fill out all required fields.';
//     }
//   }
// } 


   onSubmit() {
       this.isSubmitted = true;
  
     if (this.compositeForm.valid) {
        const formData = new FormData();
  
        // Append individual form controls to formData
       Object.keys(this.compositeForm.controls).forEach(key => {
          const control = this.compositeForm.get(key);
  
        if (control instanceof FormArray) {
            // For FormArrays (nominees and familyDetails)
             control.value.forEach((item: any, index: number) => {
               for (const subKey in item) {
              formData.append(`${key}[${index}].${subKey}`, item[subKey]);
            }
          });
         } else {
             formData.append(key, control?.value);
         }
       });
  
       // Get nominee and family files from the form
         const nomineeFile = this.compositeForm.get('nomineeFile')?.value; // Adjust to your form control name
         const familyFile = this.compositeForm.get('familyFile')?.value; // Adjust to your form control name
         if (nomineeFile) {
         formData.append('nomineeFile', nomineeFile, nomineeFile.name);
         }
      if (familyFile) {
          formData.append('familyFile', familyFile, familyFile.name);
      }

    
  
       // Call the export service to download the Excel file
      this.exportService.downloadExcel(formData).subscribe(
           (response: Blob) => {
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
             const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
          a.download = 'FormData.xlsx'; // The filename for the downloaded file
           document.body.appendChild(a);
        a.click();
         document.body.removeChild(a);
             window.URL.revokeObjectURL(url); // Clean up the object URL
  
           this.submissionMessage = 'Form submitted successfully! Excel file is downloading.';
       },
                 (error) => {
            console.error('Error downloading the file:', error);
         this.submissionMessage = 'Error occurred while submitting the form.';
         }
       );
  
         // Reset the form after submission
        this.compositeForm.reset();
        this.nominees.clear();
        this.familyDetails.clear();
       this.updateNomineeDataSource();
      this.updateFamilyDataSource();
      } else {
         this.submissionMessage = 'Please fill out all required fields.';
      }
     }
   }
