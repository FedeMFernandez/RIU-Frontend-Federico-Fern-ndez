import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-no-content-component',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  templateUrl: './no-content.component.html',
  styleUrl: './no-content.component.scss',
})
export class NoContentComponent {

  @Input('text') text: string = 'No hay resultados para mostrar';
  @Input('icon') icon: string = 'sentiment_dissatisfied';
}
