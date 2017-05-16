'use strict'

var   RADIUS = 21,          // Radius of the hexagonal map
      MAX_ELEVATION = 256,  // Number of possible elevations
      ELEVATION_STEP = .2,  // 0 - table mountain island, 1 isolated peaks
      RANDOMNESS = .5,      // 0 - very rough and diconected shapes, 1 - smooth continuous islands
      SIZE = 20,            // Radius of one hex in px
      PALETTE = chroma.scale(['14640a','fbf84f','6b030a']).colors(MAX_ELEVATION),
      PEAKS = 3,
      SEED = Math.floor(Math.random()*1000).toString(16)+'land'


function main(){
  var canvas = document.getElementById('canvas')
  var ctx = canvas.getContext('2d')
  init(ctx, SEED)
  ui(ctx)
}


function init(ctx) {
  Math.seedrandom(SEED);

  var map = new Map(RADIUS, ctx)

  map.addNRandomPeaks(PEAKS);
  map.elevateAll()
  map.draw(SIZE)

}

function ui(ctx) {
    var container = document.querySelector('.ui-container')
    var open = document.querySelector('.button-open')
    var close = document.querySelector('.button-close')
    open.addEventListener('click', function(){
      container.classList.add('open')
      console.log('test');
    }, false)
    close.addEventListener('click', function(){
      container.classList.remove('open')
    }, false)

    var generate = document.getElementsByName('generate')[0]
    var f_radius = document.getElementsByName('radius')[0]
    var f_elevation = document.getElementsByName('elevation')[0]
    var f_step = document.getElementsByName('step')[0]
    var f_roughness = document.getElementsByName('roughness')[0]
    var f_size = document.getElementsByName('size')[0]
    var f_seed = document.getElementsByName('seed')[0]
    var f_peaks = document.getElementsByName('peaks')[0]
    f_radius.value = RADIUS
    f_elevation.value = MAX_ELEVATION
    f_step.value = ELEVATION_STEP
    f_roughness.value = RANDOMNESS
    f_size.value = SIZE
    f_peaks.value = PEAKS
    f_seed.value = SEED

    generate.addEventListener('click',function() {
        RADIUS = parseInt(f_radius.value)
        MAX_ELEVATION = parseInt(f_elevation.value)
        ELEVATION_STEP = parseFloat(f_step.value)
        RANDOMNESS = parseFloat(f_roughness.value)
        SIZE = parseInt(f_size.value)
        PALETTE = chroma.scale(['14640a','fbf84f','6b030a']).colors(MAX_ELEVATION)
        SEED = f_seed.value
        PEAKS = parseInt(f_peaks.value)
        init(ctx)
    }, false)
}


function shuffle(array) {
  var a = array.slice()
  for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a;
}

function degToRad(deg) {
  return Math.PI / 180 * deg
}


class Hexagon {
  constructor(x,y,z, context, parent, id) {
    this.x = x
    this.y = y
    this.z = z
    this.id = id
    this.elevation = null
    this.context = context
    this.parent = parent
  }

  draw(size){
    this.context.save()

    // Start from the center
    this.context.translate(this.context.canvas.clientWidth/2, this.context.canvas.clientHeight/2)

    // translare by coordinates
    // on Z axis
    this.context.translate(this.z*(size*(5/6)), this.z*(size*1.5))
    // on X axis
    this.context.translate(-this.x*(size/12)*11, this.x*(1.5*size))
    // draw hexagon
    this.drawPixels(size)

    this.context.restore()
  }


  drawPixels(unit){
    this.context.save()
    this.context.beginPath()

    var size = unit*1.01 // slightly increase the size, cleans rounding artifacts
    var angle

    angle = degToRad(90) // start at 90deg

    this.context.moveTo(size * Math.cos(angle), size * Math.sin(angle))

    for (var i = 1; i < 7; i++) {
      // rotate by 60deg
      angle = degToRad(60 * i + 30)
      this.context.lineTo(size * Math.cos(angle), size * Math.sin(angle))
    }

    this.context.closePath()

    this.context.fillStyle = this.getColor()

    this.context.fill()
    this.context.restore()
  }

