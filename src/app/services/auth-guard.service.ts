import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private routes:Router,private storage:Storage) { }

  async canActivate(route: ActivatedRouteSnapshot){

    let rol=await this.storage.get('rol')
    console.log('rol :'+rol);
    
    if(rol=='alumno'){
      return true;
    }else{
      this.routes.navigate(['/adm'])
      return false
    }
  }
}
