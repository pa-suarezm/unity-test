import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'unity',
  templateUrl: './unity.component.html',
  styleUrls: ['./unity.component.css']
})
export class UnityComponent implements OnInit {

  gameInstance: any;
  progress = 0;
  isReady = false;

  mostrarImgExamenFisico = false;
  mostrarVideoExamenFisico = false;
  mostrarAudioExamenFisico = false;

  examenFisico = "";
  imgUrl = "";

  constructor(private afStorage: AngularFireStorage) { }

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

    //Se expone esta función a Unity
    (window as any).examenFisicoChangeListener = (examenFisico: string) => {
      this.examenFisico = examenFisico;
    }

    //Se expone esta función a Unity
    (window as any).setFirebaseImgURL = (imgUrl: string) => {
      var finalUrl;

      this.mostrarImgExamenFisico = false;
      this.mostrarVideoExamenFisico = false;
      this.mostrarAudioExamenFisico = false;
      
      this.afStorage.ref(imgUrl).getDownloadURL()
      .subscribe(
        downloadUrl => finalUrl = downloadUrl,
        err => console.log('Observer got an error: ' + err),
        () => {
          //this.imgUrl = finalUrl;
          this.mostrarImgExamenFisico = true;

          this.examenFisico = finalUrl;

          //Llama a la funcion de Unity para renderizar la imagen en el simulador
          this.gameInstance.SendMessage('Panel_audiovisuales', 'renderImgDesdeUrl', finalUrl);

          this.imgUrl = finalUrl;
        }
      );
    }
  }

}
