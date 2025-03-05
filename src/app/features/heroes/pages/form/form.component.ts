import { LoadingSignal } from './../../../../core/signals/loading.signal';
import { Component, computed, OnInit, Signal } from '@angular/core';
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
import moment, { Moment } from 'moment';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TextUppercaseDirective } from 'src/app/shared/directives/text-uppercase.directive';
import { HeroService } from '../../services/hero.service';
import { MomentValidators } from 'src/app/shared/validators/moment.validator';
import Patterns from 'src/app/core/constants/patterns.constants';
import { HeroModel } from '../../db/heroes.db';

@Component({
  selector: 'app-heroes-pages-form',
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
export class HeroesFormPage implements OnInit {

  loading: Signal<boolean> = computed(() => this.loadingSignal.loading());
  form!: FormGroup;
  dateFormat: string = 'DD/MM/YYYY';
  nameControl: FormControl = new FormControl('', [Validators.required, Validators.pattern(Patterns.TEXT_UPPERCASE_WITH_SPACES_DOTS_DASH)]);
  powerControl: FormControl = new FormControl('', [Validators.required, Validators.pattern(Patterns.TEXT_WITH_SPACES_DOTS_DASH)]);
  weaknessControl: FormControl = new FormControl('', [Validators.required, Validators.pattern(Patterns.TEXT_WITH_SPACES_DOTS_DASH)]);
  birthControl: FormControl = new FormControl(null, [Validators.required, MomentValidators.validDate(this.dateFormat)]);
  isEdition: boolean = false;

  private heroID: number = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private heroService: HeroService,
    private notificationService: NotificationService,
    private loadingSignal: LoadingSignal,
  ) { }

  async ngOnInit(): Promise<void> {
    this.form = new FormGroup({
      name: this.nameControl,
      power: this.powerControl,
      weakness: this.weaknessControl,
      birth: this.birthControl,
    });

    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    if (idParam) {
      this.heroID = parseInt(idParam);
      this.isEdition = true;
      this.fetch(this.heroID);
    }
  }

  async submitEventHandler(values: Form): Promise<void> {
      if (this.isEdition) {
        return await this.update(values);
      }
      this.add(values);
  }

  async deleteEventHandler(): Promise<void> {
    if (!this.isEdition) { return; }
    const hero = this.form.value;
    const confirm = await this.notificationService.showQuestion(`¿Desea borrar al héroe ${hero.name}?`);
    if (confirm) {
      await this.delete(hero);
    }
  }

  private fetch(id: number): void {
    try {
      const response = this.heroService.get(id) as HeroModel;
      this.form.setValue(this.fromHeroModel(response));
    } catch (error: any) {
      this.notificationService.show(error.message, 'error');
      this.router.navigate(['heroes']);
    }
  }

  private add(values: Form): void {
    try {
      this.heroService.push(this.toHeroModel(values));
      this.notificationService.show(`Se ha guardado el héroe ${values.name}`);
      this.router.navigate(['heroes']);
    } catch (error: any) {
      this.notificationService.show(error.message, 'error');
    }
  }

  private async update(values: Form): Promise<void> {
    try {
      await this.heroService.update(this.heroID, this.toHeroModel(values));
      this.notificationService.show(`Se ha actualizado el héroe ${values.name}`);
      this.router.navigate(['heroes']);
    } catch (error: any) {
      this.notificationService.show(error.message, 'error');
    }
  }

  private async delete(values: Form): Promise<void> {
    try {
      await this.heroService.delete(this.heroID);
      this.router.navigate(['heroes']);
      this.notificationService.show(`Se ha borrado el héroe ${values.name}`);
    } catch (error: any) {
      this.notificationService.show(error.message, 'error');
    }
  }

  private fromHeroModel(values: HeroModel): Form {
    return <Form>{
      name: values.name,
      power: values.power,
      weakness: values.weakness,
      birth: moment.unix(values.birth),
    };
  }

  private toHeroModel(values: any): HeroModel {
    return {
      ...values,
      birth: values.birth.unix(),
    } as HeroModel;
  }
}
interface Form {
  name: string;
  power: string;
  weakness: string;
  birth: Moment;
}
