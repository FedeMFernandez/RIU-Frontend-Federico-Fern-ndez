import { Component, computed, OnInit, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { LoadingSignal } from '../core/signals/loading.signal';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    MatProgressBar,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  loading: Signal<boolean> = computed(() => this.loadingSignal.loading());

  constructor(
    private loadingSignal: LoadingSignal,
  ) { }

  ngOnInit(): void {}

}
