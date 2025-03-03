import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
import { HeroService, HeroModelDTO } from '../../services/hero.service';

@Component({
  selector: 'app-list',
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
export class ListComponent implements OnInit {

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  @Input() private set _dataSource(value: Hero[]) {
    this.dataSource.data = value;
  }

  loading: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'power', 'weakness', 'birth', 'createdAt', 'actions'];
  searchInput: string = '';
  dataSource: MatTableDataSource<Hero> = new MatTableDataSource<Hero>([]);
  heroes: Hero[] = [];

  constructor(
    private heroService: HeroService,
    private notificationService: NotificationService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.fetchList();
  }

  async deleteEventHandler(hero: Hero): Promise<void> {
    const confirm = await this.notificationService.showQuestion(`¿Desea borrar al héroe ${hero.name}?`);
    if (confirm) {
      await this.delete(hero);
    }
  }

  searchChangeEventHandler(filter: string): void {
    filter = filter.trim();
    if (!filter.length) {
      this._dataSource = this.heroes;
      return;
    }
    this._dataSource = this.heroes.filter((element: Hero) => (element.name.toLowerCase().includes(filter.toLowerCase()) || element.id.toString() === filter));
  }

  private async fetchList(): Promise<void> {
    try {
      this.loading = true;
      const response = await this.heroService.get() as HeroModelDTO[];
      this.heroes = response.map((hero: HeroModelDTO) => <Hero>{ ...hero });
      this._dataSource = this.heroes;
    } catch (error: any) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

  private async delete(hero: Hero): Promise<void> {
    try {
      await this.heroService.delete(hero.id);
      this.notificationService.show(`Se ha borrado el héroe ${hero.name}`);
      await this.fetchList();
    } catch (error: any) {
      this.notificationService.show('¡Ha ocurrido un error!', 'error');
    }
  }

}

interface Hero {
  id: number;
  name: string;
  power: string;
  weakness: string;
  birth: number;
  createdAt: number;
}
