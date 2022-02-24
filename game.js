kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    background: [0, 0, 0, 1]
});

loadPedit("space-invader", "sprites/space-invader.pedit");
loadPedit("wall", "sprites/wall.pedit");
loadPedit("space-ship", "sprites/space-ship.pedit");
loadPedit("bullet", "sprites/bullet.pedit");
const TIME_LEFT = 50;
const MOVE_SPEED = 200;
const SI_MOVE_SPEED = 200;
const SI_MOVE_DOWN = 200;
let SI_LEFT = 39;

layer(['obj','ui'], 'obj');

scene('game', ()=>{
    addLevel([
        '!--------------------------|',
        '!      ^^^^^^^^^^^^^       |',
        '!      ^^^^^^^^^^^^^       |',
        '!      ^^^^^^^^^^^^^       |',
        '!                          |',
        '!                          |',
        '!                          |',
        '!                          |',
        '!                          |',
        '!                          |',
        '!                          |',
        '!                          |',
        '!                          |',
        '!                          |',
        '!--------------------------|',
      ],{
        width: 32,
        height:32,
        '^' : () => [
              sprite("space-invader"),
              area(),
              scale(0.5),
              'space-invader',
        ],
        '!' : () => [
              sprite("wall"),
              area(),
              solid(),
              scale(0.5),
              'left-wall',
        ],
        '-' : () => [
              sprite("wall"),
              area(),
              solid(),
              scale(0.5),
              'plane',
        ],
        '|' : () => [
              sprite("wall"),
              area(),
              solid(),
              scale(0.5),
              'right-wall',
        ],
      });
    const player = add([
        sprite('space-ship'),
        pos(width()/2, height()/2),
        origin('center'),
        area(),
        solid(),
    ]);

    let CURRENT_SPEED = SI_MOVE_SPEED;
    action('space-invader', (si)=>{
        si.move(CURRENT_SPEED,0);
    })
    collides('space-invader','right-wall',()=>{
        CURRENT_SPEED = -SI_MOVE_SPEED;
        every('space-invader',(si)=>{
            si.move(0,SI_MOVE_DOWN);
        })
    })
    collides('space-invader','left-wall',()=>{
        CURRENT_SPEED = SI_MOVE_SPEED;
        every('space-invader',(si)=>{
            si.move(0,SI_MOVE_DOWN);
        })
    })
    player.collides('space-invader',()=>{
        go('lose',score.value)
    })
      
    keyDown('left', ()=>{
        player.move(-MOVE_SPEED,0)
    })
    keyDown('right', ()=>{
        player.move(MOVE_SPEED,0)
    })
    keyPress('space',()=>{
        spawnBullet(player.pos);
    })
    action('bullet',(b)=>{
        b.move(0,-300);
        if(b.pos.y < 0){
            destroy(b);
        }
    });
    collides('bullet','space-invader',(b,s) =>{
        destroy(b);
        destroy(s);
        score.value++;
        score.text = score.value;
        if (score.value == 39){
            go('lose', score.value);
        }
    })


    function spawnBullet(player){
        add([
            sprite('bullet'),
            pos(player),
            origin('center'),
            area(),
            scale(0.2),
            'bullet',
        ])
    }
    
      
    const score = add([
        text('0'),
        pos(20,20),
        layer('ui'),
        {
          value : 0,
        }
    ])  
    const timer = add([
        text('0'),
        pos(800,50),
        layer('ui'),
        scale(0.5),
        {
          time : TIME_LEFT,
        }
    ]);
    timer.action(()=>{
        timer.time -= dt();
        timer.text = timer.time.toFixed(2);
        if(timer.time <= 0){
            go('lose',score.value)
        }
    })
})

scene('lose',(score) => [
    add([
    text("Final Score: "+ score * TIME_LEFT),
    origin('center'),
    scale(1.5),
    pos(width()/2, height()/2)
  ])
])

go('game')