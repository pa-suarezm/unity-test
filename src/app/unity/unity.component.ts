import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'unity',
  templateUrl: './unity.component.html',
  styleUrls: ['./unity.component.css']
})
export class UnityComponent implements OnInit {

  gameInstance: any;
  progress = 0;
  percentage = 0;
  isReady = false;

  //Examen físico
  examenFisico = "";
  imgUrl = "";
  audioUrl = "";

  //Ayudas diagnósticas
  labActual = 0;
  labsTotales = 0;

  titleLab = "";
  valorLab = "";
  pathLab = "";
  urlImgLab = "";

  titlesLab = [];
  valoresLab = [];
  pathsLab = [];

  labText = false;
  labImg = false;

  @ViewChild('contentImg')
  private contentImg: TemplateRef<any>;

  @ViewChild('contentAudio')
  private contentAudio: TemplateRef<any>;

  @ViewChild('contentLabs')
  private contentLabs: TemplateRef<any>;

  anteriorLab() {
    if (this.labActual == 0) {
      this.labActual = this.labsTotales - 1;
    }
    else {
      this.labActual--;
    }
    
    this.mostrarLab(this.labActual);
  }

  siguienteLab() {
    this.labActual++;
    this.labActual %= this.labsTotales;

    this.mostrarLab(this.labActual);
  }

  mostrarLab(index: number)
  {
    this.labActual = index;

    this.labText = false;
    this.labImg = false;

    //TO DO pasar las variables del lab actual
    this.titleLab = this.titlesLab[this.labActual];
    this.valorLab = this.valoresLab[this.labActual];
    this.pathLab = this.pathsLab[this.labActual];

    this.labText = (this.valorLab != "N/A");
    this.labImg = (this.pathLab != "N/A");

    if (this.labImg) {
      this.afStorage.ref(this.pathLab).getDownloadURL()
      .subscribe(
        downloadUrl => this.urlImgLab = downloadUrl,
        err => console.log('Observer got an error: ' + err),
        () => console.log('Obersever got a completion notification')
      );
    }
  }

  constructor(private afStorage: AngularFireStorage, private modalService: NgbModal) { }

  ngOnInit(): void {
    const loader = (window as any).UnityLoader;

    this.gameInstance = loader.instantiate(
      'gameContainer', 
      '/assets/Build/Builds.json', {
      onProgress: (gameInstance: any, progress: number) => {
          this.progress = Math.round(progress);
          this.percentage = Math.round(progress*100)
          if (progress === 1) {
            this.isReady = true;
          }
        }
      });

    //Se exponen estas funciones a Unity
    (window as any).lanzarModalConImg = (imgUrl: string, title: string) => {

      this.afStorage.ref(imgUrl).getDownloadURL()
      .subscribe(
        downloadUrl => this.imgUrl = downloadUrl,
        err => console.log('Observer got an error: ' + err),
        () => {
          //Cuando se mande la notificación de completado
          this.examenFisico = title;

          this.modalService.open(this.contentImg, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            console.log(`Closed with: ${result}`);
          }, (reason) => {
            console.log(`Dismissed ${reason}`);
          });
        }
      );
    }

    (window as any).lanzarModalConAudio = (audioUrl: string, title: string) => {

      this.afStorage.ref(audioUrl).getDownloadURL()
      .subscribe(
        downloadUrl => this.audioUrl = downloadUrl,
        err => console.log('Observer got an error: ' + err),
        () => {
          //Cuando se mande la notificación de completado
          this.examenFisico = title;

          this.modalService.open(this.contentAudio, {ariaLabelledBy: 'modal-basic-title'}).result
          .then(
            (result) => {}, 
            (reason) => {}
          );
        }
      );
    }

    (window as any).lanzarModalLabs = () => {

      this.modalService.open(this.contentLabs, {ariaLabelledBy: 'modal-basic-title'}).result
      .then(
        (result) => {}, 
        (reason) => {}
      );

      this.mostrarLab(0);
    }

    (window as any).agregarLab = (title: string, valor: string, path: string) => {

      this.labsTotales++;

      this.titlesLab.push(title);
      this.valoresLab.push(valor);
      this.pathsLab.push(path);

    }

    (window as any).eliminarLabs = () => {

      this.titlesLab = [];
      this.valoresLab = [];
      this.pathsLab = [];

      this.labActual = 0;
      this.labsTotales = 0;

    }
  }

}
