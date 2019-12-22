import { Injectable } from '@angular/core';
import{HttpClient, HttpHeaders} from '@angular/common/http';
import {Response, RequestOptions} from '@angular/http';
import { observable } from 'rxjs';
import{map} from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private fb: FormBuilder ,private http: HttpClient) { }
  readonly BaseURI='https://eflearning.azurewebsites.net';

  formModel = this.fb.group({
  name:['', Validators.required],
  surname:['', Validators.required],
  username:['', Validators.required],
  email:['', Validators.email ],
  Passwords: this.fb.group({
    password:['', [Validators.required, Validators.minLength(4)]],
  confirmPassword:['', Validators.required],
  }, {validator: this.comparePasswords}) 
  
});
comparePasswords(fb: FormGroup){

  let confirmPswCtrl = fb.get('confirmPassword')
  if(confirmPswCtrl.errors == null || 'passwordMismatch' in confirmPswCtrl.errors){
    if(fb.get('password').value != confirmPswCtrl.value)
    confirmPswCtrl.setErrors({passwordMismatch:true});
    else
    confirmPswCtrl.setErrors(null);
  }
}
  registerUser(){

    const body= {
      name : this.formModel.value.name,
      surname : this.formModel.value.surname,
      username : this.formModel.value.username,
      email : this.formModel.value.email,
      password : this.formModel.value.Passwords.password,
      confirmPassword :this.formModel.value.Passwords.password,

    }
    return this.http.post(this.BaseURI + '/api/Account/Register',body);
  }

  login(formData){
    return this.http.post(this.BaseURI + '/api/Account/AccessToken',formData);
  }

  getCurrentUser(id){
    // let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: });
    console.log(id);
    return this.http.get(this.BaseURI + '/api/User/GetUserByIdWithRoleAsync/'+ id);
  }
  // getCurrentUser(email){
  //   var tokenHeader = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')})
  //   return this.http.get(this.BaseURI + '/api/Account/CurrentUser',{headers: tokenHeader});
  // }
}
