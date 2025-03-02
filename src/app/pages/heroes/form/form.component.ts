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
import { TextUppercaseDirective } from 'src/app/commons/directives/text-uppercase.directive';
import Patterns from 'src/app/commons/constants/patterns.constants';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { LoadingService } from 'src/app/commons/services/loading.service';
import { Subscription } from 'rxjs';
import { Moment } from 'moment';
import moment from 'moment';
import { HeroService, HeroModelDTO } from 'src/app/commons/services/hero.service';

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

  loading: boolean = false;
  form!: FormGroup;
  nameControl: FormControl = new FormControl('', [Validators.required, Validators.pattern(Patterns.TEXT_WITH_SPACES_AND_DOTS)]);
  powerControl: FormControl = new FormControl('', [Validators.required, Validators.pattern(Patterns.TEXT_WITH_SPACES_AND_DOTS)]);
  weaknessControl: FormControl = new FormControl('', [Validators.required, Validators.pattern(Patterns.TEXT_WITH_SPACES_AND_DOTS)]);
  birthControl: FormControl = new FormControl(null, [Validators.required]);
  isEdition: boolean = false;

  private heroID: number = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private heroService: HeroService,
    private notificationService: NotificationService,
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
      await this.fetch(this.heroID);
    }
  }

  async submitEventHandler(values: Form): Promise<void> {
    if (this.isEdition) {
      await this.update(values);
      return;
    }
    await this.add(values);
  }

  async deleteEventHandler(): Promise<void> {
    if (!this.isEdition) { return; }
    const hero = this.form.value;
    const confirm = await this.notificationService.showQuestion(`¿Desea borrar al héroe ${hero.name}?`);
    if (confirm) {
      await this.delete(hero);
    }
  }

  private async fetch(id: number): Promise<void> {
    try {
      this.loading = true;
      const response = await this.heroService.get(id) as HeroModelDTO;
      this.form.setValue(this.fromHeroModelDTO(response));
    } catch (error: any) {
      this.notificationService.show('¡Ha ocurrido un error!', 'error');
    } finally {
      this.loading = false;
    }
  }

  private async add(values: Form): Promise<void> {
    try {
      this.loading = true;
      await this.heroService.push(this.toHeroModelDTO(values));
      this.notificationService.show(`Se ha guardado el héroe ${values.name}`);
      this.router.navigate(['heroes']);
    } catch (error: any) {
      this.notificationService.show('¡Ha ocurrido un error!', 'error');
    } finally {
      this.loading = false;
    }
  }

  private async update(values: Form): Promise<void> {
    try {
      this.loading = true;
      await this.heroService.update(this.heroID, this.toHeroModelDTO(values));
      this.notificationService.show(`Se ha actualizado el héroe ${values.name}`);
      this.router.navigate(['heroes']);
    } catch (error: any) {
      this.notificationService.show('¡Ha ocurrido un error!', 'error');
    } finally {
      this.loading = false;
    }
  }

  private async delete(values: Form): Promise<void> {
    try {
      this.loading = true;
      await this.heroService.delete(this.heroID);
      this.router.navigate(['heroes']);
      this.notificationService.show(`Se ha borrado el héroe ${values.name}`);
    } catch (error: any) {
      this.notificationService.show('¡Ha ocurrido un error!', 'error');
    } finally {
      this.loading = false;
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
}
interface Form {
  name: string;
  power: string;
  weakness: string;
  birth: Moment;
}
