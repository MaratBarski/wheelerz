import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Observable, first, forkJoin, map, tap } from 'rxjs'
import { ChairInfo, ChairOption, MobilityDto, MobilityType, UserMobility } from 'src/app/models/user-accessibility'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { DataService } from 'src/app/services/data.service'
import { MobilityTypeComponent } from 'src/app/components/mobility-type/mobility-type.component'
import { ChairOptionsComponent } from 'src/app/components/chair-options/chair-options.component'
import { ChairInfoComponent } from 'src/app/components/chair-info/chair-info.component'
import { ProgressBarComponent } from 'src/app/components/progress-bar/progress-bar.component'
import { LoaderService } from 'src/app/services/loader.service'
import { Router } from '@angular/router'
import { ReverseDirective } from 'src/app/directives/reverse.directive'
import { FormsModule } from '@angular/forms'
import { TranslationService } from 'src/app/services/translation.service'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { TermsComponent } from 'src/app/policy/terms/terms.component'
import { PolicyComponent } from 'src/app/policy/policy/policy.component'

@Component({
  selector: 'app-my-accessibility',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslatePipe, FormsModule, ReverseDirective, MobilityTypeComponent, ChairOptionsComponent, ChairInfoComponent, ProgressBarComponent, TermsComponent, PolicyComponent],
  templateUrl: './my-accessibility.component.html',
  styleUrls: ['./my-accessibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyAccessibilityComponent {
  router = inject(Router)
  loaderService = inject(LoaderService)
  trans = inject(TranslationService)
  dataService = inject(DataService)
  types!: MobilityType[]
  chairOptions!: ChairOption[]
  chairInfo: ChairInfo = { width: 0, length: 0, seatHeight: 0, values: [{ key: 'cm', value: 'cm' }, { key: 'inch', value: 'inch' }] }
  selectedTypes = new Set<string>()
  noWalk = false
  step = 0
  currentIndex = -1
  selectedCm = 'cm'
  agree = false
  constructor(public dialog: MatDialog) { }

  get isRtl(): boolean {
    return this.trans.isRtl
  }

  get nextDisable(): boolean {
    return this.currentIndex === this.chairOptions.length
  }

  get isHideMobType(): boolean {
    return this.step !== 0
  }

  get isHideChairOptions(): boolean {
    return !(this.currentIndex >= 0 && this.currentIndex < this.chairOptions.length)
  }

  get isChairInfo(): boolean {
    return this.currentIndex === this.chairOptions.length
  }

  userMobility$: Observable<UserMobility> =
    forkJoin([this.dataService.getModilityDefinition(), this.dataService.getUserMobility()])
      .pipe(tap(([js, res]) => {
        this.types = js.types
        this.chairOptions = js.chairOptions
        this.selectedTypes = new Set<string>(res.mobilities.map(x => x.name))
        this.chairInfo = {
          ...this.chairInfo,
          width: res.chairInfo?.width || 0,
          length: res.chairInfo?.length || 0,
          seatHeight: res.chairInfo?.seatHeight || 0
        }
        this.selectedCm = res.chairInfo?.messure || this.selectedCm
        this.chairOptions = this.chairOptions.map(x => ({
          ...x,
          selectedKey: res.chairOptions.find(y => y.key === x.name)?.value || x.selectedKey
        }))
      }), map(([js, res]) => js))

  getSelecteTypes(): MobilityType[] {
    return this.types.filter(x => this.selectedTypes.has(x.name))
  }

  onChangeMobilityType(set: Set<string>): void {
    this.selectedTypes = set
  }

  save(): void {
    this.loaderService.load(true)
    const mob: MobilityDto = {
      mobilities: this.getSelecteTypes(),
      chairInfo: {
        width: this.chairInfo.width,
        seatHeight: this.chairInfo.seatHeight,
        length: this.chairInfo.length,
        messure: this.selectedCm
      },
      chairOptions: this.chairOptions.map(x => ({
        key: x.name,
        value: x.selectedKey
      }))
    }
    this.dataService.updateUserMobility(mob).pipe(first()).subscribe(() => {
      this.loaderService.load(false)
      this.router.navigateByUrl('/my-profile/general')
    })
  }

  onNowalk(value: boolean): void {
    this.noWalk = value
  }

  next(i: number): void {
    this.step += i
    this.currentIndex += i
  }

  onChangeCm(value: string): void {
    this.selectedCm = value
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
