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

  examenFisico = "";
  imgUrl = "https://i.imgur.com/Z1mAEjG.png";

  

  constructor(private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
    const loader = (window as any).UnityLoader;

    (window as any).examenFisicoChangeListener = (examenFisico: string) => {
      this.examenFisico = examenFisico;
    }

    (window as any).setFirebaseImgURL = (imgUrl: string) => {
      const observer = {
        next: completion => console.log('Observer got a next value: ' + completion),
        error: err => console.log('Observer got an error: ' + err),
        complete: () => console.log('Observer got a complete notification')
      };

      var downloadSub= this.afStorage.ref(imgUrl).getDownloadURL()
      .subscribe(
        completion => {
          console.log('Observer got a next value: ' + completion)
          this.imgUrl = completion;
        },
        err => console.log('Observer got an error: ' + err),
        () => {
          console.log('Observer got a complete notification');
        }
      );

      
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
