import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WavesService {
  waveBaseCount = [2, 3, 3, 3, 4, 5]; // how many waves for each level (0xlevel1, 5xlevel3)
  marksPerGrid = 3; // number of possible camber marks inside a 9-grid
  waves: number[][][] = [];
  resolved: number[][][] = [];

  public _subject = new BehaviorSubject<any>(false);

  constructor() {
    this.setNewWaves();
    this.setResolvedWaves();
  }

  public emit<T>(data: T) {
    this._subject.next(data);
  }

  public on<T>(): Observable<T> {
    return this._subject.asObservable();
  }

  setNewWaves() {
    this.waves = [...this.getGeneratedWave()];
  }

  setResolvedWaves() {
    this.resolved = [...this.getGeneratedWave(false)];
  }

  resolveGrid(index: number[], values: number[]) {
    this.resolved[index[0]][index[1]] = values;
  }

  getGeneratedWave(addMarks: boolean = true) {
    return this.waveBaseCount.map((waveSize) => {
      let wave: number[][] = [];
      for (let w = 0; w < waveSize; w++) {
        let marks: number[] = [];

        for (let i = 1; i <= this.marksPerGrid; i++) {
          let randomNum;
          do {
            randomNum = Math.floor(Math.random() * 8) + 1;
          } while (marks.includes(randomNum));
          if (!addMarks) {
            randomNum = -1;
          }
          marks.push(randomNum);
        }
        wave.push(marks);
      }
      return wave;
    });
  }
}
