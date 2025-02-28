import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { NavigationExtras, Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NoContentComponent } from 'src/app/commons/components/no-content/no-content.component';
import { MomentFormatPipe } from 'src/app/commons/pipes/moment-format.pipe';
import { HeroService, HeroModelDTO } from 'src/app/commons/services/hero.service';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [
    RouterModule,
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
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss'
})
export class HeroesComponent implements OnInit {

  //#region Template bindings
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (!this.dataSource) { return; }
    this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (!this.dataSource) { return; }
    this.dataSource.sort = sort;
  }
  //#endregion

  //region Inputs/Outputs
  @Input() private set _dataSource(value: Hero[]) {
    if (this.dataSource) {
      this.dataSource.data = value;
    } else {
      this.dataSource = new MatTableDataSource(value);
    }
  }
  //#endregion

  //#region Public vars
  loading: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'power', 'weakness', 'birth', 'createdAt', 'actions'];
  searchInput: string = '';
  dataSource!: MatTableDataSource<Hero>;
  heroes: Hero[] = [];
  //#endregion

  //#region Lyfecicle
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private heroService: HeroService,
    private notificationService: NotificationService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.fetchList();
  }
  //#endregion

  //#region Public methods
  async deleteEventHandler(hero: Hero): Promise<void> {
    const confirm = await this.notificationService.showQuestion(`¿Desea borrar al héroe ${hero.name}?`);
    if (confirm) {
      await this.delete(hero);
      await this.fetchList();
    }
  }

  navigate(url: any[], extras?: NavigationExtras): void {
    extras = {
      ...extras,
      relativeTo: this.activatedRoute,
    }
    this.router.navigate(url, extras);
  }

  searchChangeEventHandler(filter: string): void {
    filter = filter.trim();
    if (!filter.length) {
      this._dataSource = this.heroes;
      return;
    }
    this._dataSource = this.heroes.filter((element: Hero) => (element.name.toUpperCase().includes(filter.toUpperCase()) || element.id.toString() === filter));
  }
  //#endregion

  //#region Private methods
  private async fetchList(): Promise<void> {
    try {
      this.loading = true;
      const response = await this.heroService.get() as HeroModelDTO[];
      this.heroes = response.map((hero: HeroModelDTO) => <Hero>{ ...hero });
      this._dataSource = this.heroes;
    } catch (error: any) {
      this.notificationService.showError('¡Ha ocurrido un error!');
    } finally {
      this.loading = false;
    }
  }

  private async delete(hero: Hero): Promise<void> {
    try {
      await this.heroService.delete(hero.id);
      this.notificationService.show(`Se ha borrado el héroe ${hero.name}`, 'success');
    } catch (error: any) {
      this.notificationService.showError('¡Ha ocurrido un error!');
    }
  }
  //#endregion

}

interface Hero {
  id: number;
  name: string;
  power: string;
  weakness: string;
  birth: number;
  createdAt: number;
}
