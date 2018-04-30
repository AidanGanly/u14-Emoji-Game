const SETTINGS = {
  PHYSICS : {
    CHARACTER : {
      MoveLegsOnWalk : true
    }
  }
}

class CharacterClass {
  constructor(ENV){
    this.ENV = ENV

    this.LEFT_X         = 0
    this.LEFT_REAL_X    = 0

    this.RIGHT_X        = 0
    this.RIGHT_REAL_X   = 0

    this.NumberRotateX  = 0

    this.PlaceExplosion = false
    this.ExplosionX     = 0
    this.ExplosionY     = 0
  }

  manipulateCharacter(DIR){
    var _this = this
    _.each(this.Character.Body, function(ARRAY){
      _.each(ARRAY, function(DATA, NAME){
        if (NAME !== '__COLOUR'){
          if (DIR === 'UP'){
            if (NAME === 'L1' || NAME === 'R1'){
              DATA.setPositionY(DATA.getPositionY() - 40)
            } else {
              DATA.setPositionY(DATA.getPositionY() - 10)
            }
          } else if (DIR === 'LEFT'){
            DATA.setPositionX(DATA.getPositionX() - 5)
          } else if (DIR === 'RIGHT'){
            DATA.setPositionX(DATA.getPositionX() + 5)
          } else if (DIR === 'RESET'){
            DATA.body.angle = _this.NumberRotateX
            _this.NumberRotateX = _this.NumberRotateX + 0.0015
            image(Images.respawn, _this.Character.Body.torso.TM2.getPositionX() - 200, _this.Character.Body.torso.TM2.getPositionY() - 200, 400, 400);
          }
        }
      })
    })
  }

  setKeys(DICT){
    this.KEYS = DICT
    return this
  }

  setSpawn(x,y){
    this.x = x; this.y = y;
    return this
  }

  setSymbol(image){
    this.display_symbol = image
    return this
  }

  setID(ID){
    this.ID = ID
    return this
  }

  connect(obj, obj2, stiffness){
    return this.ENV.Matter.connect(obj, obj2, {
      stiffness: (stiffness ? stiffness : 1.5),
    })
  }

