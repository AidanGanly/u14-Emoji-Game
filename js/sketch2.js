const SETTINGS = {
  PHYSICS : {
    CHARACTER : {
      MoveLegsOnWalk : true
    }
  },
  TIMING: {
    displayDeath : 2000
  }
}

var DEAD = []
var REMAINING = []

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

    this.size           = 20

    this.LeftInit  = 0
    this.RightInit = 0

    this.hasFireLeft   = false
    this.hasFireRight  = false

    this.displayQuartile   = 0
    this.displayForSeconds = 6

    this.parts = 0

    this.ShouldDisplayDeath = false
    this.displayDeath       = false

    this.HasLengthMovement  = true
    this.changeHeight       = 100
  }

  manipulateCharacter(DIR){
    var _this = this
    _.each(this.Character.Body, function(ARRAY){
      _.each(ARRAY, function(DATA, NAME){
        if (NAME !== '__COLOUR'){
          if (DIR === 'UP'){
            // if (NAME === 'L1' || NAME === 'R1'){
            //   DATA.setPositionY(DATA.getPositionY() - 4)
            // } else {
            //   DATA.setPositionY(DATA.getPositionY() - 4)
            // }
            DATA.body.velocity.y = 100
            DATA.body.mass = 0.1
            DATA.setPositionY(DATA.getPositionY() - 6)
            //DATA.addSpeed(.25, 90)
          } else if (DIR === 'LEFT'){
            DATA.setPositionX(DATA.getPositionX() - 5)
          } else if (DIR === 'RIGHT'){
            DATA.setPositionX(DATA.getPositionX() + 5)
          } else if (DIR === 'RESET'){
            DATA.body.angle = _this.NumberRotateX
            _this.NumberRotateX = _this.NumberRotateX + 0.0015
            image(Images.respawn, _this.Character.Body.torso.TM2.getPositionX() - 100/2, _this.Character.Body.torso.TM2.getPositionY() - 100/2, 200/2, 200/2);
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
    if (Math.round(this.displayQuartile/60) < 6) return this
    let _this = this

    if (_this.PlaceExplosion === true && _this.PlaceExplosionIteration < 20){
      _this.PlaceExplosionIteration ++;

      for (let i=0; i<3; i++) {
        image(Images.explode, _this.ExplosionX + random(-2, 2), _this.ExplosionY + random(-2, 2), random(30, 70), random(30, 70))
        image(Images.point, _this.ExplosionX + random(-2, 2), _this.ExplosionY  + random(-2, 2), random(30, 70), random(30, 70))
      }

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

      image(Images.rocket_left, BulletPositionX, BulletPositionY, this.size, this.size);

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

                if ((BPX_ODF > -5 && BPX_ODF < 5) && (BPX_OPX < 30 && BPY_OPY < 30)){
                  let Force = (Math.abs(_this.RIGHT_X, OpposingX)) / (1000)
                  DATA.body.force.x = - 0.015

                  _this.RIGHT_X = 0

                  _this.ExplosionX = OpposingX
                  _this.ExplosionY = OpposingY
                  _this.PlaceExplosion = true

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

      image(Images.rocket_right, BulletPositionX, BulletPositionY, this.size, this.size);

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

                if ((BPX_ODF > -5 && BPX_ODF < 5) && (BPX_OPX < 30 && BPY_OPY < 30)){

                  let Force = (Math.abs(_this.LEFT_REAL_X, OpposingX)) / (1000)
                  DATA.body.force.x = 0.015
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

    return this
  }

  initCharacter(){

    let _this = this
    var [x,y] = [this.x, this.y]

    this.Character = {
      Body        : {},
      Connections : {}
    }

    // All created using a small function I created in Lua
    this.Character.Body = {
      head : {
        __COLOUR: '#353b48',
        NK : this.ENV.Matter.makeBlock((x + (this.size * 1) ), (y - (this.size * 4)), this.size, this.size, {restitution: 1}),
        HL : this.ENV.Matter.makeBlock((x + (this.size * 0) ), (y - (this.size * 5)), this.size, this.size, {restitution: 1}),
        HM : this.ENV.Matter.makeBlock((x + (this.size * 1) ), (y - (this.size * 5)), this.size, this.size, {restitution: 1}),
        HR : this.ENV.Matter.makeBlock((x + (this.size * 2) ), (y - (this.size * 5)), this.size, this.size, {restitution: 1}),
      },
      torso : {
        __COLOUR: '#2f36this.size',
        TL1 : this.ENV.Matter.makeBlock((x + (this.size * 2) ), (y - (this.size * 1)), this.size, this.size, {restitution: 1}),
        TM1 : this.ENV.Matter.makeBlock((x + (this.size * 1) ), (y - (this.size * 1)), this.size, this.size, {restitution: 1}),
        TR1 : this.ENV.Matter.makeBlock((x + (this.size * 0) ), (y - (this.size * 1)), this.size, this.size, {restitution: 1}),
        //
        TL2 : this.ENV.Matter.makeBlock((x + (this.size * 2) ), (y - (this.size * 2)), this.size, this.size, {restitution: 1}),
        TM2 : this.ENV.Matter.makeBlock((x + (this.size * 1) ), (y - (this.size * 2)), this.size, this.size, {restitution: 1}),
        TR2 : this.ENV.Matter.makeBlock((x + (this.size * 0) ), (y - (this.size * 2)), this.size, this.size, {restitution: 1}),
        //
        TL3 : this.ENV.Matter.makeBlock((x + (this.size * 2) ), (y - (this.size * 3)), this.size, this.size, {restitution: 1}),
        TM3 : this.ENV.Matter.makeBlock((x + (this.size * 1) ), (y - (this.size * 3)), this.size, this.size, {restitution: 1}),
        TR3 : this.ENV.Matter.makeBlock((x + (this.size * 0) ), (y - (this.size * 3)), this.size, this.size, {restitution: 1}),
      },
      left_arm : {
        __COLOUR: '#7f8fa6',
        L1 : this.ENV.Matter.makeBlock((x + (this.size * 3) ), (y - (this.size * 1)), this.size, this.size, {restitution: 1}),
        L2 : this.ENV.Matter.makeBlock((x + (this.size * 3) ), (y - (this.size * 2)), this.size, this.size, {restitution: 1}),
        L3 : this.ENV.Matter.makeBlock((x + (this.size * 3) ), (y - (this.size * 3)), this.size, this.size, {restitution: 1}),
      },
      middle_leg : {
        ML2 : this.ENV.Matter.makeBlock((x + (this.size * 1) ), (y - (this.size * 0)), this.size, this.size, {restitution: 1}),
        ML1 : this.ENV.Matter.makeBlock((x + (this.size * 1) ), (y - (this.size * -1)), this.size, this.size, {restitution: 1}),
      },
      right_arm : {
        __COLOUR: '#7f8fa6',
        R1 : this.ENV.Matter.makeBlock((x + (this.size * -1) ), (y - (this.size * 1)), this.size, this.size, {restitution: 1}),
        R2 : this.ENV.Matter.makeBlock((x + (this.size * -1) ), (y - (this.size * 2)), this.size, this.size, {restitution: 1}),
        R3 : this.ENV.Matter.makeBlock((x + (this.size * -1) ), (y - (this.size * 3)), this.size, this.size, {restitution: 1}),
      },
      left_leg  : {
        __COLOUR: '#718093',
        BL1 : this.ENV.Matter.makeBlock(x, y,        this.size, this.size, {restitution: 1.2}),
        BL2 : this.ENV.Matter.makeBlock(x, (y + this.size), this.size, this.size, {restitution: 1.2}),
      },
      right_leg : {
        __COLOUR: '#718093',
        BR1 : this.ENV.Matter.makeBlock((x + (this.size * 2) ), y,        this.size, this.size, {restitution: 1.2}),
        BR2 : this.ENV.Matter.makeBlock((x + (this.size * 2) ), (y + this.size), this.size, this.size, {restitution: 1.2}),
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

    _.each(this.Character.Body, function(ARRAY){
      _.each(ARRAY, function(DATA, NAME){
        switch(NAME){
          case '__COLOUR':
            break;
          default:
            if (DATA.isOffCanvas(120)){
              if (_this.ShouldDisplayDeath === false){
                _this.displayDeath = true
                DEAD.push(_this.ID)
                setTimeout(function(){
                  _this.displayDeath  = false
                }, SETTINGS.TIMING.displayDeath)
                _this.ShouldDisplayDeath = true
              }
              if (_this.displayDeath === true){
                image(Images.skull, width/2 - 100, height/2, 100, 100)
                image(_this.display_symbol, width/2, height/2, 100, 100)
                image(Images.skull, width/2 + 100, height/2, 100, 100)
              }
            }
        }
      })
    })

    return this
  }

  get CharacterBody(){
    return this.Character
  }

  get symbol(){
    return this.display_symbol
  }

  displayAllocatedWinner(){
    var _this = this

    if (REMAINING.length === 1){
      if (this.HasLengthMovement){
        setTimeout(function(){
          _this.changeHeight = 0
        }, SETTINGS.TIMING.displayDeath)
        _this.HasLengthMovement = false
      }

      image(Players[REMAINING].symbol, width/2, height/2 - _this.changeHeight, 100, 100)

      image(Images.crown, width/2 + 100, height/2 - _this.changeHeight, 100, 100)
      image(Images.crown, width/2 - 100, height/2 - _this.changeHeight, 100, 100)

      //

      image(Images.repeat, width/2 - 100, height/2 + 100, 100, 100)
      image(Images.keyboard, width/2, height/2 + 100, 100, 100)
      image(Images.repeat_p, width/2 + 100, height/2 + 100, 100, 100)

      //

      image(Images.crown, Players[REMAINING].CharacterBody.Body.head.HM.getPositionX() - 15, Players[REMAINING].CharacterBody.Body.head.HM.getPositionY() - 35, 30, 30)
    }

    return this
  }

  getLifeStatus(){
    if (DEAD.length === 2){
      for (var n in DEAD){
        var current = DEAD[n]
        if (REMAINING.length === 0){
          if (current === 1) REMAINING.push(0)
          if (current === 2) REMAINING.push(1)
          if (current === 3) REMAINING.push(2)
        }
      }
    }
    return this
  }

  displayKeysAboveCharacter(){

    if (!(this.displayQuartile > this.displayForSeconds * 60)){

      let BaseX = this.Character.Body.head.HM.getPositionX() - 10
      let BaseY = this.Character.Body.head.HM.getPositionY() - 50

      image(Images.Binds[this.ID][0], BaseX - 20, BaseY, 20, 20) // Left
      image(Images.Binds[this.ID][1], BaseX + 20, BaseY, 20, 20) // Right
      image(Images.Binds[this.ID][2], BaseX, BaseY - 20, 20, 20) // Up
      image(Images.Binds[this.ID][3], BaseX, BaseY, 20, 20) // Down

      //

      image(Images.rocket_left, BaseX - this.LeftInit - (20 * 3), BaseY, 20, 20)
      image(Images.rocket_right, BaseX - this.RightInit + (20 * 3), BaseY, 20, 20)

      //

      if (this.hasFireLeft){
        image(Images.shoot_fire, BaseX - (20 * 2), BaseY, 20, 20) // Shoot_Left
      } else {
        image(Images.shoot, BaseX - (20 * 2), BaseY, 20, 20) // Shoot_Left
      }

      if (this.hasFireRight){
        image(Images.shoot_fire, BaseX + (20 * 2), BaseY, 20, 20) // Shoot_Left
      } else {
        image(Images.shoot, BaseX + (20 * 2), BaseY, 20, 20) // Shoot_Left
      }

      this.LeftInit += 10;
      this.RightInit -= 10;

      if (this.RightInit * -1 > width + 50){
        this.RightInit = 0
        this.hasFireRight = true
        setTimeout(function(){
          this.hasFireRight = false
        }.bind(this), 200)
      }

      if (this.LeftInit > width - BaseX/3.65){
        this.LeftInit = 0
        this.hasFireLeft = true
        setTimeout(function(){
          this.hasFireLeft = false
        }.bind(this), 200)
      }

      // Countdown

      switch(Math.round(this.displayQuartile/60)){
        case 0:
          image(Images.five, width/2, height/2, 100, 100)
          break
        case 1:
          image(Images.four, width/2, height/2, 100, 100)
          break
        case 2:
          image(Images.three, width/2, height/2, 100, 100)
          break
        case 3:
          image(Images.two, width/2, height/2, 100, 100)
          break
        case 4:
          image(Images.one, width/2, height/2, 100, 100)
          break
        case 5:
          image(Images.zero, width/2, height/2, 100, 100)
          break
        case 6:
          image(Images.end, width/2 + 100, height/2, 100, 100)
          image(Images.end, width/2, height/2, 100, 100)
          image(Images.end, width/2 - 100, height/2, 100, 100)
          break
      }

      this.displayQuartile++;
    }

    return this
  }
}

class Map {
  constructor(ENV){
    this.ENV = ENV
  }
  initMap(){
    this.scene = {
      floor : [
        Images.fire,
        //matter.makeBarrier(width / 2, height, width, 40),
        { // Creates custom class that mimicks barriers
          width : width,
          getPositionX: function(){ return width/2 },
          getPositionY: function(){ return height },
          show: function(){},
        },
        30,
        ['STATIC']
      ],
      __layers : {
        __floors : {
          upper_floor1 : [
            Images.chain,
            matter.makeBarrier((width/2), 600 + 60, width/1.32, 40),
            20,
            ['STATIC']
          ],
          upper_floor2 : [
            Images.chain,
            matter.makeBarrier(20, 600 + 60, 300, 40),
            20,
            {
              x: [-50, 200, 200],
              y: ['STATIC'], //from, to, start
              current: 'MOVE_UP', // It's at 200, so move up to 300
              speed: 0.1, // speed at which things move
              cache: {x: 20, y: 400 + 60}, // initial x,y
              offset: 300 // unused
            }
          ],
          upper_floor3 : [
            Images.chain,
            matter.makeBarrier(335, 340 + 60, 300, 40),
            20,
            ['STATIC']
          ],
          upper_floor4 : [
            Images.chain,
            matter.makeBarrier(660, 340 + 60, 600, 40),
            20,
            {
              x: ['STATIC'],
              y: [0, 200, 0], //from, to, start
              current: 'MOVE_UP', // It's at 200, so move up to 300
              speed: 0.1, // speed at which things move
              cache: {x: 800, y: 340 + 60}, // initial x,y
              offset: 300 // unused
            }
          ],
          upper_floor5 : [
            Images.chain,
            matter.makeBarrier(730, 130 + 60, 1100, 40),
            20,
            ['STATIC']
          ],
          upper_floor6 : [
            Images.chain,
            matter.makeBarrier(1400, 360 + 60, 200, 40),
            20,
            {
              x: [0, 220, 200],
              y: ['STATIC'], //from, to, start
              current: 'MOVE_UP', // It's at 200, so move up to 300
              speed: 0.3, // speed at which things move
              cache: {x: 1400, y: 140 + 60}, // initial x,y
              offset: 300 // unused
            }
          ],
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
          for (var i=0; i < DATA[1].width; i+=40){

            if (DATA[3] != "STATIC"){
              var x = DATA[3].x
              var y = DATA[3].y

              if (x[0] !== "STATIC"){
                if ( (DATA[3].current === "MOVE_UP")){
                  if (x[2] < x[1]){
                    x[2]+=DATA[3].speed || 0.1;
                  } else {
                    DATA[3].current = "MOVE_DOWN"
                  }
                }

                if ( (DATA[3].current === "MOVE_DOWN")){
                  if (x[2] > x[0]){
                    x[2]-=DATA[3].speed || 0.1;
                  } else {
                    DATA[3].current = "MOVE_UP"
                  }
                }
              }
              if (y[0] !== "STATIC"){

                if ( (DATA[3].current === "MOVE_UP")){
                  if (y[2] < y[1]){
                    y[2]+=DATA[3].speed || 0.1;
                  } else {
                    DATA[3].current = "MOVE_DOWN"
                  }
                }

                if ( (DATA[3].current === "MOVE_DOWN")){
                  if (y[2] > y[0]){
                    y[2]-=DATA[3].speed || 0.1;
                  } else {
                    DATA[3].current = "MOVE_UP"
                  }
                }
              }

              if (x[0] !== "STATIC"){
                DATA[1].setPositionY( DATA[3].cache.y + x[2] )
                image(DATA[0], ( (DATA[1].getPositionX() - ((DATA[1].width/2)) ) + i), (DATA[3].cache.y + x[2]) - 30, 40, 40);
              } else if (y[0] !== "STATIC"){
                DATA[1].setPositionX( DATA[3].cache.x + y[2] )
                image(DATA[0], (DATA[3].cache.x + y[2] + i) - DATA[3].offset, ( (DATA[1].getPositionY()) - DATA[2]), 40, 40);
              }

            } else {
              image(DATA[0], ( (DATA[1].getPositionX() - (DATA[1].width/2)) ) + i, DATA[1].getPositionY() - DATA[2], 40, 40);
            }
          }
          //DATA[1].show();
        }
      })
    }; create(this.scene);
  }
}

function setup() {
  matter.mouseInteraction(
    createCanvas(
      1536 - 40,
      759  - 20
     )
  );

  Images = {
    black_square : loadImage("images/black_square.png"),
    pistol_left  : loadImage("images/pistol_left.png"),
    pistol_right : loadImage("images/pistol_right.png"),
    rocket_left  : loadImage("images/rocket_left.png"),
    rocket_right : loadImage("images/rocket_right.png"),
    respawn      : loadImage("images/respawn.png"),
    explode      : loadImage("images/explode.png"),
    chain        : loadImage("images/chain.png"),
    point        : loadImage("images/point.png"),
    fire         : loadImage("images/fire.png"),
    P1           : loadImage("images/P1.png"),
    P2           : loadImage("images/P2.png"),
    P3           : loadImage("images/P3.png"),
    shoot        : loadImage("images/controls/shoot.png"),
    shoot_fire   : loadImage("images/controls/shoot_fire.png"),

    five  : loadImage("images/controls/5.png"),
    four  : loadImage("images/controls/4.png"),
    three : loadImage("images/controls/3.png"),
    two   : loadImage("images/controls/2.png"),
    one   : loadImage("images/controls/1.png"),
    zero  : loadImage("images/controls/0.png"),
    end   : loadImage("images/controls/!.png"),

    repeat     : loadImage("images/repeat.png"),
    repeat_p   : loadImage("images/controls/p_restart.png"),
    keyboard   : loadImage("images/controls/keyboard.png"),

    skull : loadImage("images/skull.png"),
    crown : loadImage("images/crown.png"),

    Binds : [
      [
        loadImage("images/controls/a.png"), // Left
        loadImage("images/controls/d.png"), // Right
        loadImage("images/controls/w.png"), // Up
        loadImage("images/controls/s.png"), // Down
      ],
      [
        loadImage("images/controls/j.png"), // Left
        loadImage("images/controls/l.png"), // Right
        loadImage("images/controls/i.png"), // Up
        loadImage("images/controls/k.png"), // Down
      ],
      [
        loadImage("images/controls/left.png"), // Left
        loadImage("images/controls/right.png"), // Right
        loadImage("images/controls/up.png"), // Up
        loadImage("images/controls/down.png"), // Down
      ],
    ]
  }

  Players = [
    new CharacterClass({Matter : matter})
    .setSpawn(380, 308)
    .initCharacter()
    .setID(0)
    .setSymbol(Images.P1)
    .setKeys({
      LEFT:        65, // A
      RIGHT:       68, // D
      UP:          87, // W
      DOWN:        83, // S
      SHOOT_LEFT:  70, // F
      SHOOT_RIGHT: 20, // CAPS_LOCK
    }),

    new CharacterClass({Matter : matter})
    .setSpawn(800, 88)
    .initCharacter()
    .setID(1)
    .setSymbol(Images.P2)
    .setKeys({
      LEFT:        74,  // J
      RIGHT:       76,  // L
      UP:          73,  // I
      DOWN:        75,  // K
      SHOOT_LEFT:  72,  // H
      SHOOT_RIGHT: 186, // ;
    }),

    new CharacterClass({Matter : matter})
    .setSpawn(1206, 620)
    .initCharacter()
    .setID(2)
    .setSymbol(Images.P3)
    .setKeys({
      LEFT:        LEFT_ARROW,
      RIGHT:       RIGHT_ARROW,
      UP:          UP_ARROW,
      DOWN:        DOWN_ARROW,
      SHOOT_LEFT:  45,
      SHOOT_RIGHT: 17
    }),
  ]

  newMap = new Map({Matter: matter})
  newMap.initMap()
}

function draw() {
  matter.changeGravity(0, 0.7)
  background(0);
  fill(127);

  newMap.createMap();

  for (let Char in Players){
    Players[Char]
    .createCharacter()
    .listenKeys()
    .displayKeysAboveCharacter()
    .getLifeStatus()
    .displayAllocatedWinner()
  }
}

// Allows user to reload the page by pressing ctrl + p
onkeydown = function(e){
  if (e.ctrlKey){
     e.preventDefault()
  } else if (e.key === 'p'){
    location.reload()
  }
}
