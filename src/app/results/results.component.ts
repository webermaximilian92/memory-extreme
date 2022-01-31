import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  @Input() public generatedWaveGroups: number[][][] = [];
  @Input() public resolvedWaves: number[][][] = [];

  validWaves: number[] = [];
  validSum = 0;
  gridsSum = 0;
  bestRun = '0';

  cambers = Array(9)
    .fill(null)
    .map((x, i) => i); // [1,..., 9] number of cells per

  constructor() {}

  ngOnInit(): void {
    this.resultpoints();
  }

  resultpoints() {
    let copy = [...this.generatedWaveGroups];

    copy.map((ws, wsi) =>
      ws.map((g, gi) => {
        const resolved = [...this.resolvedWaves[wsi][gi]];
        const array2Sorted = resolved.slice().sort();

        const valid =
          g.length === resolved.length &&
          g
            .slice()
            .sort()
            .every((value, index) => {
              return value === array2Sorted[index];
            });

        const add = valid ? 1 : 0;
        typeof this.validWaves[wsi] === 'undefined'
          ? this.validWaves.push(add)
          : (this.validWaves[wsi] = this.validWaves[wsi] + add);
      })
    );

    this.validSum = this.validWaves.reduce((a, b) => a + b, 0);
    this.gridsSum = this.generatedWaveGroups.reduce((a, b) => a + b.length, 0);

    this.bestRun = localStorage.getItem('bestRun') || '0';
    if (+this.bestRun || 0 < this.validSum) {
      localStorage.setItem('bestRun', this.validSum + '');
      this.bestRun = this.validSum + '';
    } else {
      this.bestRun = this.validSum + '';
    }
  }

  getCellStatus(invalidCambers: number, grid: number[]): string {
    return grid.includes(invalidCambers)
      ? 'tw-bg-neutral-700'
      : 'tw-bg-neutral-100';
  }
}
