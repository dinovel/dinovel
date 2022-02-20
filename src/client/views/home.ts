import { declareComponent } from 'dinovel/render/declare.ts';
import * as THREE from 'https://cdn.skypack.dev/three@0.130.0';
import 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';

// deno-lint-ignore no-explicit-any
declare const VANTA: any;

const template = /*html*/ `<div id="home-container-for-vanta" style="width: 100%; height: 100%"></div>`;

export const HomeView = declareComponent({
  template,
  mounted() {
    try {
      VANTA.NET({
        el: '#home-container-for-vanta',
        THREE,
        mouseControls: false,
        touchControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        points: 9.00,
        maxDistance: 24.00,
        spacing: 18.00
      });
    } catch {
      // do nothing
    }
  },
});
