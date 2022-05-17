import { Component, AfterViewInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {
  @Input()
  shadow:any;

  constructor() { }

  ngAfterViewInit(): void {
    //console.log(this.shadow);

    // Create chart

    var w = 210;
    var h = 125;
    var padding = 2;
    var chart = [
    { season: 'summer', shadow: Math.round(this.shadow.summer) },
    { season: 'winter', shadow: Math.round(this.shadow.winter) },
    { season: 'spring', shadow: Math.round(this.shadow.spring) },
    ];
    var svg;

    d3.select("#chart").select("svg").remove();
    
    svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    function colorPicker(v: string) {
      if (v == 'summer') {
        return '#FFFF00';
      } else if (v == 'winter') {
        return '#CC0066';
      } else {
        return '#0066CC';
      }
    }

    svg
      .selectAll('rect')
      .data(chart)
      .enter()
      .append('rect')
      .attr('x', function (d, idx) {
        return idx * (w / chart.length);
      })
      .attr('y', function (d) {
        return h - d.shadow - 20;
      })
      .attr('width', w / chart.length - padding)
      .attr('height', function (d) {
        return d.shadow;
      })
      .attr('fill', function (d) {
        return colorPicker(d.season);
      })

    var text = svg.selectAll('text').data(chart).enter();

    text
      .append('text')
      .text(function (d) {
        return d.shadow + '%';
      })
      .attr('text-anchor', 'middle')
      .attr('x', function (d, idx) {
        return idx * (w / chart.length) + 30;
      })
      .attr('y', function (d) {
        return h - chart.length - 30;
      })
      .attr('font-family', 'sans-serif');

//       var key = Object.keys(dict)[idx];
// value = dict[key]


      text
      .append('text')
      .text(function (d,idx) {
        d.shadow = d.shadow/100;
        if(idx==0) d.shadow = d.shadow*720;
        else if(idx==1) d.shadow = d.shadow*360;
        else if(idx==2) d.shadow = d.shadow*540;
        return d.shadow.toFixed(2) + " min";
      })
      .attr('text-anchor', 'middle')
      .attr("dominant-baseline", "central") 
      .attr('x', function (d, idx) {
        return idx * (w / chart.length) + 30;
      })
      .attr('y', function (d) {
        return h - chart.length - 80;
      })
      .attr('font-family', 'sans-serif');

      text
      .append('text')
      .text(function (d) {
        return d.season;
      })
      .attr('text-anchor', 'middle')
      .attr('x', function (d, idx) {
        return idx * (w / chart.length) + 30;
      })
      .attr('y', function (d) {
        return h - chart.length - 5;
      })
      .attr('font-family', 'Saira Condensed')
      .attr("font-weight",900);



  }

  updateValues(values: any) {
    // Update values
    this.shadow = values;
    //console.log(this.shadow);
    this.ngAfterViewInit();
  }

}
