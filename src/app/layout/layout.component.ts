import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { LoadingService } from '../commons/services/loading.service';
import { Subscription } from 'rxjs';

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
export class LayoutComponent implements OnInit, OnDestroy {

  //#region Public vars
  progressBar: boolean = false;
  //#endregion

  //#region Private vars
  private progressBarSubscription!: Subscription;
  //#endregion

  //#region Lyfecicle
  constructor(
    private progressBarService: LoadingService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.progressBarSubscription = this.progressBarService.loading.subscribe((value) => {
      this.progressBar = value;
    });
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.progressBarSubscription.unsubscribe();
  }
  //#endregion
 }
