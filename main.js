/* Tak tady bych Tě opravdu nečekal, chceš věděť odkud jsem to zkopíroval viď?
/* Chceš se dozvědět, jak dlouho jsem musel listovat Stackoverflow.com,
/* než jsem našel odpověď na otázku "Jak v JavaScriptu naprogramovat
/* procedurálně generovanou mapu, umístěnou do hexagonální mřížky?"
/* Z kolik repozitářů na GitHubu jsem musel kopírovat kusy kódu doufaje, že
/* bude fungovat, aniž bych musel něco složitě upravovat nebo nad něčím
/* dlouze přemýšlet?
/* Odpověď na tyhle otázky se tady nedovíš. Můžu se ti, ale pokusit vysvětlit,
/* jak to funguje.
*/

/* Tohle si vymysleli programátoři JavaScriptu, když se jim ostatní programátoři
/* smáli, že JavaScript není dostatečně vážný programovací jazyk.
/* Když napíšeš nazačátek */ 'use strict' /* pořád se ti budou smát, ale tvůj
/* kód bude o 42% přísnější.
*/

/* Ok, co dál?
/* nejdřív si pojmenuju pár čísel: */
const RADIUS = 21,          // Radius of the hexagonal map
      MAX_ELEVATION = 100,  // Number of possible elevations
      ELEVATION_STEP = .1,  // 0 - table mountain island, 1 isolated peaks
      RANDOMNESS = .2,      // 0 - very rough and diconected shapes, 1 - smooth continuous islands
      SIZE = 20             // Radius of one hex in px

/* A konečně funkce main, kde se dějí ta kouzla: */
function main() {
  /* Protože chci, aby počítač nakreslil mapu imaginárního ostrova,
  /* musím mu nejdřív říct, kde má plátno */
  var canvas = document.getElementById('canvas')
  /* když pochopí, že plátnem myslím tu obroskou bílou plochu na obrazovse,
  /* musím ještě vysvětlit, aby kreslil ve 2D. */
  var ctx = canvas.getContext('2d')
  /* Vytvořím si novou mapu o poloměrem RADIUS */
  var map = new Map(RADIUS, ctx)

  /* Mimochodem...
  /* V programování je nevětší hřích lenost, líní programátoři se vyznačují tím,
  /* že se neradi opakují. Proti lenosti se, ale dá bojovat. */

  // Vyberu si náhodný šestiúhelník a nastavím jako výšku na maximum
  map.randomFlat().elevation = MAX_ELEVATION
  // Vyberu si náhodný šestiúhelník a nastavím jako výšku na maximum
  map.randomFlat().elevation = MAX_ELEVATION
  // Vyberu si náhodný šestiúhelník a nastavím jako výšku na maximum
  map.randomFlat().elevation = MAX_ELEVATION
  // Vyberu si náhodný šestiúhelník a nastavím jako výšku na maximum
  map.randomFlat().elevation = MAX_ELEVATION
  // Vyberu si náhodný šestiúhelník a nastavím jako výšku na maximum
  map.randomFlat().elevation = MAX_ELEVATION
  // Vyberu si náhodný šestiúhelník a nastavím jako výšku na maximum
  map.randomFlat().elevation = MAX_ELEVATION
  // Vyberu si náhodný šestiúhelník a nastavím jako výšku na maximum
  map.randomFlat().elevation = MAX_ELEVATION
  // Vyberu si náhodný šestiúhelník a nastavím jako výšku na maximum
  map.randomFlat().elevation = MAX_ELEVATION
  // 💦

  // Potom nastavím výšku všem ostatním šestiúhelníkům
  map.elevateAll()

  // A nakonec mapu nakreslím.
  map.draw(SIZE)
  // Je slušné vracet věci, které jste si půjčili.
  return map;
}
/* Docela jednoduché, ne?
/* Jak říkám, programovat zvládne každý, stačí chtít.
/*
/* Hmm... Ok, pár věcí jsem zatajil. Vlastně všechno.
/*
/*
/*
/*
/*
/*
/*
/*
*/


function shuffle(array) {
  var a = array.slice()
  for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
  return a;
}

function MyError(message) {
  this.name = 'err';
  this.message = message;
  this.stack = (new Error()).stack;
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
    var size = h*1.01
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

    var color = RADIUS * 2 + 1
    var red = Math.floor(255/color * ( + RADIUS))
    var blue = Math.floor(255/color * (this.y + RADIUS))
    var green = Math.floor(255/color * (this.z + RADIUS))

    this.context.fillStyle = 'rgb(' + red + ', ' + blue + ', ' + green + ')'

    if (this.elevation != null) {
      var shade = Math.floor(255/MAX_ELEVATION*this.elevation)
      this.context.fillStyle = 'rgb(' + shade + ', ' + shade + ', ' + shade + ')'
      if(this.elevation < 50){

      }
      if(this.elevation == Math.floor(MAX_ELEVATION/10)){
        this.context.fillStyle = '#273ecc'
      }
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
    this.keysFlat = this.keys
    this.waterEdges()
    this.keys = shuffle(this.keys)
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

  waterEdges(){
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
          hex.elevation = Math.floor(MAX_ELEVATION/10)
          this.keysFlat = this.keysFlat.filter((key)=>{
            return key != ("hex_"+(1000-hex.x)+(1000-hex.y)+(1000-hex.z))
          })
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
    // this.loopByGrid((h)=>{
    //   if (h.elevation == null) {
    //     h.elevation = Math.floor(MAX_ELEVATION/10)
    //   }
    // })
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
          if (elevation < MAX_ELEVATION/10) {
             hex.elevation = Math.floor(MAX_ELEVATION/10)
          }

          neighbours = neighbours.filter(function(neighbour){
            return neighbours.elevation == null;
          })

          if(neighbours != [] && Math.random() > RANDOMNESS){
            this.elevate(neighbours[Math.floor(Math.random()*(neighbours.length-1))])
          }


          // debugger
          hex.draw(SIZE)


          result = true
          this.keysFlat = this.keysFlat.filter((key)=>{
            return key != ("hex_"+(1000-hex.x)+(1000-hex.y)+(1000-hex.z))
          })
        }

      }
    }
    return result
  }

}

var m = main()
