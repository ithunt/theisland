game.PlayerEntity = me.Entity.extend({

    //constructor
    init: function(x, y, settings) {
        //call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        //set the default horizontal & vertical speed (accel vector)
        //todo: this is physics right? so 0 for top down? or is this start place?
        this.body.setVelocity(0,0);
        this.accelForce = 0;

        //set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        //ensure the player is update even when outside of the viewport
        this.alwaysUpdate = true;

        //top down game - no visible gravity
        this.body.gravity = 0;
        this.gravity = 0;


        //Note: the sprite for mainPlayer is specified in Tiled using the objects Layer
        this.lastAnimationUsed = "run-down";
        this.animationToUseThisFrame = "run-down";

        //Animations from the tilesheet. Breaks a sprite sheet into Left-To-Right, Top-To-Bottom. so 15 is bottom right of a 4x4 sheet
        //height and width are also set in Tiled as mainPlayer properties
        this.renderable.addAnimation('run-down', [0, 1, 2, 3], 100);
        this.renderable.addAnimation('run-left', [4, 5, 6, 7], 100);
        this.renderable.addAnimation('run-right', [8, 9, 10, 11], 100);
        this.renderable.addAnimation('run-up', [12, 13, 14, 15], 100);

//        this.renderable.addAnimation('hit', [0, 4, 8, 12], 100);
        this.renderable.setCurrentAnimation('run-down');


        this.body.maxVel.x = this.body.maxVel.y = 25;
    },

    //update the player position based on delta time
    update: function(dt) {

        this.body.vel.x = 0;
        this.body.vel.y = 0;
        this.g_dt = dt / 20; //To be able to keep original values of velocity but still use dt.

        this.stateChanged = false;

        if(me.input.isKeyPressed('left')) {
            this.body.vel.x -= 1; //just set the direction, actual vel calculated later

            this.stateChanged = true;
            this.animationToUseThisFrame = 'run-left';
        }

        if( me.input.isKeyPressed('right')) {
            this.body.vel.x += 1;
            this.stateChanged = true;
            this.animationToUseThisFrame = 'run-right';
        }

        if( me.input.isKeyPressed('up')) {
            this.body.vel.y -= 1;
            this.stateChanged = true;
            this.animationToUseThisFrame = 'run-up';
        }

        if( me.input.isKeyPressed('down')) {
            this.body.vel.y += 1;
            this.stateChanged = true;
            this.animationToUseThisFrame = 'run-down';
        }

        if (this.animationToUseThisFrame != this.lastAnimationUsed) {
            this.lastAnimationUsed = this.animationToUseThisFrame;
            this.renderable.setCurrentAnimation(this.animationToUseThisFrame);
        }

        //if no buttons were pressed, pause the animation
        this.renderable.animationpause = !this.stateChanged;

        // check & update player movement
        this.body.update(dt);

        //calculate actual velocity to prevent speeding by diag
        this.body.vel.normalize();
        this.body.vel.scale(this.accelForce * this.g_dt);

        //update animation if necessary
//        if (this.body.vel.x!=0 || this.body.vel.y != 0) {
            //update object animation
            this._super(me.Entity, 'update', [dt]); //todo wtf does this do?
            return true; //inform engine we are updating;
//        }

        //else inform the engine that we did not perform
        // any updates (position, animation, etc)
//        return false;
    }
});