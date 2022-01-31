import { Component, ViewChild } from '@angular/core';
import { GameComponent } from './game/game.component';
import { WavesService } from './waves.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('game') game!: GameComponent;

  title = 'memory';

  generatedWaveGroups: number[][][] = [];
  resolvedWaves: number[][][] = [];
  showResults = false;
  _showImpressum = false;

  constructor(private _waves: WavesService) {
    this.generatedWaveGroups = this._waves.waves;
    this.resolvedWaves = this._waves.resolved;
  }

  toggleImpressum() {
    this._showImpressum = !this._showImpressum;
  }

  reset() {
    this._waves.setNewWaves();
    this._waves.setResolvedWaves();
    this.generatedWaveGroups = this._waves.waves;
    this.resolvedWaves = this._waves.resolved;
    this.showResults = false;
  }

  end() {
    this.showResults = true;
  }

  done() {
    this.showResults = true;
  }

  resolve(item: any) {
    this._waves.resolveGrid(item.index, item.camber);
  }
}