  getColor(){
    // this is ugly :(

    var color = null

      if(this.elevation != null && this.elevation > 0 ){
        color = PALETTE[this.elevation-1]
      } else {
        color = '#273ecc'
      }


    return color
  }
}

class Map {
  constructor(size, context) {
    this.context = context
    this.size = size
    this.hexagons = {}
    this.keys = []
    this.populate()
    this.keysFlat = this.keys
    this.waterEdges()
    this.keys = shuffle(this.keys)
  }

  populate(){
    for (var x = -this.size; x <= this.size; x++) {
      for (var y = -this.size; y <= this.size; y++) {
        for (var z = -this.size; z <= this.size; z++) {
          if ( (x+y+z) == 0 ) {
            this.hexagons[this.hash(x,y,z)] = new Hexagon(x,y,z, this.context, this, this.hash(x,y,z))
            this.keys.push(this.hash(x,y,z))
          }
        }
      }
    }
  }

  filterFlats(hex){
    this.keysFlat = this.keysFlat.filter((key)=>{
      return key != hex.hash
    })
  }

  waterEdges(){
    // filter is slow, find better implementation?

    var hex = null
    for (var hexa in this.hexagons) {
      if (this.hexagons.hasOwnProperty(hexa)) {
        hex = this.hexagons[hexa]
        if (hex.x == this.size ||
            hex.x == -this.size ||
            hex.y ==  this.size ||
            hex.y == -this.size ||
            hex.z ==  this.size ||
            hex.z == -this.size ) {
          hex.elevation = 0

          this.filterFlats(hex)
        }
      }
    }
  }

  addNRandomPeaks(n){
    for (var i = 0; i < n; i++) {
      this.randomFlat().elevation = MAX_ELEVATION
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
    var shuffled = shuffle(this.keys)
    return this.hexagons[shuffled[0]]
  }
  randomFlat(){
    var shuffled = shuffle(this.keysFlat)
    return this.hexagons[shuffled[0]]
  }

  loopByHash(f){
    for (var i = 0; i < this.keys.length; i++) {
      // console.log(this.keys[i]);
      if (this.hexagons.hasOwnProperty(this.keys[i])) {
        f(this.hexagons[this.keys[i]])
      }
    }
  }

  loopByGrid(f){
    var z,x,y = 0;
    var start = 0;
    for (z = -RADIUS; z <= RADIUS; z++) {
      start = (z > 0) ? -RADIUS : -(z+RADIUS)
      for (x = start; x < start+(RADIUS*2+1)+Math.abs(z); x++) {
        y = 0 -x -z;
        if (this.hexagons.hasOwnProperty(this.hash(x,y,z))) {
          f(this.hexagons[this.hash(x,y,z)])
        }
      }
    }
  }

  draw(width){
    this.loopByGrid((hex)=>{
      hex.draw(width)
    })
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

  elevateAll(){
    for (var i = 0; i < 10000 && this.keysFlat.length>0; i++) {
      this.elevate(this.randomFlat())
    }

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
            elevation = Math.floor(neighbours[i].elevation*(1-ELEVATION_STEP) + Math.random()*neighbours[i].elevation*(ELEVATION_STEP))
          } else if (neighbours[i].elevation != null && neighbours[i].elevation < elevation*(1-ELEVATION_STEP) ){
            // elevation = Math.floor(Math.random()*neighbours[i].elevation*(1-ELEVATION_STEP))
            elevation = Math.floor((Math.random()*neighbours[i].elevation+elevation)/2)
          }
        }
        if (elevation != null) {
          hex.elevation = elevation
          // if (elevation < MAX_ELEVATION/10) {
          //    hex.elevation = Math.floor(MAX_ELEVATION/10)
          // }

          neighbours = neighbours.filter(function(neighbour){
            return neighbours.elevation == null;
          })

          if(neighbours != [] && Math.random() > RANDOMNESS){
            this.elevate(neighbours[Math.floor(Math.random()*(neighbours.length-1))])
          }


          // debugger
          hex.draw(SIZE)


          result = true
          this.filterFlats(hex)
        }

      }
    }
    return result
  }

}

main()
