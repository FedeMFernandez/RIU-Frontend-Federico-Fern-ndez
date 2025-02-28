import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TextUppercaseDirective } from 'src/app/commons/directives/upper-text.directive';
import Patterns from 'src/app/commons/constants/patterns.constants';
import { HeroService, HeroModelDTO } from 'src/app/commons/services/hero.service';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { LoadingService } from 'src/app/commons/services/loading.service';
import { Subscription } from 'rxjs';
import { Moment } from 'moment';
import moment from 'moment';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    TextUppercaseDirective,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  providers: [
    HeroService,
    NotificationService,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {

  //#region Public vars
  id: number = 0;
  loading: boolean = false;
  form!: FormGroup;
  nameControl: FormControl = new FormControl('', [Validators.required, Validators.pattern(Patterns.TEXT_UPPERCASE_WITH_SPACES_AND_DOTS)]);
  powerControl: FormControl = new FormControl('', [Validators.required, Validators.pattern(Patterns.TEXT_WITH_SPACES_AND_DOTS)]);
  weaknessControl: FormControl = new FormControl('', [Validators.required, Validators.pattern(Patterns.TEXT_WITH_SPACES_AND_DOTS)]);
  birthControl: FormControl = new FormControl(null, [Validators.required]);
  titleLabel: string = 'Añadir';
  //#endregion

  //#region Private vars
  private progressBarSubscription!: Subscription;
  //#endregion

  //#region Lifecycle
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private heroService: HeroService,
    private notificationService: NotificationService,
    private progressBarService: LoadingService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.form = new FormGroup({
      name: this.nameControl,
      power: this.powerControl,
      weakness: this.weaknessControl,
      birth: this.birthControl,
    });

    this.progressBarSubscription = this.progressBarService.loading.subscribe((value) => {
      this.loading = value;
    });

    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id') as string);
    if (this.id) {
      this.titleLabel = 'Editar';
      await this.fetch(this.id);
    }
  }

  ngOnDestroy(): void {
    this.progressBarSubscription.unsubscribe();
  }
  //#endregion

  //#region Public methods
  async addEventHandler(values: Form): Promise<void> {
    if (this.id) {
      await this.update(values);
      return;
    }
    await this.add(values);
  }

  async deleteEventHandler(values: Form): Promise<void> {
    if (!this.id) { return; }
    const confirm = await this.notificationService.showQuestion(`¿Desea borrar al héroe ${values.name}?`);
    if (confirm) {
      await this.delete(values);
    }
  }
  //#endregion

  //#region Private methods
  private async fetch(id: number): Promise<void> {
    try {
      const response = await this.heroService.get(id) as HeroModelDTO;
      this.form.setValue(this.fromHeroModelDTO(response));
    } catch (error: any) {
      this.notificationService.showError('¡Ha ocurrido un error!');
    }
  }

  private async add(values: Form): Promise<void> {
    try {
      await this.heroService.push(this.toHeroModelDTO(values));
      this.notificationService.show(`Se ha guardado el héroe ${values.name}`, 'success');
      this.router.navigate(['heroes']);
    } catch (error: any) {
      this.notificationService.showError('¡Ha ocurrido un error!');
    }
  }

  private async update(values: Form): Promise<void> {
    try {
      await this.heroService.update(this.id, this.toHeroModelDTO(values));
      this.notificationService.show(`Se ha actualizado el héroe ${values.name}`, 'success');
      this.router.navigate(['heroes']);
    } catch (error: any) {
      this.notificationService.showError('¡Ha ocurrido un error!');
    }
  }

  private async delete(values: Form): Promise<void> {
    try {
      await this.heroService.delete(this.id);
      this.router.navigate(['heroes']);
      this.notificationService.show(`Se ha borrado el héroe ${values.name}`, 'success');
    } catch (error: any) {
      this.notificationService.showError('¡Ha ocurrido un error!');
    }
  }

  private fromHeroModelDTO(values: HeroModelDTO): Form {
    return <Form>{
      name: values.name,
      power: values.power,
      weakness: values.weakness,
      birth: moment.unix(values.birth),
    };
  }

  private toHeroModelDTO(values: any): HeroModelDTO {
    return <HeroModelDTO>{
      ...values,
      birth: values.birth.unix(),
    };
  }
  //#endregion
}
interface Form {
  name: string;
  power: string;
  weakness: string;
  birth: Moment;
}
