var SETTINGS = {
  PHYSICS : {
    CHARACTER : {
      MoveArmsOnShoot : true,
      MoveLegsOnWalk  : true
    }
  }
}

var floor;
var character;
var img;

function connect(obj, obj2, stiffness){
  return matter.connect(obj, obj2, {
    stiffness: (stiffness ? stiffness : 1.5),
    //length: 0.7 * dist(obj.getPositionX(), obj.getPositionY(), obj2.getPositionX(), obj2.getPositionY()),
  })
}

function setup() {
  matter.mouseInteraction(canvas);

  canvas = createCanvas(window.innerWidth	- 40, window.innerHeight - 40);

  scene = {
    floor   : matter.makeBarrier(width / 2, height, width, 50),
    __layers : {
      __first : {
        F1 : matter.makeBarrier(0, 1500, width / 5, 90),
        F2 : matter.makeBarrier(width / 5, 1500, width / 5.5, 90),
      }
    }
  }

  black_square = loadImage("images/black_square.png");
  //
  pistol_right = loadImage("images/pistol_right.png");
  pistol_left  = loadImage("images/pistol_left.png");
  //
  rocket_left   = loadImage("images/rocket_left.png");
  rocket_right  = loadImage("images/rocket_right.png");

  var x = width / 2;
  var y = height / 2;

  var text_mid_x = width / 2;
  var text_mid_y = height / 2;

  newText = {
    E : {
      EBR3 : matter.makeBarrier(text_mid_x - (40 * 3))
    }
  }

  character = {
    body : {
      head      : {
        __COLOUR: '#353b48',
        NK : matter.makeBlock((x + (40 * 1) ), (y - (40 * 4)), 40, 40, {restitution: 1}),
        HL : matter.makeBlock((x + (40 * 0) ), (y - (40 * 5)), 40, 40, {restitution: 1}),
        HM : matter.makeBlock((x + (40 * 1) ), (y - (40 * 5)), 40, 40, {restitution: 1}),
        HR : matter.makeBlock((x + (40 * 2) ), (y - (40 * 5)), 40, 40, {restitution: 1}),
      },
      torso     : {
        __COLOUR: '#2f3640',
        TL1 : matter.makeBlock((x + (40 * 2) ), (y - (40 * 1)), 40, 40, {restitution: 1}),
        TM1 : matter.makeBlock((x + (40 * 1) ), (y - (40 * 1)), 40, 40, {restitution: 1}),
        TR1 : matter.makeBlock((x + (40 * 0) ), (y - (40 * 1)), 40, 40, {restitution: 1}),
        //
        TL2 : matter.makeBlock((x + (40 * 2) ), (y - (40 * 2)), 40, 40, {restitution: 1}),
        TM2 : matter.makeBlock((x + (40 * 1) ), (y - (40 * 2)), 40, 40, {restitution: 1}),
        TR2 : matter.makeBlock((x + (40 * 0) ), (y - (40 * 2)), 40, 40, {restitution: 1}),
        //
        TL3 : matter.makeBlock((x + (40 * 2) ), (y - (40 * 3)), 40, 40, {restitution: 1}),
        TM3 : matter.makeBlock((x + (40 * 1) ), (y - (40 * 3)), 40, 40, {restitution: 1}),
        TR3 : matter.makeBlock((x + (40 * 0) ), (y - (40 * 3)), 40, 40, {restitution: 1}),
      },
      left_arm  : {
        __COLOUR: '#7f8fa6',
        L1 : matter.makeBlock((x + (40 * 3) ), (y - (40 * 1)), 40, 40, {restitution: 1}),
        L2 : matter.makeBlock((x + (40 * 3) ), (y - (40 * 2)), 40, 40, {restitution: 1}),
        L3 : matter.makeBlock((x + (40 * 3) ), (y - (40 * 3)), 40, 40, {restitution: 1}),
      },
      middle_leg : {
        ML2 : matter.makeBlock((x + (40 * 1) ), (y - (40 * 0)), 40, 40, {restitution: 1}),
        ML1 : matter.makeBlock((x + (40 * 1) ), (y - (40 * -1)), 40, 40, {restitution: 1}),
      },
      right_arm : {
        __COLOUR: '#7f8fa6',
        R1 : matter.makeBlock((x + (40 * -1) ), (y - (40 * 1)), 40, 40, {restitution: 1}),
        R2 : matter.makeBlock((x + (40 * -1) ), (y - (40 * 2)), 40, 40, {restitution: 1}),
        R3 : matter.makeBlock((x + (40 * -1) ), (y - (40 * 3)), 40, 40, {restitution: 1}),
      },
      left_leg  : {
        __COLOUR: '#718093',
        BL1 : matter.makeBlock(x, y,        40, 40, {restitution: 1.2}),
        BL2 : matter.makeBlock(x, (y + 40), 40, 40, {restitution: 1.2}),
      },
      right_leg : {
        __COLOUR: '#718093',
        BR1 : matter.makeBlock((x + (40 * 2) ), y,        40, 40, {restitution: 1.2}),
        BR2 : matter.makeBlock((x + (40 * 2) ), (y + 40), 40, 40, {restitution: 1.2}),
      }
    },
    stats : {},
  }

  connections = {
    head : {
      NK_HM : connect(character.body.head.NK, character.body.head.HM),
      HM_HL : connect(character.body.head.HM, character.body.head.HL),
      HM_HR : connect(character.body.head.HM, character.body.head.HR),
      //
      NK_HL : connect(character.body.head.NK, character.body.head.HL),
      NK_HR : connect(character.body.head.NK, character.body.head.HR),
    },
    torso_head : {
      TM3_NK : connect(character.body.torso.TM3, character.body.head.NK),
      TL3_NK : connect(character.body.torso.TL3, character.body.head.NK),
      TR3_NK : connect(character.body.torso.TR3, character.body.head.NK),
    },
    torso : {
      TM1_TL1 : connect(character.body.torso.TM1, character.body.torso.TL1),
      TM1_TR1 : connect(character.body.torso.TM1, character.body.torso.TR1),
      //
      TM2_TL2 : connect(character.body.torso.TM2, character.body.torso.TL2),
      TM2_TR2 : connect(character.body.torso.TM2, character.body.torso.TR2),
      //
      TM3_TL1 : connect(character.body.torso.TM3, character.body.torso.TL3),
      TM3_TR1 : connect(character.body.torso.TM3, character.body.torso.TR3),
      //
      TL1_TL2 : connect(character.body.torso.TL1, character.body.torso.TL2),
      TL2_TL3 : connect(character.body.torso.TL2, character.body.torso.TL3),
      //
      TM1_TM2 : connect(character.body.torso.TM1, character.body.torso.TM2),
      TM2_TM3 : connect(character.body.torso.TM2, character.body.torso.TM3),
      //
      TR1_TR2 : connect(character.body.torso.TR1, character.body.torso.TR2),
      TR2_TR3 : connect(character.body.torso.TR2, character.body.torso.TR3),
      //
      TR3_TR2 : connect(character.body.torso.TR3, character.body.torso.TR2),
      TR2_TR1 : connect(character.body.torso.TR2, character.body.torso.TR1),
      //\\|//\\|
      //\\|//\\|
      //\\|//\\|
      TL1_TM2 : connect(character.body.torso.TL1, character.body.torso.TM2),
      TR1_TR2 : connect(character.body.torso.TR1, character.body.torso.TM2),
      //
      TL2_TM3 : connect(character.body.torso.TL2, character.body.torso.TM3),
      TR2_TR3 : connect(character.body.torso.TR2, character.body.torso.TM3),
      //
      TL3_TM2 : connect(character.body.torso.TL3, character.body.torso.TM2),
      TR3_TM2 : connect(character.body.torso.TR3, character.body.torso.TM2),
      //
      TR3_TM2 : connect(character.body.torso.TR3, character.body.torso.TM2),
      TR2_TM1 : connect(character.body.torso.TR2, character.body.torso.TM1),
      //
      TL3_TM2 : connect(character.body.torso.TL3, character.body.torso.TM2),
      TL2_TM1 : connect(character.body.torso.TL2, character.body.torso.TM1),
    },
    left_arm_torso : {
      L3_TL3 : connect(character.body.left_arm.L3, character.body.torso.TL3),
      L3_TL2 : connect(character.body.left_arm.L3, character.body.torso.TL2),
    },
    right_arm_torso : {
      R3_TR3 : connect(character.body.right_arm.R3, character.body.torso.TR3),
      R3_TL2 : connect(character.body.right_arm.R3, character.body.torso.TR2),
    },
    left_arm : {
      L3_L2 : connect(character.body.left_arm.L3, character.body.left_arm.L2),
      L2_L1 : connect(character.body.left_arm.L2, character.body.left_arm.L1),
    },
    middle_leg : {
      ML2_TM1 : connect(character.body.middle_leg.ML2, character.body.torso.TM1),
      ML2_TL1 : connect(character.body.middle_leg.ML2, character.body.torso.TL1),
      ML2_TR1 : connect(character.body.middle_leg.ML2, character.body.torso.TR1),
      ML2_BR1 : connect(character.body.middle_leg.ML2, character.body.right_leg.BR1),
      //
      ML2_BL1 : connect(character.body.middle_leg.ML2, character.body.left_leg.BL1),
      ML2_BR2 : connect(character.body.middle_leg.ML2, character.body.right_leg.BR1),
      //
      ML2_BL2 : connect(character.body.middle_leg.ML2, character.body.left_leg.BL2),
      ML2_BR2 : connect(character.body.middle_leg.ML2, character.body.right_leg.BR2),
      //
      BR1_ML1  : connect(character.body.right_leg.BR1, character.body.middle_leg.ML1),
      BL1_ML1  : connect(character.body.left_leg.BL1, character.body.middle_leg.ML1),
      //
      BL2_ML1  : connect(character.body.left_leg.BL2, character.body.middle_leg.ML1),
      BR2_ML1  : connect(character.body.right_leg.BR2, character.body.middle_leg.ML1),
      //
      ML1_ML2  : connect(character.body.middle_leg.ML1, character.body.middle_leg.ML2),
    },
    right_arm : {
      R3_R2 : connect(character.body.right_arm.R3, character.body.right_arm.R2),
      R2_R1 : connect(character.body.right_arm.R2, character.body.right_arm.R1),
    },
    left_leg_torso : {
      BL1_TR1 : connect(character.body.left_leg.BL1, character.body.torso.TR1),
      BL1_TM2 : connect(character.body.left_leg.BL1, character.body.torso.TM1),
    },
    right_leg_torso : {
      BR1_TL1 : connect(character.body.right_leg.BR1, character.body.torso.TL1),
      BL1_TM2 : connect(character.body.right_leg.BR1, character.body.torso.TM1),
    },
    left_leg  : {
      BL1_BL2 : connect(character.body.left_leg.BL1, character.body.left_leg.BL2),
    },
    right_leg : {
      BR1_BR2 : connect(character.body.right_leg.BR1, character.body.right_leg.BR2),
    },
  }
}