  listenKeys(){
    let _this = this

    if (_this.PlaceExplosion === true && _this.PlaceExplosionIteration < 20){
      _this.PlaceExplosionIteration ++;

      for (let i=0; i<3; i++)
      image(Images.explode, _this.ExplosionX + random(-2, 2), _this.ExplosionY + random(-2, 2), random(30, 70), random(30, 70))
      image(Images.point, _this.ExplosionX + random(-2, 2), _this.ExplosionY  + random(-2, 2), random(30, 70), random(30, 70))
    } else {
      _this.PlaceExplosion = false;
      _this.PlaceExplosionIteration = 0
    }

    if (keyIsDown(_this.KEYS.LEFT)) {
      _this.manipulateCharacter('LEFT')
    }
    if (keyIsDown(_this.KEYS.RIGHT)) {
      _this.manipulateCharacter('RIGHT')
    }
    if (keyIsDown(_this.KEYS.UP)) {
      _this.manipulateCharacter('UP')
    }
    if (keyIsDown(_this.KEYS.DOWN)) {
      _this.manipulateCharacter('RESET')
    }
    if (keyIsDown(_this.KEYS.SHOOT_RIGHT)) {
      var STARTED_AT = _this.Character.Body.right_arm.R1.getPositionX()
      _this.RIGHT_X = _this.RIGHT_X - 30
      _this.RIGHT_REAL_X = _this.RIGHT_X;

      var BulletPositionX     = ( _this.Character.Body.right_arm.R1.getPositionX() + _this.RIGHT_X )
      var BulletPositionY     = ( (_this.Character.Body.right_arm.R1.getPositionY() - 10) + random(-15, -5) )

      image(Images.rocket_left, BulletPositionX, BulletPositionY, 40, 40);

      for (let Char in Players){
        if (Char != _this.ID){
          _.each(Players[Char].CharacterBody.Body, function(ARRAY){
            _.each(ARRAY, function(DATA, NAME){
              if (NAME !== '__COLOUR'){
                var OpposingX = DATA.body.position.x
                var OpposingY = DATA.body.position.y

                var BPX_OPX = Math.abs(Math.round(BulletPositionX) - Math.round(OpposingX))
                var BPY_OPY = Math.abs(Math.round(BulletPositionY) - Math.round(OpposingY))

                var BPX_ODF

                if (BPX_OPX > BPY_OPY){ BPX_ODF = BPX_OPX - BPY_OPY } else { BPX_ODF = BPY_OPY - BPX_OPX }

                if ((BPX_ODF > -5 && BPX_ODF < 5) && (BPX_OPX < 100 && BPY_OPY < 100)){
                  DATA.body.force.x = -0.5
                  _this.RIGHT_X = 0

                  _this.ExplosionX = OpposingX
                  _this.ExplosionY = OpposingY
                  _this.PlaceExplosion = true

                  //image(Images.explode, OpposingX, OpposingY, 40, 40)
                }
              }
            })
          })
        }
      }

      if ((_this.RIGHT_REAL_X * -1/2) - (STARTED_AT/2)-61 > 0){
        _this.RIGHT_X = 0
      }

      if (SETTINGS.PHYSICS.CHARACTER.MoveArmsOnShoot === true){
        _.each(_this.Character.Body, function(ARRAY){
          _.each(ARRAY, function(DATA, NAME){
           if (NAME === 'R1'){
             DATA.setPositionY(DATA.getPositionY() - 30)
           }
         })
       })
     }
   } else {
       if (!keyIsDown(_this.KEYS.SHOOT_LEFT)){
         _this.RIGHT_X = 0
       }
    }

    if (keyIsDown(_this.KEYS.SHOOT_LEFT)) {

      var STARTED_AT = _this.Character.Body.left_arm.L1.getPositionX()
      _this.LEFT_X = _this.LEFT_X + 30;
      _this.LEFT_REAL_X = 50 + _this.LEFT_X;

      var BulletPositionX = ( _this.Character.Body.left_arm.L1.getPositionX() + _this.LEFT_X )
      var BulletPositionY = ( (_this.Character.Body.left_arm.L1.getPositionY() - 10) + random(-15, -5) )

      image(Images.rocket_right, BulletPositionX, BulletPositionY, 40, 40);

      for (let Char in Players){
        if (Char != _this.ID){
          _.each(Players[Char].CharacterBody.Body, function(ARRAY){
            _.each(ARRAY, function(DATA, NAME){
              if (NAME !== '__COLOUR'){
                var OpposingX = DATA.body.position.x
                var OpposingY = DATA.body.position.y

                var BPX_OPX = Math.abs(Math.round(BulletPositionX) - Math.round(OpposingX))
                var BPY_OPY = Math.abs(Math.round(BulletPositionY) - Math.round(OpposingY))

                var BPX_ODF

                if (BPX_OPX > BPY_OPY){ BPX_ODF = BPX_OPX - BPY_OPY } else { BPX_ODF = BPY_OPY - BPX_OPX }

                if ((BPX_ODF > -5 && BPX_ODF < 5) && (BPX_OPX < 100 && BPY_OPY < 100)){
                  DATA.body.force.x = 0.5
                  _this.LEFT_X = 0

                  _this.ExplosionX = OpposingX
                  _this.ExplosionY = OpposingY
                  _this.PlaceExplosion = true
                }
              }
            })
          })
        }
      }

      if (_this.LEFT_REAL_X > width){
        _this.LEFT_X = 0
      }

      if (SETTINGS.PHYSICS.CHARACTER.MoveArmsOnShoot === true){
        _.each(character.body, function(ARRAY){
          _.each(ARRAY, function(DATA, NAME){
            if (NAME === 'L1'){
              DATA.setPositionY(DATA.getPositionY() - 30)
            }
          })
        })
      }
   } else {
       if (!keyIsDown(_this.KEYS.SHOOT_RIGHT)){
         _this.LEFT_X = 0
       }
    }
  }

