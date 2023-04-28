import { ElementRef, Injectable } from '@angular/core';
import { Gmap } from '../models/gmap';

declare const google: any

@Injectable({
  providedIn: 'root'
})
export class GmapService {
  Map: any
  AdvancedMarkerView: any

  async init() {
    if (this.Map) return
    this.Map = (await google.maps.importLibrary("maps")).Map;
    this.AdvancedMarkerView = await google.maps.importLibrary("marker").AdvancedMarkerView;
  }

  async drawMap(map: Gmap, elm: ElementRef<HTMLDivElement>) {
    await this.init()
    const position = map.center
    const m = new this.Map(elm.nativeElement, {
      zoom: map.zoom,
      center: position,
      mapId: map.mapId
    });
    const beachMarker = new google.maps.Marker({
      position: position,
      m,
      title: map.marker || ''
    });

    beachMarker.setMap(m);
  }
}