NY = 0;
NX = 0;

function setPosition(DIR){
  _.each(character.body, function(ARRAY){
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
          // DATA.setPosition(DATA.getPositionY() + radians(NY), DATA.getPositionX() + radians(NX));
          // NY = NY + 1;
          // NX = NX + 1;
        }
      }
    })
  })
}

var run = false;
var RIGHT_X = 0;
var LEFT_REAL_X;

var LEFT_X = 0;
var LEFT_REAL_X;

function keyPressed() {
  if (keyIsDown(LEFT_ARROW)) {
    if (SETTINGS.PHYSICS.CHARACTER.MoveLegsOnWalk === true){
      _.each(character.body, function(ARRAY){
        _.each(ARRAY, function(DATA, NAME){
         if (NAME === 'BL2' || NAME === 'BL1'){
           DATA.setPositionY(DATA.getPositionY() - 10)
         }
       })
      })
    }
    setPosition('LEFT')
  }
  if (keyIsDown(RIGHT_ARROW)) {
    if (SETTINGS.PHYSICS.CHARACTER.MoveLegsOnWalk === true){
      _.each(character.body, function(ARRAY){
        _.each(ARRAY, function(DATA, NAME){
         if (NAME === 'BR2' || NAME === 'BR1'){
           DATA.setPositionY(DATA.getPositionY() + 10)
         }
       })
      })
    }
    setPosition('RIGHT')
  }
  if (keyIsDown(UP_ARROW)) {
    setPosition('UP')
  }
  if (keyIsDown(DOWN_ARROW)) {
    setPosition('RESET')
  }

  if (keyIsDown(45)){
    image(rocket_left, character.body.left_arm.L1.getPositionX() + RIGHT_X, (character.body.left_arm.L1.getPositionY() - 10) + random(-15, -5), 40, 40);
    RIGHT_X = RIGHT_X + 30;

    RIGHT_REAL_X = 50 + RIGHT_X;

    if (RIGHT_REAL_X > width){
      RIGHT_X = 0
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
    if (!keyIsDown(17)){
      RIGHT_X = 0
    }
  }

  if (keyIsDown(17)){
    image(rocket_left, character.body.right_arm.R1.getPositionX() + LEFT_X, (character.body.right_arm.R1.getPositionY() - 10) + random(-15, -5), 40, 40);
    LEFT_X = LEFT_X - 30
    var STARTED_AT = character.body.right_arm.R1.getPositionX()

    LEFT_REAL_X = LEFT_X;

    if ((LEFT_REAL_X * -1/2) - (STARTED_AT/2)-61 > 0){
      LEFT_X = 0
    }

    if (SETTINGS.PHYSICS.CHARACTER.MoveArmsOnShoot === true){
      _.each(character.body, function(ARRAY){
        _.each(ARRAY, function(DATA, NAME){
         if (NAME === 'R1'){
           DATA.setPositionY(DATA.getPositionY() - 30)
         }
       })
     })
   }
 } else {
     if (!keyIsDown(45)){
       LEFT_X = 0
     }
  }
}

function draw() {
  background(0);
  keyPressed();
  fill(127);

  function create(data){
    _.each(data, function(DATA, ALIAS){
      if (ALIAS.indexOf('__') === 0){
        create(DATA)
      } else {
        DATA.show();
      }
    })
  }

  create(scene)

  stroke('#e0f1f1');
  _.each(character.body, function(ARRAY){
    _.each(ARRAY, function(DATA, NAME){
      if (NAME === '__COLOUR'){
        fill(DATA)
      } else {
        if (NAME === 'L1'){
          image(pistol_right, DATA.getPositionX() - (DATA.getHeight()/2+0.1), DATA.getPositionY() - (DATA.getHeight()/2+0.1), DATA.getHeight(), DATA.getWidth());
        } else if (NAME === 'R1'){
          image(pistol_left, DATA.getPositionX() - (DATA.getHeight()/2+0.1), DATA.getPositionY()  - (DATA.getHeight()/2+0.1), DATA.getHeight(), DATA.getWidth());
        } else if (!(NAME === 'ML1' || NAME === 'ML2')){
          stroke('#212121');
          image(black_square, DATA.getPositionX() - (DATA.getHeight()/2+0.1), DATA.getPositionY() - (DATA.getHeight()/2+0.1), DATA.getHeight(), DATA.getWidth());
        }
        //DATA.show();
      }
    })
  });

  _.each(connections, function(ARRAY){
    _.each(ARRAY, function(DATA, NAME){
      DATA.show();
    })
  })
  stroke(0, 0, 0);
}
