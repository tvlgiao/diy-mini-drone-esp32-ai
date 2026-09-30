/*
 * Mô phỏng lắp ráp 3D cho Mini Drone ESP32 AI.
 * Script thường (không phải module) để chạy được cả khi mở index.html bằng file://;
 * three.js tải bằng import() động từ jsDelivr (+esm: OrbitControls dùng chung bản three).
 * Dùng: const sim = window.initAsm3D(divEl); sim.setStep(i)   // i = 0..11 theo STEPS
 * Đơn vị: mm. Hệ trục máy bay: X mũi, Y trái, Z lên  →  three: (x, z, -y).
 * File này sinh ra từ src/asm3d.src.js bằng src/build-asm3d.py (nhúng frame/frame-120.json).
 */
(function () {
  'use strict';
  const FRAME = {"frame":{"outer":[[-43.26,-35.48],[-41.24,-35.43],[-40.66,-35.29],[-40.12,-35.04],[-39.64,-34.68],[-28.07,-23.12],[-27.66,-22.6],[-27.37,-22.01],[-27.21,-21.37],[-27.21,-20.71],[-27.42,-19.85],[-27.87,-19.1],[-28.59,-18.47],[-29.39,-18.11],[-30.12,-18.0],[-41.99,-18.0],[-42.75,-17.94],[-43.82,-17.66],[-44.86,-17.1],[-45.69,-16.37],[-46.36,-15.45],[-46.82,-14.32],[-47.0,-13.1],[-47.0,12.99],[-46.85,14.23],[-46.4,15.37],[-45.69,16.37],[-44.76,17.17],[-43.67,17.71],[-42.96,17.91],[-42.14,18.0],[-30.19,18.0],[-29.54,18.07],[-28.59,18.47],[-28.12,18.83],[-27.78,19.21],[-27.32,20.13],[-27.21,20.63],[-27.2,21.22],[-27.42,22.15],[-27.97,23.01],[-39.75,34.78],[-40.3,35.14],[-40.99,35.38],[-43.44,35.5],[-44.31,35.69],[-45.12,35.97],[-46.01,36.41],[-46.75,36.92],[-47.48,37.59],[-48.04,38.24],[-48.69,39.3],[-49.17,40.54],[-49.39,41.76],[-49.39,43.09],[-49.17,44.31],[-48.69,45.56],[-48.04,46.61],[-47.14,47.6],[-46.19,48.33],[-45.09,48.9],[-43.81,49.29],[-42.62,49.42],[-41.38,49.35],[-40.21,49.07],[-38.99,48.53],[-37.97,47.83],[-37.34,47.24],[-36.79,46.58],[-36.33,45.86],[-35.9,44.96],[-35.64,44.15],[-35.48,43.3],[-35.39,41.02],[-35.14,40.31],[-34.73,39.69],[-13.88,18.83],[-13.41,18.47],[-12.89,18.2],[-12.32,18.04],[-11.81,18.0],[11.88,18.0],[12.54,18.09],[13.16,18.32],[13.93,18.88],[34.78,39.75],[35.17,40.37],[35.38,40.99],[35.48,43.3],[35.64,44.15],[35.9,44.96],[36.33,45.86],[36.79,46.58],[37.34,47.24],[37.97,47.83],[38.99,48.53],[40.25,49.08],[41.59,49.38],[42.92,49.41],[44.15,49.21],[45.44,48.75],[46.58,48.06],[47.6,47.14],[48.33,46.19],[48.9,45.09],[49.29,43.81],[49.42,42.62],[49.35,41.38],[49.07,40.21],[48.59,39.11],[47.93,38.11],[47.27,37.37],[46.61,36.82],[45.86,36.33],[45.09,35.95],[44.28,35.68],[43.44,35.5],[41.02,35.39],[40.38,35.18],[39.75,34.78],[27.97,23.01],[27.62,22.54],[27.39,22.08],[27.25,21.59],[27.19,21.0],[27.32,20.13],[27.66,19.4],[28.23,18.73],[28.98,18.26],[29.97,18.01],[33.75,17.94],[34.78,17.67],[35.69,17.21],[36.37,16.69],[36.95,16.06],[37.36,15.45],[37.83,14.49],[38.18,14.0],[38.67,13.56],[39.26,13.23],[39.82,13.06],[40.34,13.0],[50.01,13.0],[50.86,12.91],[51.87,12.54],[52.74,11.91],[53.42,11.07],[53.83,10.14],[54.0,9.01],[54.0,-9.18],[53.91,-9.86],[53.73,-10.46],[53.42,-11.07],[53.02,-11.63],[52.48,-12.14],[51.87,-12.54],[51.18,-12.82],[50.47,-12.97],[40.34,-13.0],[39.4,-13.18],[38.81,-13.47],[38.24,-13.94],[37.84,-14.47],[37.36,-15.45],[36.93,-16.09],[36.28,-16.77],[35.59,-17.28],[34.7,-17.7],[33.72,-17.95],[30.05,-18.0],[29.04,-18.23],[28.41,-18.59],[27.83,-19.15],[27.42,-19.85],[27.21,-20.63],[27.2,-21.22],[27.32,-21.87],[27.58,-22.48],[27.97,-23.01],[39.69,-34.73],[40.3,-35.14],[40.99,-35.38],[43.44,-35.5],[44.31,-35.69],[45.12,-35.97],[46.01,-36.41],[46.75,-36.92],[47.48,-37.59],[48.06,-38.27],[48.75,-39.42],[49.18,-40.58],[49.41,-41.89],[49.39,-43.13],[49.13,-44.44],[48.69,-45.56],[48.04,-46.61],[47.14,-47.6],[46.16,-48.35],[44.96,-48.95],[43.77,-49.3],[42.58,-49.42],[41.25,-49.33],[40.09,-49.02],[38.96,-48.51],[37.87,-47.74],[37.25,-47.14],[36.71,-46.47],[36.26,-45.74],[35.9,-44.96],[35.64,-44.15],[35.48,-43.3],[35.39,-41.02],[35.14,-40.31],[34.73,-39.69],[13.88,-18.83],[13.09,-18.29],[12.25,-18.03],[-11.88,-18.0],[-12.61,-18.11],[-13.29,-18.39],[-13.93,-18.88],[-34.78,-39.75],[-35.17,-40.37],[-35.4,-41.07],[-35.48,-43.26],[-35.83,-44.77],[-36.5,-46.16],[-37.37,-47.27],[-38.55,-48.26],[-39.92,-48.96],[-41.42,-49.35],[-42.96,-49.41],[-44.31,-49.17],[-45.59,-48.67],[-46.75,-47.93],[-47.74,-46.98],[-48.53,-45.86],[-49.08,-44.6],[-49.38,-43.26],[-49.41,-41.89],[-49.17,-40.54],[-48.67,-39.26],[-47.93,-38.11],[-46.98,-37.11],[-45.86,-36.33],[-44.6,-35.77]],"holes":[[[-38.14,-42.74],[-38.16,-41.9],[-38.34,-41.08],[-38.69,-40.31],[-39.17,-39.62],[-39.78,-39.04],[-40.49,-38.59],[-41.28,-38.28],[-42.11,-38.14],[-42.95,-38.16],[-43.78,-38.34],[-44.55,-38.69],[-45.24,-39.17],[-45.82,-39.78],[-46.27,-40.49],[-46.57,-41.28],[-46.71,-42.11],[-46.69,-42.95],[-46.51,-43.78],[-46.17,-44.55],[-45.68,-45.24],[-45.07,-45.82],[-44.36,-46.27],[-43.57,-46.57],[-42.74,-46.71],[-41.9,-46.69],[-41.08,-46.51],[-40.31,-46.17],[-39.62,-45.68],[-39.04,-45.07],[-38.59,-44.36],[-38.28,-43.57]],[[-20.47,-22.18],[-20.54,-21.56],[-20.85,-21.02],[-21.34,-20.63],[-21.94,-20.47],[-22.56,-20.54],[-23.11,-20.85],[-23.49,-21.34],[-23.66,-21.94],[-23.58,-22.56],[-23.27,-23.11],[-22.78,-23.49],[-22.18,-23.66],[-21.56,-23.58],[-21.02,-23.27],[-20.63,-22.78]],[[-7.04,-14.7],[-8.92,-14.7],[-9.22,-14.77],[-9.48,-14.95],[-9.65,-15.21],[-9.7,-15.52],[-9.63,-15.82],[-9.39,-16.13],[-9.02,-16.29],[-7.08,-16.3],[-6.78,-16.23],[-6.39,-15.88],[-6.31,-15.36],[-6.56,-14.91]],[[-44.79,5.33],[-44.79,-5.36],[-44.63,-5.84],[-44.3,-6.22],[-43.85,-6.45],[-43.34,-6.49],[-42.94,-6.38],[-42.58,-6.12],[-42.32,-5.76],[-42.21,-5.33],[-42.21,5.36],[-42.35,5.81],[-42.65,6.18],[-43.03,6.41],[-43.5,6.5],[-43.97,6.41],[-44.37,6.16],[-44.66,5.78]],[[-36.22,-11.49],[-24.71,-11.49],[-24.06,-11.35],[-23.4,-11.03],[-22.83,-10.57],[-22.39,-9.98],[-22.11,-9.3],[-22.0,-8.57],[-22.0,8.65],[-22.13,9.37],[-22.43,10.04],[-22.93,10.67],[-23.52,11.11],[-24.2,11.39],[-24.93,11.5],[-36.22,11.49],[-36.94,11.35],[-37.6,11.03],[-38.17,10.57],[-38.61,9.98],[-38.89,9.3],[-39.0,8.57],[-38.98,-8.87],[-38.68,-9.85],[-38.07,-10.67],[-37.22,-11.24]],[[-18.8,5.3],[-18.79,-5.36],[-18.63,-5.84],[-18.3,-6.22],[-17.85,-6.45],[-17.34,-6.49],[-16.92,-6.36],[-16.58,-6.12],[-16.32,-5.76],[-16.21,-5.33],[-16.21,5.36],[-16.35,5.81],[-16.65,6.18],[-17.06,6.42],[-17.53,6.5],[-18.0,6.4],[-18.4,6.14],[-18.68,5.76]],[[-10.15,-11.5],[0.37,-11.48],[1.08,-11.3],[1.73,-10.95],[2.27,-10.46],[2.68,-9.85],[2.91,-9.23],[3.0,-8.57],[2.99,8.72],[2.82,9.51],[2.49,10.17],[2.01,10.72],[1.35,11.18],[0.73,11.41],[0.07,11.5],[-10.29,11.49],[-11.01,11.32],[-11.67,10.99],[-12.27,10.46],[-12.68,9.85],[-12.91,9.23],[-13.0,8.57],[-12.98,-8.87],[-12.68,-9.85],[-12.07,-10.67],[-11.22,-11.24],[-10.66,-11.43]],[[9.85,-11.5],[18.94,-11.47],[19.65,-11.27],[20.29,-10.91],[20.87,-10.35],[21.24,-9.72],[21.43,-9.16],[21.5,-8.57],[21.49,8.72],[21.32,9.51],[20.95,10.23],[20.4,10.82],[19.72,11.24],[19.16,11.43],[18.57,11.5],[9.63,11.48],[8.85,11.27],[8.21,10.91],[7.63,10.35],[7.26,9.72],[7.07,9.16],[7.0,8.57],[7.02,-8.87],[7.32,-9.85],[7.93,-10.67],[8.78,-11.24],[9.34,-11.43]],[[-7.02,16.3],[-8.92,16.3],[-9.21,16.24],[-9.47,16.07],[-9.64,15.81],[-9.7,15.5],[-9.64,15.19],[-9.39,14.87],[-9.02,14.71],[-7.08,14.7],[-6.79,14.76],[-6.4,15.11],[-6.31,15.62],[-6.55,16.08]],[[-20.47,21.9],[-20.53,22.53],[-20.82,23.08],[-21.31,23.47],[-21.9,23.65],[-22.53,23.59],[-23.08,23.3],[-23.47,22.82],[-23.65,22.22],[-23.59,21.6],[-23.3,21.05],[-22.82,20.65],[-22.22,20.47],[-21.6,20.53],[-21.05,20.82],[-20.65,21.31]],[[-38.14,42.11],[-38.16,42.95],[-38.34,43.78],[-38.69,44.55],[-39.17,45.24],[-39.78,45.82],[-40.49,46.27],[-41.28,46.57],[-42.11,46.71],[-42.95,46.69],[-43.78,46.51],[-44.55,46.17],[-45.24,45.68],[-45.82,45.07],[-46.27,44.36],[-46.57,43.57],[-46.71,42.74],[-46.69,41.9],[-46.51,41.08],[-46.17,40.31],[-45.68,39.62],[-45.07,39.04],[-44.36,38.59],[-43.57,38.28],[-42.74,38.14],[-41.9,38.16],[-41.08,38.34],[-40.31,38.69],[-39.62,39.17],[-39.04,39.78],[-38.59,40.49],[-38.28,41.28]],[[46.71,-42.74],[46.69,-41.9],[46.51,-41.08],[46.17,-40.31],[45.68,-39.62],[45.07,-39.04],[44.36,-38.59],[43.57,-38.28],[42.74,-38.14],[41.9,-38.16],[41.08,-38.34],[40.31,-38.69],[39.62,-39.17],[39.04,-39.78],[38.59,-40.49],[38.28,-41.28],[38.14,-42.11],[38.16,-42.95],[38.34,-43.78],[38.69,-44.55],[39.17,-45.24],[39.78,-45.82],[40.49,-46.27],[41.28,-46.57],[42.11,-46.71],[42.95,-46.69],[43.78,-46.51],[44.55,-46.17],[45.24,-45.68],[45.82,-45.07],[46.27,-44.36],[46.57,-43.57]],[[23.66,-22.18],[23.58,-21.56],[23.27,-21.02],[22.78,-20.63],[22.18,-20.47],[21.56,-20.54],[21.02,-20.85],[20.63,-21.34],[20.47,-21.94],[20.54,-22.56],[20.85,-23.11],[21.34,-23.49],[21.94,-23.66],[22.56,-23.58],[23.11,-23.27],[23.49,-22.78]],[[28.98,-14.7],[27.08,-14.7],[26.79,-14.76],[26.53,-14.93],[26.36,-15.19],[26.3,-15.5],[26.36,-15.81],[26.61,-16.13],[26.98,-16.29],[28.92,-16.3],[29.21,-16.24],[29.6,-15.89],[29.69,-15.38],[29.45,-14.92]],[[46.98,-10.0],[45.08,-10.0],[44.79,-10.06],[44.53,-10.23],[44.36,-10.49],[44.3,-10.8],[44.36,-11.11],[44.61,-11.43],[44.98,-11.59],[46.92,-11.6],[47.21,-11.54],[47.6,-11.19],[47.69,-10.68],[47.45,-10.22]],[[28.35,-11.5],[30.79,-11.49],[31.37,-11.37],[31.91,-11.15],[32.51,-10.72],[32.99,-10.17],[33.32,-9.51],[33.49,-8.79],[33.48,8.87],[33.18,9.85],[32.62,10.62],[31.78,11.21],[30.79,11.49],[28.28,11.49],[27.7,11.39],[27.15,11.18],[26.54,10.77],[26.05,10.23],[25.68,9.51],[25.51,8.79],[25.53,-8.94],[25.85,-9.91],[26.49,-10.72],[27.35,-11.27]],[[42.78,-6.49],[47.07,-6.5],[47.8,-6.39],[48.41,-6.15],[48.96,-5.77],[49.41,-5.29],[49.77,-4.65],[49.94,-4.09],[50.0,-3.57],[49.97,3.94],[49.74,4.72],[49.37,5.35],[48.79,5.91],[48.15,6.27],[47.66,6.43],[47.07,6.5],[43.0,6.5],[42.41,6.44],[41.72,6.21],[41.1,5.82],[40.59,5.29],[40.23,4.65],[40.06,4.09],[40.0,3.57],[40.0,-3.5],[40.07,-4.16],[40.43,-5.04],[41.04,-5.77],[41.85,-6.27]],[[46.98,11.6],[45.08,11.6],[44.79,11.54],[44.53,11.37],[44.36,11.11],[44.3,10.8],[44.36,10.49],[44.61,10.17],[44.98,10.01],[46.92,10.0],[47.21,10.06],[47.6,10.41],[47.69,10.92],[47.45,11.38]],[[28.96,16.3],[27.08,16.3],[26.78,16.23],[26.52,16.05],[26.35,15.79],[26.3,15.48],[26.37,15.18],[26.62,14.86],[26.98,14.71],[28.92,14.7],[29.22,14.77],[29.61,15.12],[29.69,15.64],[29.44,16.09]],[[23.65,21.9],[23.59,22.53],[23.3,23.08],[22.82,23.47],[22.22,23.65],[21.6,23.59],[21.05,23.3],[20.65,22.82],[20.47,22.22],[20.53,21.6],[20.82,21.05],[21.31,20.65],[21.9,20.47],[22.53,20.53],[23.08,20.82],[23.47,21.31]],[[46.71,42.0],[46.71,42.85],[46.54,43.67],[46.22,44.45],[45.75,45.15],[45.15,45.75],[44.45,46.22],[43.67,46.54],[42.85,46.71],[42.0,46.71],[41.18,46.54],[40.4,46.22],[39.7,45.75],[39.1,45.15],[38.63,44.45],[38.31,43.67],[38.15,42.85],[38.15,42.0],[38.31,41.18],[38.63,40.4],[39.1,39.7],[39.7,39.1],[40.4,38.63],[41.18,38.31],[42.0,38.15],[42.85,38.15],[43.67,38.31],[44.45,38.63],[45.15,39.1],[45.75,39.7],[46.22,40.4],[46.54,41.18]]]},"rings":[{"outer":[[79.0,-62.17],[78.83,-63.53],[78.4,-64.84],[77.72,-66.03],[76.83,-67.07],[75.74,-67.91],[74.52,-68.53],[73.2,-68.9],[71.83,-69.0],[70.47,-68.83],[69.16,-68.4],[67.97,-67.72],[66.93,-66.83],[66.09,-65.74],[65.47,-64.52],[65.1,-63.2],[65.0,-61.83],[65.17,-60.47],[65.6,-59.16],[66.28,-57.97],[67.17,-56.93],[68.26,-56.09],[69.48,-55.47],[70.8,-55.1],[72.17,-55.0],[73.53,-55.17],[74.84,-55.6],[76.03,-56.28],[77.07,-57.17],[77.91,-58.26],[78.53,-59.48],[78.9,-60.8]],"holes":[[[76.3,-61.89],[76.2,-61.06],[75.93,-60.26],[75.52,-59.52],[74.97,-58.89],[74.3,-58.37],[73.55,-57.99],[72.74,-57.76],[71.89,-57.7],[71.06,-57.8],[70.26,-58.07],[69.52,-58.48],[68.89,-59.03],[68.37,-59.7],[67.99,-60.45],[67.76,-61.26],[67.7,-62.11],[67.8,-62.94],[68.07,-63.74],[68.48,-64.48],[69.03,-65.11],[69.7,-65.63],[70.45,-66.01],[71.26,-66.24],[72.11,-66.3],[72.94,-66.2],[73.74,-65.93],[74.48,-65.52],[75.11,-64.97],[75.63,-64.3],[76.01,-63.55],[76.24,-62.74]]]},{"outer":[[96.0,-62.17],[95.83,-63.53],[95.4,-64.84],[94.72,-66.03],[93.83,-67.07],[92.74,-67.91],[91.52,-68.53],[90.2,-68.9],[88.83,-69.0],[87.47,-68.83],[86.16,-68.4],[84.97,-67.72],[83.93,-66.83],[83.09,-65.74],[82.47,-64.52],[82.1,-63.2],[82.0,-61.83],[82.17,-60.47],[82.6,-59.16],[83.28,-57.97],[84.17,-56.93],[85.26,-56.09],[86.48,-55.47],[87.8,-55.1],[89.17,-55.0],[90.53,-55.17],[91.84,-55.6],[93.03,-56.28],[94.07,-57.17],[94.91,-58.26],[95.53,-59.48],[95.9,-60.8]],"holes":[[[93.3,-61.89],[93.2,-61.06],[92.93,-60.26],[92.52,-59.52],[91.97,-58.89],[91.3,-58.37],[90.55,-57.99],[89.74,-57.76],[88.89,-57.7],[88.06,-57.8],[87.26,-58.07],[86.52,-58.48],[85.89,-59.03],[85.37,-59.7],[84.99,-60.45],[84.76,-61.26],[84.7,-62.11],[84.8,-62.94],[85.07,-63.74],[85.48,-64.48],[86.03,-65.11],[86.7,-65.63],[87.45,-66.01],[88.26,-66.24],[89.11,-66.3],[89.94,-66.2],[90.74,-65.93],[91.48,-65.52],[92.11,-64.97],[92.63,-64.3],[93.01,-63.55],[93.24,-62.74]]]},{"outer":[[113.0,-62.17],[112.83,-63.53],[112.4,-64.84],[111.72,-66.03],[110.83,-67.07],[109.74,-67.91],[108.52,-68.53],[107.2,-68.9],[105.83,-69.0],[104.47,-68.83],[103.16,-68.4],[101.97,-67.72],[100.93,-66.83],[100.09,-65.74],[99.47,-64.52],[99.1,-63.2],[99.0,-61.83],[99.17,-60.47],[99.6,-59.16],[100.28,-57.97],[101.17,-56.93],[102.26,-56.09],[103.48,-55.47],[104.8,-55.1],[106.17,-55.0],[107.53,-55.17],[108.84,-55.6],[110.03,-56.28],[111.07,-57.17],[111.91,-58.26],[112.53,-59.48],[112.9,-60.8]],"holes":[[[110.3,-61.89],[110.2,-61.06],[109.93,-60.26],[109.52,-59.52],[108.97,-58.89],[108.3,-58.37],[107.55,-57.99],[106.74,-57.76],[105.89,-57.7],[105.06,-57.8],[104.26,-58.07],[103.52,-58.48],[102.89,-59.03],[102.37,-59.7],[101.99,-60.45],[101.76,-61.26],[101.7,-62.11],[101.8,-62.94],[102.07,-63.74],[102.48,-64.48],[103.03,-65.11],[103.7,-65.63],[104.45,-66.01],[105.26,-66.24],[106.11,-66.3],[106.94,-66.2],[107.74,-65.93],[108.48,-65.52],[109.11,-64.97],[109.63,-64.3],[110.01,-63.55],[110.24,-62.74]]]},{"outer":[[130.0,-62.17],[129.83,-63.53],[129.4,-64.84],[128.72,-66.03],[127.83,-67.07],[126.74,-67.91],[125.52,-68.53],[124.2,-68.9],[122.83,-69.0],[121.47,-68.83],[120.16,-68.4],[118.97,-67.72],[117.93,-66.83],[117.09,-65.74],[116.47,-64.52],[116.1,-63.2],[116.0,-61.83],[116.17,-60.47],[116.6,-59.16],[117.28,-57.97],[118.17,-56.93],[119.26,-56.09],[120.48,-55.47],[121.8,-55.1],[123.17,-55.0],[124.53,-55.17],[125.84,-55.6],[127.03,-56.28],[128.07,-57.17],[128.91,-58.26],[129.53,-59.48],[129.9,-60.8]],"holes":[[[127.3,-61.89],[127.2,-61.06],[126.93,-60.26],[126.52,-59.52],[125.97,-58.89],[125.3,-58.37],[124.55,-57.99],[123.74,-57.76],[122.89,-57.7],[122.06,-57.8],[121.26,-58.07],[120.52,-58.48],[119.89,-59.03],[119.37,-59.7],[118.99,-60.45],[118.76,-61.26],[118.7,-62.11],[118.8,-62.94],[119.07,-63.74],[119.48,-64.48],[120.03,-65.11],[120.7,-65.63],[121.45,-66.01],[122.26,-66.24],[123.11,-66.3],[123.94,-66.2],[124.74,-65.93],[125.48,-65.52],[126.11,-64.97],[126.63,-64.3],[127.01,-63.55],[127.24,-62.74]]]}],"motors":{"M1":[42.43,-42.43],"M2":[-42.43,-42.43],"M3":[-42.43,42.43],"M4":[42.43,42.43]},"body":[-47.0,-18.0,38.0,18.0],"nose":[36.0,-13.0,54.0,13.0],"thickness":1.5,"motorHole":8.6,"podOD":14.0};
  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/+esm';
  const ORBIT_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js/+esm';
  const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const STEP_INFO = [
    { parts: ['frame', 'tape'], view: 'iso', labels: [['frame', 'Khung carbon 1,5 mm'], ['tape', 'Băng keo đánh dấu mũi']] },
    { parts: ['rings', 'motors'], view: 'pod', labels: [['band1', 'Gen co nhiệt ôm thân'], ['ring1', 'Vòng đệm dán dưới lỗ'], ['motor1', 'M1 quay ngược ↺']] },
    { parts: ['driver'], view: 'rear', labels: [['driver', 'Mạch động cơ: 4 MOSFET + diode']] },
    { parts: ['mwires'], view: 'rear', labels: [['wireM2', 'Dây động cơ luồn qua lỗ tay']] },
    { parts: ['power'], view: 'rear', labels: [['ph', 'Jack pin BT2.0'], ['cap', 'Tụ lớn'], ['buck', 'Bộ đổi điện 3,3 V']] },
    { parts: ['battery', 'strap'], view: 'bottomRear', labels: [['battery', 'Pin 1S nằm ngang'], ['strap', 'Dây ràng luồn 2 rãnh']] },
    { parts: ['devkit', 'ties'], view: 'top', labels: [['devkit', 'Bộ não ESP32'], ['usb', 'Cổng USB quay ra sau'], ['tie1', 'Dây rút']] },
    { parts: ['mpu'], view: 'mpu', labels: [['mpuX', 'X → mũi'], ['mpuY', 'Y → trái'], ['mpu', 'MPU6050 ở giữa']] },
    { parts: ['pmw', 'vl53'], view: 'bottom', labels: [['pmw', 'Mắt nhìn sàn PMW3901'], ['vl53', 'Thước đo VL53L1X']] },
    { parts: ['xiao'], view: 'nose', labels: [['lens', 'Camera nhìn về trước'], ['xiao', 'XIAO ESP32-S3']] },
    { parts: ['swires'], view: 'iso', labels: [['swires', 'Dây ép sát thân']] },
    { parts: ['props'], view: 'props', labels: [['propM1', 'B ↺'], ['propM2', 'A ↻'], ['propM3', 'B ↺'], ['propM4', 'A ↻']] },
  ];

  // Vị trí camera (hệ máy bay): [mắt x,y,z], [đích x,y,z]
  const VIEWS = {
    iso: [[-130, -150, 150], [0, 0, 0]],
    pod: [[88, -98, 48], [38, -38, 0]],
    rear: [[-110, -80, 110], [-30, 0, 3]],
    bottomRear: [[-120, -150, -140], [-20, 0, -3]],
    bottom: [[-40, -150, -170], [8, 0, -3]],
    top: [[-40, -60, 170], [8, 0, 3]],
    mpu: [[-55, -70, 95], [4, 0, 5]],
    nose: [[140, -95, 60], [40, 0, 8]],
    props: [[-150, -170, 150], [0, 0, 10]],
  };

  window.initAsm3D = function (container) {
    let api = null, pending = 0, dead = false;
    const ctl = { setStep(i) { pending = i; if (api) api.setStep(i); }, view(e, t) { if (api) api.view(e, t); }, dispose() { dead = true; if (api) api.dispose(); } };
    container.classList.add('asm3d');
    const msg = document.createElement('div');
    msg.className = 'asm3d-msg';
    msg.textContent = 'Đang tải mô hình 3D…';
    container.appendChild(msg);
    Promise.all([import(THREE_URL), import(ORBIT_URL)]).then(([THREE, O]) => {
      if (dead) return;
      api = build(THREE, O.OrbitControls, container);
      msg.remove();
      api.setStep(pending);
    }).catch(err => {
      msg.textContent = /WebGL/i.test(String(err)) ? 'Trình duyệt này không bật được WebGL nên không xem được hình 3D.' : 'Không tải được mô hình 3D (cần Internet để tải three.js).';
      console.error('[asm3d]', err);
    });
    return ctl;
  };

  function build(THREE, OrbitControls, container) {
    injectCss();
    const V = (x, y, z) => new THREE.Vector3(x, z, -y);   // hệ máy bay → three
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    const labelLayer = document.createElement('div');
    labelLayer.className = 'asm3d-labels';
    container.appendChild(labelLayer);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 1, 3000);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 40;
    controls.maxDistance = 600;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x6b7280, 1.4));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.copy(V(-80, -120, 220));
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xffffff, 0.6);
    fill.position.copy(V(120, 80, -150));
    scene.add(fill);

    // ---------- vật liệu ----------
    const M = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.6, metalness: 0.05 }, o));
    const carbonTex = weaveTexture(THREE);
    const mats = {
      carbon: M(0x24282d, { roughness: 0.35, metalness: 0.25, map: carbonTex }),
      motor: M(0xc9ced3, { metalness: 0.7, roughness: 0.3 }),
      motorCap: M(0x8d949b, { metalness: 0.7, roughness: 0.35 }),
      shaft: M(0xe6e6e6, { metalness: 0.9, roughness: 0.2 }),
      shrink: M(0x111111, { roughness: 0.8 }),
      pcbGreen: M(0x1f6b4f), pcbBlue: M(0x2451a6), pcbPurple: M(0x6b2f9e), pcbBlack: M(0x1b1d20),
      perf: M(0xc9a15a, { roughness: 0.8 }),
      chip: M(0x161616, { roughness: 0.5 }),
      silver: M(0xbfc5ca, { metalness: 0.8, roughness: 0.3 }),
      white: M(0xf2f2ee), foam: M(0xe9e2c7, { roughness: 0.95 }),
      battery: M(0x2e6fd8, { roughness: 0.5 }), batteryLabel: M(0xf2f2ee),
      strap: M(0x8bc34a, { roughness: 0.9 }), tie: M(0xf7f7f2, { roughness: 0.7 }),
      tape: M(0xff7a1a, { roughness: 0.8 }),
      red: M(0xd9342b), black: M(0x151515), blue: M(0x2f6fd6), whiteW: M(0xf4f4f4), yellow: M(0xffd84d),
      cap: M(0x3a3f45, { metalness: 0.5, roughness: 0.4 }),
      lens: M(0x2a4d8f, { metalness: 0.3, roughness: 0.1, emissive: 0x0a1a3a }),
      propA: M(0xff8a3d, { roughness: 0.5, transparent: true, opacity: 0.95 }),
      propB: M(0x5aa9e6, { roughness: 0.5, transparent: true, opacity: 0.95 }),
      arrow: M(0xe8590c, { roughness: 0.6 }),
    };

    const parts = {};   // tên phần → Group (bay vào khi tới bước)
    const anchors = {}; // tên nhãn → Object3D
    const group = name => { const g = new THREE.Group(); g.name = name; g.visible = false; scene.add(g); parts[name] = g; return g; };
    const mesh = (geo, mat, parent, pos, name) => {
      const m = new THREE.Mesh(geo, mat.clone());
      if (pos) m.position.copy(pos);
      parent.add(m);
      if (name) anchors[name] = m;
      return m;
    };
    // hộp theo hệ máy bay: tâm (x,y,z), kích thước dx (dọc X), dy (dọc Y), dz (cao)
    const box = (parent, c, s, mat, name) => mesh(new THREE.BoxGeometry(s[0], s[2], s[1]), mat, parent, V(...c), name);
    const cyl = (parent, c, r, h, mat, name, seg = 32) => mesh(new THREE.CylinderGeometry(r, r, h, seg), mat, parent, V(...c), name);
    const tube = (parent, pts, r, mat, name) => {
      const curve = new THREE.CatmullRomCurve3(pts.map(p => V(...p)), false, 'catmullrom', 0.2);
      return mesh(new THREE.TubeGeometry(curve, Math.max(24, pts.length * 12), r, 8, false), mat, parent, null, name);
    };
    const shapeOf = (ring) => { const s = new THREE.Shape(); ring.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y)); s.closePath(); return s; };
    const plate = (poly, depth, mat, parent, z0, name) => {
      const sh = shapeOf(poly.outer);
      poly.holes.forEach(h => sh.holes.push(shapeOf(h)));
      const geo = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false, curveSegments: 1 });
      geo.rotateX(-Math.PI / 2);   // (x, y, d) → (x, d, -y)
      const m = mesh(geo, mat, parent, new THREE.Vector3(0, z0, 0), name);
      return m;
    };

    const T = FRAME.thickness, MOT = FRAME.motors;
    const ROT = { M1: 'ccw', M2: 'cw', M3: 'ccw', M4: 'cw' };
    const WIRE = { M1: [mats.whiteW, mats.black], M3: [mats.whiteW, mats.black], M2: [mats.red, mats.blue], M4: [mats.red, mats.blue] };
    const TOP = T;             // mặt trên khung
    const MOTOR_TOP = TOP + 12, MOTOR_LEN = 20, MR = 4.25;
    const MOTOR_BOT = MOTOR_TOP - MOTOR_LEN;
    const PROP_Z = MOTOR_TOP + 3.2;

    // ---------- bước 1: khung + băng keo mũi ----------
    const gFrame = group('frame');
    plate(FRAME.frame, T, mats.carbon, gFrame, 0, 'frame');
    const gTape = group('tape');
    box(gTape, [52, 0, TOP + 0.15], [3, 20, 0.3], mats.tape, 'tape');

    // quầng sáng dưới máy bay: giúp khung carbon đen nổi trên nền trang tối
    const glowC = document.createElement('canvas');
    glowC.width = glowC.height = 128;
    const gx = glowC.getContext('2d'), grd = gx.createRadialGradient(64, 64, 4, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,255,255,0.55)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    gx.fillStyle = grd;
    gx.fillRect(0, 0, 128, 128);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(glowC), transparent: true, depthWrite: false }));
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -16;
    scene.add(glow);

    // mũi tên "MŨI" cố định trên nền
    const noseArrow = new THREE.Group();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(4, 10, 24), mats.arrow);
    cone.rotation.z = -Math.PI / 2;
    cone.position.copy(V(78, 0, 0));
    const shaftA = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 14, 12), mats.arrow);
    shaftA.rotation.z = -Math.PI / 2;
    shaftA.position.copy(V(67, 0, 0));
    noseArrow.add(cone, shaftA);
    scene.add(noseArrow);
    anchors.nose = cone;

    // ---------- bước 2: vòng đệm + động cơ (gen co ở chỗ ôm) ----------
    const gRings = group('rings');
    FRAME.rings.forEach((r, i) => {
      // vòng trong file DXF nằm cạnh khung; dời về dưới từng vành motor
      const cx = r.outer.reduce((a, p) => a + p[0], 0) / r.outer.length, cy = r.outer.reduce((a, p) => a + p[1], 0) / r.outer.length;
      const key = ['M1', 'M2', 'M3', 'M4'][i], [mx, my] = MOT[key];
      const shifted = { outer: r.outer.map(([x, y]) => [x - cx + mx, y - cy + my]), holes: r.holes.map(h => h.map(([x, y]) => [x - cx + mx, y - cy + my])) };
      plate(shifted, T, mats.carbon, gRings, -T, 'ring' + key.slice(1));
    });
    const gMot = group('motors');
    const motorGroups = {};
    Object.entries(MOT).forEach(([k, [x, y]]) => {
      const g = new THREE.Group();
      gMot.add(g);
      motorGroups[k] = g;
      const n = k.slice(1);
      cyl(g, [x, y, MOTOR_BOT + MOTOR_LEN / 2], MR, MOTOR_LEN - 1.5, mats.motor, 'motor' + n);
      cyl(g, [x, y, MOTOR_TOP - 0.75], MR * 0.92, 1.5, mats.motorCap);
      cyl(g, [x, y, MOTOR_BOT + 0.5], MR * 0.8, 1, mats.motorCap);
      cyl(g, [x, y, MOTOR_TOP + 2.5], 0.5, 5, mats.shaft);
      const band = cyl(g, [x, y, 0], MR + 0.25, 8, mats.shrink, 'band' + n);
      band.userData.band = true;
      // 2 dây ngắn thò ra đáy motor
      WIRE[k].forEach((wm, j) => tube(g, [[x + (j ? 1 : -1), y, MOTOR_BOT], [x + (j ? 1 : -1), y, MOTOR_BOT - 3]], 0.5, wm));
    });

    // ---------- bước 3: mạch động cơ (bảng đục lỗ ở trên, phía sau) ----------
    const gDrv = group('driver');
    const DRV_Z = TOP + 1.0 + 1.0;  // có băng keo xốp + dây ràng bên dưới
    box(gDrv, [-30, 0, DRV_Z - 0.5], [26, 22, 1], mats.foam);
    box(gDrv, [-30, 0, DRV_Z + 0.8], [30, 24, 1.6], mats.perf, 'driver');
    const DRV_TOP = DRV_Z + 1.6;
    [-7.5, -2.5, 2.5, 7.5].forEach((yy, i) => {
      box(gDrv, [-36, yy, DRV_TOP + 0.55], [2.9, 1.6, 1.1], mats.chip);            // AO3400 (SOT-23)
      box(gDrv, [-31.5, yy, DRV_TOP + 0.5], [3.4, 1.4, 1], mats.black);             // SS14
      box(gDrv, [-30.2, yy, DRV_TOP + 0.52], [0.5, 1.45, 1.04], mats.silver);       // vạch diode
      cyl(gDrv, [-40, yy, DRV_TOP + 0.6], 0.6, 1.2, mats.yellow, null, 10);          // điện trở (đứng)
    });

    // ---------- bước 4: dây động cơ đi dọc tay, luồn lỗ lên mạch ----------
    const gMW = group('mwires');
    Object.entries(MOT).forEach(([k, [x, y]]) => {
      const hx = x * 0.52, hy = y * 0.52;
      WIRE[k].forEach((wm, j) => {
        const o = j ? 0.9 : -0.9;
        tube(gMW, [[x + o, y, MOTOR_BOT - 3], [x * 0.9 + o, y * 0.9, -2], [hx + o * 0.6, hy, -1.5], [hx + o * 0.6, hy, TOP + 1], [(hx - 30) / 2 + o, (hy) / 2, DRV_TOP + 1.5], [-35, Math.sign(y) * 9 + o, DRV_TOP + 0.8]], 0.45, wm, j === 0 ? 'wire' + k : null);
      });
    });

    // ---------- bước 5: đầu cắm pin, tụ, bộ đổi điện ----------
    const gPow = group('power');
    box(gPow, [-44, 0, DRV_TOP + 1.2], [4.5, 6, 2.4], mats.white, 'ph');           // jack BT2.0
    cyl(gPow, [-24, 6.5, DRV_TOP + 4], 3, 8, mats.cap, 'cap');                    // tụ 1000 µF
    cyl(gPow, [-24, 6.5, DRV_TOP + 8.1], 3.02, 0.2, mats.silver);
    box(gPow, [-23, -6.5, DRV_TOP + 1.8], [9, 9, 1.2], mats.pcbBlue, 'buck');     // buck-boost 3,3 V
    box(gPow, [-23, -6.5, DRV_TOP + 2.8], [3, 3, 0.9], mats.chip);

    // ---------- bước 6: pin dưới bụng + dây ràng ----------
    const gBat = group('battery');
    const BZ0 = -7, BZ1 = 0;   // pin 7 mm dưới mặt đáy khung
    box(gBat, [-30.5, 0, (BZ0 + BZ1) / 2], [12, 67, 6], mats.battery, 'battery');   // BetaFPV 450 mAh: 67,3 × 11,8 × 6,1 mm
    box(gBat, [-30.5, 0, BZ0 - 0.05], [9, 44, 0.1], mats.batteryLabel);
    tube(gBat, [[-30.5, 29.5, -3.5], [-30.5, 34, -2], [-36, 30, TOP + 2], [-42, 3, DRV_TOP + 1.2]], 0.55, mats.red);
    const gStrap = group('strap');
    const ST = 0.8, SW = 10, xa = -43.5, xb = -17.5;
    box(gStrap, [(xa + xb) / 2, 0, TOP + ST / 2], [xb - xa + 1.2, SW, ST], mats.strap, 'strap');
    box(gStrap, [xa, 0, (BZ0 - ST + TOP + ST) / 2], [ST * 1.5, SW, TOP + ST - (BZ0 - ST)], mats.strap);
    box(gStrap, [xb, 0, (BZ0 - ST + TOP + ST) / 2], [ST * 1.5, SW, TOP + ST - (BZ0 - ST)], mats.strap);
    box(gStrap, [(xa + xb) / 2, 0, BZ0 - ST / 2], [xb - xa + 1.2, SW, ST], mats.strap);

    // ---------- bước 7: ESP32 DevKit + dây rút ----------
    const gDev = group('devkit');
    const DEV_Z = TOP + 1;   // băng keo xốp 1 mm
    box(gDev, [11.5, 0, DEV_Z - 0.5], [40, 20, 1], mats.foam);
    box(gDev, [11.5, 0, DEV_Z + 0.8], [51, 28, 1.6], mats.pcbGreen, 'devkit');
    const DEV_TOP = DEV_Z + 1.6;
    box(gDev, [27, 0, DEV_TOP + 1.6], [18, 16, 3.2], mats.silver);                 // module ESP32 (anten về mũi)
    box(gDev, [36.5, 0, DEV_TOP + 0.5], [1, 16, 1], mats.pcbBlack);
    box(gDev, [-12, 0, DEV_TOP + 1.5], [5.5, 9, 3], mats.silver, 'usb');          // cổng USB quay ra sau
    box(gDev, [-3, 0, DEV_TOP + 0.8], [5, 5, 1.6], mats.chip);                     // CH340
    box(gDev, [4, 8, DEV_TOP + 1], [3, 3, 2], mats.chip);
    const gTies = group('ties');
    [-8, 28].forEach((x, i) => {
      box(gTies, [x, 0, DEV_TOP + 0.5], [2.8, 31.5, 1], mats.tie, i ? null : 'tie1');
      [-15.5, 15.5].forEach(y => box(gTies, [x, y, DEV_TOP / 2], [2.8, 1, DEV_TOP + 2], mats.tie));
      box(gTies, [x, 0, -0.5], [2.8, 31.5, 1], mats.tie);
    });

    // ---------- bước 8: MPU6050 ở giữa, mũi tên X/Y ----------
    const gMpu = group('mpu');
    const MPU_Z = DEV_TOP + 3.2 + 1;   // xốp trên nắp module? đặt giữa máy, trên chip USB-UART: xốp dày 2 mm
    box(gMpu, [0, 0, DEV_TOP + 1.2], [14, 12, 2.4], mats.foam);
    box(gMpu, [0, 0, DEV_TOP + 3.2], [21, 16, 1.6], mats.pcbBlue, 'mpu');
    box(gMpu, [0, 0, DEV_TOP + 4.4], [4, 4, 0.9], mats.chip);
    const MPU_TOP = DEV_TOP + 4.1;
    const arrowFlat = (x0, y0, dx, dy, name) => {
      const len = Math.hypot(dx, dy);
      const a = new THREE.Group();
      const s = new THREE.Mesh(new THREE.BoxGeometry(len - 3, 0.3, 0.9), mats.yellow.clone());
      s.position.set((len - 3) / 2, 0, 0);
      const h = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3, 3), mats.yellow.clone());
      h.rotation.z = -Math.PI / 2;
      h.position.set(len - 1.5, 0, 0);
      a.add(s, h);
      a.position.copy(V(x0, y0, MPU_TOP + 0.2));
      a.rotation.y = Math.atan2(dy, dx);   // quay quanh trục Z máy bay (dương = X→Y)
      gMpu.add(a);
      anchors[name] = h;
    };
    arrowFlat(-6, -4, 12, 0, 'mpuX');
    arrowFlat(-6, -4, 0, 10, 'mpuY');

    // ---------- bước 9: PMW3901 + VL53L1X dưới bụng, nhìn xuống ----------
    const gPmw = group('pmw');
    box(gPmw, [2, 0, -0.5], [15, 15, 1], mats.foam);
    box(gPmw, [2, 0, -1.8], [21, 21, 1.6], mats.pcbPurple, 'pmw');
    cyl(gPmw, [2, 0, -3.8], 3.2, 2.5, mats.chip);
    cyl(gPmw, [2, 0, -5.1], 2, 0.2, mats.lens);
    const gVl = group('vl53');
    box(gVl, [27, 0, -0.5], [10, 12, 1], mats.foam);
    box(gVl, [27, 0, -1.8], [13, 17, 1.6], mats.pcbBlack, 'vl53');
    box(gVl, [27, 0, -3.1], [2.5, 5, 1], mats.chip);

    // ---------- bước 10: XIAO đứng ở mũi, camera nhìn về trước ----------
    const gXiao = group('xiao');
    const XX = 46;   // bo đứng nằm đúng trên 2 rãnh dây rút (x = 46)
    const XB = TOP + 1.2, XT = XB + 21;
    mesh(new THREE.SphereGeometry(2.2, 12, 8), mats.white, gXiao, V(XX - 2.2, 0, TOP + 1.2));                    // keo nến giữ chân bo
    box(gXiao, [XX, 0, (XB + XT) / 2], [1.2, 17.5, 21], mats.pcbBlack, 'xiao');                                   // XIAO
    box(gXiao, [XX, 0, XT + 1], [3.2, 9, 2], mats.silver);                                                         // USB-C ở đầu trên
    box(gXiao, [XX + 1.8, 0, XB + 10.5], [2.4, 17.5, 18], mats.pcbBlack);                                          // bo camera Sense
    box(gXiao, [XX + 3.8, 0, XB + 11], [1.6, 8.5, 8.5], mats.chip);                                                // khối camera
    const lens = cyl(gXiao, [XX + 5.3, 0, XB + 11], 2.2, 1.4, mats.lens, 'lens');
    lens.rotation.z = Math.PI / 2;   // ống kính hướng +X (về mũi)
    const lensRing = cyl(gXiao, [XX + 5.0, 0, XB + 11], 3, 0.9, mats.silver);
    lensRing.rotation.z = Math.PI / 2;
    const TZ = XT + 2.6;
    box(gXiao, [46, 0, TZ], [2.8, 22.6, 1], mats.tie);                                                            // dây rút vòng qua đỉnh bo
    [-10.8, 10.8].forEach(y => box(gXiao, [46, y, (TZ - 1) / 2], [2.8, 1, TZ + 1], mats.tie));
    box(gXiao, [46, 0, -0.5], [2.8, 22.6, 1], mats.tie);

    // ---------- bước 11: dây cảm biến ép sát thân ----------
    const gSw = group('swires');
    const sw = [
      [[12, 9, -2.6], [12, 12.5, -1], [12, 12.5, TOP + 2], [14, 13.5, DEV_TOP + 0.3]],
      [[27, -7, -2.6], [22, -12.5, -1], [22, -12.5, TOP + 2], [20, -13.5, DEV_TOP + 0.3]],
      [[0, 8, MPU_TOP], [0, 11, DEV_TOP + 1], [6, 13.5, DEV_TOP + 0.3]],
      [[45, 6, TOP + 4], [42, 6, TOP + 0.8], [36, 12.5, DEV_TOP + 0.3]],
    ];
    const swMats = [mats.yellow, mats.blue, mats.red, mats.whiteW];
    sw.forEach((p, i) => [0, 1].forEach(j => tube(gSw, p.map(([x, y, z]) => [x + j * 0.9, y, z]), 0.35, swMats[(i + j) % 4], i === 0 && j === 0 ? 'swires' : null)));
    [[12, 12.5, -0.8], [22, -12.5, -0.8]].forEach(c => mesh(new THREE.SphereGeometry(1.4, 12, 8), mats.white, gSw, V(...c)));   // chấm keo nến

    // ---------- bước 12: cánh quạt A/B + mũi tên chiều quay ----------
    const gProps = group('props');
    const props = {};
    Object.entries(MOT).forEach(([k, [x, y]]) => {
      const isA = ROT[k] === 'cw';
      const p = new THREE.Group();
      p.position.copy(V(x, y, PROP_Z));
      p.add(new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 3, 20), (isA ? mats.propA : mats.propB).clone()));
      [0, Math.PI].forEach(a => {
        const b = new THREE.Mesh(bladeGeo(THREE, isA), (isA ? mats.propA : mats.propB).clone());
        b.rotation.y = a;
        p.add(b);
      });
      gProps.add(p);
      props[k] = p;
      anchors['prop' + k] = p;
      // vòng mũi tên chiều quay (nhìn từ trên)
      const arc = new THREE.Mesh(new THREE.TorusGeometry(31, 0.7, 6, 48, Math.PI * 1.2), mats.arrow.clone());
      arc.rotation.x = Math.PI / 2;
      arc.position.copy(V(x, y, PROP_Z + 1));
      const head = new THREE.Mesh(new THREE.ConeGeometry(2.4, 6, 12), mats.arrow.clone());
      gProps.add(arc, head);
      arc.userData.arcFor = k; head.userData.arcFor = k;
    });
    // Cung nằm ngang: tham số t → three (31cos t, _, 31sin t). Nhìn từ trên, t tăng đi từ mũi (X) sang phải (-Y) = chiều kim đồng hồ.
    // CCW (M1, M3): đầu mũi tên ở t=0, hướng ngược tiếp tuyến; CW: đầu ở t=cuối, hướng theo tiếp tuyến.
    Object.entries(MOT).forEach(([k]) => {
      const [x, y] = MOT[k], ccw = ROT[k] === 'ccw', end = Math.PI * 1.2;
      const head = gProps.children.find(c => c.userData.arcFor === k && c.geometry.type === 'ConeGeometry');
      const ang = ccw ? 0 : end, s = ccw ? -1 : 1;
      head.position.set(x + 31 * Math.cos(ang), PROP_Z + 1, -y + 31 * Math.sin(ang));
      head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-Math.sin(ang) * s, 0, Math.cos(ang) * s).normalize());
    });

    // ---------- trạng thái, nhãn, hoạt ảnh ----------
    const ORDER = STEP_INFO.map(s => s.parts);
    const stepOf = {};
    ORDER.forEach((ps, i) => ps.forEach(p => { stepOf[p] = i; }));
    Object.values(parts).forEach(g => g.traverse(o => { if (o.isMesh) o.userData.baseEmissive = o.material.emissive.clone(); }));

    let step = -1, anim = null, camAnim = null, t0 = performance.now(), running = true, visible = true;
    const labels = [];

    function setLabels(list) {
      labelLayer.replaceChildren();
      labels.length = 0;
      list.forEach(([key, text]) => {
        const o = anchors[key];
        if (!o) return;
        const d = document.createElement('div');
        d.className = 'asm3d-label';
        d.textContent = text;
        labelLayer.appendChild(d);
        labels.push([o, d]);
      });
      const n = document.createElement('div');
      n.className = 'asm3d-label nose';
      n.textContent = 'MŨI';
      labelLayer.appendChild(n);
      labels.push([anchors.nose, n]);
    }

    const offsetFor = name => ({
      frame: [0, 0, 0], tape: [0, 0, 25], rings: [0, 0, -30], motors: [0, 0, 35], driver: [0, 0, 30], mwires: [0, 0, 0],
      power: [0, 0, 30], battery: [0, 0, -35], strap: [0, 0, -25], devkit: [0, 0, 40], ties: [0, 0, 20], mpu: [0, 0, 30],
      pmw: [0, 0, -30], vl53: [0, 0, -30], xiao: [40, 0, 0], swires: [0, 0, 0], props: [0, 0, 30],
    }[name] || [0, 0, 20]);

    function setStep(i) {
      i = Math.max(0, Math.min(STEP_INFO.length - 1, i | 0));
      step = i;
      Object.entries(parts).forEach(([name, g]) => {
        const s = stepOf[name];
        g.visible = s <= i;
        g.position.set(0, 0, 0);
        g.traverse(o => { if (o.isMesh) { o.material.emissive.copy(o.userData.baseEmissive); o.material.emissiveIntensity = 1; } });
      });
      const cur = STEP_INFO[i].parts.map(n => parts[n]);
      const now = performance.now();
      anim = REDUCED ? null : { start: now, dur: 1000, groups: cur.map(g => ({ g, from: V(...offsetFor(g.name)) })) };
      if (anim) anim.groups.forEach(({ g, from }) => g.position.copy(from));
      // bước 2: gen co nhiệt co lại rồi motor ấn xuống
      Object.values(motorGroups).forEach(g => g.children.forEach(c => { if (c.userData.band) c.scale.set(1, 1, 1); }));
      const [eye, tgt] = VIEWS[STEP_INFO[i].view];
      const t = V(...tgt), e = V(...eye);
      // khung hẹp (điện thoại): lùi camera để vẫn thấy đủ máy bay
      const f = Math.min(2.2, Math.max(1, 1.25 / (camera.aspect || 1)));
      e.sub(t).multiplyScalar(f).add(t);
      if (REDUCED) { camera.position.copy(e); controls.target.copy(t); } else camAnim = { start: now, dur: 1100, fromE: camera.position.clone(), fromT: controls.target.clone(), e, t };
      if (camera.position.lengthSq() === 0) { camera.position.copy(e); controls.target.copy(t); camAnim = null; }
      setLabels(STEP_INFO[i].labels);
      noseArrow.visible = true;
      kick();
    }

    const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const tmp = new THREE.Vector3();
    function frame(now) {
      if (!running) return;
      raf = visible ? requestAnimationFrame(frame) : 0;
      if (anim) {
        const k = Math.min(1, (now - anim.start) / anim.dur), e = ease(k);
        anim.groups.forEach(({ g, from }) => {
          if (g.name === 'motors') {
            // nửa đầu: gen co nhiệt co lại; nửa sau: ấn motor xuống lỗ
            const k1 = Math.min(1, k * 2), k2 = Math.max(0, k * 2 - 1);
            g.children.forEach(mg => mg.children.forEach(c => { if (c.userData.band) { const s = 1.35 - 0.35 * ease(k1); c.scale.set(s, 1, s); } }));
            g.position.copy(from).multiplyScalar(1 - ease(k2));
          } else g.position.copy(from).multiplyScalar(1 - e);
        });
        if (k >= 1) anim = null;
      }
      if (camAnim) {
        const k = Math.min(1, (now - camAnim.start) / camAnim.dur), e = ease(k);
        camera.position.lerpVectors(camAnim.fromE, camAnim.e, e);
        controls.target.lerpVectors(camAnim.fromT, camAnim.t, e);
        if (k >= 1) camAnim = null;
      }
      // tô sáng phần của bước hiện tại
      const pulse = 0.1 + 0.08 * Math.sin(now / 260);
      if (step >= 0) STEP_INFO[step].parts.forEach(n => parts[n].traverse(o => { if (o.isMesh) { o.material.emissive.setHex(0xffa040); o.material.emissiveIntensity = pulse; } }));
      // cánh quay ở bước cuối
      if (step === STEP_INFO.length - 1 && !anim) {
        const dt = (now - t0) / 1000;
        Object.entries(props).forEach(([k, p]) => { p.rotation.y = (ROT[k] === 'ccw' ? 1 : -1) * dt * (REDUCED ? 0.6 : 5); });
      }
      controls.update();
      renderer.render(scene, camera);
      // nhãn HTML
      const w = container.clientWidth, h = container.clientHeight;
      const placed = [];
      labels.forEach(([o, d]) => {
        o.getWorldPosition(tmp);
        tmp.project(camera);
        const hidden = tmp.z > 1 || !isShown(o);
        d.style.display = hidden ? 'none' : '';
        if (hidden) return;
        const lw = d.offsetWidth, lh = d.offsetHeight;
        let x = (tmp.x + 1) / 2 * w - lw / 2, y = (1 - tmp.y) / 2 * h - lh * 1.3;
        // đẩy nhãn lên trên nếu đè nhãn đã đặt
        for (let n = 0; n < 8; n++) {
          const hit = placed.find(r => x < r.x + r.w + 4 && x + lw + 4 > r.x && y < r.y + r.h + 3 && y + lh + 3 > r.y);
          if (!hit) break;
          y = hit.y - lh - 4;
        }
        x = Math.max(2, Math.min(w - lw - 2, x));
        y = Math.max(2, Math.min(h - lh - 2, y));
        placed.push({ x, y, w: lw, h: lh });
        d.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      });
    }
    const isShown = o => { for (let p = o; p; p = p.parent) if (p.visible === false) return false; return true; };
    let raf = 0;
    const kick = () => { if (!raf && visible && running) raf = requestAnimationFrame(frame); };
    controls.addEventListener('change', kick);

    function resize() {
      const w = container.clientWidth || 600, h = container.clientHeight || 420;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      kick();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    const io = new IntersectionObserver(es => { visible = es.some(e => e.isIntersecting); if (visible) kick(); });
    io.observe(container);
    resize();

    return {
      setStep,
      // đặt camera theo hệ máy bay (dùng để kiểm tra, vd nhìn thẳng từ trên: view([-1, 0, 260], [0, 0, 0]))
      view(eye, tgt) { camAnim = null; camera.position.copy(V(...eye)); controls.target.copy(V(...tgt)); kick(); },
      dispose() { running = false; ro.disconnect(); io.disconnect(); controls.dispose(); renderer.dispose(); container.replaceChildren(); },
    };
  }

  // Cánh 2 lá: mặt phẳng hơi xoắn, dài 27,5 mm. isA = quay xuôi (CW) — lá của B là ảnh gương.
  function bladeGeo(THREE, isA) {
    const s = new THREE.Shape();
    s.moveTo(2, -2.2);
    s.bezierCurveTo(10, -4.8, 22, -4.2, 27.5, -1.2);
    s.bezierCurveTo(27.8, 0.8, 26, 2.2, 22, 2.4);
    s.bezierCurveTo(14, 2.8, 6, 2.6, 2, 2.2);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.6, bevelEnabled: false, curveSegments: 12 });
    g.rotateX(-Math.PI / 2);          // nằm ngang
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {  // xoắn lá: nghiêng theo bề rộng
      const x = pos.getX(i), z = pos.getZ(i);
      pos.setY(i, pos.getY(i) + (isA ? 1 : -1) * z * 0.35 * (1 - x / 40));
    }
    g.computeVertexNormals();
    return g;
  }

  // Vân carbon: ô bàn cờ chéo nhỏ, vẽ bằng canvas
  function weaveTexture(THREE) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const x = c.getContext('2d');
    x.fillStyle = '#2a2e33';
    x.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
      const g = x.createLinearGradient(i * 8, j * 8, i * 8 + ((i + j) % 2 ? 8 : 0), j * 8 + ((i + j) % 2 ? 0 : 8));
      g.addColorStop(0, '#1f2226');
      g.addColorStop(0.5, '#3a3f45');
      g.addColorStop(1, '#1f2226');
      x.fillStyle = g;
      x.fillRect(i * 8 + 0.5, j * 8 + 0.5, 7, 7);
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(0.08, 0.08);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  function injectCss() {
    if (document.getElementById('asm3d-css')) return;
    const s = document.createElement('style');
    s.id = 'asm3d-css';
    s.textContent = `.asm3d{position:relative;overflow:hidden;min-height:320px;touch-action:none}
.asm3d canvas{display:block;cursor:grab}
.asm3d-labels{position:absolute;inset:0;pointer-events:none}
.asm3d-label{position:absolute;left:0;top:0;white-space:nowrap;font:600 12px/1.3 system-ui,sans-serif;padding:3px 8px;border-radius:999px;background:rgba(20,22,26,.82);color:#fff;box-shadow:0 1px 4px rgba(0,0,0,.25)}
.asm3d-label.nose{background:#e8590c}
.asm3d-msg{position:absolute;inset:0;display:grid;place-items:center;font:14px system-ui,sans-serif;opacity:.7}`;
    document.head.appendChild(s);
  }
})();
