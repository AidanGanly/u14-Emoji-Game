var [x, y] = [40, 40]

const KEYS = {}

NumberRotateX = 0

const SETTINGS = {
  PHYSICS : {
    CHARACTER : {
      MoveLegsOnWalk : true
    }
  }
}

function connect(obj, obj2, stiffness){
  return matter.connect(obj, obj2, {
    stiffness: (stiffness ? stiffness : 1.5),
  })
}

class CharacterClass {
  constructor(ENV){
    this.ENV = ENV

    this.LEFT_X       = 0
    this.LEFT_REAL_X  = 0

    this.RIGHT_X      = 0
    this.RIGHT_REAL_X = 0
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
            DATA.body.angle = NumberRotateX
            NumberRotateX = NumberRotateX + 0.0015
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

  listenKeys(){
    let _this = this
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
      image(Images.rocket_left, _this.Character.Body.right_arm.R1.getPositionX() + _this.RIGHT_X, (_this.Character.Body.right_arm.R1.getPositionY() - 10) + random(-15, -5), 40, 40);
      _this.RIGHT_X = _this.RIGHT_X - 30
      var STARTED_AT = _this.Character.Body.right_arm.R1.getPositionX()

      _this.RIGHT_REAL_X = _this.RIGHT_X;

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
       if (!keyIsDown(45)){
         _this.RIGHT_X = 0
       }
    }

    if (keyIsDown(_this.KEYS.SHOOT_LEFT)) {
      image(Images.rocket_right, _this.Character.Body.right_arm.R1.getPositionX() + _this.LEFT_X, (_this.Character.Body.right_arm.R1.getPositionY() - 10) + random(-15, -5), 40, 40);
      _this.LEFT_X = _this.LEFT_X - 30
      var STARTED_AT = _this.Character.Body.left_arm.L1.getPositionX()

      _this.LEFT_REAL_X = _this.LEFT_X;

      if ((_this.LEFT_REAL_X * -1/2) - (STARTED_AT/2)-61 > 0){
        _this.LEFT_X = 0
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
       if (!keyIsDown(45)){
         _this.LEFT_X = 0
       }
    }
  }

  initCharacter(){
    this.Character = {
      Body        : {},
      Connections : {}
    }

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
        NK_HM : connect(this.Character.Body.head.NK, this.Character.Body.head.HM),
        HM_HL : connect(this.Character.Body.head.HM, this.Character.Body.head.HL),
        HM_HR : connect(this.Character.Body.head.HM, this.Character.Body.head.HR),
        //
        NK_HL : connect(this.Character.Body.head.NK, this.Character.Body.head.HL),
        NK_HR : connect(this.Character.Body.head.NK, this.Character.Body.head.HR),
      },
      torso_head : {
        TM3_NK : connect(this.Character.Body.torso.TM3, this.Character.Body.head.NK),
        TL3_NK : connect(this.Character.Body.torso.TL3, this.Character.Body.head.NK),
        TR3_NK : connect(this.Character.Body.torso.TR3, this.Character.Body.head.NK),
      },
      torso : {
        TM1_TL1 : connect(this.Character.Body.torso.TM1, this.Character.Body.torso.TL1),
        TM1_TR1 : connect(this.Character.Body.torso.TM1, this.Character.Body.torso.TR1),
        //
        TM2_TL2 : connect(this.Character.Body.torso.TM2, this.Character.Body.torso.TL2),
        TM2_TR2 : connect(this.Character.Body.torso.TM2, this.Character.Body.torso.TR2),
        //
        TM3_TL1 : connect(this.Character.Body.torso.TM3, this.Character.Body.torso.TL3),
        TM3_TR1 : connect(this.Character.Body.torso.TM3, this.Character.Body.torso.TR3),
        //
        TL1_TL2 : connect(this.Character.Body.torso.TL1, this.Character.Body.torso.TL2),
        TL2_TL3 : connect(this.Character.Body.torso.TL2, this.Character.Body.torso.TL3),
        //
        TM1_TM2 : connect(this.Character.Body.torso.TM1, this.Character.Body.torso.TM2),
        TM2_TM3 : connect(this.Character.Body.torso.TM2, this.Character.Body.torso.TM3),
        //
        TR1_TR2 : connect(this.Character.Body.torso.TR1, this.Character.Body.torso.TR2),
        TR2_TR3 : connect(this.Character.Body.torso.TR2, this.Character.Body.torso.TR3),
        //
        TR3_TR2 : connect(this.Character.Body.torso.TR3, this.Character.Body.torso.TR2),
        TR2_TR1 : connect(this.Character.Body.torso.TR2, this.Character.Body.torso.TR1),
        //\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|
        //\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|
        //\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|//\\|
        TL1_TM2 : connect(this.Character.Body.torso.TL1, this.Character.Body.torso.TM2),
        TR1_TR2 : connect(this.Character.Body.torso.TR1, this.Character.Body.torso.TM2),
        //
        TL2_TM3 : connect(this.Character.Body.torso.TL2, this.Character.Body.torso.TM3),
        TR2_TR3 : connect(this.Character.Body.torso.TR2, this.Character.Body.torso.TM3),
        //
        TL3_TM2 : connect(this.Character.Body.torso.TL3, this.Character.Body.torso.TM2),
        TR3_TM2 : connect(this.Character.Body.torso.TR3, this.Character.Body.torso.TM2),
        //
        TR3_TM2 : connect(this.Character.Body.torso.TR3, this.Character.Body.torso.TM2),
        TR2_TM1 : connect(this.Character.Body.torso.TR2, this.Character.Body.torso.TM1),
        //
        TL3_TM2 : connect(this.Character.Body.torso.TL3, this.Character.Body.torso.TM2),
        TL2_TM1 : connect(this.Character.Body.torso.TL2, this.Character.Body.torso.TM1),
      },
      left_arm_torso : {
        L3_TL3 : connect(this.Character.Body.left_arm.L3, this.Character.Body.torso.TL3),
        L3_TL2 : connect(this.Character.Body.left_arm.L3, this.Character.Body.torso.TL2),
      },
      right_arm_torso : {
        R3_TR3 : connect(this.Character.Body.right_arm.R3, this.Character.Body.torso.TR3),
        R3_TL2 : connect(this.Character.Body.right_arm.R3, this.Character.Body.torso.TR2),
      },
      left_arm : {
        L3_L2 : connect(this.Character.Body.left_arm.L3, this.Character.Body.left_arm.L2),
        L2_L1 : connect(this.Character.Body.left_arm.L2, this.Character.Body.left_arm.L1),
      },
      middle_leg : {
        ML2_TM1 : connect(this.Character.Body.middle_leg.ML2, this.Character.Body.torso.TM1),
        ML2_TL1 : connect(this.Character.Body.middle_leg.ML2, this.Character.Body.torso.TL1),
        ML2_TR1 : connect(this.Character.Body.middle_leg.ML2, this.Character.Body.torso.TR1),
        ML2_BR1 : connect(this.Character.Body.middle_leg.ML2, this.Character.Body.right_leg.BR1),
        //
        ML2_BL1 : connect(this.Character.Body.middle_leg.ML2, this.Character.Body.left_leg.BL1),
        ML2_BR2 : connect(this.Character.Body.middle_leg.ML2, this.Character.Body.right_leg.BR1),
        //
        ML2_BL2 : connect(this.Character.Body.middle_leg.ML2, this.Character.Body.left_leg.BL2),
        ML2_BR2 : connect(this.Character.Body.middle_leg.ML2, this.Character.Body.right_leg.BR2),
        //
        BR1_ML1  : connect(this.Character.Body.right_leg.BR1, this.Character.Body.middle_leg.ML1),
        BL1_ML1  : connect(this.Character.Body.left_leg.BL1, this.Character.Body.middle_leg.ML1),
        //
        BL2_ML1  : connect(this.Character.Body.left_leg.BL2, this.Character.Body.middle_leg.ML1),
        BR2_ML1  : connect(this.Character.Body.right_leg.BR2, this.Character.Body.middle_leg.ML1),
        //
        ML1_ML2  : connect(this.Character.Body.middle_leg.ML1, this.Character.Body.middle_leg.ML2),
      },
      right_arm : {
        R3_R2 : connect(this.Character.Body.right_arm.R3, this.Character.Body.right_arm.R2),
        R2_R1 : connect(this.Character.Body.right_arm.R2, this.Character.Body.right_arm.R1),
      },
      left_leg_torso : {
        BL1_TR1 : connect(this.Character.Body.left_leg.BL1, this.Character.Body.torso.TR1),
        BL1_TM2 : connect(this.Character.Body.left_leg.BL1, this.Character.Body.torso.TM1),
      },
      right_leg_torso : {
        BR1_TL1 : connect(this.Character.Body.right_leg.BR1, this.Character.Body.torso.TL1),
        BL1_TM2 : connect(this.Character.Body.right_leg.BR1, this.Character.Body.torso.TM1),
      },
      left_leg  : {
        BL1_BL2 : connect(this.Character.Body.left_leg.BL1, this.Character.Body.left_leg.BL2),
      },
      right_leg : {
        BR1_BR2 : connect(this.Character.Body.right_leg.BR1, this.Character.Body.right_leg.BR2),
      },
    }

    return this
  }

  createCharacter(){
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
    respawn      : loadImage("images/respawn.png")
  }

  Players = [
    new CharacterClass({Matter : matter}).initCharacter().setKeys({
      LEFT:        LEFT_ARROW,
      RIGHT:       RIGHT_ARROW,
      UP:          UP_ARROW,
      DOWN:        DOWN_ARROW,
      SHOOT_LEFT:  45,
      SHOOT_RIGHT: 17
    }) // Create the characters here
  ]

  newMap = new Map({Matter: matter})
  newMap.initMap()
}

function draw() {
  background(0);
  fill(127);

  newMap.createMap();

  for (let Char in Players){
    Players[Char].createCharacter().listenKeys()
  }
}
