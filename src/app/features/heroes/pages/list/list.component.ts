import { Component, ViewChild, Signal, computed, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NoContentComponent } from 'src/app/shared/components/no-content/no-content.component';
import { MomentFormatPipe } from 'src/app/shared/pipes/moment-format.pipe';
import { HeroService } from '../../services/hero.service';
import { HeroesDataBase, HeroModel } from '../../db/heroes.db';

@Component({
  selector: 'app-heroes-pages-list',
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
    MatSortModule,
    MomentFormatPipe,
  ],
  providers: [
    HeroService,
    NotificationService,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class HeroesListPage {

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  displayedColumns: string[] = ['id', 'name', 'power', 'weakness', 'birth', 'createdAt', 'actions'];
  searchInput: string = '';
  dataSource: MatTableDataSource<HeroModel> = new MatTableDataSource<HeroModel>([]);

  private readonly heroes: Signal<HeroModel[]> = computed(() => this.heroesDataBase.heroesCollection());

  constructor(
    private heroService: HeroService,
    private heroesDataBase: HeroesDataBase,
    private notificationService: NotificationService,
  ) {
    this.init();
  }

  init() {
    effect(() => {
      this.dataSource.data = this.heroes();
    });
  }

  async deleteEventHandler(hero: HeroModel): Promise<void> {
    const confirm = await this.notificationService.showQuestion(`¿Desea borrar al héroe ${hero.name}?`);
    if (confirm) {
      await this.delete(hero);
    }
  }

  searchChangeEventHandler(filter: string): void {
    filter = filter.trim();
    this.searchInput = filter;
    if (!filter.length) {
      this.dataSource.data = this.heroes();
      return;
    }
    this.dataSource.data = this.heroes().filter((element: HeroModel) => (element.name.toLowerCase().includes(filter.toLowerCase()) || element.id.toString() === filter));
  }

  private async delete(hero: HeroModel): Promise<void> {
    try {
      await this.heroService.delete(hero.id);
      this.notificationService.show(`Se ha borrado el héroe ${hero.name}`);
    } catch (error: any) {
      this.notificationService.show('¡Ha ocurrido un error!', 'error');
    }
  }

}
