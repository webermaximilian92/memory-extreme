import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WavesService } from '../waves.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
  @Output() public reset: EventEmitter<boolean> = new EventEmitter();
  @Output() public end: EventEmitter<boolean> = new EventEmitter();

  ngOnInit(): void {}

  constructor(private wavesService: WavesService) {}

  ereset() {
    this.reset.emit();
    this.wavesService.emit<boolean>(true);
  }

  eend() {
    this.end.emit();
  }
}
