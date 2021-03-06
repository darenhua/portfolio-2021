import { spline } from '@georgedoescode/spline';
import SimplexNoise from 'simplex-noise';

const points = createPoints();
// our <path> element
const paths = document.querySelectorAll('.meter path');
// used to set our custom property values
const root = document.documentElement;
const simplex = new SimplexNoise();

// how fast we progress through "time"
let noiseStep = 0.0005;

function noise(x, y) {
  // return a value at {x point in time} {y point in time}
  return simplex.noise2D(x, y);
}

root.style.setProperty("--startColor", `red`);
root.style.setProperty("--stopColor", `white`);

document.querySelector('#gradient1 > #gradientStop2').setAttribute("offset", "0%");
document.querySelector('#gradient2 > #gradientStop2').setAttribute("offset", "0%");
document.querySelector('#gradient3 > #gradientStop2').setAttribute("offset", "0%");

function createMeter() {
    paths.forEach((path, index) => {
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
        
            // return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"
            const nX = noise(point.noiseOffsetX + index, point.noiseOffsetX + index);
            const nY = noise(point.noiseOffsetY + index, point.noiseOffsetY + index);
            // map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20
            const x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
            const y = map(nY, -1, 1, point.originY - 20, point.originY + 20);
        
            // update the point's current coordinates
            point.x = x;
            point.y = y;
        
            // progress the point's x, y values through "time"
            point.noiseOffsetX += noiseStep;
            point.noiseOffsetY += noiseStep;
          }
        
    path.setAttribute('d', spline(points, 1, true));
    
    
    })
}

function map(n, start1, end1, start2, end2) {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
  }
  
function createPoints() {
    const points = [];
    // how many points do we need
    const numPoints = 6;
    // used to equally space each point around the circle
    const angleStep = (Math.PI * 2) / numPoints;
    // the radius of the circle
    const rad = 75;
  
    for (let i = 1; i <= numPoints; i++) {
      // x & y coordinates of the current point
      const theta = i * angleStep;
  
      const x = 100 + Math.cos(theta) * rad;
      const y = 100 + Math.sin(theta) * rad;
  
      // store the point
      points.push({
        x: x,
        y: y,
        /* we need to keep a reference to the point's original {x, y} coordinates 
        for when we modulate the values later */
        originX: x,
        originY: y,
        // more on this in a moment!
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
      });
    }
  
    return points;
  }

export default createMeter
