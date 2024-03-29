import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core'
import { CommonModule, KeyValue } from '@angular/common'
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { User } from 'src/app/models/user'
import { InputLineComponent } from '../input-line/input-line.component'
import { Observable, map, tap } from 'rxjs'
import { State } from 'src/app/models/country'
import { DataService } from 'src/app/services/data.service'
import { SEXES } from 'src/app/consts'
import { RadioComponent } from '../radio/radio.component'
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input'
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input'
import { TooltipModule } from 'ngx-bootstrap/tooltip'
import { CountryStateSelectorComponent } from '../country-state-selector/country-state-selector.component'
import { DateSelectorComponent } from '../date-selector/date-selector.component'
import { DateTimeService } from 'src/app/services/date-time.service'
import { PolicyComponent } from 'src/app/policy/policy/policy.component'
import { TermsComponent } from 'src/app/policy/terms/terms.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { TranslationService } from 'src/app/services/translation.service'

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    InputLineComponent,
    RadioComponent,
    NgxIntlTelInputModule,
    TooltipModule,
    CountryStateSelectorComponent,
    DateSelectorComponent,
    TermsComponent,
    PolicyComponent,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit {
  trans = inject(TranslationService)
  dataService = inject(DataService)
  dateTimeService = inject(DateTimeService)
  cd = inject(ChangeDetectorRef)
  agree = false
  sexes = SEXES
  get isRtl(): boolean {
    return this.trans.isRtl
  }

  @Input() user: User = {
    countryId: 0,
    stateId: 0
  };
  @Input() btnText = 'next'
  @Input() delete = false
  @Input() update = false

  @Output() onSave = new EventEmitter<User>()
  @Output() onDelete = new EventEmitter<void>()

  separateDialCode = true
  SearchCountryField = SearchCountryField
  CountryISO = CountryISO
  PhoneNumberFormat = PhoneNumberFormat
  isFirstTimeLoaded = true

  preferredCountries: CountryISO[] = [
    CountryISO.Israel,
    CountryISO.UnitedStates
  ]

  get isValid(): boolean {
    if (!this.birthYear) return false
    if (this.birthYear < new Date().getFullYear() - 100) return false
    if (this.birthYear > new Date().getFullYear() - 10) return false
    if (!this.agree) return false
    return this.form.valid && this.isPasswordEq && this.isCountrySelected && this.isStateSelected
  }

  get isCountrySelected(): boolean {
    return +this.form.get('countryId')?.value !== 0
  }

  get isStateSelected(): boolean {
    return +this.form.get('stateId')?.value !== 0
  }

  get selectedCountryId(): number {
    return this.form?.controls['countryId']?.value || 0
  }

  get isPasswordEq(): boolean {
    return this.form.get('password')?.value === this.form.get('confirmPassword')?.value
  }

  get birthYear(): number {
    return this.form.get('birthYear')?.value
  }

  get phone(): string {
    return this.form.get('phone')?.value?.number
  }

  countries$ = this.dataService.getCoutries().pipe(map(res => ([{ name: 'Select Country', id: 0 }, ...res])))
  states$?: Observable<State[]>

  form: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    countryId: new FormControl('', [Validators.required]),
    stateId: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    birthYear: new FormControl('', [Validators.required])
  })

  constructor(public dialog: MatDialog) { }

  updateSex(sex: KeyValue<any, any>): void {
    this.form.get('sex')?.setValue(sex.key)
    this.user.sex = sex.key
  }

  ngOnInit(): void {
    if (this.update) {
      this.form.removeControl('password')
      this.form.removeControl('confirmPassword')
    }
    this.form.patchValue(this.user)
    this.loadStates()
  }

  next(): void {
    const user = { ...this.user, ...this.form.getRawValue(), phone: this.phone }
    this.onSave.next(user)
  }

  loadStates(): void {
    this.states$ = this.dataService.getStates(this.selectedCountryId).pipe(
      tap(res => {
        if (!res.length) this.form.get('stateId')?.disable();
        else this.form.get('stateId')?.enable()
      }),
      map(res => ([{ name: 'Select State', id: 0, countryId: 0 }, ...res])),
      tap(() => {
        if (!this.isFirstTimeLoaded) return
        this.isFirstTimeLoaded = false
        this.form.patchValue(this.user)
      })
    )
    this.form.controls['stateId'].patchValue(0)
  }

  deleteUser(): void {
    if (confirm('Are you sure')) {
      this.onDelete.next()
    }
  }

  openLink(dlg: string, event: any): void {
    event.stopPropagation()
    event.preventDefault()
    if (dlg === 'terms')
      this.dialog.open(TermsComponent)
    else
      this.dialog.open(PolicyComponent)
  }
}