  initCharacter(){

    var [x,y] = [this.x, this.y]

    this.Character = {
      Body        : {},
      Connections : {}
    }

    // All created using a small function I created in Lua
    this.Character.Body = {
      head : {
        __COLOUR: '#353b48',
        NK : this.ENV.Matter.makeBlock((x + (40 * 1) ), (y - (40 * 4)), 40, 40, {restitution: 1}),
        HL : this.ENV.Matter.makeBlock((x + (40 * 0) ), (y - (40 * 5)), 40, 40, {restitution: 1}),
        HM : this.ENV.Matter.makeBlock((x + (40 * 1) ), (y - (40 * 5)), 40, 40, {restitution: 1}),
        HR : this.ENV.Matter.makeBlock((x + (40 * 2) ), (y - (40 * 5)), 40, 40, {restitution: 1}),
      },
      torso : {
        __COLOUR: '#2f3640',
        TL1 : this.ENV.Matter.makeBlock((x + (40 * 2) ), (y - (40 * 1)), 40, 40, {restitution: 1}),
        TM1 : this.ENV.Matter.makeBlock((x + (40 * 1) ), (y - (40 * 1)), 40, 40, {restitution: 1}),
        TR1 : this.ENV.Matter.makeBlock((x + (40 * 0) ), (y - (40 * 1)), 40, 40, {restitution: 1}),
        //
        TL2 : this.ENV.Matter.makeBlock((x + (40 * 2) ), (y - (40 * 2)), 40, 40, {restitution: 1}),
        TM2 : this.ENV.Matter.makeBlock((x + (40 * 1) ), (y - (40 * 2)), 40, 40, {restitution: 1}),
        TR2 : this.ENV.Matter.makeBlock((x + (40 * 0) ), (y - (40 * 2)), 40, 40, {restitution: 1}),
        //
        TL3 : this.ENV.Matter.makeBlock((x + (40 * 2) ), (y - (40 * 3)), 40, 40, {restitution: 1}),
        TM3 : this.ENV.Matter.makeBlock((x + (40 * 1) ), (y - (40 * 3)), 40, 40, {restitution: 1}),
        TR3 : this.ENV.Matter.makeBlock((x + (40 * 0) ), (y - (40 * 3)), 40, 40, {restitution: 1}),
      },
      left_arm : {
        __COLOUR: '#7f8fa6',
        L1 : this.ENV.Matter.makeBlock((x + (40 * 3) ), (y - (40 * 1)), 40, 40, {restitution: 1}),
        L2 : this.ENV.Matter.makeBlock((x + (40 * 3) ), (y - (40 * 2)), 40, 40, {restitution: 1}),
        L3 : this.ENV.Matter.makeBlock((x + (40 * 3) ), (y - (40 * 3)), 40, 40, {restitution: 1}),
      },
      middle_leg : {
        ML2 : this.ENV.Matter.makeBlock((x + (40 * 1) ), (y - (40 * 0)), 40, 40, {restitution: 1}),
        ML1 : this.ENV.Matter.makeBlock((x + (40 * 1) ), (y - (40 * -1)), 40, 40, {restitution: 1}),
      },
      right_arm : {
        __COLOUR: '#7f8fa6',
        R1 : this.ENV.Matter.makeBlock((x + (40 * -1) ), (y - (40 * 1)), 40, 40, {restitution: 1}),
        R2 : this.ENV.Matter.makeBlock((x + (40 * -1) ), (y - (40 * 2)), 40, 40, {restitution: 1}),
        R3 : this.ENV.Matter.makeBlock((x + (40 * -1) ), (y - (40 * 3)), 40, 40, {restitution: 1}),
      },
      left_leg  : {
        __COLOUR: '#718093',
        BL1 : this.ENV.Matter.makeBlock(x, y,        40, 40, {restitution: 1.2}),
        BL2 : this.ENV.Matter.makeBlock(x, (y + 40), 40, 40, {restitution: 1.2}),
      },
      right_leg : {
        __COLOUR: '#718093',
        BR1 : this.ENV.Matter.makeBlock((x + (40 * 2) ), y,        40, 40, {restitution: 1.2}),
        BR2 : this.ENV.Matter.makeBlock((x + (40 * 2) ), (y + 40), 40, 40, {restitution: 1.2}),
      }
    },
    this.Character.Connections = {
      head : {
        NK_HM : this.connect(this.Character.Body.head.NK, this.Character.Body.head.HM),
        HM_HL : this.connect(this.Character.Body.head.HM, this.Character.Body.head.HL),
        HM_HR : this.connect(this.Character.Body.head.HM, this.Character.Body.head.HR),
        //
        NK_HL : this.connect(this.Character.Body.head.NK, this.Character.Body.head.HL),
        NK_HR : this.connect(this.Character.Body.head.NK, this.Character.Body.head.HR),
      },
      torso_head : {
        TM3_NK : this.connect(this.Character.Body.torso.TM3, this.Character.Body.head.NK),
        TL3_NK : this.connect(this.Character.Body.torso.TL3, this.Character.Body.head.NK),
        TR3_NK : this.connect(this.Character.Body.torso.TR3, this.Character.Body.head.NK),
      },
      torso : {
        TM1_TL1 : this.connect(this.Character.Body.torso.TM1, this.Character.Body.torso.TL1),
        TM1_TR1 : this.connect(this.Character.Body.torso.TM1, this.Character.Body.torso.TR1),
        //
        TM2_TL2 : this.connect(this.Character.Body.torso.TM2, this.Character.Body.torso.TL2),
        TM2_TR2 : this.connect(this.Character.Body.torso.TM2, this.Character.Body.torso.TR2),
        //
        TM3_TL1 : this.connect(this.Character.Body.torso.TM3, this.Character.Body.torso.TL3),
        TM3_TR1 : this.connect(this.Character.Body.torso.TM3, this.Character.Body.torso.TR3),
        //
        TL1_TL2 : this.connect(this.Character.Body.torso.TL1, this.Character.Body.torso.TL2),
        TL2_TL3 : this.connect(this.Character.Body.torso.TL2, this.Character.Body.torso.TL3),
        //
        TM1_TM2 : this.connect(this.Character.Body.torso.TM1, this.Character.Body.torso.TM2),
        TM2_TM3 : this.connect(this.Character.Body.torso.TM2, this.Character.Body.torso.TM3),
        //
        TR1_TR2 : this.connect(this.Character.Body.torso.TR1, this.Character.Body.torso.TR2),
        TR2_TR3 : this.connect(this.Character.Body.torso.TR2, this.Character.Body.torso.TR3),
        //
        TR3_TR2 : this.connect(this.Character.Body.torso.TR3, this.Character.Body.torso.TR2),
        TR2_TR1 : this.connect(this.Character.Body.torso.TR2, this.Character.Body.torso.TR1),
        //\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|
        //\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|
        //\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|
        TL1_TM2 : this.connect(this.Character.Body.torso.TL1, this.Character.Body.torso.TM2),
        TR1_TR2 : this.connect(this.Character.Body.torso.TR1, this.Character.Body.torso.TM2),
        //
        TL2_TM3 : this.connect(this.Character.Body.torso.TL2, this.Character.Body.torso.TM3),
        TR2_TR3 : this.connect(this.Character.Body.torso.TR2, this.Character.Body.torso.TM3),
        //
        TL3_TM2 : this.connect(this.Character.Body.torso.TL3, this.Character.Body.torso.TM2),
        TR3_TM2 : this.connect(this.Character.Body.torso.TR3, this.Character.Body.torso.TM2),
        //
        TR3_TM2 : this.connect(this.Character.Body.torso.TR3, this.Character.Body.torso.TM2),
        TR2_TM1 : this.connect(this.Character.Body.torso.TR2, this.Character.Body.torso.TM1),
        //
        TL3_TM2 : this.connect(this.Character.Body.torso.TL3, this.Character.Body.torso.TM2),
        TL2_TM1 : this.connect(this.Character.Body.torso.TL2, this.Character.Body.torso.TM1),
      },
      left_arm_torso : {
        L3_TL3 : this.connect(this.Character.Body.left_arm.L3, this.Character.Body.torso.TL3),
        L3_TL2 : this.connect(this.Character.Body.left_arm.L3, this.Character.Body.torso.TL2),
      },
      right_arm_torso : {
        R3_TR3 : this.connect(this.Character.Body.right_arm.R3, this.Character.Body.torso.TR3),
        R3_TL2 : this.connect(this.Character.Body.right_arm.R3, this.Character.Body.torso.TR2),
      },
      left_arm : {
        L3_L2 : this.connect(this.Character.Body.left_arm.L3, this.Character.Body.left_arm.L2),
        L2_L1 : this.connect(this.Character.Body.left_arm.L2, this.Character.Body.left_arm.L1),
      },
      middle_leg : {
        ML2_TM1 : this.connect(this.Character.Body.middle_leg.ML2, this.Character.Body.torso.TM1),
        ML2_TL1 : this.connect(this.Character.Body.middle_leg.ML2, this.Character.Body.torso.TL1),
        ML2_TR1 : this.connect(this.Character.Body.middle_leg.ML2, this.Character.Body.torso.TR1),
        ML2_BR1 : this.connect(this.Character.Body.middle_leg.ML2, this.Character.Body.right_leg.BR1),
        //
        ML2_BL1 : this.connect(this.Character.Body.middle_leg.ML2, this.Character.Body.left_leg.BL1),
        ML2_BR2 : this.connect(this.Character.Body.middle_leg.ML2, this.Character.Body.right_leg.BR1),
        //
        ML2_BL2 : this.connect(this.Character.Body.middle_leg.ML2, this.Character.Body.left_leg.BL2),
        ML2_BR2 : this.connect(this.Character.Body.middle_leg.ML2, this.Character.Body.right_leg.BR2),
        //
        BR1_ML1  : this.connect(this.Character.Body.right_leg.BR1, this.Character.Body.middle_leg.ML1),
        BL1_ML1  : this.connect(this.Character.Body.left_leg.BL1, this.Character.Body.middle_leg.ML1),
        //
        BL2_ML1  : this.connect(this.Character.Body.left_leg.BL2, this.Character.Body.middle_leg.ML1),
        BR2_ML1  : this.connect(this.Character.Body.right_leg.BR2, this.Character.Body.middle_leg.ML1),
        //
        ML1_ML2  : this.connect(this.Character.Body.middle_leg.ML1, this.Character.Body.middle_leg.ML2),
      },
      right_arm : {
        R3_R2 : this.connect(this.Character.Body.right_arm.R3, this.Character.Body.right_arm.R2),
        R2_R1 : this.connect(this.Character.Body.right_arm.R2, this.Character.Body.right_arm.R1),
      },
      left_leg_torso : {
        BL1_TR1 : this.connect(this.Character.Body.left_leg.BL1, this.Character.Body.torso.TR1),
        BL1_TM2 : this.connect(this.Character.Body.left_leg.BL1, this.Character.Body.torso.TM1),
      },
      right_leg_torso : {
        BR1_TL1 : this.connect(this.Character.Body.right_leg.BR1, this.Character.Body.torso.TL1),
        BL1_TM2 : this.connect(this.Character.Body.right_leg.BR1, this.Character.Body.torso.TM1),
      },
      left_leg  : {
        BL1_BL2 : this.connect(this.Character.Body.left_leg.BL1, this.Character.Body.left_leg.BL2),
      },
      right_leg : {
        BR1_BR2 : this.connect(this.Character.Body.right_leg.BR1, this.Character.Body.right_leg.BR2),
      },
    }

    return this
  }

