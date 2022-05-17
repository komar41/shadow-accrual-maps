import { environment } from '../../environments/environment.prod';
import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import {Map, View} from 'ol';
import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer';
import {transform, toLonLat} from 'ol/proj';
import RasterSource from 'ol/source/Raster';
import {createXYZ} from 'ol/tilegrid';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';

import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import * as olProj from 'ol/proj';

var element = {
  winter:360,
  spring: 540,
  summer: 720
};

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  map: any;
  decLayer: any;
  junLayer: any;
  sepLayer: any;
  mousePosition:any;
  values:any;

  @Output() 
  childToParent = new EventEmitter<any>();

  constructor() { }

  ngAfterViewInit(): void {
    // Create map

    this.values = {};

    let sourceDec = new RasterSource({
      sources: [
        new XYZ({
          url: environment.filesurl+'chicago-shadows/chi-dec-21/15/{x}/{y}.png',
          tileGrid: createXYZ({tileSize: 256, minZoom: 15, maxZoom: 15}),
        })
      ],
      operation: function(pixels: any, data: any): any {
        var pixel = [0,0,0,0];
        var val = pixels[0][3]/255.0;
        pixel[0]=66*val;
        pixel[1]=113*val;
        pixel[2]=143*val;
        pixel[3]=255*val;
      
        return pixel;
      },
    });

    let sourceJun = new RasterSource({
      sources: [
        new XYZ({
          url: environment.filesurl+'chicago-shadows/chi-jun-21/15/{x}/{y}.png',
          tileGrid: createXYZ({tileSize: 256, minZoom: 15, maxZoom: 15}),
        })
      ],
      operation: function(pixels: any, data: any): any {
        var pixel = [0,0,0,0];
        var val = pixels[0][3]/255.0;
        pixel[0]=66*val;
        pixel[1]=113*val;
        pixel[2]=143*val;
        pixel[3]=255*val;
      
        return pixel;
      },
    });

    let sourceSep = new RasterSource({
      sources: [
        new XYZ({
          url: environment.filesurl+'chicago-shadows/chi-sep-21/15/{x}/{y}.png',
          tileGrid: createXYZ({tileSize: 256, minZoom: 15, maxZoom: 15}),
        })
      ],
      operation: function(pixels: any, data: any): any {
        var pixel = [0,0,0,0];
        var val = pixels[0][3]/255.0;
        pixel[0]=66*val;
        pixel[1]=113*val;
        pixel[2]=143*val;
        pixel[3]=255*val;
      
        return pixel;
      },
    });

    this.map = new Map({
      target: 'map',

      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.decLayer = new ImageLayer({
          source: sourceDec,
          zIndex: 1,
        }),
        this.junLayer = new ImageLayer({
          source: sourceJun,
          zIndex: 1,
        }),
        this.sepLayer = new ImageLayer({
          source: sourceSep,
          zIndex: 1,
        })
      ],
      
      view: new View({
        center: olProj.transform([-87.6298, 41.8781], 'EPSG:4326', 'EPSG:3857'),
        zoom: 15
      }),
      
    });

    this.map.on('pointermove', (evt: any) => {
      this.mousePosition = evt.pixel;
      this.map.render();
    });
    
    this.decLayer.on('postrender', (event: any) => {
      var ctxDec = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      if (this.mousePosition) {
        var x = this.mousePosition[0] * pixelRatio;
        var y = this.mousePosition[1] * pixelRatio;
        var data = ctxDec.getImageData(x, y, 1, 1).data;
        var value = (data[3] /255) * element.winter;
        this.values["winter"] = (value/element.winter)*100;
        this.updateValues();
        //console.log(this.values);
       }
    });

    this.junLayer.on('postrender', (event: any) => {
      var ctxJun = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      if (this.mousePosition) {
        var x = this.mousePosition[0] * pixelRatio;
        var y = this.mousePosition[1] * pixelRatio;
        var data = ctxJun.getImageData(x, y, 1, 1).data;
        var value = (data[3] /255) * element.summer;
        this.values["summer"] = (value/element.summer)*100;
        this.updateValues();
        //console.log(this.values);
       }
    });

    this.sepLayer.on('postrender', (event: any) => {
      var ctxSep = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      if (this.mousePosition) {
        var x = this.mousePosition[0] * pixelRatio;
        var y = this.mousePosition[1] * pixelRatio;
        var data = ctxSep.getImageData(x, y, 1, 1).data;
        var value = (data[3] /255) * element.spring;
        this.values["spring"] = (value/element.spring)*100;
        this.updateValues();
        //console.log(this.values);
       }
    });
  }

  updateValues() {
    // Emit new values to chart component
    this.childToParent.emit(this.values);
  }

}
