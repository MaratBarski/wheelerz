import { Component, ChangeDetectionStrategy, Input, inject, AfterViewInit, OnInit, ElementRef, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GetDefaultGmap, Gmap } from 'src/app/models/gmap'
import { GmapService } from 'src/app/services/gmap.service'
import { FileImageComponent } from '../file-image/file-image.component'

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FileImageComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, AfterViewInit {
  gmapService = inject(GmapService)

  @Input() gmap?: string
  @Input() mapFile?: string

  @ViewChild('divmap') divmap!: ElementRef<HTMLDivElement>

  map?: Gmap

  get isGmap(): boolean {
    if (!this.map) return false
    if (!this.map.center?.lat || !this.map.center?.lng) return false
    return true
  }

  get noMap(): boolean {
    return !this.isGmap && !this.mapFile
  }

  init(): void {
    this.map = JSON.parse(this.gmap || JSON.stringify(GetDefaultGmap()))
  }

  ngOnInit(): void {
    this.init()
  }

  ngAfterViewInit(): void {
    this.viewMap()
  }

  viewMap(): void {
    if (!this.isGmap) return
    if (this.map)
      this.gmapService.drawMap(this.map, this.divmap)
  }

}
