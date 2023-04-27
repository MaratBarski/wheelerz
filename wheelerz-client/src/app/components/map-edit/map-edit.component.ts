import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ChangeDetectionStrategy, inject, ViewChild, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TranslatePipe } from 'src/app/pipes/translate.pipe'
import { GetDefaultGmap, Gmap } from 'src/app/models/gmap'
import { GmapService } from 'src/app/services/gmap.service'

@Component({
  selector: 'app-map-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './map-edit.component.html',
  styleUrls: ['./map-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapEditComponent implements OnInit, AfterViewInit {

  gmapService = inject(GmapService)

  @ViewChild('divmap') divmap!: ElementRef<HTMLDivElement>

  @Input() gmap?: string
  @Output() onChange = new EventEmitter<string>()

  map?: Gmap

  init(): void {
    this.map = JSON.parse(this.gmap || JSON.stringify(GetDefaultGmap()))
    if (this.map)
      this.map.mapId = `${new Date().valueOf()}`
  }

  ngOnInit(): void {
    this.init()
  }

  ngAfterViewInit(): void {
    this.viewMap()
  }

  viewMap(): void {
    if (!this.map) return

    this.gmapService.drawMap(this.map, this.divmap)
    this.onChange.emit(JSON.stringify(this.map))
  }
}
