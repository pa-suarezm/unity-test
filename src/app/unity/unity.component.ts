import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    const loader = (window as any).UnityLoader;

    (window as any).examenFisicoChangeListener = (examenFisico: string) => {
      this.examenFisico = examenFisico;
    }

    (window as any).setFirebaseImgURL = (imgUrl: string) => {
      this.imgUrl = imgUrl;
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
