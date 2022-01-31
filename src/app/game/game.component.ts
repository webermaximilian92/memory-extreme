import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WavesService } from '../waves.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @Input() public generatedWaveGroups: number[][][] = [];
  @Input() public resetGame: boolean = false;
  @Output() public resolve: EventEmitter<any> = new EventEmitter();
  @Output() public done: EventEmitter<any> = new EventEmitter();

  cambers = Array(9)
    .fill(null)
    .map((x, i) => i); // [1,..., 9] number of cells per

  lastIndexes = [0, 0];
  currentIndexes = [0, 0];
  resolvedCambers: number[] = [];

  solverIndex = 0;
  _startGame = false;
  _showCounter = false;
  _showMainCounter = false;
  _timerSeconds = 0;
  _showSolver = false;
  _hideResolver = true;
  _sequenceActive = false;

  constructor(private wavesService: WavesService) {}

  ngOnInit(): void {
    this.wavesService.on<boolean>().subscribe((data: any) => {
      this.reset();
    });
  }

  enew() {
    this.startGame();
  }

  enext() {
    this.continueSequence();
    this.showCounter(3);
  }

  showCounter(time: number, small: boolean = true) {
    this._showCounter = true;
    this._showMainCounter = !small;
    this._timerSeconds = time;

    const seconds = setInterval(() => {
      this._timerSeconds--;
    }, 1000);

    setTimeout(() => {
      clearInterval(seconds);
      this._showCounter = false;
      this._showMainCounter = false;
    }, time * 1000);
  }

  reset() {
    this.currentIndexes = [0, 0];
    this.solverIndex = 0;
    this._startGame = false;
    this._showCounter = false;
    this._showMainCounter = false;
    this._timerSeconds = 0;
    this._showSolver = false;
    this._hideResolver = true;
    this._sequenceActive = false;

    // kill all timeouts
    var highestTimeoutId = setTimeout(';');
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }

  startGame() {
    this.reset();
    this._startGame = true;
    this.showCounter(3, false);
    setTimeout(() => {
      this.continueSequence();
    }, 8000);
  }

  continueSequence(nextWave: boolean = false) {
    this._showSolver = false;
    this._sequenceActive = true;

    const ws = [...this.generatedWaveGroups];

    if (this.currentIndexes[1] + 1 < ws[this.currentIndexes[0]].length) {
      this.currentIndexes[1] = this.currentIndexes[1] + 1;

      setTimeout(() => {
        this.continueSequence();
      }, 3000);
    } else if (this.currentIndexes[0] < ws.length) {
      this.showSolver(3);
    }
  }

  showSolver(time: number) {
    this._showSolver = true;
    this._hideResolver = false;
    this.showCounter(time);
    setTimeout(() => (this._hideResolver = true), time * 1000);
    setTimeout(() => this.resetSolver(time), time * 1000 + 500);
  }

  resetSolver(time: number) {
    const waveLength = this.generatedWaveGroups[this.currentIndexes[0]].length;

    this.sendResolve();

    if (this.solverIndex + 1 < waveLength) {
      this.solverIndex++;
      this.showSolver(time);
    } else {
      this._showSolver = false;
      this._sequenceActive = false;
      this.solverIndex = 0;

      if (this.currentIndexes[0] + 1 < this.generatedWaveGroups.length) {
        this.nextWave();
      } else {
        this.end();
      }
    }
  }

  nextWave() {
    this.currentIndexes[0] = this.currentIndexes[0] + 1;
    this.currentIndexes[1] = 0;
    setTimeout(() => {
      this.continueSequence();
    }, 3000);
  }

  end() {
    this.done.emit();
  }

  sendResolve() {
    const index = [...this.currentIndexes];
    index[1] = this.solverIndex;

    this.resolve.emit({ index: index, camber: this.resolvedCambers });
    this.resolvedCambers = [];
  }

  // template utils

  resolveValue(camberIndex: number) {
    if (this.resolvedCambers.includes(camberIndex)) {
      var index = this.resolvedCambers.indexOf(camberIndex);
      if (index !== -1) {
        this.resolvedCambers.splice(index, 1);
      }
    } else {
      this.resolvedCambers.push(camberIndex);
    }
  }

  isCurrentGridActive(iWaveGroup: number, iGrid: number) {
    return (
      iWaveGroup === this.currentIndexes[0] && iGrid === this.currentIndexes[1]
    );
  }

  getCellStatus(invalidCambers: number, grid: number[]): string {
    return grid.includes(invalidCambers)
      ? 'tw-bg-neutral-700'
      : 'tw-bg-neutral-100';
  }
}
