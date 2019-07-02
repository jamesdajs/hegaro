import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { RutinaProvider } from 'src/app/services/rutina/rutina';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  imagenes = []
  datos = {
    descripcion: "",
    instrucciones: "",
    linkyoutube: "",
    nombre: ""
  }
  youtubeaux: SafeResourceUrl
  idejer
  constructor(
    private Aroute: ActivatedRoute,
    private rutina:RutinaProvider,
    public sanitizer: DomSanitizer,
  ) {
    for (let key in this.datos)
      this.datos[key] = this.Aroute.snapshot.paramMap.get(key)
    if (this.datos.linkyoutube != "" && this.datos.linkyoutube)
      this.youtubeaux = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + /[^/]+$/.exec(this.datos.linkyoutube)[0])

      this.idejer = this.Aroute.snapshot.paramMap.get('idejercicios')
      this.cargarImagenes()
  }

  ngOnInit() {
  }
  cargarImagenes() {
    this.rutina.listarImagenesEjercicios(this.idejer)
      .then(data => this.imagenes = data)
  }
}
