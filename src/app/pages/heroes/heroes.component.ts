import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HeroModelDTO, HeroService } from '../../commons/services/hero.service';
import { NoContentComponent } from '../../commons/components/no-content/no-content.component';
import { NotificationService } from '../../commons/services/notification.service';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginator,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    NoContentComponent,
    MatProgressBarModule,
  ],
  providers: [
    HeroService,
    NotificationService,
  ],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss'
})
export class HeroesComponent implements OnInit {

  //#region Public vars
  loading: boolean = false;
  deleting: boolean = false;
  dataSource: Hero[] = [];
  displayedColumns: string[] = ['id', 'name', 'power', 'weakness', 'birth', 'actions'];
  searchInput: string = '';
  labels: any = {
    'SEARCH_INPUT': {
      'LABEL': 'Buscar',
      'HINT': 'Puedes escribir el nombre completo o parte del nombre, o el id del héroe.',
    },
    'TABLE': {
      'HEADER': {
        'ID': 'ID',
        'NAME': 'Nombre',
        'POWER': 'Poder',
        'WEAKNESS': 'Debilidad',
        'BIRTH': 'Fecha de nacimiento',
        'ACTIONS': 'Acciones',
      }
    }
  };
  //#endregion

  //#region Lyfecicle
  constructor(
    private heroService: HeroService,
    private notificationService: NotificationService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.fetchHeroesList();
  }
  //#endregion

  //#region Public methods
  async deleteEventHandler(hero: Hero): Promise<void> {
    const confirm = await this.notificationService.showQuestion(`¿Desea borrar al héroe ${hero.name}?`);
    if (confirm) {
      await this.deleteHero(hero.id);
    }
  }
  //#endregion

  //#region Private methods
  private async fetchHeroesList(): Promise<void> {
    try {
      this.loading = true;
      const response = await this.heroService.get();
      this.dataSource = response.map((hero: HeroModelDTO) => {
        return <Hero>{
          ...hero,
          birth: new Date(hero.birth),
          createdAt: new Date(hero.createdAt),
        }
      });
    } catch (error: any) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

  private async deleteHero(id: number): Promise<void> {
    try {
      this.deleting = true;
      await this.heroService.delete(id);
    } catch (error: any) {
      console.log(error);
    } finally {
      this.deleting = false;
      this.fetchHeroesList();
    }
  }
  //#endregion

}

interface Hero {
  id: number;
  name: string;
  power: string;
  weakness: string;
  birth: Date;
  createdAt: Date;
}
