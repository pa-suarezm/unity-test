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

  mostrarExamenFisico = false;
  examenFisico = "";
  imgUrl = "";

  constructor(private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
    const loader = (window as any).UnityLoader;
    
    //Se expone esta función a Unity
    (window as any).examenFisicoChangeListener = (examenFisico: string) => {
      this.examenFisico = examenFisico;
    }

    //Se expone esta función a Unity
    (window as any).setFirebaseImgURL = (imgUrl: string) => {
      var finalUrl;
      this.mostrarExamenFisico = false;
      this.afStorage.ref(imgUrl).getDownloadURL()
      .subscribe(
        downloadUrl => finalUrl = downloadUrl,
        err => console.log('Observer got an error: ' + err),
        () => {
          this.imgUrl = finalUrl;
          this.mostrarExamenFisico = true;
        }
      );
    }

    (window as any).quitarImagen = () => {
      this.mostrarExamenFisico = false;
    }

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
  }

}
