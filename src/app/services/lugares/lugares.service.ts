import { Injectable } from '@angular/core';

import { Configurl} from '../config'
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LugaresService {
  url=Configurl.url
  urlInsert=this.url+"usuarios"
  urlSelect=this.url+"usuarios/select"
  urlUpdate=this.url+"usuarios/modificar"
  urlDelete=this.url+"usuarios/eliminar"
  headers= new HttpHeaders({
    'Content-Type':  'application/json',
    'X-CSRF-TOKEN':"token",
    'Authorization':"token"
  })
  constructor(private http:HttpClient) { }
  //tipo ejercicios
  crearcurso(datos,id){
    console.log("service",datos);
    console.log(id);
    
    
    let sql="INSERT into datos_ins (lat,lng,idusuario,nombregym,zoom,direccion) VALUES (?,?,?,?,?,?)"
    let values=[datos.lat,datos.lng,id,datos.gym,datos.zoom,datos.direccion]
    return this.http.post<any>(this.urlInsert,{sql:sql,values:values},{headers:this.headers})
    .toPromise()
  }

     //listar cursos
  listarlugaresadm(id_usuario){
    let sql=`select * 
    from datos_ins 
    where idusuario=?`
    let values=[id_usuario]
    return this.http.post<any>(this.urlSelect,{sql:sql,values:values},{headers:this.headers})
    .toPromise()
  }

  listarlugares(id_usuario,estado){
    let sql=`select * 
    from datos_ins 
    where estado=? and idusuario=?`
    let values=[estado,id_usuario]
    return this.http.post<any>(this.urlSelect,{sql:sql,values:values},{headers:this.headers})
    .toPromise()
  }
  listarlUnlugar(id_datosins){
    let sql=`select * 
    from datos_ins 
    where  iddatos_ins=?`
    let values=[id_datosins]
    return this.http.post<any>(this.urlSelect,{sql:sql,values:values},{headers:this.headers})
    .toPromise()
  }

  
  modlugar(datos,id){
    console.log("mod",datos);
    let sql =  ` 
    UPDATE datos_ins 
    set lat=?,lng=?,nombregym=?,zoom=?, direccion=?
    where iddatos_ins=?`
    let values = [datos.lat,datos.lng,datos.gym,datos.zoom,datos.direccion,id]
    return this.http.post(this.urlUpdate, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }

  eliminar(id,estado){
    let sql = ` 
    UPDATE datos_ins 
    set estado=?
    where iddatos_ins=?`
    let values = [estado,id]
    return this.http.post(this.urlUpdate, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }
}
