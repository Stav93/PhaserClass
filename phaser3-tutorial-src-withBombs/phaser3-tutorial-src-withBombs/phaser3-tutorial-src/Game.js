
//טעינת תמונות
function preload() {
    this.load.image('bomb1', 'assets/Bomb.png')
    this.load.image('bomb2', 'assets/Bomb2.png')
    this.load.image('bomb3', 'assets/Bomb3.png')
    this.load.image('platform', 'https://content.codecademy.com/courses/learn-phaser/physics/platform.png')
    this.load.image('spaceship', 'assets/Spaceship.png')
    //this.load.image('star', 'assets/Star.png')
}

//יצירת משתנה הבמה
const gameState = {
    score: 0
};

//נטע
const config = {
    type: Phaser.AUTO,
    width: 450,
    height: 500,
    backgroundColor: "black",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            enableBody: true,
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

//המשתנה של המשחק וקריאה לפונקציה
const game = new Phaser.Game(config);

//יצירה - סתיו
function create() {
    gameState.player = this.physics.add.sprite(225, 450, 'spaceship').setScale(.25);

    const platforms = this.physics.add.staticGroup();

    platforms.create(225, 510, 'platform');

    gameState.scoreText = this.add.text(195, 485, 'Score: 0', { fontSize: '15px', fill: '#000000' })

    gameState.player.setCollideWorldBounds(true);

    this.physics.add.collider(gameState.player, platforms)

    gameState.cursors = this.input.keyboard.createCursorKeys();

    //פצצות
    const bombs = this.physics.add.group();

    function bombGen() {
        const xCoord1 = Math.random() * 450;
        const xCoord2 = Math.random() * 450;
        const xCoord3 = Math.random() * 450;
        bombs.create(xCoord1, 10, 'bomb1').setScale(0.5);
        bombs.create(xCoord2, 10, 'bomb2').setScale(0.5);
        bombs.create(xCoord3, 10, 'bomb3').setScale(0.5);
    }

    const bombGenLoop = this.time.addEvent({
        delay: 150,
        callback: bombGen,
        callbackScope: this,
        loop: true,
    });

    //התנגשות בין הפצצות למשטח
    this.physics.add.collider(bombs, platforms, function (bomb) {
        bomb.destroy();
        gameState.score += 10;
        gameState.scoreText.setText(`Score: ${gameState.score}`)
    })

    //התנגשות בין החללית לפצצה
    this.physics.add.collider(gameState.player, bombs, () => {
        bombGenLoop.destroy();
        starGenLoop.destroy();
        this.physics.pause();
        this.add.text(180, 250, 'Game Over!', { fontSize: '20px', fill: 'white' });
        this.add.text(140, 270, 'Click to Restart', { fontSize: '20px', fill: 'white' });
        //אירוע לחיצה על הטקסט
        this.input.on('pointerup', () => {
            gameState.score = 0;
            this.scene.restart();
        })
    })

    //if (gameState.score > 200) {
    //    bombGenLoop.destroy();
    //    this.physics.pause();
    //    this.add.text(180, 250, 'You Win!', { fontSize: '20px', fill: 'white' });
    //    this.add.text(140, 270, 'Click to Restart', { fontSize: '20px', fill: 'white' });
    //    //אירוע לחיצה על הטקסט
    //    this.input.on('pointerup', () => {
    //        gameState.score = 0;
    //        this.scene.restart();
    //    })
    //}

}

//אורטל - מקשי מקלדת ותזוזות בהתאם
function update() {
    if (gameState.cursors.left.isDown) {
        gameState.player.setVelocityX(-160);
    } else if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(160);
    } else {
        gameState.player.setVelocityX(0);
    }

    //if (gameState.score > 200) {
    //    bombGenLoop.destroy();
    //    this.physics.pause();
    //    gameState.add.text(180, 250, 'You Win!', { fontSize: '20px', fill: 'white' });
    //    gameState.add.text(140, 270, 'Click to Restart', { fontSize: '20px', fill: 'white' });
    //    //אירוע לחיצה על הטקסט
    //    this.input.on('pointerup', () => {
    //        gameState.score = 0;
    //        this.scene.restart();
    //    })
    //}


}