  createCharacter(){
    let _this = this
    _.each(this.Character.Body, function(ARRAY){
      _.each(ARRAY, function(DATA, NAME){
        switch(NAME){
          case '__COLOUR':
            fill(DATA);
            break;
          case 'L1':
            image(Images.pistol_right, DATA.getPositionX() - (DATA.getHeight()/2+0.1), DATA.getPositionY() - (DATA.getHeight()/2+0.1), DATA.getHeight(), DATA.getWidth());
            break;
          case 'R1':
            image(Images.pistol_left, DATA.getPositionX() - (DATA.getHeight()/2+0.1), DATA.getPositionY()  - (DATA.getHeight()/2+0.1), DATA.getHeight(), DATA.getWidth());
            break;
          case 'TM2':
            image(_this.display_symbol, DATA.getPositionX() - (DATA.getHeight()/2+0.1), DATA.getPositionY() - (DATA.getHeight()/2+0.1), DATA.getHeight(), DATA.getWidth());
            break;
          case 'ML1':
          case 'ML2':
            break
          default:
            stroke('#212121');
            image(Images.black_square, DATA.getPositionX() - (DATA.getHeight()/2+0.1), DATA.getPositionY() - (DATA.getHeight()/2+0.1), DATA.getHeight(), DATA.getWidth());
        }
      })
    });

    return this
  }

