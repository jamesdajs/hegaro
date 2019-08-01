
import { Injectable } from '@angular/core';

import { Cliente, firebaseConfig } from "../../app.config";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { Observable } from 'rxjs/Observable';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from 'angularfire2/storage';

import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configurl } from '../config';
import { Storage } from '@ionic/storage';

//import * as firebase from "firebase";
/*
  Generated class for the UsuarioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable({ providedIn: 'root' })
export class UsuarioProvider {
  cliente: AngularFirestoreCollection<Cliente>;

  private clientedoc: AngularFirestoreDocument<Cliente>;
  constructor(
    private db: AngularFirestore,
    private store: AngularFireStorage,
    private authfb: AngularFireAuth,
    private http: HttpClient,
    private storage:Storage
  ) {
    console.log('Hello UsuarioProvider Provider');
    this.cliente = db.collection<Cliente>(firebaseConfig.cliente_endpoint);
  }
  /*versihaysolicitud(idins){
    let query=res=>res.where("idcliente","==",this.authfb.auth.currentUser.uid)
                      .where("idinstructor","==",idins)
                      .where("rol","==","cliente")
    return this.getcollArrayconkey("instructor_cliente",query)
  }
  verMissolicitud(estado,rol){
    let query=res=>res.where("idinstructor","==",this.authfb.auth.currentUser.uid)
                      .where("estado","==",estado)
                      .where("rol","==",rol)
    return this.getcollArrayconkey("instructor_cliente",query)
  }
  modificarinstructor_cliente(id,data){
    return this.db.collection("instructor_cliente").doc(id).set(data,{ merge: true })
  }
  addcliente(cli){
    this.cliente.add(cli)
  }
  crearusuario(id,data){
    return this.db.collection("cliente").doc(id).set(data,{ merge: true })
  }
  modusuario(data){
    return this.db.collection("cliente").doc(this.authfb.auth.currentUser.uid).set(data,{ merge: true })
  }
  
  
  buscarinstuctor(buscar){
    let query=res=>res.where("instructor","==",true)
                      .orderBy('fullname')
                      .startAt(buscar)
    return this.getcollArrayconkey("cliente",query)
  }
  verMisinstuctor(){
    let query=res=>res.where("idcliente","==",this.authfb.auth.currentUser.uid)
                      .where("estado","==",true)
                      .where("rol","==","instructor")
    return this.getcollArrayconkey("instructor_cliente",query)
  }
  verMisinstuctorPronesa(){
    let query=res=>res.where("idcliente","==",this.authfb.auth.currentUser.uid)
    return new Promise((res,rej)=>{
      this.getcollArrayconkey("instructor_cliente",query)
      .subscribe(data=>{
        res(data)
      },rej)
    })
    
  }
  updateTask(id, update) {
 
    this.clientedoc = this.db.doc<Cliente>(`${firebaseConfig.cliente_endpoint}/${id}`);
 
    this.clientedoc.update(update);
 
 }
 
guardarSolicitud(data){
  return this.db.collection("instructor_cliente").add(data)
}
verSitienenDatos() {
  return new Promise((resolve, reject) => {
    this.db.collection("cliente").doc(this.authfb.auth.currentUser.uid).valueChanges()
     .subscribe((response: any) => {
        resolve(response); 
      }, reject); 
    })
  }
  VerSiestaLogeado(){
    return  new Promise(resolve=>{

      this.authfb.auth.onAuthStateChanged(function(user) {
        if (user) {
          resolve(true)
        }else{
          resolve(false)
        }
      })
    })
  }
 deleteTask(id) {

  //Get the task document

  this.clientedoc = this.db.doc<Cliente>(`${firebaseConfig.cliente_endpoint}/${id}`);

  //Delete the document

  this.clientedoc.delete();

}
  private getArrayconkey():Observable<any>{
    return this.db.collection<Cliente>(firebaseConfig.cliente_endpoint,res => {
      return res.where("genero", "==", true)
    })
    .snapshotChanges().pipe(map(change=>{
      return change.map(c=>({key:c.payload.doc.id, ...c.payload.doc.data()}))
    }))
  }
  leerdatos(){
    return this.getArrayconkey()
  }
  leermisdatos(){
    
    return this.db
    .doc<Cliente>(`${firebaseConfig.cliente_endpoint}/${this.authfb.auth.currentUser.uid}`)
    .valueChanges()
    //this.db.collection('cliente').doc("OwURqGHpPggxLbTlKp0L").valueChanges()
    
  }
  guardarrutinacliente(keycli,datos){
    datos["idinstructor"]=this.authfb.auth.currentUser.uid
    datos["estado"]=false
    return this.db.collection(`cliente/${keycli}/rutinas`).add(datos)
  }
  guardarRutina_ejercicio(data){
    return this.db.collection(`rutina_ejer`).add(data)
  }
  guardarRutina_cliente(data){
    return this.db.collection(`instructor_cliente`).add(data)
  }
  
  guardarDietacliente(keycli,datos){
    datos["idinstructor"]=this.authfb.auth.currentUser.uid
    datos["estado"]=false
    return this.db.collection(`cliente/${keycli}/dietas`).add(datos)
  }
  guardarDietas_dieta(data){
    return this.db.collection(`dietas_dieta`).add(data)
  }
  datosCliente(id){
    
    return this.db
    .doc<Cliente>(`${firebaseConfig.cliente_endpoint}/${id}`)
    .valueChanges()
    //this.db.collection('cliente').doc("OwURqGHpPggxLbTlKp0L").valueChanges()
    
  }
  leerOtrosdatos(datos){
    
    return this.db
    .doc<Cliente>(`${firebaseConfig.cliente_endpoint}/${datos}`)
    .valueChanges()
    //this.db.collection('cliente').doc("OwURqGHpPggxLbTlKp0L").valueChanges()
    
  }
  creardatosInstructor(datos){
    return this.db.collection(`${firebaseConfig.cliente_endpoint}/${this.authfb.auth.currentUser.uid}/instructor`)
    .doc("modo_instructor").set(datos,{ merge: true })
  }
  modificardatocli(id,data){
    return this.db.collection("instructor_cliente").doc(id).set(data,{ merge: true })
  }
  leerOtrosdatosinstructor(datos):any{
    
    return this.db
    .doc(`${firebaseConfig.cliente_endpoint}/${datos}/instructor/modo_instructor`)
    .valueChanges()
    //this.db.collection('cliente').doc("OwURqGHpPggxLbTlKp0L").valueChanges()
    
  }
  leerMisdatosinstructor():any{
    
    return this.db
    .doc(`${firebaseConfig.cliente_endpoint}/${this.authfb.auth.currentUser.uid}/instructor/modo_instructor`)
    .valueChanges()
    //this.db.collection('cliente').doc("OwURqGHpPggxLbTlKp0L").valueChanges()
    
  }
  leermisdatosPromesa():Promise<Cliente>{
    
    return new Promise((res,rej)=>{
      this.db
      .doc<Cliente>(`${firebaseConfig.cliente_endpoint}/${this.authfb.auth.currentUser.uid}`)
      .valueChanges()
      .subscribe(datos=>{
        res(datos)
      },rej)
    })
    
    //this.db.collection('cliente').doc("OwURqGHpPggxLbTlKp0L").valueChanges()
    
  }
  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  uploadImage(imageURI){
    return new Promise<any>((resolve, reject) => {
      let storageRef = this.store.ref("cliente/juan")
      this.encodeImageUri(imageURI, function(image64){
        storageRef.putString(image64, 'data_url')
        .then(snapshot => {
          resolve(snapshot.downloadURL)
        }, err => {
          reject(err);
        })
      })
    })
  }*/
  //Firebase
  
  //mysql
  urlInsert = Configurl.url + "usuarios"
  urlSelect = Configurl.url + "usuarios/select"
  urlUpdate = Configurl.url + "usuarios/modificar"
  urlDelete = Configurl.url + "usuarios/eliminar"
  urlsql = Configurl.url +"consultas/crear"

    headers = new HttpHeaders({
      "Content-Type": "application/json"
    })
  guardaridlocal(){
    this.storage.set('idusuario', this.authfb.auth.currentUser.uid);
  }
  guardarusuario(Datos) {
    let sql = '', values = []
    if (Datos.correo) {
      sql = "INSERT into  usuarios (idusuarios,idfacebook,fullname,foto,correo,token) VALUES (?,?,?,?,?,?)"
      values = [this.authfb.auth.currentUser.uid,Datos.id, Datos.name, Datos.foto, Datos.email,Datos.token]
    } else {
      sql = "INSERT into  usuarios (idusuarios,idfacebook,fullname,foto,token) VALUES (?,?,?,?,?)"
      values = [this.authfb.auth.currentUser.uid,Datos.id, Datos.name, Datos.foto,Datos.token]
    }

    return this.http.post(this.urlInsert, { sql: sql, values: values }, { headers: this.headers})
      .toPromise()
  }
  actualizarusuario(Datos,idusu) {
    let sql = '', values = []
    if (Datos.correo) {
      sql = "update usuarios set fullname=?,foto=?,correo=?, token=? where idusuarios = ?"
      values = [Datos.name, Datos.foto, Datos.correo,Datos.token, idusu]

    } else {
      sql = "update usuarios set fullname=?,foto=?, token=? where idusuarios = ?"
      values = [Datos.name, Datos.foto,Datos.token, idusu]
    }
    console.log('actualizar usuario',sql,values,JSON.stringify(Datos));
    
    return this.http.post(this.urlUpdate, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }
  guardarusuariosintoken(Datos) {
    let sql = '', values = []
    if (Datos.email) {
      sql = "INSERT into  usuarios (idusuarios,idfacebook,fullname,foto,correo) VALUES (?,?,?,?,?)"
      values = [this.authfb.auth.currentUser.uid,Datos.id, Datos.name, Datos.foto, Datos.email]
    } else {
      sql = "INSERT into  usuarios (idusuarios,idfacebook,fullname,foto) VALUES (?,?,?,?)"
      values = [this.authfb.auth.currentUser.uid,Datos.id, Datos.name, Datos.foto]
    }

    return this.http.post(this.urlInsert, { sql: sql, values: values }, { headers: this.headers})
      .toPromise()
  }

  actualizarusuariosintoken(Datos,idusu) {
    let sql = '', values = []
    if (Datos.email) {
      sql = "update usuarios set fullname=?,foto=?,correo=? where idusuarios = ?"
      values = [Datos.name, Datos.foto, Datos.email, idusu]
    } else {
      sql = "update usuarios set fullname=?,foto=? where idusuarios = ?"
      values = [Datos.name, Datos.foto, idusu]
    }
    console.log('actualizar usuario AQUI ',sql,values,JSON.stringify(Datos));
    return this.http.post(this.urlUpdate, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
    
  }
  actualizarusuariodatosnormales(Datos, id) {
    let sql = "update usuarios set fechanac = ?,peso = ?,altura=?,genero=?,telefono=?,correo=? where idusuarios = ?"
    let values = [Datos.fechanac.substring(0,10), Datos.peso, Datos.altura, Datos.genero, Datos.telefono,Datos.correo, id]
    return this.http.post(this.urlUpdate, { sql: sql, values: values }, { headers: this.headers})
      .toPromise()
  }
  creardatosInstructor(Datos:{descripcion:string,direccion:string,lat:string,lng:string,zoom:string}, id) {
    let sql = `INSERT INTO datos_ins (iddatos_ins,descripcion,direccion, lat, lng,zoom)
     VALUES(?, ?, ?,?,?,?) `
    let values = [
      id, Datos.descripcion, Datos.direccion, Datos.lat, Datos.lng, Datos.zoom
    ]
    return this.http.post(this.urlUpdate, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }
  modificardatosInstructor(Datos:{descripcion:string,direccion:string,lat:string,lng:string,zoom:string}, id) {
    let sql = ` 
     UPDATE datos_ins set descripcion=?,direccion=?, lat=?, lng=?,zoom=? where iddatos_ins=?` 
    let values = [
      Datos.descripcion, Datos.direccion, Datos.lat, Datos.lng, Datos.zoom,id
    ]
    return this.http.post(this.urlUpdate, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }
  listarusuarios() {
    let sql = "select * from usuarios"
    let values = []
    return this.http.post(this.urlSelect, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }
  verUsuarioIDfb(idfb): Promise<any> {
    let sql = "select * from usuarios where idfacebook=?"
    let values = [idfb]
    return this.http.post(this.urlSelect, { sql: sql, values: values })
      .toPromise()
  }
  verUsuarioIDdbalumno(id): Promise<any> {
    let sql = "select * from usuarios where idusuarios=? "
    let values = [id]
    return this.http.post(this.urlSelect, { sql: sql, values: values }, { headers: this.headers})
      .toPromise()
  }
  verUsuarioIDdbinstructor(id):Promise<any> {
    let sql = "select * from usuarios u, datos_ins d where u.idusuarios=? and	d.idusuario=u.idusuarios"
    let values = [id]
    return this.http.post(this.urlSelect, { sql: sql, values: values}, { headers: this.headers})
      .toPromise()
    //return this.http.post<[]>(this.urlSelect, { sql: sql, values: values }, { headers: this.headers })
  }
  consultas() {
    let sql = "ALTER TABLE datos_ins ADD COLUMN direccion varchar(100) not null"
    let values = []
    return this.http.post(this.urlSelect, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }

  guardarhorario(idtipo_horario,cant,dia,hi,hf) {
    let sql = '', values = []
    sql = "INSERT into horarios (idtipo_horario,cantidad,dia,hora_ini,hora_fin) VALUES (?,?,?,?,?)"
    values = [idtipo_horario,cant,dia,hi,hf]
    return this.http.post(this.urlInsert, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }
  guardarTipohorario(idusu,nombre) {
    let sql = '', values = []
    sql = "INSERT into tipo_horario (nombre,idusuario) VALUES (?,?)"
    values = [nombre,idusu]
    return this.http.post(this.urlInsert, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }
  listarTipohorario(id):Promise<any>{
    let sql = "select * from tipo_horario where idusuario=?"
    let values = [id]
    return this.http.post(this.urlSelect, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }
  modificarestadotipohorario(idtipo,estado) {
    let sql = "update tipo_horario set estado=? where idtipo_horario = ?"
    let values = [estado,idtipo]
    return this.http.post(this.urlUpdate, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }
  modificarNombretipohorario(idtipo,nombre) {
    let sql = "update tipo_horario set nombre=? where idtipo_horario = ?"
    let values = [nombre,idtipo]
    return this.http.post(this.urlUpdate, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }
  //RECUPERAR HORARIO DE USUARIO
  mishorarios(id):Promise<any> {
    let sql = "select h.*, (SELECT COUNT(id_horario) FROM registro_horarios WHERE id_horario=h.idhorarios)AS contador from horarios h where h.idtipo_horario=?"
    let values = [id]
    return this.http.post(this.urlSelect, { sql: sql, values: values}, { headers: this.headers })
      .toPromise()
  }

  modificarhorario(cantidad,horai,horaf,id) {
    let sql = "update horarios set cantidad=?,hora_ini=?,hora_fin=? where idhorarios = ?"
    let values = [cantidad,horai,horaf,id]
    return this.http.post(this.urlUpdate, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }

  //ELIMINAR HORARIO
  eliminarhorario(id){
    let sql = "delete from horarios where idhorarios=?"
    let values = [id]
    return this.http.post(this.urlDelete, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }

  //verifica si existe un alumno con este horario
  verificarhorario(id):Promise<any>{
    let sql = "select * from registro_horarios where id_horario=?"
    let values = [id]
    return this.http.post(this.urlSelect, { sql: sql, values: values }, { headers: this.headers })
      .toPromise()
  }

  //guardar token fcm

}
