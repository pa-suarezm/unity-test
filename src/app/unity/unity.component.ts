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
  isReady = false;

  examenFisico = "";
  imgUrl = "";
  audioUrl = "";

  @ViewChild('contentImg')
  private contentImg: TemplateRef<any>;

  @ViewChild('contentAudio')
  private contentAudio: TemplateRef<any>;

  constructor(private afStorage: AngularFireStorage, private modalService: NgbModal) { }

  ngOnInit(): void {
    const loader = (window as any).UnityLoader;

    this.gameInstance = loader.instantiate(
      'gameContainer', 
      '/assets/Build/Builds.json', {
      onProgress: (gameInstance: any, progress: number) => {
          this.progress = progress;
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

          this.modalService.open(this.contentAudio, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            console.log(`Closed with: ${result}`);
          }, (reason) => {
            console.log(`Dismissed ${reason}`);
          });
        }
      );
    }
  }

}