  get CharacterBody(){
    return this.Character
  }
}

class Map {
  constructor(ENV){
    this.ENV = ENV
  }
  initMap(){
    this.scene = {
      floor   : matter.makeBarrier(width / 2, height, width, 50),
      __layers : {
        __first : {
          F1 : matter.makeBarrier(0, 1500, width / 5, 90),
          F2 : matter.makeBarrier(width / 5, 1500, width / 5.5, 90),
        }
      }
    }
  }
  createMap(){
    function create(data){
      _.each(data, function(DATA, ALIAS){
        if (ALIAS.indexOf('__') === 0){
          create(DATA)
        } else {
          DATA.show();
        }
      })
    }; create(this.scene);
  }
}

function setup() {
  matter.mouseInteraction(
    createCanvas(
      window.innerWidth - 40,
      window.innerHeight - 40
     )
  );

  Images = {
    black_square : loadImage("images/black_square.png"),
    pistol_left  : loadImage("images/pistol_left.png"),
    pistol_right : loadImage("images/pistol_right.png"),
    rocket_left  : loadImage("images/rocket_left.png"),
    rocket_right : loadImage("images/rocket_right.png"),
    titleImage   : loadImage("images/title.png"),
    respawn      : loadImage("images/respawn.png"),
    explode      : loadImage("images/explode.png"),
    point        : loadImage("images/point.png"),
    P1           : loadImage("images/P1.png"),
    P2           : loadImage("images/P2.png"),
    P3           : loadImage("images/P3.png"),
  }

  Players = [
    new CharacterClass({Matter : matter})
    .setSpawn(500, 1000)
    .initCharacter()
    .setID(0)
    .setSymbol(Images.P1)
    .setKeys({
      LEFT:        LEFT_ARROW,
      RIGHT:       RIGHT_ARROW,
      UP:          UP_ARROW,
      DOWN:        DOWN_ARROW,
      SHOOT_LEFT:  45,
      SHOOT_RIGHT: 17
    }),

    new CharacterClass({Matter : matter})
    .setSpawn(200, 1000)
    .initCharacter()
    .setID(1)
    .setSymbol(Images.P2)
    .setKeys({
      LEFT:        65, // A
      RIGHT:       68, // D
      UP:          87, // W
      DOWN:        83, // S
      SHOOT_LEFT:  70, // F
      SHOOT_RIGHT: 20, // CAPS_LOCK
    }),
  ]

  newMap = new Map({Matter: matter})
  newMap.initMap()
}

function draw() {
  background(0);
  fill(127);


  newMap.createMap();

  for (let Char in Players){
    Players[Char]
    .createCharacter()
    .listenKeys()
  }
}

onkeydown = function(e){ return ((e.ctrlKey) ? e.preventDefault() : ''); }
