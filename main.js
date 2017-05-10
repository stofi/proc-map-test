'use strict'
const DIAMETER = 12

function main() {
  var canvas = document.getElementById('canvas')
  var ctx = canvas.getContext('2d')
  var map = new Map(DIAMETER, ctx)
  map.draw(25)
  return map;
}

class Hexagon {
  constructor(x,y,z, context) {
    this.x = x
    this.y = y
    this.z = z
    this.context = context
  }

  draw(size){
    this.context.save()
    this.context.translate(this.context.canvas.clientWidth/2, this.context.canvas.clientHeight/2)

    // Z axis
    this.context.translate(this.z*(size/6)*5, this.z*(size*1.5))
    // X axis
    this.context.translate(-this.x*(size/12)*11, this.x*(1.5*size))
    // draw hexagon
    this.drawPixels(size)

    this.context.restore()
  }

  drawPixels(h){
    var size = h
    var angle_deg, angle_rad

    this.context.save()

    this.context.beginPath()


    angle_deg = 60 + 30
    angle_rad = Math.PI / 180 * angle_deg
    this.context.moveTo(size * Math.cos(angle_rad), size * Math.sin(angle_rad));

    for (var i = 1; i < 7; i++) {
      angle_deg = 60 * i + 30
      angle_rad = Math.PI / 180 * angle_deg
      this.context.lineTo(size * Math.cos(angle_rad), size * Math.sin(angle_rad));
    }

    this.context.closePath()

  //  this.context.stroke()

    var color = DIAMETER * 2 + 1
    var red = Math.floor(255/color * ( + DIAMETER))
    var blue = Math.floor(255/color * (this.y + DIAMETER))
    var green = Math.floor(255/color * (this.z + DIAMETER))

    this.context.fillStyle = 'rgb(' + red + ', ' + blue + ', ' + green + ')'


    this.context.fill()
    this.context.restore()

    this.context.fillStyle = 'white'
    this.context.font = '10px Courier';
    this.context.fillText(''+this.x, size-6, (size/3)*2+10);
    this.context.fillText(''+this.y, -(size/3)*2, size/2);
    this.context.fillText(''+this.z, (size/3)*2-12, size/2);
  }
}

class Map {
  constructor(size, context) {
    this.context = context
    this.size = size
    this.hexagons = {}
    this.populate()
  }

  populate(){
    for (var x = -this.size; x <= this.size; x++) {
      for (var y = -this.size; y <= this.size; y++) {
        for (var z = -this.size; z <= this.size; z++) {
          if ( (x+y+z) == 0 ) {
            if(x==1 && y==9 && z==-10){
              debugger
            }
            this.hexagons[this.hash(x,y,z)] = new Hexagon(x,y,z, this.context)
          }
        }
      }
    }
  }

  hash(x,y,z){
    return ("hex_"+(1000-x)+(1000-y)+(1000-z))
  }
  getHexagon(x,y,z){
    return this.hexagons[this.hash(x,y,z)]
  }
  draw(width){
    for (var key in this.hexagons) {
      if (this.hexagons.hasOwnProperty(key)) {
        this.hexagons[key].draw(width)
      }
    }
  }
}

var m = main()
