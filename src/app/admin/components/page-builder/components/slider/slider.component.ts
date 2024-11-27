import { Component, OnInit } from '@angular/core';
import grapesjs from 'grapesjs';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  constructor() { }
  ngOnInit(): void {
    const editor: any = grapesjs.init({
      container: '#gjs',
      components: '<div class="swiper-container"><div class="swiper-wrapper"></div></div>',
      style: '.swiper-container { width: 100%; height: 100%; } .swiper-slide { text-align: center; font-size: 18px; background: #fff; display: flex; justify-content: center; align-items: center; }',
      plugins: ['gjs-plugin-slider'],
      pluginsOpts: {
        'gjs-plugin-slider': {
          slidesToSlide: 1,
          autoplay: true,
          interval: 3000,
          pauseOnHover: true,
        }
      }
    });

    
  }

}
