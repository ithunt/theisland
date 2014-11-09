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


        this.body.gravity = 0;
        this.gravity = 0; //top down game

        this.body.maxVel.x = this.body.maxVel.y = 25;
    },

    //update the player position
    //what is dt? delta time i think
    update: function(dt) {



        this.body.vel.x = 0;
        this.body.vel.y = 0;
        this.g_dt = dt / 20; //To be able to keep original values of velocity but still use dt.

        this.stateChanged = false;

        if(me.input.isKeyPressed('left')) {
            //flip the sprite on horizontal axis
            this.flipX(true);
            this.body.vel.x -= 1; //just set the direction, actual vel calculated later

            this.stateChanged = true;
            //update the entity velocity
//            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        }

        if( me.input.isKeyPressed('right')) {
            //unflip the sprite
            this.flipX(false);

            this.body.vel.x += 1;
            this.stateChanged = true;

            //update the entity velocity
//            this.body.vel.x += this.body.accel.x * me.timer.tick;
        }

        if( me.input.isKeyPressed('up')) {
            //todo set the up sprite

            this.body.vel.y -= 1;
            this.stateChanged = true;
        }

        if( me.input.isKeyPressed('down')) {
            //todo set the down sprite

            this.body.vel.y += 1;
            this.stateChanged = true;
        }




        //todo: in a top down, up/down will likely reflect this a bit more except using different spirtes not flipping

//        if(me.input.isKeyPressed('jump')) {
//            //make sure we are not already jumping or falling
//            if(!this.body.jumping && !this.body.falling) {
//                //set the current velocity to the maximum defined value
//                // gravity will take care of it from here
//                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
//                //s et the jumping flag
//                this.body.jumping = true;
//            }
//        }

        // check & update player movement
        this.body.update(dt);

        //calculate actual velocity to prevent speeding by diag
        this.body.vel.normalize();
        this.body.vel.scale(this.accelForce * this.g_dt);

        //update animation if necessary
        if (this.body.vel.x!=0 || this.body.vel.y != 0) {
            //update object animation
            this._super(me.Entity, 'update', [dt]); //todo wtf does this do?
            return true; //inform engine we are updating;
        }

        //else inform the engine that we did not perform
        // any updates (position, animation, etc)
        return false;
    }
});