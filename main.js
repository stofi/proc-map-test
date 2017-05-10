'use strict'
const DIAMETER = 12,
      MAX_ELEVATION = 100,
      RANDOMNESS = .5

function main() {
  var canvas = document.getElementById('canvas')
  var ctx = canvas.getContext('2d')
  var map = new Map(DIAMETER, ctx)

  map.randomHexagon().elevation = MAX_ELEVATION

  for (var i = 0; i < 10000; i++) {
    map.elevate(map.randomHexagon())
  }
  map.draw(25)
  return map;
}

function shuffle(array) {
  var a = array.slice()
  for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a;
}


class Hexagon {
  constructor(x,y,z, context, parent) {
    this.x = x
    this.y = y
    this.z = z
    this.elevation = null
    this.context = context
    this.parent = parent
  }

  draw(size){
    this.context.save()
    this.context.translate(this.context.canvas.clientWidth/2, this.context.canvas.clientHeight/2)


    // Z axis
    this.context.translate(this.z*(size*(5/6)), this.z*(size*1.5))
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

    if (this.elevation != null) {
      var shade = 255-Math.floor(255/MAX_ELEVATION*this.elevation)
      this.context.fillStyle = 'rgb(' + shade + ', ' + shade + ', ' + shade + ')'
    }


    this.context.fill()
    this.context.restore()

    // this.context.fillStyle = 'white'
    // this.context.font = '10px Courier';
    // this.context.fillText(''+this.x, size-6, (size/3)*2+10);
    // this.context.fillText(''+this.y, -(size/3)*2, size/2);
    // this.context.fillText(''+this.z, (size/3)*2-12, size/2);
  }
}

class Map {
  constructor(size, context) {
    this.context = context
    this.size = size
    this.hexagons = {}
    this.keys = []
    this.populate()
  }

  populate(){
    for (var x = -this.size; x <= this.size; x++) {
      for (var y = -this.size; y <= this.size; y++) {
        for (var z = -this.size; z <= this.size; z++) {
          if ( (x+y+z) == 0 ) {
            this.hexagons[this.hash(x,y,z)] = new Hexagon(x,y,z, this.context, this)
            this.keys.push(this.hash(x,y,z))
          }
        }
      }
    }
  }

  hash(x,y,z){
    return ("hex_"+(1000-x)+(1000-y)+(1000-z))
  }

  getHexagon(x,y,z){
    if (this.hexagons[this.hash(x,y,z)]) {
      return this.hexagons[this.hash(x,y,z)]
    } else return null
  }

  randomHexagon(){
    var z = Math.floor(Math.random()*(DIAMETER*2))-DIAMETER
    var x = DIAMETER - Math.floor(Math.random()*( DIAMETER*2-Math.abs(z) ))
    var y = - x - z;

    var hex = this.getHexagon(x,y,z);

    if ((x+y+z) == 0 && hex == null){
      return this.randomHexagon()
    } else return hex
  }

  draw(width){
    for (var key in this.hexagons) {
      if (this.hexagons.hasOwnProperty(key)) {
        this.hexagons[key].draw(width)
      }
    }
  }
  getNeigbours(parent){
    var x = parent.x;
    var y = parent.y;
    var z = parent.z;
    var result = []
    var hex;

    var hex = this.getHexagon( x+1, y, z-1 );
    if( hex != null) result.push(hex)

    var hex = this.getHexagon( x-1, y, z+1 );
    if( hex != null) result.push(hex)

    var hex = this.getHexagon( x, y+1, z-1 );
    if( hex != null) result.push(hex)

    var hex = this.getHexagon( x, y-1, z-1 );
    if( hex != null) result.push(hex)

    var hex = this.getHexagon( x+1, y-1, z );
    if( hex != null) result.push(hex)

    var hex = this.getHexagon( x-1, y+1, z );
    if( hex != null) result.push(hex)

    return result;
  }

  elevate(hex){
    var neighbours = [];
    var elevation = null;
    var result = false;
    if (hex.elevation == null) {
      neighbours = this.getNeigbours(hex)

      if(neighbours != []){
        for (var i = 0; i < neighbours.length; i++) {
          if (elevation == null && neighbours[i].elevation != null) {
            elevation = Math.floor(neighbours[i].elevation*.9 + Math.random()*neighbours[i].elevation*.1)
          } else if (neighbours[i].elevation != null && neighbours[i].elevation < elevation*.9 ){
            elevation = Math.floor(Math.random()*neighbours[i].elevation*.9)
          }
        }
        if (elevation != null) {
          hex.elevation = elevation
          console.log(elevation);

          neighbours = neighbours.filter(function(neighbour){
            return neighbours.elevation == null;
          })

          if(neighbours != [] && Math.random() > RANDOMNESS){
            this.elevate(neighbours[Math.floor(Math.random()*(neighbours.length-1))])
          }
          result = true
        }

      }
    }
    return result
  }

}

var m = main()
