var Game;
(function (Game) {
    var AudioUtils = (function () {
        function AudioUtils() {
        }
        Object.defineProperty(AudioUtils, "sfxOn", {
            get: function () { return AudioUtils._sfxOn; },
            set: function (on) {
                AudioUtils._sfxOn = on;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AudioUtils, "musicOn", {
            get: function () { return AudioUtils._musicOn; },
            set: function (on) {
                if (AudioUtils._musicOn != on) {
                    if (on) {
                        AudioUtils.resumeMusic();
                    }
                    else {
                        AudioUtils.pauseMusic();
                    }
                    AudioUtils._musicOn = on;
                }
            },
            enumerable: true,
            configurable: true
        });
        AudioUtils.setSfxAudioSprite = function (sprite) {
            AudioUtils._sfxAudioSprite = sprite;
        };
        AudioUtils.addSfxSound = function (key, sound) {
            AudioUtils._sfxSounds[key] = sound;
        };
        AudioUtils.playSound = function (key, volume, loop) {
            if (volume === void 0) { volume = 1.0; }
            if (loop === void 0) { loop = false; }
            if (!AudioUtils._sfxOn)
                return;
            if (AudioUtils._sfxAudioSprite != null) {
                AudioUtils._sfxAudioSprite.play(key, volume).loop = loop;
            }
            else {
                var sound = AudioUtils._sfxSounds[key];
                if (sound != undefined)
                    sound.play("", 0, volume, loop);
            }
        };
        AudioUtils.stopSound = function (key) {
            if (AudioUtils._sfxAudioSprite != null) {
                AudioUtils._sfxAudioSprite.stop(key);
            }
            else {
                var sound = AudioUtils._sfxSounds[key];
                if (sound != undefined)
                    sound.stop();
            }
        };
        Object.defineProperty(AudioUtils, "currentMusic", {
            get: function () {
                return AudioUtils._currentMusic;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AudioUtils, "isMusicPlaying", {
            get: function () {
                if (AudioUtils._currentMusic == null || AudioUtils._currentMusic.length == 0) {
                    return false;
                }
                var music = AudioUtils._music[AudioUtils._currentMusic];
                if (music == undefined)
                    return false;
                return music.isPlaying;
            },
            enumerable: true,
            configurable: true
        });
        AudioUtils.addMusic = function (key, music) {
            AudioUtils._music[key] = music;
        };
        AudioUtils.playMusic = function (key, loop, fadeIntDuration) {
            if (loop === void 0) { loop = true; }
            if (fadeIntDuration === void 0) { fadeIntDuration = 0; }
            if (!AudioUtils._musicOn || AudioUtils._currentMusic == key)
                return;
            if (AudioUtils.isMusicPlaying)
                AudioUtils.stopMusic();
            if (!(key in AudioUtils._music))
                return;
            AudioUtils._currentMusic = key;
            var music = AudioUtils._music[key];
            if (fadeIntDuration <= 0) {
                music.play("", 0, 1, loop, true);
            }
            else {
                music.fadeIn(fadeIntDuration, true);
            }
            if (!loop) {
                music.onStop.addOnce(function () {
                    AudioUtils.onMusicFinished.dispatch(key);
                }, this);
            }
        };
        AudioUtils.stopMusic = function (fadeOutDuration) {
            if (fadeOutDuration === void 0) { fadeOutDuration = 0; }
            if (AudioUtils.isMusicPlaying) {
                var music_1 = AudioUtils._music[AudioUtils._currentMusic];
                if (fadeOutDuration > 0) {
                    music_1.onFadeComplete.addOnce(function () {
                        music_1.stop();
                    });
                    music_1.fadeOut(fadeOutDuration);
                }
                else {
                    music_1.stop();
                }
                AudioUtils._currentMusic = null;
            }
        };
        AudioUtils.pauseMusic = function () {
            if (AudioUtils.isMusicPlaying) {
                AudioUtils._music[AudioUtils._currentMusic].pause();
            }
        };
        AudioUtils.resumeMusic = function () {
            if (AudioUtils._currentMusic != null && AudioUtils._currentMusic.length > 0) {
                var music = AudioUtils._music[AudioUtils._currentMusic];
                if (music.paused) {
                    music.resume();
                }
            }
        };
        AudioUtils._sfxOn = true;
        AudioUtils._musicOn = true;
        AudioUtils._sfxAudioSprite = null;
        AudioUtils._sfxSounds = [];
        AudioUtils._music = [];
        AudioUtils._currentMusic = null;
        AudioUtils.onMusicFinished = new Phaser.Signal();
        return AudioUtils;
    }());
    Game.AudioUtils = AudioUtils;
})(Game || (Game = {}));
var Bike;
(function (Bike_1) {
    var Bike = (function () {
        function Bike(parentLayer) {
            var _this = this;
            this._exhSmokeNextTime = 0;
            this._timer = Gameplay.Gameplay.instance.timer;
            this._layer = Game.Global.game.add.group(parentLayer);
            this._wheels = [new Bike_1.Wheel(this, 0), new Bike_1.Wheel(this, 1)];
            this._motorSettings = new Bike_1.MotorSettings(0, 0, 0, 0);
            this._tiltSettings = new Bike_1.TiltSettings(0, 0);
            this._stunts = [
                new Bike_1.AirTimeStunt(this),
                new Bike_1.WheelieStunt(this),
            ];
            this._fuel = new Bike_1.FuelTank();
            this._ghostRecorder = new Ghost.Recorder(this._timer, this);
            World.ActCheckpoint.instance.onActivate.add(function () {
                _this._cpDisScorePos = _this._disScorePos;
            }, this);
        }
        Object.defineProperty(Bike.prototype, "timer", {
            get: function () { return this._timer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bike.prototype, "type", {
            get: function () { return this._type; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bike.prototype, "bodySprite", {
            get: function () { return this._bodySprite; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bike.prototype, "headSprite", {
            get: function () { return this._headSprite; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bike.prototype, "engineOn", {
            get: function () { return (this._flags & 1) != 0; },
            set: function (state) { this.setEngineState(state); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bike.prototype, "break", {
            get: function () { return (this._flags & 2) != 0; },
            set: function (state) { this.setBreakState(state); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bike.prototype, "dead", {
            get: function () { return (this._flags & 8) != 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bike.prototype, "reachedDistance", {
            get: function () { return Math.round(this._reachedDisMaxX - this._reachedDisStartX) / Gameplay.Gameplay.PIXELS_TO_METERS; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bike.prototype, "fuel", {
            get: function () { return this._fuel; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bike.prototype, "deathReason", {
            get: function () { return this._deathReason; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bike.prototype, "ghostRecorder", {
            get: function () { return this._ghostRecorder; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bike.prototype, "visible", {
            get: function () { return this._layer.visible; },
            set: function (visible) { this._layer.visible = visible; },
            enumerable: true,
            configurable: true
        });
        Bike.prototype.destroy = function () {
            if (this._layer.children.length != 0) {
                this._layer.forEach(function (child) {
                    if (child.body != null)
                        child.body.kill();
                }, this);
                this._layer.removeAll(true);
                this._type = null;
            }
            Game.AudioUtils.stopSound("engineIdle");
            Game.AudioUtils.stopSound("engineAcceleration");
        };
        Bike.prototype.reset = function () {
            this.create(Game.Global.getBikeType(Game.Global.playerProfile.bikeTypeUID), Gameplay.Gameplay.BIKE_START_X, Gameplay.Gameplay.instance.worldView.ground.getGroundYOnX(Gameplay.Gameplay.BIKE_START_X) + WorldGround.ActSegment.PHY_GROUND_OFFSET + 1);
            this._layer.visible = true;
            this._ghostRecorder.reset();
            this._reachedDisStartX = this._bodySprite.x;
            this._reachedDisMaxX = this._reachedDisStartX;
            this._disScorePos = this._reachedDisStartX;
            this.particles.reset();
        };
        Bike.prototype.resetFromCP = function () {
            var cp = World.ActCheckpoint.instance;
            this.create(Game.Global.getBikeType(Game.Global.playerProfile.bikeTypeUID), cp.bikeRestartPoint.x, cp.bikeRestartPoint.y);
            this._disScorePos = this._cpDisScorePos;
            this._ghostRecorder.resetFromCP();
            this.particles.reset();
        };
        Bike.prototype.create = function (type, x, y) {
            this.destroy();
            this._type = type;
            this._flags = 32;
            this.createBody(x, y);
            var wheel = this._wheels[0];
            wheel.create(this._bodySprite, type.rWheel);
            wheel.body.setCategoryContactCallback(8, this.handlePickupsContact, this);
            wheel.body.setCategoryContactCallback(2, this.handleGroundContact, this);
            wheel.body.setCategoryContactCallback(32, this.handlePlatformContact, this);
            wheel.body.setCategoryPresolveCallback(32, this.handlePlatformPresolve, this);
            if (type.rAxleImage.mode != 0) {
                this._rFork = Game.Global.game.add.image(0, 0, "atlas_A", type.rWheel.axleSpriteKey, this._layer);
                this._rFork.anchor.copyFrom(type.rAxleImage.anchor);
                this._rFork.moveDown();
                if (type.rAxleImage.mode == 1)
                    this._rFork.moveDown();
            }
            else {
                this._rFork = null;
            }
            wheel = this._wheels[1];
            wheel.create(this._bodySprite, type.fWheel);
            wheel.joint.SetMaxMotorTorque(10);
            wheel.body.setCategoryContactCallback(8, this.handlePickupsContact, this);
            wheel.body.setCategoryContactCallback(2, this.handleGroundContact, this);
            wheel.body.setCategoryContactCallback(32, this.handlePlatformContact, this);
            wheel.body.setCategoryPresolveCallback(32, this.handlePlatformPresolve, this);
            this._fFork = Game.Global.game.add.image(0, 0, "atlas_A", type.fWheel.axleSpriteKey, this._layer);
            this._fFork.anchor.set(0, 0.5);
            this._fFork.moveDown();
            this._wheels[0].joint.SetMaxMotorTorque(type.motor.torque);
            this._motorSettings.copyFrom(type.motor);
            this.createHead();
            this._engineStateTime = this._timer.time;
            this._tiltSettings.copyFrom(type.tilt);
            this._tiltDir = 0;
            for (var i = 0; i < this._stunts.length; i++)
                this._stunts[i].reset();
            this._fuel.reset();
        };
        Bike.prototype.start = function () {
            if ((this._flags & 32) != 0) {
                this._flags &= ~32;
                this._ghostRecorder.start();
                Game.AudioUtils.playSound("engineIdle", 1, true);
            }
        };
        Bike.prototype.update = function () {
            var time = this._timer.time;
            this._flags &= ~16;
            if (this.engineOn) {
                var progress = (time - this._engineStateTime) / this._motorSettings.maxSpeedDelay;
                if (progress > 1)
                    progress = 1;
                var motorSpeed = this._motorSettings.minSpeed;
                motorSpeed += (this._motorSettings.maxSpeed - motorSpeed) * Phaser.Easing.Quadratic.Out(progress);
                this._wheels[0].joint.SetMotorSpeed(motorSpeed);
                if (time >= this._wheelDustTime) {
                    this._wheelDustTime = time + 150;
                    var wheel = this._wheels[0];
                    if (wheel.onGround) {
                        var contactPos = Bike._tmpPoint;
                        var angle = this._bodySprite.rotation;
                        wheel.getGroundContactPoint(contactPos, 2 | 32);
                        this.particles.showParticle(2, contactPos.x, contactPos.y, Math.cos(angle) * -2, Math.sin(angle) * -2, angle);
                    }
                }
                if (time >= this._exhSmokeNextTime) {
                    this._exhSmokeNextTime = time + 100;
                    var bodySet = this._type.body;
                    var angle = this._bodySprite.rotation + bodySet.exhaustDir;
                    var x = this._bodySprite.x + Math.cos(angle) * bodySet.exhaustDis;
                    var y = this._bodySprite.y + Math.sin(angle) * bodySet.exhaustDis;
                    angle = this._bodySprite.rotation;
                    this.particles.showParticle(0, x, y, Math.cos(angle) * -2, Math.sin(angle) * -2);
                }
            }
            if ((this._flags & (4 | 32)) == 4) {
                this.applyBoost();
                if (this._boostTime + 500 < time) {
                    this._flags &= ~4;
                }
            }
            var i = this._wheels.length;
            while (i-- != 0)
                this._wheels[i].update();
            if ((this._flags & 8) == 0) {
                i = this._stunts.length;
                while (i-- != 0)
                    this._stunts[i].update();
            }
            if ((this._flags & 32) == 0) {
                if (!this._fuel.getFuel(0.25 * this._timer.delta))
                    this.kill(0);
            }
        };
        Bike.prototype.boost = function () {
            if ((this._flags & (4 | 32)) == 0) {
                this._flags |= 4;
                this._boostTime = this._timer.time;
                Game.AudioUtils.playSound("nitro");
            }
        };
        Bike.prototype.preRender = function () {
            var wheelPos = this._wheels[1].sprite.position;
            this._fFork.rotation = this._bodySprite.rotation + this._type.fWheel.spring.angle;
            this._fFork.position.copyFrom(wheelPos);
            this._fFork.updateTransform();
            if (this._rFork != null) {
                wheelPos = this._wheels[0].sprite.position;
                this._rFork.position.copyFrom(wheelPos);
                var bodySet = this._type.body;
                var angle = this._bodySprite.rotation + bodySet.rAxleAttachDir;
                var x = this._bodySprite.x + Math.cos(angle) * bodySet.rAxleAttachDis;
                var y = this._bodySprite.y + Math.sin(angle) * bodySet.rAxleAttachDis;
                this._rFork.rotation = this._rFork.position.angleXY(x, y, false) + bodySet.rAxleDefAngle;
                this._rFork.updateTransform();
            }
            if ((this._flags & 32) == 0) {
                if (this._reachedDisMaxX < this._bodySprite.x) {
                    this._reachedDisMaxX = this._bodySprite.x;
                    if (this._reachedDisMaxX - Bike.DIS_SCORE_DEF_DIS >= this._disScorePos) {
                        var i = Math.floor((this._reachedDisMaxX - this._disScorePos) / Bike.DIS_SCORE_DEF_DIS);
                        Gameplay.Gameplay.instance.addScore(i * Bike.DIS_SCORE);
                        this._disScorePos += i * Bike.DIS_SCORE_DEF_DIS;
                    }
                }
                this._ghostRecorder.update();
            }
            if ((this._flags & 32) == 0) {
                var nextCheckpoint = World.DataManager.instance.nextCheckpoint;
                if (nextCheckpoint != null && nextCheckpoint.position <= this._bodySprite.x && Gameplay.Gameplay.instance.credits > 0)
                    World.DataManager.instance.activateCheckpoint();
            }
        };
        Bike.prototype.tilt = function (dir) {
            if ((this._flags & 32) != 0)
                return;
            var body = this._bodySprite.body;
            var angVel = body.angularVelocity;
            if (this._tiltDir != dir) {
                var angVelRatio = Math.abs(angVel) / Bike.MAX_ANGULAR_VELOCITY;
                var impulse = this._tiltSettings.iniImpulse;
                if ((dir < 0) == (angVel < 0) || angVel == 0) {
                    impulse *= (1 - angVelRatio);
                }
                else {
                    impulse += angVelRatio * (impulse * 2);
                }
                body.data.ApplyAngularImpulse(impulse * dir);
                this._tiltDir = dir;
            }
            else {
                var applyTorque = true;
                if (this._tiltDir < 0) {
                    if (angVel < -Bike.MAX_ANGULAR_VELOCITY)
                        applyTorque = false;
                }
                else if (angVel > Bike.MAX_ANGULAR_VELOCITY) {
                    applyTorque = false;
                }
                if (applyTorque)
                    body.data.ApplyTorque(this._tiltDir * this._tiltSettings.torque);
            }
        };
        Bike.prototype.stopTilt = function () {
            this._tiltDir = 0;
        };
        Bike.prototype.kill = function (reason) {
            if (this.dead)
                return;
            if (reason == 1)
                Game.AudioUtils.playSound("crash");
            this.setEngineState(false);
            this.setBreakState(false);
            this.stopTilt();
            for (var i = 0; i < this._stunts.length; i++)
                this._stunts[i].cancel();
            this._flags |= 8 | 32;
            this._deathReason = reason;
            this._ghostRecorder.stop();
            Gameplay.Gameplay.instance.gameOver();
            Game.AudioUtils.stopSound("engineIdle");
            Game.AudioUtils.stopSound("engineAcceleration");
            var cp = World.ActCheckpoint.instance;
            if (cp.active)
                Gamee2.Gamee.logEvent("GAME_OVER", "block: " + World.ActCheckpoint.instance.blockNode.block.uid + ", bike: " + this._type.uid + ", reason: " + reason + ", distance: " + this.reachedDistance);
        };
        Bike.prototype.getWheel = function (wheel) { return this._wheels[wheel]; };
        Bike.prototype.getVelocity = function () {
            if ((this._flags & 16) == 0) {
                var velVec = Bike._tmpVec;
                this._bodySprite.body.data.GetLinearVelocity(velVec);
                this._curVelocity = Math.abs(Math.sqrt(velVec.x * velVec.x + velVec.y * velVec.y));
                this._flags |= 16;
            }
            return this._curVelocity;
        };
        Bike.prototype.renderDebugInfo = function (x, y, lineHeight) {
            var debug = Game.Global.game.debug;
            debug.text("dis: " + this.reachedDistance, x, y);
            y += lineHeight;
            return y;
        };
        Bike.prototype.applyBoost = function () {
            if (this.getVelocity() < 15 && this._wheels[0].onGround) {
                var body = this._bodySprite.body;
                var bodyDir = body.rotation;
                body.applyForce(Math.cos(bodyDir) * 100, Math.sin(bodyDir) * 100);
            }
        };
        Bike.prototype.setEngineState = function (state) {
            if ((this._flags & 32) != 0 || this.engineOn == state)
                return;
            var joint = this._wheels[0].joint;
            if (state) {
                joint.SetMotorSpeed(this._motorSettings.minSpeed);
                this.setBreakState(false);
                this._wheelDustTime = this._exhSmokeNextTime = this._timer.time;
                Game.AudioUtils.stopSound("engineIdle");
                Game.AudioUtils.playSound("engineAcceleration", 1, true);
            }
            else {
                Game.AudioUtils.stopSound("engineAcceleration");
                Game.AudioUtils.playSound("engineIdle", 1, true);
            }
            joint.EnableMotor(state);
            this.setFlag(1, state);
            this._engineStateTime = this._timer.time;
        };
        Bike.prototype.setBreakState = function (state) {
            if ((this._flags & 32) != 0 || this.break == state)
                return;
            var rWheelJoint = this._wheels[0].joint;
            var fWheelJoint = this._wheels[1].joint;
            if (state) {
                this.setEngineState(false);
                rWheelJoint.SetMotorSpeed(0);
                rWheelJoint.EnableMotor(true);
                fWheelJoint.SetMotorSpeed(0);
                fWheelJoint.EnableMotor(true);
            }
            else {
                rWheelJoint.EnableMotor(false);
                fWheelJoint.EnableMotor(false);
            }
            this.setFlag(2, state);
        };
        Bike.prototype.createBody = function (x, y) {
            this._bodySprite = Game.Global.game.add.sprite(x, 0, "atlas_A", this._type.body.spriteKey, this._layer);
            var anchorX = Math.round(this._bodySprite.width / 2);
            var anchorY = Math.round(this._bodySprite.height / 2);
            var wheelImg = Game.Global.game.cache.getFrameByName("atlas_A", this._type.fWheel.spriteKey);
            this._bodyBotOffset = this._type.fWheel.offset.y + wheelImg.height - anchorY;
            this._bodySprite.y = y - this._bodyBotOffset;
            Game.Global.game.physics.box2d.enable(this._bodySprite);
            var body = this._bodySprite.body;
            body.clearFixtures();
            for (var i = 0; i < this._type.body.shapes.length; i++) {
                var shape = this._type.body.shapes[i];
                var fixture = body.addPolygon(Bike.convertVertices(shape.vertices, anchorX, anchorY));
                fixture.SetDensity(shape.density);
            }
            this._bodyDefMass = body.mass;
            body.data.SetUserData(2);
            body.friction = 0.5;
            body.restitution = 0.1;
            body.angularDamping = this._type.body.angularDamping;
            body.linearDamping = 0.1;
            body.setCollisionMask(2 | 8);
            body.setCollisionCategory(4);
            body.setCategoryContactCallback(8, this.handlePickupsContact, this);
        };
        Bike.prototype.createHead = function () {
            var settings = this._type.head;
            var sprite = this._headSprite = Game.Global.game.add.sprite(0, 0, "atlas_A", settings.spriteKey, this._layer);
            var anchorX = sprite.width >> 1;
            var anchorY = sprite.height >> 1;
            sprite.x = this._bodySprite.x - (this._bodySprite.width >> 1) + settings.offset.x + anchorX;
            sprite.y = this._bodySprite.y - (this._bodySprite.height >> 1) + settings.offset.y + anchorY;
            Game.Global.game.physics.box2d.enable(sprite);
            var body = sprite.body;
            body.data.SetUserData(3);
            body.setPolygon(Bike.convertVertices(settings.vertices, anchorX, anchorY));
            body.friction = 0.5;
            body.restitution = 0.1;
            body.linearDamping = 0.1;
            body.angularDamping = 0.1;
            body.mass *= 0.5;
            body.setCollisionMask(2 | 8 | 32 | 16);
            body.setCollisionCategory(4);
            body.setCategoryContactCallback(8, this.handlePickupsContact, this);
            body.setCategoryContactCallback(16, this.handleGroundContact, this);
            body.setCategoryContactCallback(2, this.handleGroundContact, this);
            body.setCategoryContactCallback(32, this.handlePlatformContact, this);
            body.setCategoryPresolveCallback(32, this.handlePlatformPresolve, this);
            var headJointX = settings.anchor.x - anchorX;
            var headJointY = settings.anchor.y - anchorY;
            Game.Global.game.physics.box2d.weldJoint(this._bodySprite, body, sprite.x - this._bodySprite.x + headJointX, sprite.y - this._bodySprite.y + headJointY, headJointX, headJointY, 6, 0.2);
        };
        Bike.convertVertices = function (vertices, anchorX, anchorY) {
            var res = [];
            var i = 0;
            while (i < vertices.length) {
                res.push(vertices[i++] - anchorX);
                res.push(vertices[i++] - anchorY);
            }
            return res;
        };
        Bike.prototype.setFlag = function (flag, on) {
            if (on) {
                this._flags |= flag;
            }
            else {
                this._flags &= ~flag;
            }
        };
        Bike.prototype.handlePickupsContact = function (body1, body2, fixture1, fixture2, begin) {
            if (begin) {
                body2.sprite.data.pickup();
            }
        };
        Bike.prototype.handleGroundContact = function (body1, body2, fixture1, fixture2, begin, contact) {
            var bikePart = body1.data.GetUserData();
            if (bikePart == 3) {
                this.kill(1);
            }
            else {
                this._wheels[bikePart].handleGroundCotact(begin, contact);
            }
        };
        Bike.prototype.handlePlatformContact = function (body1, body2, fixture1, fixture2, begin, contact) {
            var bikePart = body1.data.GetUserData();
            if (begin) {
                var enable = contact.GetManifold().localNormal.y > 0;
                if (enable) {
                    this._platColDisPartsMask &= ~(1 << bikePart);
                    if (bikePart == 1 || bikePart == 0) {
                        this._wheels[bikePart].handleGroundCotact(true, contact);
                    }
                    else if (bikePart == 3) {
                        this.kill(1);
                    }
                }
                else {
                    this._platColDisPartsMask |= (1 << bikePart);
                }
            }
            else if ((this._platColDisPartsMask & (1 << bikePart)) == 0) {
                if (bikePart == 1 || bikePart == 0)
                    this._wheels[bikePart].handleGroundCotact(false, contact);
            }
        };
        Bike.prototype.handlePlatformPresolve = function (body1, body2, fixture1, fixture2, contact) {
            if ((this._platColDisPartsMask & (1 << body1.data.GetUserData())) != 0)
                contact.SetEnabled(false);
        };
        Bike.MAX_ANGULAR_VELOCITY = 10;
        Bike.DIS_SCORE = 1;
        Bike.DIS_SCORE_DEF_DIS = 100;
        Bike._tmpVec = new box2d.b2Vec2();
        Bike._tmpPoint = new Phaser.Point();
        return Bike;
    }());
    Bike_1.Bike = Bike;
})(Bike || (Bike = {}));
var Bike;
(function (Bike) {
    var FuelTank = (function () {
        function FuelTank() {
        }
        Object.defineProperty(FuelTank.prototype, "state", {
            get: function () { return this._value / this._capacity; },
            enumerable: true,
            configurable: true
        });
        FuelTank.prototype.reset = function () {
            if (PowerUps.Manager.powerUps[1].active) {
                this._capacity = Math.round(FuelTank.BASE_CAPACITY * FuelTank.UPGRADE_CAPACITY_INC);
            }
            else {
                this._capacity = FuelTank.BASE_CAPACITY;
            }
            this._value = this._capacity;
        };
        FuelTank.prototype.addFuel = function (value) {
            this._value += value;
            if (this._value > this._capacity)
                this._value = this._capacity;
        };
        FuelTank.prototype.getFuel = function (value) {
            this._value -= value;
            if (this._value < 0)
                this._value = 0;
            return (this._value != 0);
        };
        FuelTank.BASE_CAPACITY = 400;
        FuelTank.UPGRADE_CAPACITY_INC = 1.75;
        return FuelTank;
    }());
    Bike.FuelTank = FuelTank;
})(Bike || (Bike = {}));
var Bike;
(function (Bike) {
    var PhyShape = (function () {
        function PhyShape(vertices, density) {
            this.vertices = vertices;
            this.density = density;
        }
        return PhyShape;
    }());
    Bike.PhyShape = PhyShape;
    var BodySettings = (function () {
        function BodySettings(shapes, angularDamping, exhaustPos, rAxleAttachPos, rAxleDefAngle) {
            this.shapes = shapes;
            this.angularDamping = angularDamping;
            this._exhaustPos = exhaustPos;
            this._rAxleAttachPos = rAxleAttachPos;
            this.rAxleDefAngle = rAxleDefAngle;
        }
        Object.defineProperty(BodySettings.prototype, "bikeType", {
            get: function () { return this._bikeType; },
            set: function (type) {
                this._bikeType = type;
                var frame = Game.Global.game.cache.getFrameByName("atlas_A", this.spriteKey);
                var anchor = new Phaser.Point(frame.width / 2, frame.height / 2);
                this.exhaustDir = anchor.angle(this._exhaustPos, false);
                this.exhaustDis = anchor.distance(this._exhaustPos, false);
                this.rAxleAttachDir = anchor.angle(this._rAxleAttachPos, false);
                this.rAxleAttachDis = anchor.distance(this._rAxleAttachPos, false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BodySettings.prototype, "spriteKey", {
            get: function () { return this._bikeType.getAssetPrefix() + "body"; },
            enumerable: true,
            configurable: true
        });
        return BodySettings;
    }());
    Bike.BodySettings = BodySettings;
    var MotorSettings = (function () {
        function MotorSettings(maxSpeed, maxSpeedDelay, minSpeedRatio, torque) {
            this.maxSpeed = maxSpeed;
            this.maxSpeedDelay = maxSpeedDelay;
            this.minSpeedRatio = minSpeedRatio;
            this.torque = torque;
        }
        Object.defineProperty(MotorSettings.prototype, "minSpeed", {
            get: function () { return this.maxSpeed * this.minSpeedRatio; },
            enumerable: true,
            configurable: true
        });
        MotorSettings.prototype.copyFrom = function (settings) {
            this.maxSpeed = settings.maxSpeed;
            this.maxSpeedDelay = settings.maxSpeedDelay;
            this.minSpeedRatio = settings.minSpeedRatio;
            this.torque = this.torque;
        };
        return MotorSettings;
    }());
    Bike.MotorSettings = MotorSettings;
    var SpringSettings = (function () {
        function SpringSettings(frequency, damping, angle) {
            this.frequency = frequency;
            this.damping = damping;
            this.angle = angle;
        }
        return SpringSettings;
    }());
    Bike.SpringSettings = SpringSettings;
    var RearAxleImageSettings = (function () {
        function RearAxleImageSettings(mode, anchor) {
            this._mode = mode;
            this._anchor = anchor;
        }
        Object.defineProperty(RearAxleImageSettings.prototype, "mode", {
            get: function () { return this._mode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RearAxleImageSettings.prototype, "anchor", {
            get: function () { return this._anchor; },
            enumerable: true,
            configurable: true
        });
        return RearAxleImageSettings;
    }());
    Bike.RearAxleImageSettings = RearAxleImageSettings;
    var WheelSettings = (function () {
        function WheelSettings(frontWheel, brokenShape, offset, radius, density, friction, restitution, angularDamping, spring) {
            this._frontWheel = frontWheel;
            this.brokenShape = brokenShape;
            this.offset = offset;
            this.radius = radius;
            this.density = density;
            this.friction = friction;
            this.restitution = restitution;
            this.angularDamping = angularDamping;
            this.spring = spring;
        }
        Object.defineProperty(WheelSettings.prototype, "spriteKey", {
            get: function () {
                return this.bikeType.getAssetPrefix() + "wheel";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WheelSettings.prototype, "brokenSpriteKey", {
            get: function () { return this.bikeType.getAssetPrefix() + "brokenWheel"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WheelSettings.prototype, "axleSpriteKey", {
            get: function () { return this.bikeType.getAssetPrefix() + (this._frontWheel ? "f" : "r") + "Axle"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WheelSettings.prototype, "frontWheel", {
            get: function () { return this._frontWheel; },
            enumerable: true,
            configurable: true
        });
        return WheelSettings;
    }());
    Bike.WheelSettings = WheelSettings;
    var HeadSettings = (function () {
        function HeadSettings(offset, anchor, vertices) {
            this.offset = offset;
            this.anchor = anchor;
            this.vertices = vertices;
        }
        Object.defineProperty(HeadSettings.prototype, "spriteKey", {
            get: function () { return this.bikeType.getAssetPrefix() + "head"; },
            enumerable: true,
            configurable: true
        });
        return HeadSettings;
    }());
    Bike.HeadSettings = HeadSettings;
    var TiltSettings = (function () {
        function TiltSettings(iniImpulse, torque) {
            this.iniImpulse = iniImpulse;
            this.torque = torque;
        }
        TiltSettings.prototype.copyFrom = function (settings) {
            this.iniImpulse = settings.iniImpulse;
            this.torque = settings.torque;
        };
        return TiltSettings;
    }());
    Bike.TiltSettings = TiltSettings;
    var GhostSettings = (function () {
        function GhostSettings(anchor) {
            this._anchor = anchor;
        }
        Object.defineProperty(GhostSettings.prototype, "spriteKey", {
            get: function () { return this.bikeType.getAssetPrefix() + "ghost"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GhostSettings.prototype, "anchor", {
            get: function () { return this._anchor; },
            enumerable: true,
            configurable: true
        });
        return GhostSettings;
    }());
    Bike.GhostSettings = GhostSettings;
    var Type = (function () {
        function Type(uid, ingamePrice, gameePrice, bonus, body, fWheel, rWheel, rAxleImage, motor, head, tilt, ghost) {
            this._uid = uid;
            this._ingameCurrencyPrice = ingamePrice;
            this._gameeCurrencyPrice = gameePrice;
            this._bonus = bonus;
            this.body = body;
            body.bikeType = this;
            this.fWheel = fWheel;
            fWheel.bikeType = this;
            this.rWheel = rWheel;
            rWheel.bikeType = this;
            this.rAxleImage = rAxleImage;
            this.head = head;
            head.bikeType = this;
            this.ghost = ghost;
            ghost.bikeType = this;
            this.motor = motor;
            this.tilt = tilt;
        }
        Object.defineProperty(Type.prototype, "uid", {
            get: function () { return this._uid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Type.prototype, "ingameCurrencyPrice", {
            get: function () { return this._ingameCurrencyPrice; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Type.prototype, "gameeCurrencyPrice", {
            get: function () { return this._gameeCurrencyPrice; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Type.prototype, "portraitFrameName", {
            get: function () { return "bike_" + this._uid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Type.prototype, "bonus", {
            get: function () { return this._bonus; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Type.prototype, "unlocked", {
            get: function () { return Game.Global.playerProfile.isBikeUnlocked(this); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Type.prototype, "canBePurchased", {
            get: function () {
                if (this.unlocked || !this._ingameCurrencyPrice)
                    return false;
                return (this._ingameCurrencyPrice.price <= Game.Global.playerProfile.coins);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Type.prototype, "canBePurchasedNews", {
            get: function () {
                return (this.canBePurchased && !Game.Global.playerProfile.getBikeAnnouncedFlag(this));
            },
            enumerable: true,
            configurable: true
        });
        Type.prototype.getAssetPrefix = function () {
            return "bike_" + this._uid + "_";
        };
        return Type;
    }());
    Bike.Type = Type;
})(Bike || (Bike = {}));
var Bike;
(function (Bike) {
    var Wheel = (function () {
        function Wheel(bike, id) {
            this._bike = bike;
            this._id = id;
            this._worldManifold = new box2d.b2WorldManifold();
            this._vec1 = new box2d.b2Vec2();
            this._vec2 = new box2d.b2Vec2();
        }
        Object.defineProperty(Wheel.prototype, "sprite", {
            get: function () { return this._sprite; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Wheel.prototype, "body", {
            get: function () { return this._sprite.body; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Wheel.prototype, "joint", {
            get: function () { return this._joint; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Wheel.prototype, "defMass", {
            get: function () { return this._defMass; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Wheel.prototype, "onGround", {
            get: function () { return this._groundContCnt != 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Wheel.prototype, "worldManifold", {
            get: function () { return this._worldManifold; },
            enumerable: true,
            configurable: true
        });
        Wheel.prototype.create = function (bikeBody, wheelSettings) {
            var bikeAnchorX = Math.round(bikeBody.width / 2);
            var bikeAnchorY = Math.round(bikeBody.height / 2);
            this._sprite = Game.Global.game.add.sprite(bikeBody.x + wheelSettings.radius + (wheelSettings.offset.x - bikeAnchorX), bikeBody.y + wheelSettings.radius + (wheelSettings.offset.y - bikeAnchorY), "atlas_A", wheelSettings.spriteKey, bikeBody.parent);
            this._sprite.anchor.set(0.5);
            this._sprite.moveDown();
            Game.Global.game.physics.box2d.enable(this._sprite);
            var body = this._sprite.body;
            body.data.SetUserData(this._id);
            body.setCircle(wheelSettings.radius).SetDensity(wheelSettings.density);
            body.friction = wheelSettings.friction;
            body.restitution = wheelSettings.restitution;
            body.angularDamping = wheelSettings.angularDamping;
            body.linearDamping = 0.1;
            body.setCollisionMask(2 | 8 | 32 | 16 | 64);
            body.setCollisionCategory(4);
            body.setCategoryContactCallback(16, this.handleSpikesContact, this);
            body.setCategoryContactCallback(64, this.handleBoostContact, this);
            var spring = wheelSettings.spring;
            this._joint = Game.Global.game.physics.box2d.wheelJoint(bikeBody, body, this._sprite.x - bikeBody.x, this._sprite.y - bikeBody.y, 0, 0, Math.cos(spring.angle), Math.sin(spring.angle), spring.frequency, spring.damping);
            this._defMass = body.mass;
            this._groundContCnt = 0;
            this._lImpactFxTime = 0;
            this._flatTire = 0;
            Wheel._lImpactSfxTime = 0;
        };
        Wheel.prototype.update = function () {
            if (this._flatTire == 1) {
                var wheel = this._id == 0 ? this._bike.type.rWheel : this._bike.type.fWheel;
                this._flatTire++;
                this._sprite.frameName = wheel.brokenSpriteKey;
                this._sprite.body.setPolygon(Bike.Bike.convertVertices(wheel.brokenShape, this._sprite.width >> 1, this._sprite.height >> 1));
                this._bike.kill(2);
            }
        };
        Wheel.prototype.getGroundContactPoint = function (res, contactCategoryMask) {
            if (this._groundContCnt != 0) {
                var contactNode = this.body.data.GetContactList();
                var posSet = false;
                var validContact = null;
                while (contactNode != null) {
                    var contact = contactNode.contact;
                    var data = contact.GetFixtureB().GetBody().GetUserData();
                    contactNode = contactNode.next;
                    if (data != null && data == this._id) {
                        if ((contact.GetFixtureA().GetFilterData().categoryBits & contactCategoryMask) != 0) {
                            validContact = contact;
                            validContact.GetWorldManifold(this._worldManifold);
                        }
                    }
                }
                if (validContact != null) {
                    validContact.GetWorldManifold(this._worldManifold);
                    var phy = Game.Global.game.physics.box2d;
                    var pos = this._worldManifold.points[0];
                    res.x = Math.round(-phy.mpx(pos.x));
                    res.y = Math.round(-phy.mpx(pos.y));
                }
            }
        };
        Wheel.prototype.handleGroundCotact = function (begin, contact) {
            if (begin) {
                this._groundContCnt++;
                this.showGroundHitFx(contact);
            }
            else {
                this._groundContCnt--;
            }
        };
        Wheel.prototype.showGroundHitFx = function (contact) {
            if (this._lImpactFxTime + 1000 <= this._bike.timer.time) {
                contact.GetWorldManifold(this._worldManifold);
                var point = this._worldManifold.points[0];
                contact.GetFixtureB().GetBody().GetLinearVelocityFromWorldPoint(point, this._vec1);
                contact.GetFixtureA().GetBody().GetLinearVelocityFromWorldPoint(point, this._vec2);
                var aproachVel = box2d.b2DotVV(this._vec2.SelfSub(this._vec1), this._worldManifold.normal);
                if (aproachVel > 3) {
                    var phy = Game.Global.game.physics.box2d;
                    this._bike.particles.showParticle(1, phy.mpx(-point.x), phy.mpx(-point.y), 0, 0);
                    this._lImpactFxTime = this._bike.timer.time;
                    if (aproachVel > 6 && Wheel._lImpactSfxTime + 1000 <= this._lImpactFxTime) {
                        Wheel._lImpactSfxTime = this._lImpactFxTime;
                        Game.AudioUtils.playSound("impact");
                    }
                }
            }
        };
        Wheel.prototype.handleSpikesContact = function (body1, body2, fixture1, fixture2, begin, contact) {
            if (begin && this._flatTire == 0) {
                var shield = PowerUps.Manager.powerUps[0];
                if (shield.active) {
                    if (shield.state == 2)
                        Gameplay.Gameplay.instance.hudPowerUps.usePowerUp(shield);
                }
                else {
                    Game.AudioUtils.playSound("flatTire");
                    this._flatTire = 1;
                }
            }
        };
        Wheel.prototype.handleBoostContact = function (body1, body2, fixture1, fixture2, begin, contact) {
            if (begin)
                this._bike.boost();
        };
        return Wheel;
    }());
    Bike.Wheel = Wheel;
})(Bike || (Bike = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Bike;
(function (Bike) {
    var Particle = (function (_super) {
        __extends(Particle, _super);
        function Particle(uid, type, onRelease, parent, animFrames, animFrameRate) {
            var _this = _super.call(this, Game.Global.game, 0, 0, "atlas_A") || this;
            _this.visible = _this.exists = false;
            _this.anchor.set(0.5);
            parent.add(_this, true);
            _this.data = uid;
            _this._type = type;
            _this._onRelease = onRelease;
            _this._anim = _this.animations.add("def", animFrames, animFrameRate, false, false);
            _this._anim.onComplete.add(_this.release, _this);
            return _this;
        }
        Object.defineProperty(Particle.prototype, "type", {
            get: function () { return this._type; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Particle.prototype, "prev", {
            get: function () { return this._prev; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Particle.prototype, "next", {
            get: function () { return this._next; },
            enumerable: true,
            configurable: true
        });
        Particle.prototype.show = function (prev, x, y, velocityX, velocityY) {
            this._next = null;
            if (prev != null) {
                if (prev._next != null) {
                    this._next = prev._next;
                    this._next._prev = this;
                }
                prev._next = this;
            }
            this._prev = prev;
            this._velocityX = velocityX;
            this._velocityY = velocityY;
            this.position.set(x, y);
            this.visible = this.exists = true;
            this._anim.play();
        };
        Particle.prototype.release = function () {
            this._onRelease.dispatch(this);
            this.hide();
            if (this._prev != null)
                this._prev._next = this._next;
            if (this._next != null)
                this._next._prev = this._prev;
            this._prev = null;
            this._next = null;
        };
        Particle.prototype.hide = function () {
            this._anim.stop(false, false);
            this.visible = this.exists = false;
        };
        Particle.prototype.update = function () {
            this.position.add(this._velocityX, this._velocityY);
        };
        return Particle;
    }(Phaser.Sprite));
    var ParticleMng = (function () {
        function ParticleMng(bike, layer, timer) {
            bike.particles = this;
            this._layer = layer;
            this._timer = timer;
            var onReleaseParticle = new Phaser.Signal();
            onReleaseParticle.add(this.handleReleaseParticle, this);
            this._nextUID = 0;
            this._pool = [];
            this._pool.push(new Collections.Pool(undefined, 8, true, function () {
                return new Particle(this._nextUID++, 0, onReleaseParticle, this._layer, Phaser.Animation.generateFrameNames("exhaustSmoke_", 0, 6), 20);
            }, this));
            this._pool.push(new Collections.Pool(undefined, 2, true, function () {
                return new Particle(this._nextUID++, 1, onReleaseParticle, this._layer, Phaser.Animation.generateFrameNames("wheelImpactDust_", 0, 6), 15);
            }, this));
            this._pool.push(new Collections.Pool(undefined, 2, true, function () {
                var particle = new Particle(this._nextUID++, 2, onReleaseParticle, this._layer, Phaser.Animation.generateFrameNames("wheelDust_", 0, 4), 20);
                particle.anchor.set(0.8, 0.8);
                return particle;
            }, this));
            this._fActive = null;
        }
        Object.defineProperty(ParticleMng.prototype, "timer", {
            get: function () { return this._timer; },
            enumerable: true,
            configurable: true
        });
        ParticleMng.prototype.reset = function () {
            var particle = this._fActive;
            while (particle != null) {
                var p = particle;
                particle = p.next;
                p.release();
            }
            this._fActive = null;
            this._lActive = null;
        };
        ParticleMng.prototype.showParticle = function (type, x, y, velocityX, velocityY, angle) {
            if (angle === void 0) { angle = 0; }
            var particle = this._pool[type].getItem();
            particle.show(this._lActive, x, y, velocityX, velocityY);
            particle.rotation = angle;
            this._lActive = particle;
            if (this._fActive == null)
                this._fActive = particle;
        };
        ParticleMng.prototype.handleReleaseParticle = function (particle) {
            this._pool[particle.type].returnItem(particle);
            if (this._fActive.data == particle.data)
                this._fActive = particle.next;
            if (this._lActive.data == particle.data)
                this._lActive = particle.prev;
        };
        return ParticleMng;
    }());
    Bike.ParticleMng = ParticleMng;
})(Bike || (Bike = {}));
var Bike;
(function (Bike) {
    var Stunt = (function () {
        function Stunt(bike, scoreDelay, scoreStartVal, scorePerStep) {
            this._bike = bike;
            this._scoreDelay = scoreDelay;
            this._scoreStartVal = scoreStartVal;
            this._scorePerStepBase = scorePerStep;
        }
        Object.defineProperty(Stunt.prototype, "score", {
            get: function () { return this._score; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stunt.prototype, "multiplier", {
            get: function () { return this._multiplier; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stunt.prototype, "countingScore", {
            get: function () { return this._scoreState != 0; },
            enumerable: true,
            configurable: true
        });
        Stunt.prototype.reset = function () {
            this._state = 0;
        };
        Stunt.prototype.update = function () {
            if (this._state != 0) {
                if (this._scoreState == 0) {
                    if (this._bike.timer.time - this._time >= this._scoreDelay || this._multiplier > 1)
                        this._scoreState = (Gameplay.Gameplay.instance.stuntScore.show(this) ? 1 : -1);
                }
                else {
                    this._score += this._scorePerStep * this._bike.timer.delta;
                }
            }
        };
        Stunt.prototype.cancel = function () {
            this.finish(false);
        };
        Stunt.prototype.start = function () {
            this._state = 1;
            this._time = this._bike.timer.time;
            this._scoreState = 0;
            var bonusRatio = 1 + (this._bike.type.bonus / 100);
            this._score = this._scoreStartVal * bonusRatio;
            this._scorePerStep = this._scorePerStepBase * bonusRatio;
            this._multiplier = 1;
        };
        Stunt.prototype.finish = function (success, resMsg1, resMsg2) {
            if (this._state != 0 && this._scoreState != 0) {
                if (this._scoreState == 1) {
                    var gameplay = Gameplay.Gameplay.instance;
                    if (success) {
                        gameplay.addScore(Math.round(this._score * this._multiplier));
                        gameplay.stuntScore.confirm(resMsg1, resMsg2);
                    }
                    else {
                        gameplay.stuntScore.cancel();
                    }
                }
            }
            this._state = 0;
        };
        return Stunt;
    }());
    Bike.Stunt = Stunt;
})(Bike || (Bike = {}));
var Bike;
(function (Bike) {
    var AirTimeStunt = (function (_super) {
        __extends(AirTimeStunt, _super);
        function AirTimeStunt(bike) {
            var _this = _super.call(this, bike, 750, 100, 5) || this;
            AirTimeStunt._processFnc = [_this.processState0, _this.processState1];
            return _this;
        }
        AirTimeStunt.prototype.reset = function () {
            _super.prototype.reset.call(this);
            this._fuelBonusBikePos = 0;
        };
        AirTimeStunt.prototype.update = function () {
            AirTimeStunt._processFnc[this._state].call(this);
            _super.prototype.update.call(this);
        };
        AirTimeStunt.prototype.processState0 = function () {
            if (!this._bike.getWheel(0).onGround && !this._bike.getWheel(1).onGround) {
                _super.prototype.start.call(this);
                this._saltoStartAngle = this._bike.bodySprite.rotation;
            }
        };
        AirTimeStunt.prototype.processState1 = function () {
            var curAngle = this._bike.bodySprite.rotation;
            if (!this._bike.getWheel(0).onGround && !this._bike.getWheel(1).onGround) {
                if (Math.abs(curAngle - this._saltoStartAngle) >= AirTimeStunt.SALTO_FULL_LEN) {
                    this._saltoDir = (curAngle > this._saltoStartAngle ? 1 : -1);
                    this._saltoStartAngle += (this._saltoDir > 0 ? AirTimeStunt.SALTO_FULL_LEN : -AirTimeStunt.SALTO_FULL_LEN);
                    this._multiplier++;
                }
            }
            else {
                var res = false;
                var msg1 = null;
                var msg2 = null;
                if (Math.abs(curAngle - this._saltoStartAngle) >= AirTimeStunt.SALTO_MIL_LEN) {
                    this._saltoDir = curAngle > this._saltoStartAngle ? 1 : -1;
                    this._multiplier++;
                }
                if (this._bike.bodySprite.x - 128 > this._fuelBonusBikePos) {
                    this._fuelBonusBikePos = this._bike.bodySprite.x;
                    res = true;
                    if (this._multiplier > 1) {
                        msg1 = this._saltoDir > 0 ? "FRONT FLIP" : "BACK FLIP";
                        msg2 = (this._multiplier - 1) + "x";
                        this._bike.fuel.addFuel(AirTimeStunt.SALTO_BONUS_FUEL + Math.round((this._multiplier - 1) * (AirTimeStunt.SALTO_BONUS_FUEL * 0.75)));
                        if (this._multiplier > 2)
                            Game.AudioUtils.playSound("applause");
                    }
                }
                this.finish(res, msg1, msg2);
            }
        };
        AirTimeStunt.SALTO_FULL_LEN = Phaser.Math.degToRad(360);
        AirTimeStunt.SALTO_MIL_LEN = Phaser.Math.degToRad(200);
        AirTimeStunt.SALTO_DIR_CHANGE_LEN = Phaser.Math.degToRad(2.5);
        AirTimeStunt.SALTO_BONUS_FUEL = 80;
        return AirTimeStunt;
    }(Bike.Stunt));
    Bike.AirTimeStunt = AirTimeStunt;
})(Bike || (Bike = {}));
var Bike;
(function (Bike) {
    var WheelieStunt = (function (_super) {
        __extends(WheelieStunt, _super);
        function WheelieStunt(bike) {
            var _this = _super.call(this, bike, 1000, 100, 5) || this;
            _this._airWheel = bike.getWheel(1);
            _this._groundWheel = bike.getWheel(0);
            return _this;
        }
        WheelieStunt.prototype.update = function () {
            if (this._state == 0) {
                if (this._airWheel.onGround != this._groundWheel.onGround && this._bike.getVelocity() >= WheelieStunt.MIN_VELOCITY) {
                    if (this._airWheel.onGround) {
                        var airWheel = this._groundWheel;
                        this._groundWheel = this._airWheel;
                        this._airWheel = airWheel;
                    }
                    this._groundWheelAirTime = -1;
                    _super.prototype.start.call(this);
                }
            }
            else {
                if (this._airWheel.onGround || this._bike.getVelocity() < WheelieStunt.MIN_VELOCITY) {
                    this.endTrick();
                }
                else if (!this._groundWheel.onGround) {
                    if (this._groundWheelAirTime > 0) {
                        if (this._bike.timer.time - this._groundWheelAirTime > 250)
                            this.endTrick();
                    }
                    else {
                        this._groundWheelAirTime = this._bike.timer.time;
                    }
                }
                _super.prototype.update.call(this);
            }
        };
        WheelieStunt.prototype.endTrick = function () {
            var msg1 = null;
            var msg2 = null;
            if (this.countingScore) {
                msg1 = "WHEELIE";
                msg2 = Math.round((this._bike.timer.time - this._time) / 1000) + " sec";
            }
            _super.prototype.finish.call(this, true, msg1, msg2);
        };
        WheelieStunt.MIN_VELOCITY = 1.5;
        return WheelieStunt;
    }(Bike.Stunt));
    Bike.WheelieStunt = WheelieStunt;
})(Bike || (Bike = {}));
var Game;
(function (Game) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Boot.prototype.init = function () {
            this.stage.disableVisibilityChange = true;
            var minRes = new Phaser.Point();
            var maxRes = new Phaser.Point();
            if (this.game.device.desktop) {
                minRes.set(854, 640);
                maxRes.set(1278, 640);
            }
            else {
                minRes.set(640, 844);
                maxRes.set(640, 1278);
            }
            Game.Global.scale = new Helpers.ScaleManager(minRes, maxRes);
            this._gameeReady = false;
        };
        Boot.prototype.preload = function () {
            this.load.baseURL = "assets/";
            this.load.atlasJSONArray("atlas_A");
            this.load.atlasJSONArray("atlas_1");
            this.load.atlasJSONArray("atlas_2");
            this.load.bitmapFont("fntRed120");
            this.load.bitmapFont("fntWhite60");
            this.load.bitmapFont("fntWhite30");
            this.load.binary("maps");
            if (!this.game.device.webAudio) {
                for (var property in Game.Sounds.AUDIO_JSON.spritemap) {
                    this.load.audio(property, property + ".mp3");
                }
            }
            else {
                this.load.audiosprite("sfx", Game.Sounds.AUDIO_JSON.resources, null, Game.Sounds.AUDIO_JSON);
            }
            if (Game.Global.OPT_GAMEE) {
                Gamee2.Gamee.onInitialized.addOnce(this.handleGameeInit, this);
                this._gameeReady = !Gamee2.Gamee.initialize("FullScreen", ["saveState", "rewardedAds", "ghostMode", "replay", "socialData", "playerData", "logEvents", "share"]);
            }
            if (!Game.Global.OPT_GAMEE || this._gameeReady) {
                Game.Global.playerProfile.reset();
                this._gameeReady = true;
            }
        };
        Boot.prototype.create = function () {
            if (!this.game.device.webAudio) {
                for (var property in Game.Sounds.AUDIO_JSON.spritemap) {
                    var snd = this.add.audio(property);
                    snd.allowMultiple = true;
                    Game.AudioUtils.addSfxSound(property, snd);
                }
            }
            else {
                var audioSprite = this.add.audioSprite("sfx");
                for (var property in Game.Sounds.AUDIO_JSON.spritemap) {
                    audioSprite.sounds[property].allowMultiple = true;
                }
                Game.AudioUtils.setSfxAudioSprite(audioSprite);
            }
        };
        Boot.prototype.update = function () {
            if (this._gameeReady) {
                Game.Global.bikeTypes = [];
                var brokenWheelShape = void 0;
                if (!Gamee2.Gamee.initialized || Gamee2.Gamee.initData.gameContext == "normal") {
                    brokenWheelShape = [18, 0, 31, 5, 36, 13, 36, 21, 14, 31, 3, 25, 1, 12, 9, 3];
                    Game.Global.bikeTypes.push(new Bike.Type(1, null, null, 0, new Bike.BodySettings([new Bike.PhyShape([37, 6, 52, 10, 42, 56, 16, 39], 1),
                        new Bike.PhyShape([78, 10, 92, 34, 76, 63, 51, 63], 0.5)], 0.1, new Phaser.Point(4, 60), new Phaser.Point(48, 57), Phaser.Math.degToRad(10)), new Bike.WheelSettings(true, brokenWheelShape, new Phaser.Point(88, 46), 19, 1, 0.6, 0.5, 0.4, new Bike.SpringSettings(7, 0.2, Phaser.Math.degToRad(240))), new Bike.WheelSettings(false, brokenWheelShape, new Phaser.Point(-1, 46), 19, 1, 0.7, 0.5, 0.4, new Bike.SpringSettings(8, 0.2, Phaser.Math.degToRad(270))), new Bike.RearAxleImageSettings(2, new Phaser.Point(0.075, 0.5)), new Bike.MotorSettings(30, 1250, 0.1, 10), new Bike.HeadSettings(new Phaser.Point(33, -29), new Phaser.Point(20, 30), [25, 1, 39, 14, 36, 37, 2, 27, 3, 8, 12, 1]), new Bike.TiltSettings(4, 8), new Bike.GhostSettings(new Phaser.Point(0.4, 0.6))));
                    brokenWheelShape = [15, 1, 26, 2, 36, 12, 36, 21, 25, 30, 8, 30, 1, 21, 4, 9];
                    Game.Global.bikeTypes.push(new Bike.Type(3, new Game.Price(99, 0), null, 2, new Bike.BodySettings([new Bike.PhyShape([44, 7, 63, 16, 46, 50, 23, 37], 1),
                        new Bike.PhyShape([81, 17, 99, 41, 71, 69, 51, 69], 1)], 0.2, new Phaser.Point(3, 38), new Phaser.Point(58, 66), Phaser.Math.degToRad(0)), new Bike.WheelSettings(true, brokenWheelShape, new Phaser.Point(88, 53), 19, 1, 0.6, 0.5, 0.4, new Bike.SpringSettings(7, 0.2, Phaser.Math.degToRad(240))), new Bike.WheelSettings(false, brokenWheelShape, new Phaser.Point(4, 53), 19, 1, 0.7, 0.5, 0.4, new Bike.SpringSettings(8, 0.2, Phaser.Math.degToRad(270))), new Bike.RearAxleImageSettings(2, new Phaser.Point(0.075, 0.5)), new Bike.MotorSettings(30, 900, 0.1, 10), new Bike.HeadSettings(new Phaser.Point(38, -25), new Phaser.Point(17, 30), [15, 0, 32, 4, 40, 15, 36, 36, 3, 28, 2, 9]), new Bike.TiltSettings(4, 8), new Bike.GhostSettings(new Phaser.Point(0.48, 0.55))));
                    brokenWheelShape = [16, 1, 23, 1, 34, 8, 37, 21, 31, 28, 6, 30, 2, 14, 8, 5];
                    Game.Global.bikeTypes.push(new Bike.Type(5, new Game.Price(299, 0), null, 5, new Bike.BodySettings([
                        new Bike.PhyShape([50, 7, 88, 25, 94, 49, 76, 70, 50, 70, 39, 36], 1),
                        new Bike.PhyShape([22, 36, 38, 36, 38, 70, 7, 58], 0.5)
                    ], 0.3, new Phaser.Point(14, 69), new Phaser.Point(), Phaser.Math.degToRad(0)), new Bike.WheelSettings(true, brokenWheelShape, new Phaser.Point(88, 54), 19, 1, 0.6, 0.5, 0.4, new Bike.SpringSettings(7, 0.2, Phaser.Math.degToRad(240))), new Bike.WheelSettings(false, brokenWheelShape, new Phaser.Point(3, 54), 19, 1, 0.7, 0.5, 0.4, new Bike.SpringSettings(8, 0.2, Phaser.Math.degToRad(270))), new Bike.RearAxleImageSettings(0), new Bike.MotorSettings(30, 900, 0.1, 10), new Bike.HeadSettings(new Phaser.Point(41, -25), new Phaser.Point(15, 31), [14, 1, 27, 1, 40, 11, 37, 35, 3, 27, 3, 9]), new Bike.TiltSettings(4, 8), new Bike.GhostSettings(new Phaser.Point(0.48, 0.55))));
                    brokenWheelShape = [14, 1, 24, 1, 30, 6, 30, 31, 25, 36, 13, 36, 2, 26, 2, 12];
                    Game.Global.bikeTypes.push(new Bike.Type(2, new Game.Price(499, 0), null, 15, new Bike.BodySettings([
                        new Bike.PhyShape([43, 7, 56, 13, 44, 60, 17, 37], 1),
                        new Bike.PhyShape([79, 20, 102, 34, 71, 66, 48, 66], 0.4)
                    ], 0.1, new Phaser.Point(4, 62), new Phaser.Point(51, 62), Phaser.Math.degToRad(10)), new Bike.WheelSettings(true, brokenWheelShape, new Phaser.Point(85, 54), 19, 1, 0.6, 0.5, 0.4, new Bike.SpringSettings(7, 0.2, Phaser.Math.degToRad(245))), new Bike.WheelSettings(false, brokenWheelShape, new Phaser.Point(0, 54), 19, 1, 0.7, 0.5, 0.4, new Bike.SpringSettings(8, 0.2, Phaser.Math.degToRad(270))), new Bike.RearAxleImageSettings(2, new Phaser.Point(0.075, 0.5)), new Bike.MotorSettings(31, 750, 0.1, 10), new Bike.HeadSettings(new Phaser.Point(33, -29), new Phaser.Point(20, 34), [15, 2, 29, 2, 38, 16, 31, 36, 6, 27, 5, 13]), new Bike.TiltSettings(4, 8), new Bike.GhostSettings(new Phaser.Point(0.5, 0.58))));
                    brokenWheelShape = [20, 1, 35, 8, 36, 24, 28, 33, 7, 33, 1, 23, 4, 9];
                    Game.Global.bikeTypes.push(new Bike.Type(0, new Game.Price(999, 0), null, 30, new Bike.BodySettings([new Bike.PhyShape([30, 17, 69, 17, 49, 66, 26, 36], 0.75),
                        new Bike.PhyShape([69, 17, 83, 37, 68, 67, 49, 66], 1)], 0.5, new Phaser.Point(5, 49), new Phaser.Point(52, 65), Phaser.Math.degToRad(20)), new Bike.WheelSettings(true, brokenWheelShape, new Phaser.Point(80, 53), 19, 1, 0.6, 0.5, 0.4, new Bike.SpringSettings(7, 0.2, Phaser.Math.degToRad(240))), new Bike.WheelSettings(false, brokenWheelShape, new Phaser.Point(-2, 53), 19, 1, 0.8, 0.5, 0.4, new Bike.SpringSettings(8, 0.2, Phaser.Math.degToRad(270))), new Bike.RearAxleImageSettings(2, new Phaser.Point(0.075, 0.86)), new Bike.MotorSettings(30, 750, 0.2, 10), new Bike.HeadSettings(new Phaser.Point(26, -26), new Phaser.Point(18, 33), [17, 1, 40, 8, 37, 37, 2, 28, 2, 9]), new Bike.TiltSettings(4, 8), new Bike.GhostSettings(new Phaser.Point(0.48, 0.52))));
                    brokenWheelShape = [20, 1, 35, 8, 36, 24, 28, 33, 7, 33, 1, 23, 4, 9];
                    Game.Global.bikeTypes.push(new Bike.Type(6, new Game.Price(1499, 0), null, 75, new Bike.BodySettings([new Bike.PhyShape([34, 5, 52, 10, 37, 40, 14, 40], 1),
                        new Bike.PhyShape([80, 21, 88, 35, 66, 64, 44, 64], 0.75)], 0.25, new Phaser.Point(16, 61), new Phaser.Point(49, 62), Phaser.Math.degToRad(0)), new Bike.WheelSettings(true, brokenWheelShape, new Phaser.Point(86, 46), 19, 1, 0.6, 0.5, 0.4, new Bike.SpringSettings(7, 0.2, Phaser.Math.degToRad(240))), new Bike.WheelSettings(false, brokenWheelShape, new Phaser.Point(-4, 46), 19, 1, 0.8, 0.5, 0.4, new Bike.SpringSettings(8, 0.2, Phaser.Math.degToRad(270))), new Bike.RearAxleImageSettings(1, new Phaser.Point(0.075, 0.5)), new Bike.MotorSettings(31, 800, 0.15, 15), new Bike.HeadSettings(new Phaser.Point(27, -37), new Phaser.Point(16, 38), [10, 6, 32, 8, 44, 23, 37, 37, 28, 43, 4, 40, 2, 21]), new Bike.TiltSettings(4, 8), new Bike.GhostSettings(new Phaser.Point(0.40, 0.6))));
                    brokenWheelShape = [20, 1, 35, 8, 36, 24, 28, 33, 7, 33, 1, 23, 4, 9];
                    Game.Global.bikeTypes.push(new Bike.Type(4, new Game.Price(2199, 0), null, 150, new Bike.BodySettings([new Bike.PhyShape([30, 5, 48, 11, 40, 54, 12, 35], 1),
                        new Bike.PhyShape([74, 16, 83, 34, 68, 65, 45, 65], 0.6)], 0.25, new Phaser.Point(25, 59), new Phaser.Point(43, 56), Phaser.Math.degToRad(5)), new Bike.WheelSettings(true, brokenWheelShape, new Phaser.Point(81, 45), 19, 1, 0.6, 0.5, 0.4, new Bike.SpringSettings(7, 0.2, Phaser.Math.degToRad(240))), new Bike.WheelSettings(false, brokenWheelShape, new Phaser.Point(-7, 45), 19, 1, 0.8, 0.5, 0.4, new Bike.SpringSettings(8, 0.2, Phaser.Math.degToRad(270))), new Bike.RearAxleImageSettings(1, new Phaser.Point(0.075, 0.5)), new Bike.MotorSettings(31, 800, 0.25, 20), new Bike.HeadSettings(new Phaser.Point(18, -32), new Phaser.Point(20, 34), [13, 2, 27, 2, 36, 14, 35, 35, 1, 25, 4, 9]), new Bike.TiltSettings(4, 8), new Bike.GhostSettings(new Phaser.Point(0.43, 0.6))));
                    brokenWheelShape = [17, 1, 30, 5, 37, 16, 20, 37, 7, 33, 1, 24, 5, 7];
                    Game.Global.bikeTypes.push(new Bike.Type(8, new Game.Price(2999, 0), null, 300, new Bike.BodySettings([
                        new Bike.PhyShape([41, 5, 53, 13, 37, 58, 19, 34], 1),
                        new Bike.PhyShape([73, 16, 78, 46, 62, 67, 48, 67], 0.6)
                    ], 0.25, new Phaser.Point(36, 65), new Phaser.Point(38, 56), Phaser.Math.degToRad(5)), new Bike.WheelSettings(true, brokenWheelShape, new Phaser.Point(82, 45), 19, 1, 0.6, 0.5, 0.4, new Bike.SpringSettings(7, 0.4, Phaser.Math.degToRad(245))), new Bike.WheelSettings(false, brokenWheelShape, new Phaser.Point(-8, 45), 19, 1, 0.8, 0.5, 0.4, new Bike.SpringSettings(8, 0.3, Phaser.Math.degToRad(270))), new Bike.RearAxleImageSettings(2, new Phaser.Point(0.1, 0.78)), new Bike.MotorSettings(31, 800, 0.25, 20), new Bike.HeadSettings(new Phaser.Point(33, -28), new Phaser.Point(18, 32), [12, 1, 29, 3, 39, 15, 39, 30, 35, 36, 2, 27, 1, 12]), new Bike.TiltSettings(4, 8), new Bike.GhostSettings(new Phaser.Point(0.43, 0.6))));
                    brokenWheelShape = [14, 1, 29, 4, 36, 13, 13, 35, 4, 28, 1, 17, 6, 6];
                    Game.Global.bikeTypes.push(new Bike.Type(9, new Game.Price(4999, 0), null, 500, new Bike.BodySettings([
                        new Bike.PhyShape([16, 17, 78, 17, 70, 41, 25, 41], 1)
                    ], 0.25, new Phaser.Point(25, 41), new Phaser.Point(), 0), new Bike.WheelSettings(true, brokenWheelShape, new Phaser.Point(75, 21), 19, 1, 0.8, 0.6, 0.4, new Bike.SpringSettings(10, 0.4, Phaser.Math.degToRad(270))), new Bike.WheelSettings(false, brokenWheelShape, new Phaser.Point(-18, 20), 19, 1, 1, 0.6, 0.4, new Bike.SpringSettings(10, 0.4, Phaser.Math.degToRad(270))), new Bike.RearAxleImageSettings(0), new Bike.MotorSettings(31, 800, 0.25, 20), new Bike.HeadSettings(new Phaser.Point(45, -24), new Phaser.Point(15, 30), [17, 0, 36, 9, 40, 25, 29, 41, 2, 23, 6, 6]), new Bike.TiltSettings(4, 10), new Bike.GhostSettings(new Phaser.Point(0.43, 0.6))));
                    if (!Game.Global.playerProfile.isBikeUnlocked(Game.Global.getBikeType(Game.Global.playerProfile.bikeTypeUID)))
                        Game.Global.playerProfile.bikeTypeUID = Game.Global.NORMAL_DEF_BIKE_UID;
                }
                else {
                    brokenWheelShape = [13, 2, 27, 3, 34, 14, 33, 23, 24, 29, 1, 25, 2, 11];
                    Game.Global.battleBikeType = new Bike.Type(Game.Global.BATTLE_BIKE_UID, null, null, 0, new Bike.BodySettings([
                        new Bike.PhyShape([37, 5, 58, 10, 53, 66, 21, 49], 1),
                        new Bike.PhyShape([84, 18, 91, 34, 80, 66, 55, 66], 0.75)
                    ], 0.1, new Phaser.Point(38, 69), new Phaser.Point(), 0), new Bike.WheelSettings(true, brokenWheelShape, new Phaser.Point(88, 46), 19, 1, 0.6, 0.5, 0.4, new Bike.SpringSettings(7, 0.2, Phaser.Math.degToRad(240))), new Bike.WheelSettings(false, brokenWheelShape, new Phaser.Point(-1, 46), 19, 1, 0.7, 0.5, 0.4, new Bike.SpringSettings(8, 0.2, Phaser.Math.degToRad(270))), new Bike.RearAxleImageSettings(0), new Bike.MotorSettings(30 + Math.round((60 - 30) * (Game.Global.battleSettings.speed / 5)), 1000, 0.15, 20), new Bike.HeadSettings(new Phaser.Point(27, -31), new Phaser.Point(20, 33), [2, 7, 28, 2, 36, 32, 7, 32]), new Bike.TiltSettings(4, 8), new Bike.GhostSettings(new Phaser.Point(0.43, 0.6)));
                }
                this.state.start("Gameplay");
            }
        };
        Boot.prototype.handleGameeInit = function (initState, initData) {
            this._gameeReady = true;
            var resetPlProf = true;
            if (initData) {
                if (initData.gameContext == "battle") {
                    Game.Global.battleSettings = {
                        gravity: 0,
                        speed: 0,
                        visibility: 0,
                        assetUID: 1,
                    };
                    var settings = void 0;
                    if (initData.initData) {
                        try {
                            settings = JSON.parse(initData.initData);
                        }
                        catch (e) {
                            settings = null;
                        }
                    }
                    if (settings) {
                        if (settings.gravity != undefined)
                            Game.Global.battleSettings.gravity = settings.gravity;
                        if (settings.speed != undefined)
                            Game.Global.battleSettings.speed = settings.speed;
                        if (settings.visibility != undefined)
                            Game.Global.battleSettings.visibility = settings.visibility;
                        if (settings.assetUID != undefined)
                            Game.Global.battleSettings.assetUID = settings.assetUID;
                    }
                }
                try {
                    if (initData.saveState) {
                        Game.Global.playerProfile.fromSerializedString(initData.saveState);
                        resetPlProf = false;
                    }
                }
                catch (e) {
                }
            }
            if (resetPlProf)
                Game.Global.playerProfile.reset();
        };
        return Boot;
    }(Phaser.State));
    Game.Boot = Boot;
})(Game || (Game = {}));
var Collections;
(function (Collections) {
    var FixedArray = (function () {
        function FixedArray(maxEntryCnt) {
            if (maxEntryCnt === void 0) { maxEntryCnt = -1; }
            this._entries = [];
            this._entryCnt = 0;
            this._maxEntryCnt = maxEntryCnt;
        }
        Object.defineProperty(FixedArray.prototype, "entries", {
            get: function () { return this._entries; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FixedArray.prototype, "entryCnt", {
            get: function () { return this._entryCnt; },
            set: function (entryCnt) { this._entryCnt = entryCnt; },
            enumerable: true,
            configurable: true
        });
        FixedArray.prototype.clear = function () {
            var entryId = this._entries.length;
            while (entryId-- != 0)
                this._entries[entryId] = undefined;
            this._entryCnt = 0;
        };
        FixedArray.prototype.reset = function () {
            this._entryCnt = 0;
        };
        FixedArray.prototype.ensureCapacity = function (capacity, clear) {
            if (clear) {
                var i = Math.min(capacity, this._entries.length);
                while (i-- != 0)
                    this._entries[i] = null;
            }
            while (this._entries.length < capacity)
                this._entries.push(null);
        };
        FixedArray.prototype.addEntry = function (entry) {
            if (this._maxEntryCnt < 0 || this._entryCnt < this._maxEntryCnt) {
                this._entries[this._entryCnt++] = entry;
                return true;
            }
            return false;
        };
        FixedArray.prototype.deleteLastEntry = function () {
            if (this._entryCnt == 0)
                return null;
            var entry = this._entries[--this._entryCnt];
            this._entries[this._entryCnt] = undefined;
            return entry;
        };
        FixedArray.prototype.forEach = function (callback, context) {
            for (var entryId = 0; entryId < this._entryCnt; entryId++) {
                callback.call(context, this._entries[entryId]);
            }
        };
        FixedArray.prototype.toString = function () {
            if (this._entryCnt == 0)
                return "";
            var res = "";
            if (typeof this._entries[0] == "number") {
                for (var entryId = 0; entryId < this._entryCnt; entryId++)
                    res += (this._entries[entryId] + ",");
                return res.slice(0, res.length - 1);
            }
            return "";
        };
        FixedArray.prototype.copyTo = function (array) {
            for (var i = 0; i < this._entryCnt; i++)
                array[i] = this._entries[i];
            return array;
        };
        return FixedArray;
    }());
    Collections.FixedArray = FixedArray;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    var GameObjects = (function () {
        function GameObjects(objectCreateFnc, objectCreateFncCtx, defSize) {
            if (defSize === void 0) { defSize = 3; }
            this._actObjects = new Collections.LinkedList(defSize);
            this._inactObjects = new Collections.Pool(undefined, defSize, true, objectCreateFnc, objectCreateFncCtx);
        }
        Object.defineProperty(GameObjects.prototype, "activeObjects", {
            get: function () { return this._actObjects; },
            enumerable: true,
            configurable: true
        });
        GameObjects.prototype.reset = function () {
            while (!this._actObjects.isEmpty) {
                this.deactivateObject(this.killObject(this._actObjects.elementAtIndex(0)));
            }
        };
        GameObjects.prototype.activateObject = function () {
            var obj = this._inactObjects.getItem();
            this._actObjects.add(obj);
            return obj;
        };
        GameObjects.prototype.deactivateObject = function (obj) {
            this.killObject(obj);
            if (this._actObjects.remove(obj))
                this._inactObjects.returnItem(obj);
        };
        GameObjects.prototype.updateObjects = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this._actObjects.forEach(this.updateObjectsInt, this, args);
        };
        GameObjects.prototype.killObject = function (obj) {
            if (obj["kill"])
                obj.kill();
            return obj;
        };
        GameObjects.prototype.updateObjectsInt = function (obj, node) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            if (obj["update"]) {
                if (!obj.update(args)) {
                    this.killObject(obj);
                    this._inactObjects.returnItem(this._actObjects.removeNode(node));
                }
            }
            return true;
        };
        return GameObjects;
    }());
    Collections.GameObjects = GameObjects;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    var ILinkedListNode = (function () {
        function ILinkedListNode() {
        }
        return ILinkedListNode;
    }());
    Collections.ILinkedListNode = ILinkedListNode;
    var LinkedList = (function () {
        function LinkedList(defNodeCnt) {
            this._firstNode = null;
            this._lastNode = null;
            this._nElements = 0;
            this._nodePool = new Collections.Pool(undefined, Math.round(defNodeCnt), true, function () {
                return new ILinkedListNode();
            }, this);
        }
        LinkedList.prototype.add = function (item, index) {
            if (Collections.isUndefined(index)) {
                index = this._nElements;
            }
            if (index < 0 || index > this._nElements || Collections.isUndefined(item)) {
                return false;
            }
            var newNode = this.createNode(item);
            if (this._nElements === 0) {
                this._firstNode = newNode;
                this._lastNode = newNode;
            }
            else if (index === this._nElements) {
                this._lastNode.next = newNode;
                newNode.prev = this._lastNode;
                this._lastNode = newNode;
            }
            else if (index === 0) {
                this._firstNode.prev = newNode;
                newNode.next = this._firstNode;
                this._firstNode = newNode;
            }
            else {
                var prev = this.nodeAtIndex(index - 1);
                newNode.next = prev.next;
                newNode.prev = prev;
                newNode.next.prev = newNode;
                prev.next = newNode;
            }
            this._nElements++;
            return true;
        };
        LinkedList.prototype.addToNode = function (item, neighbor, before) {
            var newNode = this.createNode(item);
            if (before) {
                newNode.prev = neighbor.prev;
                newNode.next = neighbor;
                neighbor.prev = newNode;
                if (neighbor == this._firstNode)
                    this._firstNode = newNode;
            }
            else {
                newNode.next = neighbor.next;
                newNode.prev = neighbor;
                neighbor.next = newNode;
                if (neighbor == this._lastNode)
                    this._lastNode = newNode;
            }
            this._nElements++;
        };
        Object.defineProperty(LinkedList.prototype, "first", {
            get: function () {
                if (this._firstNode !== null) {
                    return this._firstNode.element;
                }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "last", {
            get: function () {
                if (this._lastNode !== null) {
                    return this._lastNode.element;
                }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "firstNode", {
            get: function () { return this._firstNode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "lastNode", {
            get: function () { return this._lastNode; },
            enumerable: true,
            configurable: true
        });
        LinkedList.prototype.elementAtIndex = function (index) {
            var node = this.nodeAtIndex(index);
            if (node === null) {
                return undefined;
            }
            return node.element;
        };
        LinkedList.prototype.indexOf = function (item, equalsFunction) {
            var equalsF = equalsFunction || Collections.defaultEquals;
            if (Collections.isUndefined(item)) {
                return -1;
            }
            var currentNode = this._firstNode;
            var index = 0;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    return index;
                }
                index++;
                currentNode = currentNode.next;
            }
            return -1;
        };
        LinkedList.prototype.previous = function (item, equalsFunction) {
            var equalsF = equalsFunction || Collections.defaultEquals;
            if (Collections.isUndefined(item)) {
                return null;
            }
            var currentNode = this._firstNode;
            var prevNode = null;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    return prevNode != null ? prevNode.element : null;
                }
                prevNode = currentNode;
                currentNode = currentNode.next;
            }
            return null;
        };
        LinkedList.prototype.next = function (item, equalsFunction) {
            var equalsF = equalsFunction || Collections.defaultEquals;
            if (Collections.isUndefined(item)) {
                return null;
            }
            var currentNode = this._firstNode;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    var next = currentNode.next;
                    return next != undefined && next != null ? next.element : null;
                }
                currentNode = currentNode.next;
            }
            return null;
        };
        LinkedList.prototype.contains = function (item, equalsFunction) {
            return (this.indexOf(item, equalsFunction) >= 0);
        };
        LinkedList.prototype.remove = function (item, equalsFunction) {
            var equalsF = equalsFunction || Collections.defaultEquals;
            if (this._nElements < 1 || Collections.isUndefined(item)) {
                return false;
            }
            var previous = null;
            var currentNode = this._firstNode;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    if (currentNode === this._firstNode) {
                        if ((this._firstNode = this._firstNode.next) != null)
                            this._firstNode.prev = null;
                        if (currentNode === this._lastNode)
                            this._lastNode = null;
                    }
                    else if (currentNode === this._lastNode) {
                        this._lastNode = previous;
                        previous.next = null;
                    }
                    else {
                        previous.next = currentNode.next;
                        previous.next.prev = previous;
                    }
                    currentNode.element = null;
                    this._nElements--;
                    this._nodePool.returnItem(currentNode);
                    return true;
                }
                previous = currentNode;
                currentNode = currentNode.next;
            }
            return false;
        };
        LinkedList.prototype.clear = function () {
            var currentNode = this._firstNode;
            while (currentNode != null) {
                this._nodePool.returnItem(currentNode);
                currentNode.element = null;
                currentNode = currentNode.next;
            }
            this._firstNode = null;
            this._lastNode = null;
            this._nElements = 0;
        };
        LinkedList.prototype.equals = function (other, equalsFunction) {
            var eqF = equalsFunction || Collections.defaultEquals;
            if (!(other instanceof LinkedList)) {
                return false;
            }
            if (this.size != other.size) {
                return false;
            }
            return this.equalsAux(this._firstNode, other._firstNode, eqF);
        };
        LinkedList.prototype.equalsAux = function (n1, n2, eqF) {
            while (n1 !== null) {
                if (!eqF(n1.element, n2.element)) {
                    return false;
                }
                n1 = n1.next;
                n2 = n2.next;
            }
            return true;
        };
        LinkedList.prototype.removeElementAtIndex = function (index) {
            if (index < 0 || index >= this._nElements) {
                return undefined;
            }
            return this.removeNode(this.nodeAtIndex(index));
        };
        LinkedList.prototype.removeNode = function (node) {
            if (node == this._firstNode) {
                this._firstNode = node.next;
                if (this._firstNode != null)
                    this._firstNode.prev = null;
            }
            else if (node == this._lastNode) {
                this._lastNode = node.prev;
                this._lastNode.next = null;
            }
            else {
                node.prev.next = node.next;
                node.next.prev = node.prev;
            }
            this._nElements--;
            var element = node.element;
            node.element = null;
            this._nodePool.returnItem(node);
            return element;
        };
        LinkedList.prototype.forEach = function (callback, thisContext) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var currentNode = this._firstNode;
            while (currentNode !== null) {
                var nextNode = currentNode.next;
                if (!callback.call(thisContext, currentNode.element, currentNode, args))
                    break;
                currentNode = nextNode;
            }
        };
        LinkedList.prototype.reverse = function () {
            var previous = null;
            var current = this._firstNode;
            var temp = null;
            while (current !== null) {
                temp = current.next;
                current.next = previous;
                previous = current;
                current = temp;
            }
            temp = this._firstNode;
            this._firstNode = this._lastNode;
            this._lastNode = temp;
        };
        LinkedList.prototype.toArray = function () {
            var array = [];
            var currentNode = this._firstNode;
            while (currentNode !== null) {
                array.push(currentNode.element);
                currentNode = currentNode.next;
            }
            return array;
        };
        Object.defineProperty(LinkedList.prototype, "size", {
            get: function () {
                return this._nElements;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinkedList.prototype, "isEmpty", {
            get: function () {
                return this._nElements <= 0;
            },
            enumerable: true,
            configurable: true
        });
        LinkedList.prototype.toString = function () {
            return this.toArray().toString();
        };
        LinkedList.prototype.nodeAtIndex = function (index) {
            if (index < 0 || index >= this._nElements) {
                return null;
            }
            if (index === (this._nElements - 1)) {
                return this._lastNode;
            }
            var node = this._firstNode;
            for (var i = 0; i < index; i++) {
                node = node.next;
            }
            return node;
        };
        LinkedList.prototype.createNode = function (item) {
            var node = this._nodePool.getItem();
            node.element = item;
            node.next = null;
            node.prev = null;
            return node;
        };
        return LinkedList;
    }());
    Collections.LinkedList = LinkedList;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    var Pool = (function () {
        function Pool(itemType, defSize, canGrow, itemCreateFnc, itemCreateFncCtx) {
            if (defSize === void 0) { defSize = 0; }
            if (canGrow === void 0) { canGrow = true; }
            if (itemCreateFnc === void 0) { itemCreateFnc = null; }
            this._itemType = itemType;
            this._itemCreateFnc = itemCreateFnc;
            this._itemCreateFncCtx = itemCreateFncCtx;
            this._canGrow = canGrow;
            this._pool = [];
            this._count = 0;
            this._allocatedItemCnt = 0;
            while (defSize-- != 0) {
                this._pool.push(this.newItem());
                this._count++;
            }
        }
        Object.defineProperty(Pool.prototype, "count", {
            get: function () { return this._count; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "canGrow", {
            get: function () { return this._canGrow; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pool.prototype, "allocatedItemCnt", {
            get: function () { return this._allocatedItemCnt; },
            enumerable: true,
            configurable: true
        });
        Pool.prototype.getItem = function () {
            if (this._count == 0) {
                return (this._canGrow ? this.newItem() : null);
            }
            else {
                var item = this._pool[--this._count];
                this._pool[this._count] = null;
                return item;
            }
        };
        Pool.prototype.returnItem = function (item) {
            this._pool[this._count++] = item;
        };
        Pool.prototype.newItem = function () {
            this._allocatedItemCnt++;
            if (this._itemCreateFnc != null) {
                return this._itemCreateFnc.call(this._itemCreateFncCtx, this._count);
            }
            else {
                return new this._itemType();
            }
        };
        return Pool;
    }());
    Collections.Pool = Pool;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    Collections.has = function (obj, prop) {
        return _hasOwnProperty.call(obj, prop);
    };
    function defaultCompare(a, b) {
        if (a < b) {
            return -1;
        }
        else if (a === b) {
            return 0;
        }
        else {
            return 1;
        }
    }
    Collections.defaultCompare = defaultCompare;
    function defaultEquals(a, b) {
        return a === b;
    }
    Collections.defaultEquals = defaultEquals;
    function defaultToString(item) {
        if (item === null) {
            return 'COLLECTION_NULL';
        }
        else if (isUndefined(item)) {
            return 'COLLECTION_UNDEFINED';
        }
        else if (isString(item)) {
            return '$s' + item;
        }
        else {
            return '$o' + item.toString();
        }
    }
    Collections.defaultToString = defaultToString;
    function makeString(item, join) {
        if (join === void 0) { join = ','; }
        if (item === null) {
            return 'COLLECTION_NULL';
        }
        else if (isUndefined(item)) {
            return 'COLLECTION_UNDEFINED';
        }
        else if (isString(item)) {
            return item.toString();
        }
        else {
            var toret = '{';
            var first = true;
            for (var prop in item) {
                if (Collections.has(item, prop)) {
                    if (first) {
                        first = false;
                    }
                    else {
                        toret = toret + join;
                    }
                    toret = toret + prop + ':' + item[prop];
                }
            }
            return toret + '}';
        }
    }
    Collections.makeString = makeString;
    function isFunction(func) {
        return (typeof func) === 'function';
    }
    Collections.isFunction = isFunction;
    function isUndefined(obj) {
        return (typeof obj) === 'undefined';
    }
    Collections.isUndefined = isUndefined;
    function isString(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    }
    Collections.isString = isString;
    function reverseCompareFunction(compareFunction) {
        if (!isFunction(compareFunction)) {
            return function (a, b) {
                if (a < b) {
                    return 1;
                }
                else if (a === b) {
                    return 0;
                }
                else {
                    return -1;
                }
            };
        }
        else {
            return function (d, v) {
                return compareFunction(d, v) * -1;
            };
        }
    }
    Collections.reverseCompareFunction = reverseCompareFunction;
    function compareToEquals(compareFunction) {
        return function (a, b) {
            return compareFunction(a, b) === 0;
        };
    }
    Collections.compareToEquals = compareToEquals;
})(Collections || (Collections = {}));
var Collections;
(function (Collections) {
    var WrappedArray = (function () {
        function WrappedArray() {
            this._array = [];
            this._firstItemId = 0;
            this._itemCnt = 0;
        }
        Object.defineProperty(WrappedArray.prototype, "itemCnt", {
            get: function () {
                return this._itemCnt;
            },
            enumerable: true,
            configurable: true
        });
        WrappedArray.prototype.addItem = function (item, atTheEnd) {
            if (atTheEnd === void 0) { atTheEnd = true; }
            this.ensureSpaceForNewItem(atTheEnd);
            var itemId;
            if (atTheEnd) {
                itemId = this.itemId2ItemArrayPos(this._itemCnt);
            }
            else {
                if (this._itemCnt != 0) {
                    itemId = this._firstItemId - 1;
                    if (itemId < 0)
                        itemId = this._array.length - 1;
                }
                else {
                    itemId = 0;
                }
                this._firstItemId = itemId;
            }
            this._array[itemId] = item;
            this._itemCnt++;
            return item;
        };
        WrappedArray.prototype.removeItem = function (atTheEnd) {
            if (atTheEnd === void 0) { atTheEnd = true; }
            var item = null;
            if (this._itemCnt != 0) {
                if (atTheEnd) {
                    var itemId = this.itemId2ItemArrayPos(this._itemCnt - 1);
                    item = this._array[itemId];
                    this._array[itemId] = null;
                }
                else {
                    item = this._array[this._firstItemId];
                    this._array[this._firstItemId] = null;
                    if (++this._firstItemId == this._array.length)
                        this._firstItemId = 0;
                }
                this._itemCnt--;
            }
            return item;
        };
        WrappedArray.prototype.clear = function () {
            var itemCnt = this._itemCnt;
            var itemId = this._firstItemId;
            while (itemCnt-- != 0) {
                this._array[itemId] = null;
                if (++itemId == this._array.length)
                    itemId = 0;
            }
            this._firstItemId = 0;
            this._itemCnt = 0;
        };
        WrappedArray.prototype.getItemAtIndex = function (itemId) {
            if (itemId >= this._itemCnt)
                return null;
            return this._array[this.itemId2ItemArrayPos(itemId)];
        };
        WrappedArray.prototype.getLastItem = function () {
            return this.getItemAtIndex(this._itemCnt - 1);
        };
        WrappedArray.prototype.ensureSpaceForNewItem = function (atTheEnd) {
            if (this._itemCnt < this._array.length)
                return;
            if (this._itemCnt != 0) {
                if (this._firstItemId != 0) {
                    this._array = this.toArray();
                    this._firstItemId = 0;
                }
                if (!atTheEnd) {
                    this._array.unshift(null);
                    this._firstItemId = 1;
                    return;
                }
            }
            this._array.push(null);
        };
        WrappedArray.prototype.toArray = function () {
            var newArray = [];
            var oldArray = this._array;
            var itemCnt = this._itemCnt;
            var itemId = this._firstItemId;
            while (itemCnt-- != 0) {
                newArray.push(oldArray[itemId]);
                if (++itemId == this._array.length)
                    itemId = 0;
            }
            return newArray;
        };
        WrappedArray.prototype.itemId2ItemArrayPos = function (itemId) {
            itemId += this._firstItemId;
            if (itemId >= this._array.length)
                itemId -= this._array.length;
            return itemId;
        };
        return WrappedArray;
    }());
    Collections.WrappedArray = WrappedArray;
})(Collections || (Collections = {}));
var Controls;
(function (Controls) {
    var Button = (function () {
        function Button(id, type, x, y, content, fixedToCamera, states, parent) {
            if (fixedToCamera === void 0) { fixedToCamera = true; }
            this._id = id;
            this._type = type;
            this._states = (states != undefined && states != null ? states : type.states);
            this._state = 0;
            this._onClick = new Phaser.Signal();
            if (parent == undefined)
                parent = type.layer;
            this._container = Game.Global.game.add.group(parent);
            this._container.fixedToCamera = fixedToCamera;
            this._image = this.createImage(this._container, this._states);
            this._image.anchor.copyFrom(type.anchor);
            this._image.inputEnabled = true;
            this._image.input.priorityID = 100;
            this._image.events.onInputDown.add(this.handlePointerDown, this, 0);
            this._image.events.onInputUp.add(this.handlePointerUp, this, 0);
            this.x = x;
            this.y = y;
            if (content != undefined && content != null) {
                this._content = content;
                this._container.addChild(this._content);
                this.updateContentPos();
            }
            else {
                this._content = null;
            }
        }
        Object.defineProperty(Button.prototype, "id", {
            get: function () { return this._id; },
            set: function (id) { this._id = id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "type", {
            get: function () { return this._type; },
            set: function (type) {
                this._type = type;
                this._image.anchor.copyFrom(type.anchor);
                if (type.states != undefined) {
                    var prevStates = this._states;
                    var state = this._state;
                    this._states = type.states;
                    if (prevStates[state].texture != this._states[state].texture) {
                        this._image.loadTexture(this._states[state].texture, this._states[state].frame);
                    }
                    else if (prevStates[this._state].frame != this._states[state].frame) {
                        this._image.frameName = this._states[state].frame;
                    }
                }
                this.updateContentPos();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "onClick", {
            get: function () { return this._onClick; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "content", {
            get: function () { return this._content; },
            set: function (content) {
                if (this._content != null)
                    this._container.removeChild(this._content);
                if (content == undefined)
                    content = null;
                this._content = content;
                if (this._content != null) {
                    this._container.addChild(this._content);
                    this.updateContentPos();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "x", {
            get: function () {
                return this._container.fixedToCamera ? this._container.cameraOffset.x : this._container.x + (this._container.parent ? this._container.parent.x : 0);
            },
            set: function (x) {
                if (this._container.fixedToCamera)
                    this._container.cameraOffset.x = x;
                else
                    this._container.x = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "y", {
            get: function () { return this._container.fixedToCamera ? this._container.cameraOffset.y : this._container.y; },
            set: function (y) {
                if (this._container.fixedToCamera)
                    this._container.cameraOffset.y = y;
                else
                    this._container.y = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "width", {
            get: function () { return this._image.width; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "height", {
            get: function () { return this._image.height; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "visible", {
            get: function () { return this._container.visible; },
            set: function (visible) { this._container.visible = visible; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "enabled", {
            get: function () { return this._state != 2; },
            set: function (value) {
                if (this.enabled != value) {
                    this._image.inputEnabled = value;
                    this.setState(value ? 0 : 2);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "state", {
            get: function () { return this._state; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "pressed", {
            get: function () { return this._state == 1; },
            enumerable: true,
            configurable: true
        });
        Button.prototype.setState = function (state) {
            if (this._state == state)
                return;
            if (this._states[this._state].texture != this._states[state].texture) {
                this._image.loadTexture(this._states[state].texture, this._states[state].frame);
            }
            else if (this._states[this._state].frame != this._states[state].frame) {
                this._image.frameName = this._states[state].frame;
            }
            this._state = state;
            this.updateContentPos();
        };
        Button.prototype.updateContentPos = function () {
            if (this._content == null)
                return;
            var anchor = this._type.contentAnchor;
            this._content.position.set(this._image.x + this._states[this._state].contentOffsetX + Math.round(this._image.width * anchor.x), this._image.y + this._states[this._state].contentOffsetY + Math.round(this._image.height * anchor.y));
        };
        Button.prototype.handlePointerDown = function () {
            if (this._state != 0)
                return true;
            this.setState(1);
            return false;
        };
        Button.prototype.handlePointerUp = function (img, pointer, isOver) {
            if (this._state != 1)
                return;
            this.setState(0);
            if (isOver) {
                this._onClick.dispatch(this);
                this._type.onClick.dispatch(this);
            }
        };
        Button.prototype.createImage = function (container, states) {
            return Game.Global.game.add.image(0, 0, states[0].texture, states[0].frame, container);
        };
        return Button;
    }());
    Controls.Button = Button;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var ButtonState = (function () {
        function ButtonState(texture, frame, contentOffsetX, contentOffsetY) {
            if (frame === void 0) { frame = null; }
            if (contentOffsetX === void 0) { contentOffsetX = 0; }
            if (contentOffsetY === void 0) { contentOffsetY = 0; }
            this._texture = texture;
            this._frame = frame;
            this._contentOffsetX = contentOffsetX;
            this._contentOffsetY = contentOffsetY;
        }
        Object.defineProperty(ButtonState.prototype, "texture", {
            get: function () { return this._texture; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonState.prototype, "frame", {
            get: function () { return this._frame; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonState.prototype, "contentOffsetX", {
            get: function () { return this._contentOffsetX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonState.prototype, "contentOffsetY", {
            get: function () { return this._contentOffsetY; },
            enumerable: true,
            configurable: true
        });
        return ButtonState;
    }());
    Controls.ButtonState = ButtonState;
    var ButtonType = (function () {
        function ButtonType(anchor, states, contentAnchor, layer) {
            if (states === void 0) { states = null; }
            this._states = states;
            this._anchor = anchor ? anchor : new Phaser.Point();
            this._contentAnchor = contentAnchor ? contentAnchor : new Phaser.Point(0.5, 0.5);
            this._layer = layer;
            this._onClick = new Phaser.Signal();
        }
        Object.defineProperty(ButtonType.prototype, "layer", {
            get: function () { return this._layer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonType.prototype, "anchor", {
            get: function () { return this._anchor; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonType.prototype, "states", {
            get: function () { return this._states; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonType.prototype, "contentAnchor", {
            get: function () { return this._contentAnchor; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ButtonType.prototype, "onClick", {
            get: function () { return this._onClick; },
            enumerable: true,
            configurable: true
        });
        return ButtonType;
    }());
    Controls.ButtonType = ButtonType;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var FiveStepsValue = (function () {
        function FiveStepsValue(parent, title, locked) {
            if (locked === void 0) { locked = false; }
            var add = Game.Global.game.add;
            this._container = add.group(parent);
            if (!locked) {
                var btnType = new Controls.ButtonType(new Phaser.Point(0, 0), [
                    new Controls.ButtonState("atlas_A", "btnMinus_0"),
                    new Controls.ButtonState("atlas_A", "btnMinus_1"),
                    new Controls.ButtonState("atlas_A", "btnMinus_0")
                ], null, this._container);
                this._minusBtn = new Controls.Button(0, btnType, 0, 0, null, false);
                this._minusBtn.onClick.add(this.handleBtnMinusClick, this);
            }
            var x = (locked ? 0 : this._minusBtn.width + FiveStepsValue.BUTTONS_MARGIN);
            this._barBg = add.image(x, 0, "atlas_A", "fiveStageProgBarBg", this._container);
            if (!locked) {
                var btnType = new Controls.ButtonType(new Phaser.Point(0, 0), [
                    new Controls.ButtonState("atlas_A", "btnPlus_0"),
                    new Controls.ButtonState("atlas_A", "btnPlus_1"),
                    new Controls.ButtonState("atlas_A", "btnPlus_0")
                ], null, this._container);
                this._plusBtn = new Controls.Button(1, btnType, this._barBg.x + this._barBg.width + FiveStepsValue.BUTTONS_MARGIN, 0, null, false);
                this._plusBtn.onClick.add(this.handleBtnPlusClick, this);
            }
            x += 2;
            this._barFill = [];
            for (var i = 0; i < FiveStepsValue.STEP_CNT; i++) {
                var img = add.image(x, 2, "atlas_A", "fiveStageProgBarFill", this._container);
                img.visible = false;
                this._barFill.push(img);
                x += FiveStepsValue.BAR_FILL_STEP;
            }
            this._title = add.bitmapText(0, 0, "fntWhite30", "", 30);
            this._container.add(this._title);
            this.title = title;
            this._value = 0;
            this._enabled = true;
        }
        Object.defineProperty(FiveStepsValue.prototype, "value", {
            get: function () { return this._value; },
            set: function (val) {
                if (val > FiveStepsValue.STEP_CNT)
                    val = FiveStepsValue.STEP_CNT;
                if (this._value != val) {
                    if (this._value < val) {
                        while (this._value < val) {
                            this._barFill[this._value++].visible = true;
                        }
                    }
                    else {
                        while (this._value > val) {
                            this._barFill[--this._value].visible = false;
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FiveStepsValue.prototype, "title", {
            get: function () { return this._title.text; },
            set: function (title) {
                this._title.text = title;
                this._title.position.set(this._barBg.x + Math.round((this._barBg.width - this._title.width) / 2), -2 + Math.round((this._barBg.height - this._title.height) / 2));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FiveStepsValue.prototype, "x", {
            get: function () { return this._container.x; },
            set: function (x) { this._container.x = x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FiveStepsValue.prototype, "y", {
            get: function () { return this._container.y; },
            set: function (y) { this._container.y = y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FiveStepsValue.prototype, "width", {
            get: function () { return this._container.width; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FiveStepsValue.prototype, "height", {
            get: function () { return this._container.height; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FiveStepsValue.prototype, "enabled", {
            get: function () { return this._enabled; },
            set: function (enabled) {
                if (enabled != this._enabled) {
                    this._enabled = enabled;
                    this._minusBtn.enabled = enabled;
                    this._plusBtn.enabled = enabled;
                }
            },
            enumerable: true,
            configurable: true
        });
        FiveStepsValue.prototype.setPosition = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        FiveStepsValue.prototype.setValue = function (value) {
            this.value = value;
            return this;
        };
        FiveStepsValue.prototype.handleBtnPlusClick = function () {
            Game.AudioUtils.playSound("click");
            if (this._value < FiveStepsValue.STEP_CNT) {
                this.value++;
            }
        };
        FiveStepsValue.prototype.handleBtnMinusClick = function () {
            Game.AudioUtils.playSound("click");
            if (this._value > 0) {
                this.value--;
            }
        };
        FiveStepsValue.STEP_CNT = 5;
        FiveStepsValue.BUTTONS_MARGIN = 10;
        FiveStepsValue.BAR_FILL_STEP = 80;
        return FiveStepsValue;
    }());
    Controls.FiveStepsValue = FiveStepsValue;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var ListBox = (function () {
        function ListBox(x, y, width, height, vertical, itemSize, itemPadding, itemCreateFnc, itemCreateFncCtx, parent) {
            this._content = null;
            this._width = width;
            this._height = height;
            this._containerMask = new Phaser.Graphics(Game.Global.game, 0, 0);
            parent.addChild(this._containerMask);
            this._container = new Phaser.Group(Game.Global.game, parent);
            this._container.position.set(x, y);
            this._container.mask = this._containerMask;
            parent = this._container.parent;
            this.updateContainerMask();
            this._viewOffset = 0;
            this._vertical = vertical;
            this._itemSize = itemSize;
            this._itemPadding = itemPadding;
            this._itemCreateFnc = itemCreateFnc;
            this._itemCreateFncCtx = itemCreateFncCtx;
            this._actItems = new Collections.WrappedArray();
            this._inactItems = new Collections.Pool(undefined, 0, true, function () {
                return this._itemCreateFnc.call(this._itemCreateFncCtx, this);
            }, this);
            this._scrolling = new KineticScrolling.Scrolling(false, true);
            this._scrolling.area = new Phaser.Rectangle(x, y, width, height);
            this._scrolling.onPosChange.add(this.scrollingPosChanged, this);
        }
        Object.defineProperty(ListBox.prototype, "container", {
            get: function () { return this._container; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "visibleItems", {
            get: function () { return this._actItems; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "vertical", {
            get: function () { return this._vertical; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (width) {
                if (this._width != width) {
                    this._width = width;
                    this.updateContainerMask();
                    this.updateScrollBarPosAndSize();
                    this._scrolling.area.width = width;
                    if (this._vertical) {
                        this.reportNewSize(width);
                    }
                    else {
                        this.refill();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (height) {
                if (this._height != height) {
                    this._height = height;
                    this.updateContainerMask();
                    this.updateScrollBarPosAndSize();
                    this._scrolling.area.height = height;
                    if (this._vertical) {
                        this.refill();
                    }
                    else {
                        this.reportNewSize(height);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "x", {
            get: function () { return this._container.x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "y", {
            get: function () { return this._container.y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "content", {
            get: function () { return this._content; },
            set: function (content) {
                this._content = content;
                this.updateScrollBarPosAndSize();
                this.fill();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "contentHeight", {
            get: function () {
                if (this._content == null)
                    return 0;
                return (this._content.length * (this._itemSize + this._itemPadding)) - this._itemPadding;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBox.prototype, "viewOffset", {
            get: function () { return this._viewOffset; },
            set: function (offset) {
                if (offset < 0) {
                    offset = 0;
                }
                else if (offset > this.contentHeight - this._height) {
                    offset = this.contentHeight - this._height;
                }
                this.moveView(offset - this._viewOffset);
            },
            enumerable: true,
            configurable: true
        });
        ListBox.prototype.getItemOffset = function (itemId) {
            return (this._itemSize + this._itemPadding) * itemId;
        };
        ListBox.prototype.activate = function () {
            this._scrolling.activate();
        };
        ListBox.prototype.deactivate = function () {
            this._scrolling.deactivate();
        };
        ListBox.prototype.update = function () {
            var i = this._actItems.itemCnt;
            while (i-- != 0)
                this._actItems.getItemAtIndex(i).update();
            this._scrolling.update();
        };
        ListBox.prototype.setPosition = function (x, y) {
            this._container.position.set(x, y);
            this.updateContainerMask();
            this.updateScrollBarPosAndSize();
            this._scrolling.area.x = x;
            this._scrolling.area.y = y;
        };
        ListBox.prototype.moveView = function (offset) {
            if (this._actItems.itemCnt == 0)
                return;
            var viewOffset = this._viewOffset + offset;
            var itemSize = this._itemSize + this._itemPadding;
            if (offset < 0) {
                if (viewOffset < 0) {
                    viewOffset = 0;
                }
            }
            else {
                var contentSize = this._content.length * itemSize - this._itemPadding;
                if (viewOffset + this._height > contentSize)
                    viewOffset = Math.max(0, contentSize - this._height);
            }
            if (Math.floor(this._viewOffset) == Math.floor(viewOffset))
                return;
            offset = Math.floor(viewOffset) - Math.floor(this._viewOffset);
            this.setViewOffset(viewOffset);
            var itemId = this._actItems.itemCnt;
            while (itemId-- != 0) {
                var pos = this._actItems.getItemAtIndex(itemId).move(-offset);
                if (offset > 0) {
                    if (pos <= -this._itemSize) {
                        this._inactItems.returnItem(this._actItems.removeItem(false).deactivate());
                    }
                }
                else if (pos >= this._height) {
                    this._inactItems.returnItem(this._actItems.removeItem().deactivate());
                }
            }
            if (this._actItems.itemCnt != 0) {
                if (offset > 0) {
                    var item = this._actItems.getLastItem();
                    var nextItemY = item.pos + itemSize;
                    while (nextItemY < this._height) {
                        var nextItemId = item.contentId + 1;
                        item = this._inactItems.getItem();
                        item.activate(nextItemId, nextItemY, this._content[nextItemId]);
                        this._actItems.addItem(item);
                        nextItemY += itemSize;
                    }
                }
                else {
                    var item = this._actItems.getItemAtIndex(0);
                    var nextItemPos = item.pos - itemSize;
                    while (nextItemPos > -this._itemSize) {
                        var nextItemId = item.contentId - 1;
                        item = this._inactItems.getItem();
                        item.activate(nextItemId, nextItemPos, this._content[nextItemId]);
                        this._actItems.addItem(item, false);
                        nextItemPos -= itemSize;
                    }
                }
            }
            else {
                itemId = Math.floor(viewOffset / itemSize);
                var itemY = -(viewOffset % itemSize);
                while (itemY < this._height) {
                    this._actItems.addItem(this._inactItems.getItem().activate(itemId, itemY, this._content[itemId]));
                    itemId++;
                    itemY += itemSize;
                }
            }
        };
        ListBox.prototype.updateContainerMask = function () {
            var mask = this._containerMask;
            mask.clear();
            mask.beginFill(0, 1);
            mask.drawRect(this._container.x, this._container.y, this._width, this._height);
            mask.endFill();
        };
        ListBox.prototype.reportNewSize = function (size) {
            var id = this._actItems.itemCnt;
            while (id-- != 0)
                this._actItems.getItemAtIndex(id).onSizeChanged(size);
        };
        ListBox.prototype.setViewOffset = function (offset) {
            this._viewOffset = offset;
            this.updateScrollBarThumbPos();
        };
        ListBox.prototype.scrollingPosChanged = function (deltaX, deltaY) {
            this.moveView(-(this._vertical ? deltaY : deltaX));
        };
        ListBox.prototype.fill = function () {
            var itemId = this._actItems.itemCnt;
            while (itemId-- != 0) {
                this._inactItems.returnItem(this._actItems.getItemAtIndex(itemId).deactivate());
            }
            this._actItems.clear();
            if (this._content != null) {
                var contentCnt = this._content.length;
                var itemPos = 0;
                var viewSize = (this._vertical ? this._height : this._width);
                itemId = 0;
                while (itemId < contentCnt && itemPos < viewSize) {
                    var item = this._inactItems.getItem();
                    item.activate(itemId, itemPos, this._content[itemId]);
                    this._actItems.addItem(item);
                    itemId++;
                    itemPos += this._itemSize + this._itemPadding;
                }
            }
            this.setViewOffset(0);
        };
        ListBox.prototype.refill = function () {
            if (this._actItems.itemCnt == 0)
                return;
            var itemSize = this._itemSize + this._itemPadding;
            var fItem = this._actItems.getItemAtIndex(0);
            var lItem = this._actItems.getLastItem();
            var lItemId = lItem.contentId;
            var lItemNewId = Math.floor((Math.floor(this._viewOffset) + (this._vertical ? this._height : this._width) - 1) / itemSize);
            if (lItemNewId == lItemId)
                return;
            if (lItemNewId < lItemId) {
                while (lItemNewId != lItemId) {
                    this._inactItems.returnItem(this._actItems.removeItem().deactivate());
                    lItemId--;
                }
                return;
            }
            var lItemMaxId = this._content.length - 1;
            var lItemPos = lItem.pos + itemSize;
            while (lItemId < lItemNewId && lItemId < lItemMaxId) {
                lItemId++;
                this._actItems.addItem(this._inactItems.getItem().activate(lItemId, lItemPos, this._content[lItemId]));
                lItemPos += itemSize;
            }
            if (lItemId != lItemNewId) {
                var offset = -fItem.pos;
                if (fItem.contentId != 0)
                    offset += fItem.contentId * itemSize;
                if (offset > 0) {
                    offset = Math.min(offset, this._height - (lItemPos - this._itemPadding));
                    var itemId = this._actItems.itemCnt;
                    while (itemId-- != 0)
                        this._actItems.getItemAtIndex(itemId).move(offset);
                    this.setViewOffset(Math.floor(this._viewOffset) - offset);
                    var fItemY = fItem.pos;
                    var fItemId = fItem.contentId;
                    if (fItemY > this._itemPadding) {
                        fItemId--;
                        fItemY -= itemSize;
                        this._actItems.addItem(this._inactItems.getItem().activate(fItemId, fItemY, this._content[fItemId]), false);
                    }
                }
            }
        };
        Object.defineProperty(ListBox.prototype, "scrollBar", {
            get: function () { return this._scrollBar; },
            enumerable: true,
            configurable: true
        });
        ListBox.prototype.connectScrollBar = function (scrollBar, offset) {
            this._scrollBar = scrollBar;
            this._scrollBarOffset = offset;
            this.updateScrollBarPosAndSize();
            this.updateScrollBarThumbPos();
        };
        ListBox.prototype.updateScrollBarPosAndSize = function () {
            var scrollBar = this._scrollBar;
            if (scrollBar != undefined && scrollBar != null) {
                var thumbSize = Math.min(1, this._height / this.contentHeight);
                scrollBar.x = this._container.x + this.width + this._scrollBarOffset;
                scrollBar.y = this._container.y;
                scrollBar.height = this._height;
                scrollBar.thumbSize = thumbSize;
                scrollBar.visible = thumbSize > 0 && thumbSize < 1;
            }
        };
        ListBox.prototype.updateScrollBarThumbPos = function () {
            var scrollBar = this._scrollBar;
            if (scrollBar != undefined && scrollBar != null) {
                var contentHeight = this.contentHeight;
                scrollBar.thumbPosition = (contentHeight != 0 ? this._viewOffset / (contentHeight - this._height) : 0);
            }
        };
        return ListBox;
    }());
    Controls.ListBox = ListBox;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var ListBoxItemBase = (function () {
        function ListBoxItemBase(listbox) {
            this._listbox = listbox;
            this._container = new Phaser.Group(Game.Global.game, listbox.container);
            this._container.visible = false;
            this._container.exists = false;
        }
        Object.defineProperty(ListBoxItemBase.prototype, "contentId", {
            get: function () { return this._contentId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBoxItemBase.prototype, "content", {
            get: function () { return this._content; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBoxItemBase.prototype, "pos", {
            get: function () {
                return (this._listbox.vertical ? this._container.y : this._container.x);
            },
            set: function (pos) {
                if (this._listbox.vertical) {
                    this._container.y = pos;
                }
                else {
                    this._container.x = pos;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBoxItemBase.prototype, "enabled", {
            get: function () { return this._enabled; },
            set: function (enabled) {
                if (this._enabled != enabled) {
                    this._enabled = enabled;
                    this.onEnabledChanged(enabled);
                }
            },
            enumerable: true,
            configurable: true
        });
        ListBoxItemBase.prototype.getWidth = function () {
            return this._container.width;
        };
        ListBoxItemBase.prototype.getHeight = function () {
            return this._container.height;
        };
        ListBoxItemBase.prototype.move = function (offset) {
            this._container.y += offset;
            return this._container.y;
        };
        ListBoxItemBase.prototype.activate = function (id, pos, content) {
            this._contentId = id;
            this.pos = pos;
            this._content = content;
            this._container.visible = true;
            this._container.exists = true;
            return this;
        };
        ListBoxItemBase.prototype.deactivate = function () {
            this._container.visible = false;
            this._container.exists = false;
            return this;
        };
        ListBoxItemBase.prototype.update = function () {
        };
        ListBoxItemBase.prototype.onSizeChanged = function (newSize) {
        };
        ListBoxItemBase.prototype.onEnabledChanged = function (enabled) {
        };
        return ListBoxItemBase;
    }());
    Controls.ListBoxItemBase = ListBoxItemBase;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var ScrollBarBase = (function () {
        function ScrollBarBase(container, fixedSize, vertical) {
            this._container = container;
            this._vertical = vertical;
            this._width = vertical ? fixedSize : 0;
            this._height = vertical ? 0 : fixedSize;
            this._thumbPos = 0;
            this._thumbSize = 0;
        }
        Object.defineProperty(ScrollBarBase.prototype, "vertical", {
            get: function () { return this._vertical; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "x", {
            get: function () { return this._container.x; },
            set: function (x) { this._container.x = x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "y", {
            get: function () { return this._container.y; },
            set: function (y) { this._container.y = y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "width", {
            get: function () { return this._width; },
            set: function (width) {
                this._width = width;
                this.updateWidth(width);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "height", {
            get: function () { return this._height; },
            set: function (height) {
                this._height = height;
                this.updateHeight(height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "visible", {
            get: function () { return this._container.visible; },
            set: function (visible) { this._container.visible = visible; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "thumbPosition", {
            get: function () {
                return this._thumbPos;
            },
            set: function (position) {
                if (position < 0) {
                    position = 0;
                }
                else if (position > 1) {
                    position = 1;
                }
                if (this._thumbPos != position) {
                    this._thumbPos = position;
                    this.updateThumbPos();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBarBase.prototype, "thumbSize", {
            get: function () {
                return this._thumbSize;
            },
            set: function (size) {
                if (size > 1)
                    size = 1;
                this._thumbSize = size;
                this.updateThumbSize();
            },
            enumerable: true,
            configurable: true
        });
        ScrollBarBase.prototype.getThumbPosInPixels = function () {
            return (this._vertical ? (this._height - (this._thumbSize * this._height)) * this._thumbPos : (this._width - (this._thumbSize * this._width)) * this._thumbPos);
        };
        ScrollBarBase.prototype.validSettings = function () {
            return this._width > 0 && this._height > 0 && this._thumbSize > 0;
        };
        return ScrollBarBase;
    }());
    Controls.ScrollBarBase = ScrollBarBase;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var SelectionBox = (function () {
        function SelectionBox(parent, content, titleProp, selItemId) {
            var add = Game.Global.game.add;
            this._onSelectionChange = new Phaser.Signal();
            this._content = content;
            this._contentTitleProp = titleProp;
            this._selItemId = selItemId;
            this._container = add.group(parent);
            var btnType = new Controls.ButtonType(new Phaser.Point(0, 0), [
                new Controls.ButtonState("atlas_A", "btnPrev_0"),
                new Controls.ButtonState("atlas_A", "btnPrev_1")
            ], null, this._container);
            this._btnPrev = new Controls.Button(0, btnType, 0, 0, null, false);
            this._btnPrev.onClick.add(this.handleBtnClick, this);
            btnType = new Controls.ButtonType(new Phaser.Point(0, 0), [
                new Controls.ButtonState("atlas_A", "btnNext_0"),
                new Controls.ButtonState("atlas_A", "btnNext_1")
            ], null, this._container);
            this._btnNext = new Controls.Button(1, btnType, 487, 0, null, false);
            this._btnNext.onClick.add(this.handleBtnClick, this);
            this._title = add.bitmapText(0, 0, "fntWhite30", "", 30);
            this._container.add(this._title);
            this.setTitle();
        }
        Object.defineProperty(SelectionBox.prototype, "selectedItem", {
            get: function () { return this._content[this._selItemId]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionBox.prototype, "x", {
            get: function () { return this._container.x; },
            set: function (x) { this._container.x = x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionBox.prototype, "y", {
            get: function () { return this._container.y; },
            set: function (y) { this._container.y = y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionBox.prototype, "width", {
            get: function () { return SelectionBox.WIDTH; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionBox.prototype, "height", {
            get: function () { return SelectionBox.HEIGHT; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionBox.prototype, "onSelectionChange", {
            get: function () { return this._onSelectionChange; },
            enumerable: true,
            configurable: true
        });
        SelectionBox.prototype.setTitle = function () {
            this._title.text = this._content[this._selItemId][this._contentTitleProp].toUpperCase();
            this._title.position.set(Math.round((SelectionBox.WIDTH - this._title.width) / 2), -2 + Math.round((SelectionBox.HEIGHT - this._title.height) / 2));
        };
        SelectionBox.prototype.handleBtnClick = function (button) {
            Game.AudioUtils.playSound("click");
            if (button.id == 0) {
                if (this._selItemId-- == 0)
                    this._selItemId = this._content.length - 1;
            }
            else {
                if (++this._selItemId == this._content.length)
                    this._selItemId = 0;
            }
            this.setTitle();
            this._onSelectionChange.dispatch(this, this.selectedItem);
        };
        SelectionBox.WIDTH = 543;
        SelectionBox.HEIGHT = 52;
        return SelectionBox;
    }());
    Controls.SelectionBox = SelectionBox;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var Slider = (function () {
        function Slider(id, type, parent) {
            this._id = id;
            this._type = type;
            this._bg = Game.Global.game.add.image(0, 0, type.textureKey, type.bgFrame, parent);
            this._thumb = Game.Global.game.add.image(20, 20, type.textureKey, type.thumbFrame);
            this._bg.addChild(this._thumb);
            this._thumb.anchor.set(0.5);
            if (type.vertical) {
                this._thumb.position.set(type.thumbArea.x + (type.thumbArea.width >> 1), type.thumbArea.y);
            }
            else {
                this._thumb.position.set(type.thumbArea.x, type.thumbArea.y + (type.thumbArea.height >> 1));
            }
            this._thumb.inputEnabled = true;
            this._thumb.events.onInputDown.add(this.handleInputDown, this);
            this._thumb.events.onInputUp.add(this.handleInputUp, this);
            this._dragPointer = null;
            this._minVal = 0;
            this._maxVal = 1;
            this._valResolution = 0.1;
            this._value = 0;
            this._onValueChange = new Phaser.Signal();
        }
        Object.defineProperty(Slider.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "value", {
            get: function () { return this._value; },
            set: function (value) {
                value = Math.min(Math.max(this._minVal, value), this._maxVal);
                value = Math.round(value / this._valResolution) * this._valResolution;
                if (this._value != undefined && this._value == value)
                    return;
                this._value = value;
                var offset = (this._value - this._minVal) / (this._maxVal - this._minVal);
                if (this._type.vertical) {
                    this._thumb.y = this._type.thumbArea.y + Math.round(this._type.thumbArea.height * offset);
                }
                else {
                    this._thumb.x = this._type.thumbArea.x + Math.round(this._type.thumbArea.width * offset);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "onValueChange", {
            get: function () { return this._onValueChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "x", {
            get: function () { return this._bg.x; },
            set: function (x) { this._bg.x = x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "y", {
            get: function () { return this._bg.y; },
            set: function (y) { this._bg.y = y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "visible", {
            get: function () { return this._bg.visible; },
            set: function (visible) { this._bg.visible = visible; },
            enumerable: true,
            configurable: true
        });
        Slider.prototype.setRange = function (minVal, maxVal, startVal, resolution) {
            this._minVal = minVal;
            this._maxVal = maxVal;
            this._valResolution = resolution;
            this.value = startVal;
        };
        Slider.prototype.handleInputDown = function (gameObject, pointer) {
            this._dragPointer = pointer;
            if (this._type.vertical) {
                this._dragStartPointerPos = pointer.y;
                this._dragStartThumbPos = this._thumb.y;
            }
            else {
                this._dragStartPointerPos = pointer.x;
                this._dragStartThumbPos = this._thumb.x;
            }
            this._thumb.game.input.addMoveCallback(this.handleInputMove, this);
        };
        Slider.prototype.handleInputUp = function () {
            this._dragPointer = null;
            this._thumb.game.input.deleteMoveCallback(this.handleInputMove, this);
        };
        Slider.prototype.handleInputMove = function (pointer, x, y) {
            if (this._dragPointer.id != pointer.id)
                return;
            var val;
            var thumbArea = this._type.thumbArea;
            if (!this._type.vertical) {
                var offset = Math.round(x - this._dragStartPointerPos);
                var thumbX = this._dragStartThumbPos + offset;
                if (thumbX < thumbArea.x) {
                    thumbX = thumbArea.x;
                }
                else if (thumbX >= thumbArea.right) {
                    thumbX = thumbArea.right - 1;
                }
                this._thumb.x = thumbX;
                val = (this._thumb.x - thumbArea.x) / (thumbArea.width - 1);
            }
            else {
                var offset = Math.round(y - this._dragStartPointerPos);
                var thumbY = this._dragStartThumbPos + offset;
                if (thumbY < thumbArea.y) {
                    thumbY = thumbArea.y;
                }
                else if (thumbY >= thumbArea.bottom) {
                    thumbY = thumbArea.bottom - 1;
                }
                this._thumb.y = thumbY;
                val = (this._thumb.y - this._type.thumbArea.y) / (this._type.thumbArea.height - 1);
            }
            val = this._minVal + Math.round((val * (this._maxVal - this._minVal)) / this._valResolution) * this._valResolution;
            if (this._value != val) {
                this._value = val;
                this._onValueChange.dispatch(val);
            }
        };
        return Slider;
    }());
    Controls.Slider = Slider;
})(Controls || (Controls = {}));
var Controls;
(function (Controls) {
    var SliderType = (function () {
        function SliderType(textureKey, bgFrame, thumbFrame, thumbArea, vertical) {
            this._textureKey = textureKey;
            this._bgFrame = bgFrame;
            this._thumbFrame = thumbFrame;
            this._thumbArea = thumbArea;
            this._vertical = vertical;
        }
        Object.defineProperty(SliderType.prototype, "textureKey", {
            get: function () { return this._textureKey; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SliderType.prototype, "bgFrame", {
            get: function () { return this._bgFrame; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SliderType.prototype, "thumbFrame", {
            get: function () { return this._thumbFrame; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SliderType.prototype, "thumbArea", {
            get: function () { return this._thumbArea; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SliderType.prototype, "vertical", {
            get: function () { return this._vertical; },
            enumerable: true,
            configurable: true
        });
        return SliderType;
    }());
    Controls.SliderType = SliderType;
})(Controls || (Controls = {}));
var Gamee2;
(function (Gamee2) {
    var eStartFlag;
    (function (eStartFlag) {
        eStartFlag[eStartFlag["replay"] = 1] = "replay";
        eStartFlag[eStartFlag["ghost"] = 2] = "ghost";
        eStartFlag[eStartFlag["reset"] = 4] = "reset";
    })(eStartFlag = Gamee2.eStartFlag || (Gamee2.eStartFlag = {}));
    var eAdState;
    (function (eAdState) {
        eAdState[eAdState["ready"] = 0] = "ready";
        eAdState[eAdState["loading"] = 1] = "loading";
        eAdState[eAdState["showing"] = 2] = "showing";
        eAdState[eAdState["uninitialized"] = 3] = "uninitialized";
    })(eAdState = Gamee2.eAdState || (Gamee2.eAdState = {}));
    var Gamee = (function () {
        function Gamee() {
        }
        Object.defineProperty(Gamee, "onInitialized", {
            get: function () { return this._onInitialized; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "onStart", {
            get: function () { return this._onStart; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "onPause", {
            get: function () { return this._onPause; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "onResume", {
            get: function () { return this._onResume; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "onMute", {
            get: function () { return this._onMute; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "onUnmute", {
            get: function () { return this._onUnmute; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "onGhostChange", {
            get: function () { return Gamee._onGhostChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "initialized", {
            get: function () { return this._initState == 1; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "initData", {
            get: function () { return Gamee._initData; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "startFlags", {
            get: function () { return Gamee._startFlags; },
            enumerable: true,
            configurable: true
        });
        Gamee.initialize = function (controller, gameCapabilities) {
            if (Gamee._initState == 0) {
                if (window.gamee == undefined) {
                    Gamee._initState = 3;
                    console.log("GAMEE doesn't exist");
                    return false;
                }
                Gamee._initState = 2;
                window.gamee.gameInit(controller, {}, gameCapabilities, function (error, data) {
                    if (error == null) {
                        Gamee._initState = 1;
                        Gamee._initData = data;
                        if (data && data.socialData && data.socialData.player)
                            Gamee._player = data.socialData.player;
                        window.gamee.emitter.addEventListener("start", function (event) {
                            var flags = 0;
                            if (event.detail != undefined) {
                                if (event.detail.opt_replay != undefined && event.detail.opt_replay != false)
                                    flags |= eStartFlag.replay;
                                if (event.detail.opt_ghostMode != undefined && event.detail.opt_ghostMode != false)
                                    flags |= eStartFlag.ghost;
                                if (event.detail.opt_resetState != undefined && event.detail.opt_resetState != false)
                                    flags |= eStartFlag.reset;
                            }
                            Gamee._score = 0;
                            Gamee._startFlags = flags;
                            Gamee._onStart.dispatch(flags);
                        });
                        window.gamee.emitter.addEventListener("pause", function () {
                            Gamee._onPause.dispatch();
                        });
                        window.gamee.emitter.addEventListener("resume", function () {
                            Gamee._onResume.dispatch();
                        });
                        window.gamee.emitter.addEventListener("mute", function () {
                            Gamee._onMute.dispatch();
                        });
                        window.gamee.emitter.addEventListener("unmute", function () {
                            Gamee._onUnmute.dispatch();
                        });
                        window.gamee.emitter.addEventListener("ghostHide", function () {
                            Gamee._onGhostChange.dispatch(false);
                        });
                        window.gamee.emitter.addEventListener("ghostShow", function () {
                            Gamee._onGhostChange.dispatch(true);
                        });
                    }
                    else {
                        Gamee._initState = 3;
                        console.log(error);
                    }
                    Gamee._onInitialized.dispatch(Gamee._initState, data);
                });
            }
            return true;
        };
        Object.defineProperty(Gamee, "ready", {
            get: function () { return Gamee._ready; },
            enumerable: true,
            configurable: true
        });
        Gamee.gameReady = function () {
            if (Gamee._initState == 1 && !Gamee._ready) {
                window.gamee.gameReady(function (error) {
                    if (error == null) {
                        Gamee._ready = true;
                    }
                    else {
                        console.log(error);
                    }
                });
            }
        };
        Object.defineProperty(Gamee, "player", {
            get: function () { return Gamee._player; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "friends", {
            get: function () { return Gamee._friends; },
            enumerable: true,
            configurable: true
        });
        Gamee.requestSocial = function (cbFnc, cbCtx, entryCnt) {
            if (entryCnt === void 0) { entryCnt = 10; }
            if (Gamee._initState == 1) {
                window.gamee.requestSocial(function (error, data) {
                    Gamee._player = null;
                    Gamee._friends = null;
                    if (error == undefined || error == null) {
                        if (data && data.socialData && data.socialData.friends)
                            Gamee._friends = data.socialData.friends;
                        if (data && data.socialData && data.socialData.player)
                            Gamee._player = data.socialData.player;
                    }
                    cbFnc.call(cbCtx);
                }, entryCnt);
            }
        };
        Gamee.requestPlayerReplay = function (cbFnc, cbCtx, playerId) {
            if (Gamee._initState == 1) {
                window.gamee.requestPlayerReplay(playerId, function (error, data) {
                    var replayData;
                    if (data && data.replayData) {
                        replayData = data.replayData.data;
                    }
                    else {
                        replayData = null;
                    }
                    cbFnc.call(cbCtx, replayData);
                });
            }
        };
        Gamee.requestPlayerSaveData = function (cbFnc, cbCtx, playerId) {
            if (Gamee._initState == 1) {
                window.gamee.requestPlayerSaveState(playerId, function (error, data) {
                    var saveData;
                    if (data && data.saveState) {
                        saveData = data.saveState;
                    }
                    else {
                        saveData = "";
                    }
                    cbFnc.call(cbCtx, saveData);
                });
            }
        };
        Gamee.requestPlayerData = function (cbFnc, cbCtx) {
            if (Gamee._initState == 1) {
                window.gamee.requestPlayerData(function (error, data) {
                    if (data && data.player) {
                        Gamee._player = data.player;
                    }
                    else {
                        Gamee._player = null;
                    }
                    cbFnc.call(cbCtx, Gamee._player);
                });
            }
        };
        Gamee.logEvent = function (name, value) {
            if (value === void 0) { value = ""; }
            if (Gamee._ready) {
                window.gamee.logEvent(name, value);
            }
        };
        Gamee.share = function (data, cbFnc, cbCtx) {
            if (Gamee._initState == 1) {
                window.gamee.share(data, function (error, data) {
                    if (cbFnc)
                        cbFnc.call(cbCtx, (data && data.shareStaus));
                });
            }
        };
        Gamee.gameOver = function (replayData, saveData) {
            if (Gamee._ready) {
                var replay = void 0;
                if (replayData != undefined)
                    replay = { data: replayData, variant: "0" };
                window.gamee.gameOver(replay, null, saveData);
            }
        };
        Gamee.gameSave = function (saveData) {
            if (Gamee._ready)
                window.gamee.gameSave(saveData, true);
        };
        Object.defineProperty(Gamee, "score", {
            get: function () {
                return Gamee._score;
            },
            set: function (score) {
                Gamee._score = score;
                if (Gamee._initState == 1)
                    window.gamee.updateScore(score);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "ghostScore", {
            set: function (score) {
                if (Gamee._initState == 1)
                    window.gamee.updateScore(score, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gamee, "adState", {
            get: function () { return Gamee._adState; },
            enumerable: true,
            configurable: true
        });
        Gamee.loadAd = function (cbFnc, cbCtx) {
            if (Gamee._initState != 1 || Gamee._adState != eAdState.uninitialized)
                return false;
            Gamee._adState = eAdState.loading;
            try {
                window.gamee.loadRewardedVideo(function (error, data) {
                    Gamee._adState = (data && data.videoLoaded ? eAdState.ready : eAdState.uninitialized);
                    if (cbFnc)
                        cbFnc.call(cbCtx, Gamee._adState == eAdState.ready);
                });
            }
            catch (e) {
                return false;
            }
            return true;
        };
        Gamee.showAd = function (cbFnc, cbCtx) {
            if (Gamee._adState != eAdState.ready) {
                return false;
            }
            Gamee._adState = eAdState.showing;
            window.gamee.showRewardedVideo(function (error, data) {
                Gamee._adState = eAdState.uninitialized;
                cbFnc.call(cbCtx, (data && data.videoPlayed));
            });
            return true;
        };
        Gamee.purchaseItem = function (cost, currency, name, base64Img, silent, cbFnc, cbCtx) {
            if (!Gamee.ready)
                return false;
            if (currency == 0) {
                window.gamee.purchaseItemWithCoins({
                    coinsCost: cost,
                    silentPurchase: silent,
                    itemName: name,
                    itemImage: base64Img
                }, function (error, data) {
                    cbFnc.call(cbCtx, (data && data.purchaseStatus));
                });
            }
            else {
                window.gamee.purchaseItemWithGems({
                    gemsCost: cost,
                    silentPurchase: silent,
                    itemName: name,
                    itemImage: base64Img
                }, function (error, data) {
                    cbFnc.call(cbCtx, (data && data.purchaseStatus));
                });
            }
        };
        Gamee.showSubscribeDialog = function (cbFnc, cbCtx) {
            if (!Gamee.ready)
                return false;
            window.gamee.showSubscribeDialog(function (error, data) {
                cbFnc.call(cbCtx, (data && data.vipPurchased));
            });
            return true;
        };
        Gamee._onInitialized = new Phaser.Signal();
        Gamee._onStart = new Phaser.Signal();
        Gamee._onPause = new Phaser.Signal();
        Gamee._onResume = new Phaser.Signal();
        Gamee._onMute = new Phaser.Signal();
        Gamee._onUnmute = new Phaser.Signal();
        Gamee._onGhostChange = new Phaser.Signal();
        Gamee._initState = 0;
        Gamee._ready = false;
        Gamee._player = null;
        Gamee._friends = null;
        Gamee._score = 0;
        Gamee._adState = eAdState.uninitialized;
        return Gamee;
    }());
    Gamee2.Gamee = Gamee;
})(Gamee2 || (Gamee2 = {}));
var Gameplay;
(function (Gameplay) {
    var BattleCreator = (function () {
        function BattleCreator(screenBase) {
            var game = Game.Global.game;
            this._screenBase = screenBase;
            this._content = game.add.group(null);
            this._content.exists = this._content.visible = false;
            this._unlockPrice = [
                new Game.Price(99, 2),
                new Game.Price(0, 3)
            ];
            this._racePropsLocked = false;
            this._racePropsCtrl = [];
            for (var i = 0; i < BattleCreator.SETTING_TITLES.length; i++)
                this._racePropsCtrl.push(new Controls.FiveStepsValue(this._content, BattleCreator.SETTING_TITLES[i]));
            if (this._racePropsLocked) {
                this._racePropsLockOverlay = new Gameplay.LockedContentOverlay(this._unlockPrice, "battleTitle", "BATTLE CREATOR");
                this._racePropsLockOverlay.show(this._content);
                this._racePropsLockOverlay.onUnlocked.add(this.handleCreatorUnlocked, this);
                this._racePropsLockOverlayH = (this._racePropsCtrl.length * (this._racePropsCtrl[0].height + BattleCreator.SETTINGS_SPACING))
                    - BattleCreator.SETTINGS_SPACING + BattleCreator.LOCK_OVERLAY_B_PADDING + BattleCreator.LOCK_OVERLAY_T_PADDING;
                this._racePropsCtrl.forEach(function (ctrl) { ctrl.enabled = false; });
            }
            this._slbEnv = new Controls.SelectionBox(this._content, Game.Global.enviroments, "name", 0);
            this._slbEnv.onSelectionChange.add(this.handleEnvChange, this);
            if (!Game.Global.game.device.desktop)
                this._titleImg = game.add.image(0, 0, "atlas_A", "battleTitle", this._content);
            var btnType = new Controls.ButtonType(new Phaser.Point(0, 0), [
                new Controls.ButtonState("atlas_A", "btnBlueLong_0"),
                new Controls.ButtonState("atlas_A", "btnBlueLong_1", 0, 3),
                new Controls.ButtonState("atlas_A", "btnBlueLong_2")
            ], new Phaser.Point(0.5, 0.5), this._content);
            var btnContent = game.make.bitmapText(0, 0, "fntWhite30", "CREATE BATTLE", 30);
            btnContent.anchor.set(0.5, 0.6);
            this._btnCreate = new Controls.Button(0, btnType, 0, 0, btnContent, false);
            this._btnCreate.onClick.add(this.handleBtnCreateClick, this);
        }
        Object.defineProperty(BattleCreator.prototype, "unlockPrice", {
            get: function () { return this._unlockPrice; },
            enumerable: true,
            configurable: true
        });
        BattleCreator.prototype.show = function () {
            var _this = this;
            this._screenBase.show(this._content, 0.6);
            if (this._racePropsLocked)
                this._racePropsLockOverlay.updateUnlockButtons();
            Game.Global.scale.onResChange.add(this.handleResize, this);
            this.handleResize(Game.Global.scale.resolution);
            this._screenBase.backButton.onClick.add(function () {
                Game.AudioUtils.playSound("click");
                _this._state = -1;
            }, this);
            this._state = 0;
        };
        BattleCreator.prototype.reset = function () {
            if (this._content.parent != null) {
                Game.Global.scale.onResChange.remove(this.handleResize, this);
                this._screenBase.reset();
            }
        };
        BattleCreator.prototype.update = function () {
            if (this._state == 0)
                return true;
            this.reset();
            return false;
        };
        BattleCreator.prototype.handleBtnCreateClick = function (button) {
            Game.AudioUtils.playSound("click");
            var battleSettings = {
                gravity: this._racePropsCtrl[0].value,
                speed: this._racePropsCtrl[1].value,
                visibility: this._racePropsCtrl[2].value,
                assetUID: this._slbEnv.selectedItem.uid
            };
            var game = Game.Global.game;
            var tex = game.make.renderTexture(480, 360);
            var img = game.make.image(0, 0, "atlas_2", "battleSplash_" + battleSettings.assetUID);
            img.width = tex.width;
            img.height = tex.height;
            tex.renderXY(img, 0, 0, true);
            img.destroy();
            var base64 = tex.getCanvas().toDataURL("image/jpeg", 0.8);
            tex.destroy(true);
            Gamee2.Gamee.share({
                text: "MotoFX2",
                picture: base64,
                destination: "battle",
                initData: JSON.stringify(battleSettings)
            });
            Gamee2.Gamee.logEvent("CUSTOM_BATTLE", "G: " + battleSettings.gravity + ",S:" + battleSettings.speed + ",V:" + battleSettings.visibility);
            this._state = 1;
        };
        BattleCreator.prototype.handleCreatorUnlocked = function () {
            this._racePropsLocked = false;
            this._racePropsLockOverlay.hide();
            this._racePropsCtrl.forEach(function (ctrl) { ctrl.enabled = true; }, this);
            this.handleResize(Game.Global.scale.resolution);
            Game.Global.playerProfile.handleBattleSettingsPurchased();
        };
        BattleCreator.prototype.handleEnvChange = function (selBox, item) {
            this._screenBase.setBackground(item.uid);
        };
        BattleCreator.prototype.handleResize = function (res) {
            if (this._titleImg)
                this._titleImg.position.set((res.x - this._titleImg.width) / 2, BattleCreator.TITLE_Y);
            var setH = 0;
            if (this._racePropsLocked) {
                this._racePropsLockOverlay.setSize(res.x, this._racePropsLockOverlayH);
                setH = this._racePropsLockOverlayH;
            }
            else {
                setH = this._racePropsCtrl.length * (this._racePropsCtrl[0].height + BattleCreator.SETTINGS_SPACING) - BattleCreator.SETTINGS_SPACING;
            }
            setH += this._slbEnv.height + BattleCreator.SETTINGS_SPACING;
            var btnCreateY = res.y - BattleCreator.BTN_CREATE_B_MARGIN - this._btnCreate.height;
            var y = (this._titleImg ? BattleCreator.TITLE_Y + this._titleImg.height : 0);
            y = Math.floor(y + (btnCreateY - y - setH) / 2);
            if (this._racePropsLocked) {
                this._racePropsLockOverlay.y = y;
                y += BattleCreator.LOCK_OVERLAY_T_PADDING;
            }
            var x = Math.floor((res.x - this._racePropsCtrl[0].width) / 2);
            this._racePropsCtrl.forEach(function (settings) {
                settings.setPosition(x, Math.round(y));
                y += settings.height + BattleCreator.SETTINGS_SPACING;
            });
            if (this._racePropsLocked)
                y += BattleCreator.LOCK_OVERLAY_B_PADDING;
            this._slbEnv.x = Math.round((res.x - this._slbEnv.width) / 2);
            this._slbEnv.y = y;
            this._btnCreate.x = (res.x - this._btnCreate.width) / 2;
            this._btnCreate.y = btnCreateY;
        };
        BattleCreator.SETTING_TITLES = [
            "LOW GRAVITY",
            "HIGH SPEED",
            "LOW VISIBILITY"
        ];
        BattleCreator.SETTINGS_SPACING = 20;
        BattleCreator.TITLE_Y = 20;
        BattleCreator.LOCK_OVERLAY_T_PADDING = 20;
        BattleCreator.LOCK_OVERLAY_B_PADDING = 80;
        BattleCreator.BTN_CREATE_B_MARGIN = 50;
        return BattleCreator;
    }());
    Gameplay.BattleCreator = BattleCreator;
})(Gameplay || (Gameplay = {}));
var Gameplay;
(function (Gameplay) {
    var ListBoxItem = (function (_super) {
        __extends(ListBoxItem, _super);
        function ListBoxItem(listbox, screen) {
            var _this = _super.call(this, listbox) || this;
            _this._screen = screen;
            var game = Game.Global.game;
            if (ListBoxItem._btnType1 == undefined) {
                ListBoxItem._btnType1 = new Controls.ButtonType(new Phaser.Point(0, 0), [
                    new Controls.ButtonState("atlas_A", "btnBlueS_0"),
                    new Controls.ButtonState("atlas_A", "btnBlueS_1", 0, 4),
                    new Controls.ButtonState("atlas_A", "btnOrangeS_2")
                ], new Phaser.Point(0.5, 0.48));
                ListBoxItem._btnType2 = new Controls.ButtonType(new Phaser.Point(0, 0), [
                    new Controls.ButtonState("atlas_A", "btnOrangeS_0"),
                    new Controls.ButtonState("atlas_A", "btnOrangeS_1", 0, 4),
                    new Controls.ButtonState("atlas_A", "btnOrangeS_2")
                ], new Phaser.Point(0.5, 0.48));
            }
            game.add.image(0, 0, "atlas_A", "arrowBg", _this._container);
            _this._portrait = game.add.image(182, 120, "atlas_A", "bike_0", _this._container);
            _this._portrait.anchor.set(0.5);
            _this._portraitFx = game.add.image(182, 120, "atlas_A", "bike_0_contour", _this._container);
            _this._portraitFx.anchor.set(0.5);
            _this._button1 = _this.createButton(0);
            _this._button2 = _this.createButton(1);
            _this._bonusInfo = game.make.bitmapText(412, 0, "fntWhite30", "", 30);
            _this._bonusInfo.anchor.x = 0.5;
            _this._container.add(_this._bonusInfo);
            _this._noticeIcon = new HUD.NoticeIcon(90, 40, _this._container, screen.timer);
            _this._selectedIcon = null;
            _this._saleBadge = null;
            return _this;
        }
        ListBoxItem.prototype.activate = function (id, pos, content) {
            _super.prototype.activate.call(this, id, pos, content);
            var data = content;
            this._portrait.frameName = data.portraitFrameName;
            this._portraitFx.exists = this._portraitFx.visible = false;
            this._bonusInfo.text = "+" + data.bonus + "% SCORE";
            if (data.uid == Game.Global.playerProfile.bikeTypeUID) {
                if (!this._selectedIcon) {
                    this._selectedIcon = this._screen.selectedIcon;
                    this._container.add(this._selectedIcon);
                    this._selectedIcon.visible = true;
                }
            }
            else if (this._selectedIcon) {
                this.releaseSelectedIcon();
            }
            this.updateButtons();
            if (data.gameeCurrencyPrice && data.gameeCurrencyPrice.sale) {
                if (!this._saleBadge) {
                    this._saleBadge = this._screen.freeSaleBadges.getItem();
                    this._container.add(this._saleBadge, true);
                    this._saleBadge.visible = true;
                }
            }
            else if (this._saleBadge) {
                this.releaseSaleBadge();
            }
            this._screen.handleBikeView(data);
            return this;
        };
        ListBoxItem.prototype.deactivate = function () {
            if (this._saleBadge)
                this.releaseSaleBadge();
            if (this._selectedIcon)
                this.releaseSelectedIcon();
            return _super.prototype.deactivate.call(this);
        };
        ListBoxItem.prototype.update = function () {
            this._noticeIcon.update();
        };
        ListBoxItem.prototype.releaseSelectedIcon = function () {
            this._container.remove(this._selectedIcon, false, true);
            this._selectedIcon.visible = false;
            this._selectedIcon = null;
        };
        ListBoxItem.prototype.releaseSaleBadge = function () {
            this._container.remove(this._saleBadge, false, true);
            this._saleBadge.visible = false;
            this._screen.freeSaleBadges.returnItem(this._saleBadge);
            this._saleBadge = null;
        };
        ListBoxItem.prototype.createButton = function (id) {
            var game = Game.Global.game;
            var btnContent = game.add.group(null);
            var icon = game.add.image(0, 0, "atlas_A", "iconCoin1", btnContent);
            icon.anchor.y = 0.5;
            var txt = game.make.bitmapText(0, 0, "fntWhite30", "", 30);
            txt.anchor.y = 0.55;
            btnContent.add(txt);
            var btn = new Controls.Button(id, ListBoxItem._btnType1, 314, 0, btnContent, false, undefined, this._container);
            btn.onClick.add(this.handleButtonClick, this);
            return btn;
        };
        ListBoxItem.prototype.setupBuyButton = function (button, price) {
            var btnContent = button.content;
            var btnIcon = btnContent.getChildAt(0);
            var btnText = btnContent.getChildAt(1);
            if (price.currency != 3) {
                if (price.currency == 0) {
                    var bikeType = this._content;
                    btnIcon.frameName = this._content.canBePurchased ? "iconCoin1" : "iconCoin2";
                    if (bikeType.canBePurchased) {
                        this._button1.enabled = true;
                        this._noticeIcon.layer.visible = !Game.Global.playerProfile.getBikeAnnouncedFlag(bikeType);
                    }
                    else {
                        this._button1.enabled = false;
                        this._noticeIcon.layer.visible = false;
                    }
                }
                else {
                    btnIcon.frameName = (price.currency == 1 ? "iconGameeCoin1" : "iconGameeGem1");
                    button.enabled = true;
                }
                btnIcon.visible = true;
                btnText.text = price.price.toString();
                btnText.x = btnIcon.width + 10;
            }
            else {
                btnIcon.visible = false;
                btnText.text = "SUBSCRIBE";
                btnText.x = 0;
                button.enabled = true;
                this._noticeIcon.layer.visible = false;
            }
            btnContent.pivot.set(btnContent.width / 2, 0);
            button.type = ListBoxItem._btnType2;
            button.visible = true;
            button.tag = price;
        };
        ListBoxItem.prototype.updateButtons = function () {
            var bike = this._content;
            if (bike.unlocked) {
                this._button1.type = ListBoxItem._btnType1;
                this._button1.enabled = true;
                this._button1.y = ListBoxItem.BTN_Y_1_1;
                this._button1.visible = true;
                var btnContent = this._button1.content;
                btnContent.getChildAt(0).visible = false;
                var txt = btnContent.getChildAt(1);
                txt.setText("SELECT");
                txt.x = 0;
                btnContent.pivot.set(btnContent.width / 2, 0);
                this._button2.visible = false;
                this._bonusInfo.y = ListBoxItem.BNS_INFO_Y_1_1;
                this._noticeIcon.layer.visible = false;
            }
            else {
                var buttons = [this._button1, this._button2];
                var btnId = 0;
                if (bike.ingameCurrencyPrice)
                    this.setupBuyButton(buttons[btnId++], bike.ingameCurrencyPrice);
                if (bike.gameeCurrencyPrice)
                    this.setupBuyButton(buttons[btnId++], bike.gameeCurrencyPrice);
                if (btnId == 2) {
                    this._button1.y = ListBoxItem.BTN_Y_2_1;
                    this._button2.y = ListBoxItem.BTN_Y_2_2;
                    this._bonusInfo.y = ListBoxItem.BNS_INFO_Y_2_1;
                }
                else {
                    this._button1.y = ListBoxItem.BTN_Y_1_1;
                    this._button2.visible = false;
                    this._bonusInfo.y = ListBoxItem.BNS_INFO_Y_1_1;
                }
            }
        };
        ListBoxItem.prototype.updateIngameCoinsBuyButton = function () {
            var bike = this._content;
            if (!bike.unlocked && bike.ingameCurrencyPrice)
                this.setupBuyButton(this._button1, bike.ingameCurrencyPrice);
        };
        ListBoxItem.prototype.handleButtonClick = function (button) {
            var bike = this._content;
            if (bike.unlocked) {
                Game.AudioUtils.playSound("click");
                this._screen.handleBikeSelect(bike);
            }
            else {
                var price = button.tag;
                if (price.currency == 0) {
                    Game.Global.playerProfile.coins -= price.price;
                    this.unlockBike();
                    var lbItems = this._listbox.visibleItems;
                    var i = lbItems.itemCnt;
                    while (i-- != 0)
                        lbItems.getItemAtIndex(i).updateIngameCoinsBuyButton();
                }
                else if (price.currency != 3) {
                    var texture = this._portrait.generateTexture();
                    texture.clear;
                    Gamee2.Gamee.purchaseItem(price.price, price.currency == 1 ? 0 : 1, "", texture.getBase64(), price.currency == 1, this.unlockBike, this);
                    texture.destroy(true);
                }
                else {
                    Gamee2.Gamee.showSubscribeDialog(this.unlockBike, this);
                }
            }
        };
        ListBoxItem.prototype.unlockBike = function (unlock) {
            if (unlock === void 0) { unlock = true; }
            if (!unlock)
                return;
            Game.AudioUtils.playSound("purchase2");
            var bike = this._content;
            Game.Global.playerProfile.unlockBike(bike);
            this.updateButtons();
            this._portraitFx.frameName = bike.portraitFrameName + "_contour";
            this._portraitFx.scale.set(2);
            this._portraitFx.alpha = 0.5;
            this._portraitFx.visible = this._portraitFx.exists = true;
            Game.Global.game.add.tween(this._portraitFx).to({ alpha: 0 }, 750, Phaser.Easing.Cubic.Out, true).onComplete.addOnce(function () {
                this._portraitFx.visible = this._portraitFx.exists = false;
            }, this);
            this._noticeIcon.layer.visible = false;
            Game.Global.playerProfile.save(true);
            Gamee2.Gamee.logEvent("BIKE_BOUGHT", this._content.uid.toString());
        };
        ListBoxItem.WIDTH = 580;
        ListBoxItem.HEIGHT = 260;
        ListBoxItem.BTN_Y_2_1 = 34;
        ListBoxItem.BTN_Y_2_2 = 104;
        ListBoxItem.BTN_Y_1_1 = 54;
        ListBoxItem.BNS_INFO_Y_1_1 = 150;
        ListBoxItem.BNS_INFO_Y_2_1 = 170;
        return ListBoxItem;
    }(Controls.ListBoxItemBase));
    var BikesScreen = (function () {
        function BikesScreen(screenBase) {
            var _this = this;
            var game = Game.Global.game;
            this._screenBase = screenBase;
            this._content = game.add.group(null);
            this._content.visible = this._content.exists = false;
            this._timer = new Helpers.GameTimer();
            if (Gamee2.Gamee.initialized) {
                var btnType = new Controls.ButtonType(new Phaser.Point(0, 0), [
                    new Controls.ButtonState("atlas_A", "btnBlueLong_0"),
                    new Controls.ButtonState("atlas_A", "btnBlueLong_1", 0, 3),
                    new Controls.ButtonState("atlas_A", "btnBlueLong_2")
                ], new Phaser.Point(0.5, 0.5), this._content);
                var btnContentContainer = game.make.group(null);
                game.add.image(0, -5, "atlas_A", "iconVideo", btnContentContainer).scale.set(0.7);
                btnContentContainer.addChild(game.make.bitmapText(52, 0, "fntWhite30", "GET +50 COINS", 30));
                btnContentContainer.pivot.set(btnContentContainer.width / 2, btnContentContainer.height * 0.39);
                this._btnFreeCoins = new Controls.Button(0, btnType, 120, 20, btnContentContainer, false);
                this._btnFreeCoins.onClick.add(function () {
                    Gamee2.Gamee.showAd(function (res) {
                        if (res) {
                            Game.Global.playerProfile.coins += 50;
                            Game.Global.playerProfile.validateBikesAnnouncedFlag();
                            var lbItems = _this._listbox.visibleItems;
                            var i = lbItems.itemCnt;
                            while (i-- != 0)
                                lbItems.getItemAtIndex(i).updateIngameCoinsBuyButton();
                            _this._btnFreeCoins.enabled = false;
                            _this._freeCoins += 50;
                        }
                    }, _this);
                }, this);
            }
            this._freeSaleBadges = new Collections.Pool(undefined, 0, true, function () {
                return Game.Global.game.add.image(0, 0, "atlas_A", "saleBadge");
            }, this);
            this._selectedIcon = game.add.image(90, 40, "atlas_A", "selectedIcon");
            this._selectedIcon.anchor.set(0.5);
            this._selectedIcon.exists = this._selectedIcon.visible = false;
            var onBikeSelect = new Phaser.Signal();
            onBikeSelect.add(this.handleBikeSelect, this);
            this._listbox = new Controls.ListBox(0, Game.Global.game.device.desktop && !this._btnFreeCoins ? 20 : 105, ListBoxItem.WIDTH, ListBoxItem.HEIGHT * 3, true, ListBoxItem.HEIGHT, 10, function () {
                return new ListBoxItem(this._listbox, this);
            }, this, this._content);
        }
        Object.defineProperty(BikesScreen.prototype, "timer", {
            get: function () { return this._timer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BikesScreen.prototype, "newBikeSelected", {
            get: function () { return this._result > 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BikesScreen.prototype, "selectedIcon", {
            get: function () { return this._selectedIcon; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BikesScreen.prototype, "freeSaleBadges", {
            get: function () { return this._freeSaleBadges; },
            enumerable: true,
            configurable: true
        });
        BikesScreen.prototype.show = function (hudCoins, bikeUID) {
            var _this = this;
            this._timer.start();
            this._viewedBikesMask = 0;
            this._screenBase.show(this._content);
            Game.Global.scale.onResChange.add(this.handleResize, this);
            this.handleResize(Game.Global.scale.resolution);
            this._screenBase.backButton.onClick.add(function () {
                Game.AudioUtils.playSound("click");
                _this._result = -1;
            }, this);
            this._listbox.content = Game.Global.bikeTypes;
            this._listbox.activate();
            if (bikeUID != undefined) {
                var bikes = Game.Global.bikeTypes;
                var bikeId = bikes.length;
                while (bikeId-- != 0) {
                    if (bikes[bikeId].uid == bikeUID)
                        break;
                }
                this._listbox.viewOffset = this._listbox.getItemOffset(bikeId);
            }
            this._hudCoins = hudCoins;
            hudCoins.reset(this._content, this._timer);
            if (this._btnFreeCoins)
                this._btnFreeCoins.enabled = Gamee2.Gamee.adState == Gamee2.eAdState.ready;
            this._freeCoins = 0;
            this._result = 0;
        };
        BikesScreen.prototype.reset = function () {
            if (this._content.parent != null) {
                Game.Global.scale.onResChange.remove(this.handleResize, this);
                this._listbox.deactivate();
                this._hudCoins = null;
                this._screenBase.reset();
            }
        };
        BikesScreen.prototype.update = function () {
            this._timer.update();
            if (!this._screenBase.visible || this._result != 0) {
                if (this._screenBase.visible)
                    this.reset();
                Gamee2.Gamee.loadAd();
                Game.Global.bikeTypes.forEach(function (type) {
                    if ((this._viewedBikesMask & (1 << type.uid)) != 0)
                        Game.Global.playerProfile.setBikeAnnouncedFlag(type);
                }, this);
                Game.Global.playerProfile.validateBikesAnnouncedFlag();
                Game.Global.playerProfile.save();
                if (this._freeCoins != 0)
                    Gamee2.Gamee.logEvent("FREE_COINS", this._freeCoins.toString());
                return false;
            }
            this._listbox.update();
            this._hudCoins.update();
            return true;
        };
        BikesScreen.prototype.handleBikeSelect = function (bikeType) {
            this._result = -1;
            if (Game.Global.playerProfile.bikeTypeUID != bikeType.uid) {
                Game.Global.playerProfile.bikeTypeUID = bikeType.uid;
                this._result = 1;
            }
        };
        BikesScreen.prototype.handleBikeView = function (bikeType) {
            this._viewedBikesMask |= (1 << bikeType.uid);
        };
        BikesScreen.prototype.handleResize = function (res) {
            this._listbox.setPosition((res.x - this._listbox.width) >> 1, this._listbox.y);
            this._listbox.height = res.y - this._listbox.y;
        };
        return BikesScreen;
    }());
    Gameplay.BikesScreen = BikesScreen;
})(Gameplay || (Gameplay = {}));
var Gameplay;
(function (Gameplay) {
    var LockedContentOverlay = (function () {
        function LockedContentOverlay(unlockPrice, purchaseImgKey, purchaseTitle) {
            var _this = this;
            var add = Game.Global.game.add;
            this._unlockPrice = unlockPrice;
            this._onUnlocked = new Phaser.Signal();
            this._container = Game.Global.game.add.group(null);
            this._container.visible = this._container.exists = false;
            this._overlay = add.graphics(0, 0, this._container);
            this._lockIcon = add.image(0, 0, "atlas_A", "powerUpLock", this._container);
            this._lockIcon.anchor.set(0.5);
            var btnType = new Controls.ButtonType(new Phaser.Point(0, 0), [
                new Controls.ButtonState("atlas_A", "btnOrangeMiddle_0"),
                new Controls.ButtonState("atlas_A", "btnOrangeMiddle_1", 0, 3)
            ], new Phaser.Point(0.5, 0.48), this._container);
            this._btnUnlock = [];
            unlockPrice.forEach(function (price) {
                var btnContent = add.group(null);
                var icon = add.image(0, 0, "atlas_A", Game.CURRENCY_ICON_ASSET_KEY[price.currency][0], btnContent);
                icon.anchor.y = 0.5;
                var txt = Game.Global.game.make.bitmapText(icon.width + 5, 0, "fntWhite30", (price.currency == 3 ? "SUBSCRIBE" : price.price.toString()), 30);
                txt.anchor.y = 0.55;
                btnContent.add(txt);
                btnContent.pivot.set(btnContent.width / 2, 0);
                var btn = new Controls.Button(0, btnType, 0, 0, btnContent, false);
                btn.onClick.add(_this.handleBtnClick, _this);
                btn.tag = price;
                _this._btnUnlock.push(btn);
            }, this);
            this._saleBadge = add.image(20, 20, "atlas_A", "saleBadge", this._container);
            this._saleBadge.visible = false;
            this._purchaseImgKey = purchaseImgKey;
            this._purchaseImgBase64 = null;
            this._purchaseTitle = purchaseTitle;
        }
        Object.defineProperty(LockedContentOverlay.prototype, "y", {
            get: function () { return this._container.y; },
            set: function (y) { this._container.y = y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LockedContentOverlay.prototype, "visible", {
            get: function () { return this._container.visible; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LockedContentOverlay.prototype, "width", {
            get: function () { return this._width; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LockedContentOverlay.prototype, "height", {
            get: function () { return this._height; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LockedContentOverlay.prototype, "unlockPrice", {
            get: function () { return this._unlockPrice; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LockedContentOverlay.prototype, "onUnlocked", {
            get: function () { return this._onUnlocked; },
            enumerable: true,
            configurable: true
        });
        LockedContentOverlay.prototype.show = function (parent) {
            if (this._container.visible)
                this.hide();
            parent.addChild(this._container);
            this._container.visible = this._container.exists = true;
            return this;
        };
        LockedContentOverlay.prototype.hide = function () {
            if (!this._container.visible)
                return;
            this._container.parent.removeChild(this._container);
            this._container.visible = this._container.exists = false;
            return this;
        };
        LockedContentOverlay.prototype.updateUnlockButtons = function () {
            var sale = false;
            this._btnUnlock.forEach(function (btn) {
                var btnContent = btn.content;
                var price = btn.tag;
                var icon = btnContent.getChildAt(0);
                icon.frameName = Game.CURRENCY_ICON_ASSET_KEY[price.currency][0];
                var text = btnContent.getChildAt(1);
                text.x = icon.width + 5;
                text.text = (price.currency == 3 ? "SUBSCRIBE" : price.price.toString());
                if (price.sale)
                    sale = true;
            }, this);
            this._saleBadge.visible = sale;
        };
        LockedContentOverlay.prototype.setSize = function (width, height) {
            this._width = width;
            this._height = height;
            this._overlay
                .clear()
                .beginFill(0, 0.75)
                .drawRect(0, 0, width, height);
            var spacing = (width - (this._btnUnlock[0].width * this._btnUnlock.length)) / (this._btnUnlock.length + 1);
            var x = spacing;
            var y = height - 70;
            this._btnUnlock.forEach(function (btn) {
                btn.x = x;
                btn.y = y;
                x += btn.width + spacing;
            }, this);
            this._lockIcon.x = width / 2;
            this._lockIcon.y = y / 2;
            return this;
        };
        LockedContentOverlay.prototype.handleBtnClick = function (button) {
            var _this = this;
            Game.AudioUtils.playSound("click");
            if (!Gamee2.Gamee.initialized) {
                this._onUnlocked.dispatch(this);
                return;
            }
            var price = button.tag;
            switch (price.currency) {
                case 2:
                case 1: {
                    if (!this._purchaseImgBase64) {
                        var img = Game.Global.game.make.image(0, 0, "atlas_A", this._purchaseImgKey);
                        var tex = Game.Global.game.make.renderTexture(img.width, img.height);
                        tex.renderXY(img, 0, 0, true);
                        img.destroy(true);
                        this._purchaseImgBase64 = tex.getBase64();
                        tex.destroy(true);
                    }
                    Gamee2.Gamee.purchaseItem(price.price, price.currency == 1 ? 0 : 1, this._purchaseTitle, this._purchaseImgBase64, false, function (res) {
                        if (res) {
                            _this._purchaseImgBase64 = null;
                            _this._onUnlocked.dispatch(_this);
                        }
                    }, this);
                    break;
                }
                case 3: {
                    Gamee2.Gamee.showSubscribeDialog(function (res) {
                        if (res)
                            _this._onUnlocked.dispatch(_this);
                    }, this);
                    break;
                }
            }
        };
        return LockedContentOverlay;
    }());
    Gameplay.LockedContentOverlay = LockedContentOverlay;
})(Gameplay || (Gameplay = {}));
var Gameplay;
(function (Gameplay) {
    var Peephole = (function () {
        function Peephole(layer, bike) {
            this._bike = bike;
            var add = Game.Global.game.add;
            this._layer = add.group(layer);
            this._layer.exists = false;
            this._cutout = add.image(0, 0, "atlas_A", "peepholeCutout", this._layer);
            this._cutout.scale.set(1.5);
            this._cutout.anchor.set(0.5);
            this._cutout.exists = false;
            this._cutout.visible = true;
            this._tBorder = add.image(0, 0, "atlas_A", "peepholeBorder", this._layer);
            this._tBorder.exists = false;
            this._bBorder = add.image(0, 0, "atlas_A", "peepholeBorder", this._layer);
            this._bBorder.exists = false;
            this._lBorder = add.image(0, 0, "atlas_A", "peepholeBorder", this._layer);
            this._lBorder.exists = false;
            this._rBorder = add.image(0, 0, "atlas_A", "peepholeBorder", this._layer);
            this._rBorder.exists = false;
            this.reset();
        }
        Object.defineProperty(Peephole.prototype, "active", {
            get: function () { return this._state != 0; },
            enumerable: true,
            configurable: true
        });
        Peephole.prototype.reset = function () {
            this._layer.visible = false;
            this._state = 0;
            console.log("reset: " + Gameplay.Gameplay.instance.timer.time);
        };
        Peephole.prototype.activate = function (size) {
            this._cutout.scale.set(Peephole.MAX_SIZE_SCALE - (Peephole.MAX_SIZE_SCALE - Peephole.MIN_SIZE_SCALE) * (size / 5));
            this._cutout.height = this._cutout.width = Math.round(this._cutout.width);
            this._layer.visible = true;
            this._layer.alpha = 0;
            this._state = 1;
            this._timer = Gameplay.Gameplay.instance.timer.time;
            this.updateLayout();
        };
        Peephole.prototype.deactivate = function () {
            if (this._state == 0)
                return;
            this._state = 2;
            this._timer = Gameplay.Gameplay.instance.timer.time;
            console.log("deactivate: " + Gameplay.Gameplay.instance.timer.time);
        };
        Peephole.prototype.update = function () {
            if (this._state == 0)
                return;
            if (this._state == 1) {
                var progress = (Gameplay.Gameplay.instance.timer.time - this._timer) / 1000;
                if (progress >= 1) {
                    progress = 1;
                    this._state = 3;
                }
                this._layer.alpha = Phaser.Easing.Cubic.Out(progress);
            }
            else if (this._state == 2) {
                var progress = (Gameplay.Gameplay.instance.timer.time - this._timer) / 1000;
                if (progress < 1) {
                    this._layer.alpha = 1 - Phaser.Easing.Cubic.In(progress);
                }
                else {
                    this.reset();
                }
            }
            this.updateLayout();
        };
        Peephole.prototype.updateLayout = function () {
            var cutout = this._cutout;
            var bikePos = this._bike.bodySprite;
            cutout.position.set(Math.floor(bikePos.x), Math.floor(bikePos.y));
            var cutoutSize = cutout.width;
            var cutoutX = cutout.x - (cutoutSize >> 1);
            var cutoutY = cutout.y - (cutoutSize >> 1);
            var view = Gameplay.Gameplay.instance.worldView;
            var viewX = view.viewLX;
            var viewY = view.viewTY;
            var viewW = view.viewRX - viewX + 1;
            var viewH = view.viewBY - viewY + 1;
            if (cutoutY > viewY) {
                this._tBorder.visible = true;
                this._tBorder.position.set(viewX, viewY);
                this._tBorder.width = viewW;
                this._tBorder.height = cutoutY - viewY;
            }
            else {
                this._tBorder.visible = false;
            }
            if (cutoutY + cutoutSize < viewY + viewH) {
                this._bBorder.visible = true;
                this._bBorder.position.set(viewX, cutoutY + cutoutSize);
                this._bBorder.width = viewW;
                this._bBorder.height = (viewY + viewH) - (cutoutY + cutoutSize);
            }
            else {
                this._bBorder.visible = false;
            }
            if (cutoutX > viewX) {
                this._lBorder.visible = true;
                this._lBorder.position.set(viewX, cutoutY > viewY ? cutoutY : viewY);
                this._lBorder.width = cutoutX - viewX;
                this._lBorder.height = cutoutY + cutoutSize - this._lBorder.y;
            }
            else {
                this._lBorder.visible = false;
            }
            if (cutoutX + cutoutSize < viewX + viewW) {
                this._rBorder.visible = true;
                this._rBorder.position.set(cutoutX + cutoutSize, cutoutY > viewY ? cutoutY : viewY);
                this._rBorder.width = viewX + viewW - this._rBorder.x;
                this._rBorder.height = cutoutY + cutoutSize - this._rBorder.y;
            }
            else {
                this._rBorder.visible = false;
            }
        };
        Peephole.MIN_SIZE_SCALE = 1.5;
        Peephole.MAX_SIZE_SCALE = 4;
        return Peephole;
    }());
    Gameplay.Peephole = Peephole;
})(Gameplay || (Gameplay = {}));
var HUD;
(function (HUD) {
    var Coins = (function () {
        function Coins() {
            var add = Game.Global.game.add;
            this._layer = add.group(null);
            this._layer.y = 20;
            var icon = add.image(0, 0, "atlas_A", "bnsCoin_0", this._layer);
            icon.x = -icon.width;
            icon.exists = false;
            icon.visible = true;
            this._value = add.bitmapText(-icon.width - 10, 0, "fntWhite60", "0", 60);
            this._value.anchor.set(1, 0);
            this._value.exists = false;
            this._value.visible = true;
            this._layer.add(this._value);
            this._valueFx = add.bitmapText(0, 0, "fntWhite60", "", 60);
            this._valueFx.anchor.set(0.5);
            this._valueFx.visible = this._valueFx.exists = false;
            this._layer.add(this._valueFx);
            icon.y = (this._layer.height - icon.height) >> 1;
            Game.Global.playerProfile.onCoinsChange.add(this.handleCoinsChange, this);
            Game.Global.scale.onResChange.add(this.handleResize, this);
            this.handleResize(Game.Global.scale.resolution);
        }
        Coins.prototype.reset = function (parent, timer) {
            this._timer = timer;
            this._curValue = Game.Global.playerProfile.coins;
            this._value.text = this._curValue.toString();
            this._valueFx.visible = false;
            this._layer.visible = true;
            parent.add(this._layer, true);
        };
        Coins.prototype.update = function () {
            if (this._valueFx.visible) {
                var progress = (this._timer.time - this._fxTime) / 750;
                if (progress >= 1) {
                    this._valueFx.visible = false;
                }
                else {
                    progress = Phaser.Easing.Cubic.Out(progress);
                    var scale = 1 + progress * 0.5;
                    this._valueFx.scale.set(scale, scale);
                    this._valueFx.alpha = 1 - progress;
                }
            }
        };
        Coins.prototype.bringToTop = function () {
            this._layer.parent.bringToTop(this._layer);
        };
        Coins.prototype.handleCoinsChange = function (coins) {
            this._value.text = coins.toString();
            this._valueFx.scale.set(1, 1);
            this._valueFx.alpha = 1;
            this._valueFx.visible = true;
            this._valueFx.text = this._value.text;
            this._valueFx.position.set(this._value.x - this._value.width / 2, this._value.y + this._value.height / 2);
            this._curValue = coins;
            this._fxTime = this._timer.time;
        };
        Coins.prototype.handleResize = function (res) {
            this._layer.x = res.x - 20;
        };
        return Coins;
    }());
    HUD.Coins = Coins;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var Countdown = (function () {
        function Countdown(timer) {
            this._timer = timer;
            var add = Game.Global.game.add;
            this._layer = add.group(null);
            this._layer.exists = false;
            this._bg = add.image(0, 0, "atlas_A", "stuntScoreBg", this._layer);
            this._bg.anchor.set(0.5);
            this._bg.scale.set(0.6);
            this._bg.position.set(this._bg.width * 0.5, this._bg.height * 0.5);
            this._bg.exists = false;
            this._bg.visible = true;
            this._value = add.bitmapText(this._layer.width / 2, this._layer.height / 2, "fntWhite60", "", 60);
            this._value.anchor.set(0.5);
            this._value.exists = false;
            this._value.visible = true;
            this._layer.add(this._value);
            this._flags = 0;
            Game.Global.scale.onResChange.add(this.handleResize, this);
            this.handleResize(Game.Global.scale.resolution);
        }
        Countdown.prototype.reset = function () {
            if (this._layer.parent != null) {
                this._layer.parent.removeChild(this._layer);
                this._flags = 0;
            }
        };
        Countdown.prototype.start = function () {
            this._flags = 1 | 2;
            this._time1 = this._timer.time;
            this._time2 = this._time1;
            this._countdownPos = 0;
            this._value.scale.set(1, 1);
            this._value.alpha = 1;
            this._value.text = Countdown.values[0];
            this._bg.alpha = 0;
            this._bg.scale.set(Countdown.BG_DEF_SCALE);
            this._layer.x = -this._layer.width;
            Gameplay.Gameplay.instance.hudLayer.add(this._layer);
        };
        Countdown.prototype.update = function () {
            if ((this._flags & 1) == 0)
                return false;
            var progress;
            if ((this._flags & 2) == 0) {
                progress = (this._timer.time - this._time2) / 750;
                if (progress > 1) {
                    if (++this._countdownPos >= Countdown.values.length - 1) {
                        if (this._countdownPos == Countdown.values.length) {
                            this.reset();
                            return false;
                        }
                        else {
                            this._flags |= 4;
                        }
                    }
                    Game.AudioUtils.playSound(this._countdownPos + 1 < Countdown.values.length ? "countdown1" : "countdown2");
                    this._value.text = Countdown.values[this._countdownPos];
                    this._time2 = this._timer.time;
                    progress = 0;
                }
                var i = Phaser.Easing.Cubic.Out(progress);
                this._value.alpha = 1 - i;
                i = 1 + 1 * i;
                this._value.scale.set(i, i);
                if ((this._flags & 4) != 0) {
                    i = Phaser.Easing.Cubic.Out(progress);
                    this._bg.alpha = 1 - i;
                    this._bg.scale.set(Countdown.BG_DEF_SCALE + (Countdown.BG_END_SCALE - Countdown.BG_DEF_SCALE) * i);
                }
            }
            else {
                var res = Game.Global.scale.resolution;
                var x1 = -this._layer.width;
                var x2 = (res.x - this._layer.width) / 2;
                if (x2 - x1 > 200)
                    x1 = x2 - 200;
                if ((progress = (this._timer.time - this._time1) / 750) > 1)
                    progress = 1;
                this._layer.x = x1 + (x2 - x1) * Phaser.Easing.Back.Out(progress);
                this._bg.alpha = Phaser.Easing.Cubic.Out(progress);
                if (progress == 1)
                    this._flags &= ~2;
            }
            return true;
        };
        Countdown.prototype.handleResize = function (res) {
            this._layer.y = res.y * 0.2;
        };
        Countdown.values = ["3", "2", "1", "GO!"];
        Countdown.BG_DEF_SCALE = 0.6;
        Countdown.BG_END_SCALE = 0.8;
        return Countdown;
    }());
    HUD.Countdown = Countdown;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var FuelGauge = (function () {
        function FuelGauge(timer, fuelTank, parent) {
            this._fuelTank = fuelTank;
            this._timer = timer;
            var add = Game.Global.game.add;
            this._container = add.group(parent);
            this._container.position.set(8, 7);
            this._bg = add.image(0, 0, "atlas_A", "fuelGaugeBg_" + "0", this._container);
            this._bg.exists = false;
            this._bg.visible = true;
            this._bar = add.image(78, 34, "atlas_A", "fuelGaugeBar_" + "0", this._container);
            this._barTotW = this._bar.width;
            this._bar.crop(new Phaser.Rectangle(0, 0, this._barTotW, this._bar.height), false);
            this._bar.exists = false;
            this._bar.visible = true;
            this._glow = add.image(0, 0, "atlas_A", "fuelGaugeGlow_" + "0", this._container);
            this._glow.visible = this._glow.exists = false;
            this._glow.position.set(this._container.width / 2, this._container.height / 2);
            this._glow.anchor.set(0.5);
            this._glowFxScaleX = ((this._glow.width + FuelGauge.GLOW_FX_SIZE) / this._glow.width) - 1;
            this._glowFxScaleY = ((this._glow.height + FuelGauge.GLOW_FX_SIZE) / this._glow.height) - 1;
            this._lowFuel = false;
        }
        FuelGauge.prototype.reset = function () {
            var assetId = (PowerUps.Manager.powerUps[1].active ? 1 : 0).toString();
            this._glow.visible = false;
            this._glow.frameName = "fuelGaugeGlow_" + assetId;
            this._bg.frameName = "fuelGaugeBg_" + assetId;
            this._bar.frameName = "fuelGaugeBar_" + assetId;
            this._tarBarWidth = this._barTotW;
            this._curBarWidth = this._barTotW;
            this._bar.visible = true;
            this._bar.cropRect.width = this._barTotW;
            this._bar.updateCrop();
            this._lowFuel = false;
        };
        FuelGauge.prototype.update = function () {
            var tankState = this._fuelTank.state;
            if (tankState <= FuelGauge.LOW_FUEL_TANK_STATE) {
                if (!this._lowFuel) {
                    this._lowFuel = true;
                    this._lowFuelBlinkTime = this._timer.time;
                }
            }
            else if (this._lowFuel) {
                this._lowFuel = false;
                this._bar.visible = true;
            }
            var w = Math.round(tankState * this._barTotW);
            if (w > this._tarBarWidth) {
                if (!this._glow.visible) {
                    this._glow.visible = true;
                    this._glow.scale.set(1);
                    this._glow.alpha = 1;
                    this._glowFxTime = this._timer.time;
                }
            }
            this._tarBarWidth = w;
            if (this._curBarWidth != this._tarBarWidth) {
                if (this._curBarWidth < this._tarBarWidth) {
                    this._curBarWidth += 1 * this._timer.delta;
                    if (this._curBarWidth > this._tarBarWidth)
                        this._curBarWidth = this._tarBarWidth;
                }
                else {
                    this._curBarWidth = this._tarBarWidth;
                }
                this._bar.cropRect.width = Math.round(this._curBarWidth);
                this._bar.updateCrop();
            }
            if (this._lowFuel && this._timer.time >= this._lowFuelBlinkTime) {
                this._lowFuelBlinkTime = this._timer.time + FuelGauge.LOW_FUEL_BLINK_INTERNVAL;
                this._bar.visible = !this._bar.visible;
            }
            if (this._glow.visible) {
                var progress = (this._timer.time - this._glowFxTime) / 750;
                if (progress >= 1) {
                    this._glow.visible = false;
                }
                else {
                    progress = Phaser.Easing.Cubic.Out(progress);
                    this._glow.alpha = 1 - progress;
                    this._glow.scale.set(1 + (this._glowFxScaleX * progress), 1 + (this._glowFxScaleY * progress));
                }
            }
        };
        FuelGauge.prototype.bringToTop = function () {
            this._container.parent.bringToTop(this._container);
        };
        FuelGauge.LOW_FUEL_TANK_STATE = 0.25;
        FuelGauge.LOW_FUEL_BLINK_INTERNVAL = 250;
        FuelGauge.GLOW_FX_SIZE = 40;
        return FuelGauge;
    }());
    HUD.FuelGauge = FuelGauge;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var KeepPlaying = (function () {
        function KeepPlaying(timer) {
            var _this = this;
            this._timer = timer;
            this._processFnc = [
                null,
                this.processShow,
                this.processHide
            ];
            var add = Game.Global.game.add;
            this._layer = add.group(null);
            add.image(0, 0, "atlas_A", "arrowBg", this._layer).scale.set(1, 1.2);
            var txt = add.bitmapText(this._layer.width / 2, 20, "fntWhite60", "KEEP PLAYING?", 60);
            txt.anchor.set(0.5, 0);
            this._layer.add(txt);
            var btnState = new Controls.ButtonState("atlas_A", "btnBlue_0");
            var btnType = new Controls.ButtonType(new Phaser.Point(0, 0), [btnState, new Controls.ButtonState("atlas_A", "btnBlue_1", 0, 5), btnState], new Phaser.Point(0.5, 0.48), this._layer);
            var btnContent = add.group(null);
            var btnIconKey;
            var btnTitle;
            btnIconKey = "iconVideo";
            btnTitle = "WATCH";
            add.image(0, 0, "atlas_A", btnIconKey, btnContent);
            txt = add.bitmapText(btnContent.width + 10, btnContent.height / 2, "fntWhite30", btnTitle, 30);
            txt.anchor.set(0, 0.6);
            btnContent.add(txt);
            btnContent.pivot.set(btnContent.width / 2, btnContent.height / 2);
            this._btnExtraLife = new Controls.Button(0, btnType, 0, 110, btnContent, false);
            this._btnExtraLife.x = (this._layer.width - this._btnExtraLife.width) / 2;
            this._btnExtraLife.onClick.add(function () {
                _this._res = true;
                _this._btnExtraLife.enabled = false;
                _this._btnNo.enabled = false;
                _this.reset();
            }, this);
            btnState = new Controls.ButtonState("atlas_A", "lblNoThanks");
            btnType = new Controls.ButtonType(new Phaser.Point(0, 0), [btnState, btnState, btnState], null, this._layer);
            this._btnNo = new Controls.Button(1, btnType, 0, 230, null, false);
            this._btnNo.x = (this._layer.width - this._btnNo.width) / 2;
            this._btnNo.onClick.add(function () {
                _this._state = 2;
                _this._stateTime = _this._timer.time;
                _this._btnExtraLife.enabled = false;
                _this._btnNo.enabled = false;
            }, this);
            Game.Global.scale.onResChange.add(this.handleResize, this);
            this.handleResize(Game.Global.scale.resolution);
        }
        Object.defineProperty(KeepPlaying.prototype, "result", {
            get: function () { return this._res; },
            enumerable: true,
            configurable: true
        });
        KeepPlaying.prototype.reset = function () {
            var parent = this._layer.parent;
            if (parent != null)
                parent.remove(this._layer, false, true);
            this._state = 3;
        };
        KeepPlaying.prototype.update = function () {
            if (this._state == 3)
                return false;
            var fnc = this._processFnc[this._state];
            if (fnc != null)
                return fnc.call(this);
            return true;
        };
        KeepPlaying.prototype.show = function () {
            this._btnExtraLife.enabled = false;
            this._btnNo.enabled = false;
            this._layer.alpha = 0;
            this._layer.x = -this._layer.width;
            Gameplay.Gameplay.instance.hudLayer.add(this._layer);
            this._state = 1;
            this._stateTime = this._timer.time;
            this._res = false;
        };
        KeepPlaying.prototype.processShow = function () {
            var progress = (this._timer.time - this._stateTime) / 750;
            if (progress > 1)
                progress = 1;
            progress = Phaser.Easing.Cubic.Out(progress);
            var x1 = -this._layer.width;
            var x2 = (Game.Global.scale.resolution.x - this._layer.width) / 2;
            this._layer.x = x1 + (x2 - x1) * progress;
            this._layer.alpha = progress;
            if (progress == 1) {
                this._btnExtraLife.enabled = true;
                this._btnNo.enabled = true;
                this._state = 0;
                this._stateTime = this._timer.time;
            }
            return true;
        };
        KeepPlaying.prototype.processHide = function () {
            var progress = (this._timer.time - this._stateTime) / 750;
            if (progress >= 1) {
                this.reset();
                return false;
            }
            progress = Phaser.Easing.Cubic.In(progress);
            var x2 = Game.Global.scale.resolution.x;
            var x1 = (x2 - this._layer.width) / 2;
            this._layer.x = x1 + (x2 - x1) * progress;
            this._layer.alpha = 1 - progress;
            return true;
        };
        KeepPlaying.prototype.handleResize = function (res) {
            this._layer.y = (res.y - this._layer.height) / 2;
            if (this._state == 0)
                this._layer.x = (res.x - this._layer.width) / 2;
        };
        return KeepPlaying;
    }());
    HUD.KeepPlaying = KeepPlaying;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var LoadingMessage = (function () {
        function LoadingMessage(timer) {
            this._timer = timer;
            this._msg = Game.Global.game.make.bitmapText(0, 0, "fntWhite60", "", 60);
            this._msg.exists = false;
            this._msg.visible = false;
        }
        LoadingMessage.prototype.show = function (x, y, parent) {
            this._dotCnt = 0;
            this.createMessageText();
            this._msg.visible = true;
            this._msg.position.set(x - (this._msg.width >> 1), y - (this._msg.height >> 1));
            parent.add(this._msg);
        };
        LoadingMessage.prototype.hide = function () {
            if (this._msg.visible) {
                this._msg.visible = false;
                this._msg.parent.remove(this._msg);
            }
        };
        LoadingMessage.prototype.update = function () {
            var dotCnt = Math.floor((this._timer.time % 2000) / 500);
            if (dotCnt != this._dotCnt) {
                this._dotCnt = dotCnt;
                this.createMessageText();
            }
        };
        LoadingMessage.prototype.createMessageText = function () {
            var text = LoadingMessage.MSG_BASE_PART;
            for (var i = 0; i < this._dotCnt; i++)
                text += ".";
            this._msg.text = text;
        };
        LoadingMessage.MSG_BASE_PART = "LOADING";
        return LoadingMessage;
    }());
    HUD.LoadingMessage = LoadingMessage;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var NoticeIcon = (function () {
        function NoticeIcon(x, y, parent, timer) {
            this._timer = timer;
            var add = Game.Global.game.add;
            this._layer = add.group(parent);
            this._layer.position.set(x, y);
            this._layer.exists = false;
            this._fx = add.image(0, 0, "atlas_A", "noticeIconFx", this._layer);
            this._fx.anchor.set(0.5);
            this._icon = add.image(0, 0, "atlas_A", "noticeIcon", this._layer);
            this._icon.anchor.set(0.5);
        }
        Object.defineProperty(NoticeIcon.prototype, "layer", {
            get: function () { return this._layer; },
            enumerable: true,
            configurable: true
        });
        NoticeIcon.prototype.update = function () {
            if (!this._layer.visible)
                return;
            var fxProgress = (this._timer.time % NoticeIcon.FX_LIFE_CYCLE_LEN) / NoticeIcon.FX_LIFE_CYCLE_LEN;
            this._fx.scale.set(1 + Phaser.Easing.Cubic.Out(fxProgress));
            this._fx.alpha = 0.5 - Phaser.Easing.Cubic.Out(fxProgress) * 0.5;
        };
        NoticeIcon.FX_LIFE_CYCLE_LEN = 750;
        return NoticeIcon;
    }());
    HUD.NoticeIcon = NoticeIcon;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var PowIcon = (function () {
        function PowIcon(parent) {
            this._image = Game.Global.game.add.image(0, 0, "atlas_A", undefined, parent);
            this._image.anchor.set(0.5);
            this._image.exists = false;
            this._image.visible = false;
            this._state = 3;
            this._moveLen = 0;
        }
        Object.defineProperty(PowIcon.prototype, "pow", {
            get: function () { return this._pow; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PowIcon.prototype, "reqUpdate", {
            get: function () { return this._state == 2 || this._moveLen != 0; },
            enumerable: true,
            configurable: true
        });
        PowIcon.prototype.reset = function (show, x, y) {
            if (!show) {
                this._image.visible = false;
                this._state = 3;
            }
            else {
                this._image.position.set(x, y);
                this._state = 0;
            }
            this._moveLen = 0;
        };
        PowIcon.prototype.update = function () {
            if (this._moveLen != 0) {
                this.processMove();
                if (this._moveLen == 0) {
                    if (this._state == 1)
                        this._state = 0;
                }
            }
            if (this._state == 2)
                this.processUse();
            return this.reqUpdate;
        };
        PowIcon.prototype.activate = function (pow, x1, y1, x2, y2) {
            this._pow = pow;
            this._image.frameName = pow.getIconKey();
            this._image.visible = true;
            this._image.position.set(x1, y1);
            this._moveX1 = x1;
            this._moveY1 = y1;
            this._moveX2 = x2;
            this._moveY2 = y2;
            this._moveLen = 750;
            this._moveEase = Phaser.Easing.Cubic.Out;
            this._moveTime = Gameplay.Gameplay.instance.timer.time;
            this._state = 1;
        };
        PowIcon.prototype.use = function () {
            this._pow.state = 3;
            this._useCounter = 20;
            this._useTime = Gameplay.Gameplay.instance.timer.time;
            this._state = 2;
        };
        PowIcon.prototype.move = function (targetX) {
            this._moveX1 = this._image.x;
            this._moveX2 = targetX;
            this._moveY1 = this._moveY2 = this._image.y;
            this._moveTime = Gameplay.Gameplay.instance.timer.time;
            this._moveLen = (Math.abs(targetX - this._moveX1) / 100) * 1000;
            this._moveEase = null;
        };
        PowIcon.prototype.setPos = function (x, y) {
            this._image.x = x;
            this._image.y = y;
            this._moveLen = 0;
            this._state = 0;
        };
        PowIcon.prototype.processUse = function () {
            var time = Gameplay.Gameplay.instance.timer.time;
            if (time >= this._useTime) {
                this._useTime = time + 100;
                this._useCounter--;
                if (!(this._image.visible = !this._image.visible) && this._useCounter <= 0) {
                    this._state = 3;
                    this._pow.state = 1;
                }
            }
        };
        PowIcon.prototype.processMove = function () {
            var progress = (Gameplay.Gameplay.instance.timer.time - this._moveTime) / this._moveLen;
            if (progress > 1)
                progress = 1;
            if (this._moveEase != null)
                progress = this._moveEase.call(this, progress);
            this._image.x = this._moveX1 + (this._moveX2 - this._moveX1) * progress;
            this._image.y = this._moveY1 + (this._moveY2 - this._moveY1) * progress;
            if (progress == 1)
                this._moveLen = 0;
        };
        return PowIcon;
    }());
    HUD.PowIcon = PowIcon;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var PowIconPanel = (function () {
        function PowIconPanel(parent) {
            this._layer = Game.Global.game.add.group(parent);
            this._layer.exists = false;
            this._iconsPool = new Collections.Pool(undefined, 1, true, function () {
                return new HUD.PowIcon(this._layer);
            }, this);
            this._icons = new Collections.LinkedList(1);
            this._activeIcons = new Collections.LinkedList(1);
        }
        PowIconPanel.prototype.reset = function () {
            var iconId = 0;
            this._icons.forEach(function (icon, node) {
                if (icon.pow.state == 2) {
                    icon.reset(true, PowIconPanel.ICONS_X + iconId * PowIconPanel.ICONS_SPACING, PowIconPanel.ICONS_Y);
                    iconId++;
                }
                else {
                    icon.reset(false);
                    this._iconsPool.returnItem(this._icons.removeNode(node));
                }
                return true;
            }, this);
            this._activeIcons.clear();
        };
        PowIconPanel.prototype.update = function () {
            this._activeIcons.forEach(this.updateIcon, this);
        };
        PowIconPanel.prototype.updateIcon = function (icon, node) {
            if (icon.update())
                return true;
            this._activeIcons.removeNode(node);
            if (icon.pow.state == 1)
                this.removeIcon(icon.pow.type);
            return true;
        };
        PowIconPanel.prototype.removeIcon = function (powType) {
            var moveIcons = false;
            var iconId = 0;
            this._icons.forEach(function (icon, node) {
                if (!moveIcons) {
                    if (icon.pow.type == powType) {
                        this._icons.removeNode(node);
                        this._iconsPool.returnItem(icon);
                        moveIcons = true;
                        return true;
                    }
                }
                else {
                    icon.move(PowIconPanel.ICONS_X + iconId * PowIconPanel.ICONS_SPACING);
                    this._activeIcons.add(icon);
                }
                iconId++;
                return true;
            }, this);
        };
        PowIconPanel.prototype.addPowerUp = function (pow, buyBtnX, buyBtnY) {
            var icon = this._iconsPool.getItem();
            icon.activate(pow, buyBtnX, buyBtnY, PowIconPanel.ICONS_X + this._icons.size * PowIconPanel.ICONS_SPACING, PowIconPanel.ICONS_Y);
            this._icons.add(icon);
            this._activeIcons.add(icon);
        };
        PowIconPanel.prototype.usePowerUp = function (pow) {
            this._icons.forEach(function (icon) {
                if (icon.pow.type == pow.type) {
                    icon.use();
                    this._activeIcons.add(icon);
                    return false;
                }
                return true;
            }, this);
            Game.AudioUtils.playSound("powerupBreak");
        };
        PowIconPanel.prototype.bringToTop = function () {
            this._layer.parent.bringToTop(this._layer);
        };
        PowIconPanel.ICONS_X = 112;
        PowIconPanel.ICONS_Y = 61;
        PowIconPanel.ICONS_SPACING = 40;
        return PowIconPanel;
    }());
    HUD.PowIconPanel = PowIconPanel;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var TapToPlay = (function () {
        function TapToPlay() {
            this._msg = Game.Global.game.make.bitmapText(0, 0, "fntWhite60", "TAP TO PLAY", 60);
            this._msg.anchor.set(0.5);
            this._msg.alpha = 0.5;
        }
        Object.defineProperty(TapToPlay.prototype, "position", {
            get: function () { return this._msg.position; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TapToPlay.prototype, "onInputDown", {
            get: function () { return this._onInputDown; },
            enumerable: true,
            configurable: true
        });
        TapToPlay.prototype.reset = function () {
            if (this._msg.parent != null)
                this._msg.parent.removeChild(this._msg);
            this._blinkTime = -1;
        };
        TapToPlay.prototype.update = function () {
            if (this._blinkTime < 0)
                return;
            if (this._blinkTime < Gameplay.Gameplay.instance.timer.time) {
                this._blinkTime = Gameplay.Gameplay.instance.timer.time + 250;
                this._msg.visible = !this._msg.visible;
            }
        };
        TapToPlay.prototype.show = function (onInputDown, parent, x, y) {
            this._onInputDown = onInputDown;
            this._msg.position.set(x, y);
            this._msg.visible = true;
            parent.addChild(this._msg);
            this._blinkTime = Gameplay.Gameplay.instance.timer.time + 250;
        };
        return TapToPlay;
    }());
    HUD.TapToPlay = TapToPlay;
})(HUD || (HUD = {}));
var Gameplay;
(function (Gameplay) {
    var BackgroundProps = (function () {
        function BackgroundProps(layer1ExtraH, layer2VerPos, layer2MinY) {
            this._layer1ExtraH = layer1ExtraH;
            this._layer2VerPos = layer2VerPos;
            this._layer2MinY = layer2MinY;
        }
        Object.defineProperty(BackgroundProps.prototype, "layer1ExtraH", {
            get: function () { return this._layer1ExtraH; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BackgroundProps.prototype, "layer2VerPos", {
            get: function () { return this._layer2VerPos; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BackgroundProps.prototype, "layer2MinY", {
            get: function () { return this._layer2MinY; },
            enumerable: true,
            configurable: true
        });
        return BackgroundProps;
    }());
    var MinorScreenBase = (function () {
        function MinorScreenBase() {
            var game = Game.Global.game;
            this._layer = game.add.group();
            this._layer.visible = this._layer.exists = false;
            this._bg1 = game.add.tileSprite(0, 0, 128, 128, "atlas_1", "bg_0_0", this._layer);
            this._bg1.scale.set(2, 2);
            this._bg2 = game.add.tileSprite(0, 0, 128, 128, "atlas_1", "bg_0_1", this._layer);
            this._bg2.scale.set(2, 2);
            this._bgId = -1;
            this.setBackground(0);
            game.add.graphics(0, 0, this._layer);
            var btnType = new Controls.ButtonType(new Phaser.Point(0, 0), [
                new Controls.ButtonState("atlas_A", "btnExit_0"),
                new Controls.ButtonState("atlas_A", "btnExit_1", 0, 3)
            ], new Phaser.Point(0.5, 0.5), this._layer);
            var btnContent = game.make.bitmapText(0, 0, "fntWhite30", "BACK", 30);
            btnContent.anchor.set(0.5, 0.55);
            this._backButton = new Controls.Button(0, btnType, 0, 20, btnContent, false);
        }
        Object.defineProperty(MinorScreenBase.prototype, "layer", {
            get: function () { return this._layer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MinorScreenBase.prototype, "backButton", {
            get: function () { return this._backButton; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MinorScreenBase.prototype, "visible", {
            get: function () { return this._layer.visible; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MinorScreenBase.prototype, "content", {
            get: function () { return this._content; },
            enumerable: true,
            configurable: true
        });
        MinorScreenBase.prototype.reset = function () {
            var parent = this._layer.parent;
            if (parent != null) {
                parent.removeChild(this._layer);
                this._layer.remove(this._content);
                this._content.visible = false;
                this._content = null;
                this._layer.visible = this._layer.exists = false;
                Game.Global.scale.onResChange.remove(this.handleResize, this);
            }
        };
        MinorScreenBase.prototype.show = function (content, darkLayerAlpha, bgId) {
            if (darkLayerAlpha === void 0) { darkLayerAlpha = 0.25; }
            this._bgDarkLayerAlpha = darkLayerAlpha;
            Game.Global.scale.onResChange.add(this.handleResize, this);
            this.handleResize(Game.Global.scale.resolution);
            if (bgId != undefined)
                this.setBackground(bgId);
            Game.Global.game.world.addChild(this._layer);
            this._layer.visible = this._layer.exists = true;
            this._layer.position.copyFrom(Game.Global.game.camera.position);
            this._layer.add(content);
            this._content = content;
            content.visible = true;
            this._backButton.onClick.removeAll();
        };
        MinorScreenBase.prototype.setBackground = function (bgId) {
            if (this._bgId != bgId) {
                this._bgId = bgId;
                var texId = Game.Global.enviroments[bgId].bgTexId;
                this._bg1.frameName = "bg_" + texId + "_0";
                this._bg2.frameName = "bg_" + texId + "_1";
                this.setBackgroundPosAndSize();
            }
        };
        MinorScreenBase.prototype.setBackgroundPosAndSize = function () {
            var res = Game.Global.scale.resolution;
            var bgProps = MinorScreenBase._bgProps[this._bgId];
            var bg2Y = Math.max(bgProps.layer2MinY, Math.round(res.y * bgProps.layer2VerPos));
            this._bg1.width = res.x;
            this._bg1.height = bg2Y + bgProps.layer1ExtraH;
            this._bg2.y = bg2Y;
            this._bg2.width = res.x;
            this._bg2.height = res.y - bg2Y;
        };
        MinorScreenBase.prototype.handleResize = function (res) {
            this.setBackgroundPosAndSize();
            this._layer.getChildAt(2).clear()
                .beginFill(0, this._bgDarkLayerAlpha)
                .drawRect(0, 0, res.x, res.y)
                .endFill();
        };
        MinorScreenBase._bgProps = [
            new BackgroundProps(190, 0.1, 100),
            new BackgroundProps(190, 0.1, 100),
            new BackgroundProps(24, 0.6, 290),
            new BackgroundProps(410, 0, 0)
        ];
        return MinorScreenBase;
    }());
    Gameplay.MinorScreenBase = MinorScreenBase;
})(Gameplay || (Gameplay = {}));
var PowSelection;
(function (PowSelection) {
    var BattleButton = (function () {
        function BattleButton(parent) {
            var btnType = new Controls.ButtonType(new Phaser.Point(0, 0), [
                new Controls.ButtonState("atlas_A", "btnBattle_0"),
                new Controls.ButtonState("atlas_A", "btnBattle_1"),
                new Controls.ButtonState("atlas_A", "btnBattle_0")
            ], undefined, parent);
            this._button = new Controls.Button(0, btnType, 0, 270, null, false);
        }
        Object.defineProperty(BattleButton.prototype, "onClick", {
            get: function () { return this._button.onClick; },
            enumerable: true,
            configurable: true
        });
        BattleButton.prototype.reset = function () {
            Gameplay.Gameplay.instance.screenOverlay.onStateProgress.remove(this.handleScreenOverlayStateProgress, this);
        };
        BattleButton.prototype.show = function () {
            this._button.enabled = true;
        };
        BattleButton.prototype.hide = function () {
            this._button.enabled = false;
            Gameplay.Gameplay.instance.screenOverlay.onStateProgress.add(this.handleScreenOverlayStateProgress, this);
        };
        BattleButton.prototype.handleResize = function (res) {
            this._button.x = res.x - this._button.width;
        };
        BattleButton.prototype.handleScreenOverlayStateProgress = function (overlay, state, progress, easedProgress) {
            if (progress == 1) {
                this.reset();
            }
            else {
                this._button.x = (Game.Global.scale.resolution.x - this._button.width) + this._button.width * easedProgress;
            }
        };
        return BattleButton;
    }());
    PowSelection.BattleButton = BattleButton;
})(PowSelection || (PowSelection = {}));
var PowSelection;
(function (PowSelection) {
    var BattleSettings = (function () {
        function BattleSettings(parent) {
            var game = Game.Global.game;
            this._panel = game.add.group(parent);
            this._panel.visible = false;
            this._settings = [];
            for (var i = 0; i < Gameplay.BattleCreator.SETTING_TITLES.length; i++)
                this._settings[i] = new Controls.FiveStepsValue(this._panel, Gameplay.BattleCreator.SETTING_TITLES[i], true)
                    .setPosition(0, i * 72);
            this._settings[0].value = Game.Global.battleSettings.gravity;
            this._settings[1].value = Game.Global.battleSettings.speed;
            this._settings[2].value = Game.Global.battleSettings.visibility;
        }
        Object.defineProperty(BattleSettings.prototype, "active", {
            get: function () { return this._state < 3; },
            enumerable: true,
            configurable: true
        });
        BattleSettings.prototype.reset = function () {
            this._panel.visible = false;
            this._hideProgress = 0;
            this._state = 4;
            Gameplay.Gameplay.instance.screenOverlay.onStateProgress.remove(this.handleScreenOverlayStateProgress, this);
        };
        BattleSettings.prototype.show = function () {
            this._panel.visible = true;
            this._panel.alpha = 1;
            this._time = Gameplay.Gameplay.instance.timer.time;
            this._hideProgress = 0;
            this._state = 0;
        };
        BattleSettings.prototype.hide = function (mode) {
            if (this._state != 0)
                return;
            if (mode == 0) {
                this._time = Gameplay.Gameplay.instance.timer.time;
                this._state = 1;
            }
            else {
                this._state = 2;
                Gameplay.Gameplay.instance.screenOverlay.onStateProgress.add(this.handleScreenOverlayStateProgress, this);
            }
        };
        BattleSettings.prototype.update = function () {
            var state = this._state;
            if (state >= 3)
                return state;
            if (state == 0) {
                if (Gameplay.Gameplay.instance.timer.time - this._time >= 2500)
                    this.hide(0);
            }
            else if (state == 1) {
                this._hideProgress = Phaser.Easing.Cubic.In((Gameplay.Gameplay.instance.timer.time - this._time) / 1000);
                if (this._hideProgress > 1)
                    this._hideProgress = 1;
            }
            if (this._hideProgress != 0) {
                var viewW = Game.Global.scale.resolution.x;
                var startX = (viewW - this._panel.width) / 2;
                this._panel.x = startX + (viewW - startX) * this._hideProgress;
                this._panel.alpha = 1 - this._hideProgress;
            }
            if (this._hideProgress >= 1) {
                this.reset();
                state = state == 1 ? 3 : 4;
                this._state = state;
            }
            return state;
        };
        BattleSettings.prototype.handleResize = function (res) {
            var startX = (res.x - this._panel.width) / 2;
            this._panel.x = startX + (res.x - startX) * this._hideProgress;
            this._panel.y = ((res.y - this._panel.height) / 2) - 60;
        };
        BattleSettings.prototype.handleScreenOverlayStateProgress = function (overlay, state, progress, easedProgress) {
            if (progress == 1) {
                this.reset();
            }
            else {
                this._hideProgress = easedProgress;
            }
        };
        return BattleSettings;
    }());
    PowSelection.BattleSettings = BattleSettings;
})(PowSelection || (PowSelection = {}));
var PowSelection;
(function (PowSelection) {
    var BikesButton = (function () {
        function BikesButton(parent) {
            this._layer = Game.Global.game.add.group(parent);
            this._layer.y = 150;
            var btnType = new Controls.ButtonType(new Phaser.Point(0, 0), [new Controls.ButtonState("atlas_A", "btnBikes_0"), new Controls.ButtonState("atlas_A", "btnBikes_1"), new Controls.ButtonState("atlas_A", "btnBikes_0")], undefined, this._layer);
            this._button = new Controls.Button(0, btnType, 0, 0, null, false);
            this._noticeIcon = new HUD.NoticeIcon(5, 5, this._layer, Gameplay.Gameplay.instance.timer);
            this._noticeIcon.layer.visible = false;
        }
        Object.defineProperty(BikesButton.prototype, "onClick", {
            get: function () { return this._button.onClick; },
            enumerable: true,
            configurable: true
        });
        BikesButton.prototype.reset = function () {
            Gameplay.Gameplay.instance.screenOverlay.onStateProgress.remove(this.handleScreenOverlayStateProgress, this);
            Game.Global.playerProfile.onUnannouncedBikeCntChange.remove(this.handleUnannouncedBikeCntChange, this);
        };
        BikesButton.prototype.show = function () {
            this._button.enabled = true;
            this._noticeIcon.layer.visible = Game.Global.playerProfile.unannouncedBikeCnt != 0;
            Game.Global.playerProfile.onUnannouncedBikeCntChange.add(this.handleUnannouncedBikeCntChange, this);
        };
        BikesButton.prototype.hide = function () {
            this._button.enabled = false;
            Gameplay.Gameplay.instance.screenOverlay.onStateProgress.add(this.handleScreenOverlayStateProgress, this);
        };
        BikesButton.prototype.update = function () {
            this._noticeIcon.update();
        };
        BikesButton.prototype.handleResize = function (res) {
            this._layer.x = res.x - this._button.width;
        };
        BikesButton.prototype.handleScreenOverlayStateProgress = function (overlay, state, progress, easedProgress) {
            if (progress == 1) {
                this.reset();
            }
            else {
                this._layer.x = (Game.Global.scale.resolution.x - this._button.width) + this._button.width * easedProgress;
            }
        };
        BikesButton.prototype.handleUnannouncedBikeCntChange = function (bikeCnt) {
            this._noticeIcon.layer.visible = bikeCnt != 0;
        };
        return BikesButton;
    }());
    PowSelection.BikesButton = BikesButton;
})(PowSelection || (PowSelection = {}));
var PowSelection;
(function (PowSelection) {
    var Panel = (function () {
        function Panel() {
            var _this = this;
            this._onSignal = new Phaser.Signal();
            this._layer = Game.Global.game.make.group(null);
            this._layer.visible = this._layer.exists = false;
            this._battleBtn = null;
            if (!Gamee2.Gamee.initialized || Gamee2.Gamee.initData.gameContext == "normal") {
                this._bikesBtn = new PowSelection.BikesButton(this._layer);
                this._bikesBtn.onClick.add(function () {
                    Game.AudioUtils.playSound("click");
                    _this._onSignal.dispatch(2);
                }, this);
                if (!Gamee2.Gamee.initialized || (Gamee2.Gamee.initData.platform != "web" && Gamee2.Gamee.initData.platform != "mobile_web")) {
                    this._battleBtn = new PowSelection.BattleButton(this._layer);
                    this._battleBtn.onClick.add(function () {
                        Game.AudioUtils.playSound("click");
                        _this._onSignal.dispatch(3);
                    }, this);
                }
            }
            else {
                this._bikesBtn = null;
                this._battleSettings = new PowSelection.BattleSettings(this._layer);
            }
            this._powerUps = new PowSelection.PowerUpsPanel(this._layer);
            this._powerUps.onButtonClick.add(this.handlePowerupClick, this);
            this._powerUpTmpTex = null;
        }
        Object.defineProperty(Panel.prototype, "onSignal", {
            get: function () { return this._onSignal; },
            enumerable: true,
            configurable: true
        });
        Panel.prototype.reset = function () {
            Game.Global.scale.onResChange.remove(this.handleResize, this);
            var gameplay = Gameplay.Gameplay.instance;
            gameplay.hudLayer.remove(this._layer);
            this._layer.visible = this._layer.exists = false;
            gameplay.screenOverlay.inputEnabled = false;
            gameplay.screenOverlay.onInputDown.remove(this.handleOverlayInputDown, this);
            gameplay.screenOverlay.onStateChange.remove(this.handleOverlayStateChange, this);
            if (this._bikesBtn)
                this._bikesBtn.reset();
            if (this._battleBtn)
                this._battleBtn.reset();
            if (this._battleSettings)
                this._battleSettings.reset();
        };
        Panel.prototype.show = function () {
            if (this._layer.parent != null)
                return;
            var gameplay = Gameplay.Gameplay.instance;
            gameplay.screenOverlay.show(0, 0.5, 0, undefined, true);
            gameplay.screenOverlay.inputEnabled = true;
            gameplay.hudCoins.bringToTop();
            gameplay.hudPowerUps.bringToTop();
            gameplay.hudLayer.addChild(this._layer);
            this._layer.visible = this._layer.exists = true;
            if (!this._battleSettings)
                this.showTapToPlay();
            gameplay.screenOverlay.onInputDown.addOnce(this.handleOverlayInputDown, this);
            if (this._bikesBtn != null)
                this._bikesBtn.show();
            if (this._battleBtn != null)
                this._battleBtn.show();
            if (this._battleSettings)
                this._battleSettings.show();
            this._powerUps.show();
            this._freePowerUp = null;
            gameplay.screenOverlay.onStateChange.add(this.handleOverlayStateChange, this);
            if (!Game.Global.scale.onResChange.has(this.handleResize, this)) {
                Game.Global.scale.onResChange.add(this.handleResize, this);
                this.handleResize(Game.Global.scale.resolution);
            }
        };
        Panel.prototype.update = function () {
            this._powerUps.update();
            if (this._bikesBtn)
                this._bikesBtn.update();
            if (this._battleSettings && this._battleSettings.active) {
                if (this._battleSettings.update() == 3) {
                    this.showTapToPlay();
                }
            }
        };
        Panel.prototype.showTapToPlay = function () {
            var gameplay = Gameplay.Gameplay.instance;
            gameplay.hudTapToPlay.show(gameplay.screenOverlay.onInputDown, gameplay.hudLayer, gameplay.camera.width / 2, (gameplay.camera.height - this._powerUps.height) / 2);
        };
        Panel.prototype.activatePowerup = function (button) {
            var pow = PowerUps.Manager.powerUps[button.id];
            pow.state = 2;
            Gameplay.Gameplay.instance.hudPowerUps.addPowerUp(pow, this._powerUps.getPowerUpBtnX(button.id) + button.width / 2, this._powerUps.getPowerUpBtnY(button.id) + button.height / 2);
            if (pow.type == 1) {
                Gameplay.Gameplay.instance.bike.fuel.reset();
                Gameplay.Gameplay.instance.hudFuel.reset();
            }
            this._powerUps.updateButtons();
            if (this._powerUps.freePowerup != null && this._powerUps.freePowerup.type == pow.type) {
                this._powerUps.cancelFreePowerup();
            }
            else {
                Gamee2.Gamee.logEvent("POWERUP_BOUGHT", pow.name);
            }
        };
        Panel.prototype.handlePowerupClick = function (button) {
            var _this = this;
            var pow = PowerUps.Manager.powerUps[button.id];
            if (this._powerUps.freePowerup != null && pow.type == this._powerUps.freePowerup.type) {
                if (Gamee2.Gamee.ready) {
                    Gamee2.Gamee.showAd(function (res) {
                        if (res) {
                            _this.activatePowerup(button);
                        }
                        else {
                            _this._powerUps.cancelFreePowerup();
                        }
                    }, this);
                }
                else {
                    this.activatePowerup(button);
                }
            }
            else if (Game.Global.playerProfile.coins >= pow.price) {
                Game.AudioUtils.playSound("purchase1");
                Game.Global.playerProfile.coins -= pow.price;
                Game.Global.playerProfile.validateBikesAnnouncedFlag();
                this.activatePowerup(button);
            }
        };
        Panel.prototype.handleOverlayInputDown = function () {
            var screenOverlay = Gameplay.Gameplay.instance.screenOverlay;
            if (this._bikesBtn)
                this._bikesBtn.hide();
            if (this._battleBtn)
                this._battleBtn.hide();
            if (this._battleSettings)
                this._battleSettings.hide(1);
            this._powerUps.hide();
            Gameplay.Gameplay.instance.hudTapToPlay.reset();
            screenOverlay.inputEnabled = false;
            screenOverlay.hide(750, Phaser.Easing.Cubic.In);
            if (this._freePowerUp != null)
                Gamee2.Gamee.logEvent("FREE_POWERUP", this._freePowerUp.name);
            Gamee2.Gamee.loadAd();
        };
        Panel.prototype.handleOverlayStateChange = function (overlay, state) {
            if (state == 0) {
                this.reset();
                this._onSignal.dispatch(0);
            }
        };
        Panel.prototype.handleResize = function (res) {
            if (this._layer.parent != null)
                Gameplay.Gameplay.instance.hudTapToPlay.position.set(res.x / 2, (res.y - this._powerUps.height) / 2);
            if (this._bikesBtn)
                this._bikesBtn.handleResize(res);
            if (this._battleBtn)
                this._battleBtn.handleResize(res);
            if (this._battleSettings)
                this._battleSettings.handleResize(res);
        };
        return Panel;
    }());
    PowSelection.Panel = Panel;
})(PowSelection || (PowSelection = {}));
var PowSelection;
(function (PowSelection) {
    var UpdatebleImage = (function (_super) {
        __extends(UpdatebleImage, _super);
        function UpdatebleImage(button, frame) {
            var _this = _super.call(this, Game.Global.game, 0, 0, "atlas_A", frame) || this;
            _this._button = button;
            return _this;
        }
        UpdatebleImage.prototype.update = function () {
            this._button.update();
        };
        return UpdatebleImage;
    }(Phaser.Image));
    var PowerUpButton = (function (_super) {
        __extends(PowerUpButton, _super);
        function PowerUpButton(id, x, y, parent, pow) {
            var _this = _super.call(this, id, PowerUpButton._type, x, y, null, false, [new Controls.ButtonState("atlas_A", pow.getBtnKey(0)), new Controls.ButtonState("atlas_A", pow.getBtnKey(1)), new Controls.ButtonState("atlas_A", pow.getBtnKey(2))], parent) || this;
            _this._glowImg = Game.Global.game.add.image(_this._image.width / 2, _this._image.height / 2, "atlas_A", "powerUpBtnGlow", _this._container);
            _this._glowImg.moveDown();
            _this._glowImg.anchor.set(0.5);
            _this._glowImg.exists = _this._glowImg.visible = false;
            _this._disImage = Game.Global.game.add.image(0, 0, _this._states[2].texture, _this._states[2].frame, _this._container);
            _this._disImage.exists = _this._disImage.visible = false;
            _this._disImageShowTime = -1;
            return _this;
        }
        Object.defineProperty(PowerUpButton.prototype, "image", {
            get: function () { return this._image; },
            enumerable: true,
            configurable: true
        });
        PowerUpButton.prototype.reset = function () {
            this._image.inputEnabled = true;
            this._disImage.visible = false;
            this._glowImg.visible = false;
            this._disImageShowTime = -1;
        };
        PowerUpButton.prototype.update = function () {
            if (this._disImageShowTime >= 0) {
                var progress = (Gameplay.Gameplay.instance.timer.time - this._disImageShowTime) / 750;
                if (progress >= 1) {
                    this.setState(2);
                    this.reset();
                }
                progress = Phaser.Easing.Cubic.Out(progress);
                this._disImage.alpha = progress;
                this._glowImg.alpha = PowerUpButton.GLOW_FX_ALPHA - progress * PowerUpButton.GLOW_FX_ALPHA;
                this._glowImg.scale.set(1 + 0.5 * progress);
            }
        };
        PowerUpButton.prototype.handlePointerUp = function (img, pointer, isOver) {
            if (this._state != 1)
                return;
            this.setState(0);
            if (isOver) {
                this._onClick.dispatch(this);
                this._type.onClick.dispatch(this);
                this._image.inputEnabled = false;
                this._disImage.alpha = 0;
                this._disImage.visible = true;
                this._disImageShowTime = Gameplay.Gameplay.instance.timer.time;
                this._glowImg.alpha = PowerUpButton.GLOW_FX_ALPHA;
                this._glowImg.scale.set(1);
                this._glowImg.visible = true;
            }
            else {
                this.setState(0);
            }
        };
        PowerUpButton.prototype.createImage = function (container, states) {
            var img = new UpdatebleImage(this, states[0].frame);
            container.addChild(img);
            return img;
        };
        PowerUpButton._type = new Controls.ButtonType();
        PowerUpButton.GLOW_FX_ALPHA = 0.4;
        return PowerUpButton;
    }(Controls.Button));
    PowSelection.PowerUpButton = PowerUpButton;
})(PowSelection || (PowSelection = {}));
var PowUnlocking;
(function (PowUnlocking) {
    var Image = (function () {
        function Image(parent) {
            if (Image._processFnc == undefined) {
                Image._processFnc = [
                    null,
                    this.processShow,
                    this.processHide,
                    this.processUnlock,
                    null,
                ];
            }
            this._onStateChange = new Phaser.Signal();
            var add = Game.Global.game.add;
            this._layer = add.group(parent);
            this._layer.exists = false;
            this._lightBeams = add.image(0, 0, "atlas_A", "lightBeams", this._layer);
            this._lightBeams.anchor.set(0.5);
            this._lightBeams.visible = false;
            this._lightBeams.exists = false;
            this._lockedImg = add.image(0, 0, "atlas_A", "btnExtraFuel_0", this._layer);
            this._lockedImg.exists = false;
            this._lockedImg.anchor.set(0.5);
            this._unlockedImg = add.image(0, 0, "atlas_A", "", this._layer);
            this._unlockedImg.exists = false;
            this._unlockedImg.anchor.set(0.5);
            this._lockIcon = add.image(0, 0, "atlas_A", "powerUpLock", this._layer);
            this._lockIcon.exists = false;
            this._lockIcon.anchor.set(0.5);
            this._lockIcon.scale.set(0.75);
            this._lockIcon.position.set((this._lockedImg.width - this._lockIcon.width) / 2, (this._lockedImg.height - this._lockIcon.height) / 2);
            Game.Global.scale.onResChange.add(this.handleResize, this);
            this.handleResize(Game.Global.scale.resolution);
        }
        Object.defineProperty(Image.prototype, "onStateChange", {
            get: function () { return this._onStateChange; },
            enumerable: true,
            configurable: true
        });
        Image.prototype.reset = function () {
            this._layer.visible = false;
            this._state = 4;
        };
        Image.prototype.show = function () {
            var powerUp = PowerUps.Manager.powerUps[Game.Global.powerUps.firstLockedPowerUpId];
            this._lightBeams.visible = false;
            this._unlockedImg.visible = false;
            this._unlockedImg.frameName = powerUp.getBtnKey(0);
            this._lockedImg.frameName = powerUp.getBtnKey(2);
            this._lockedImg.alpha = 1;
            this._lockedImg.visible = true;
            this._lockIcon.alpha = 1;
            this._lockIcon.scale.set(0.75);
            this._lockIcon.visible = true;
            this._layer.x = Game.Global.scale.resolution.x - this._layer.width / 2;
            this._layer.alpha = 0;
            this._layer.scale.set(1);
            this._layer.visible = true;
            this._state = 1;
            this._stateTime = Gameplay.Gameplay.instance.timer.time;
        };
        Image.prototype.hide = function () {
            if (this._state != 0)
                return;
            this._state = 2;
            this._stateTime = Gameplay.Gameplay.instance.timer.time;
        };
        Image.prototype.unlockPowerUp = function () {
            if (this._state != 0)
                return;
            this._unlockedImg.alpha = 0;
            this._unlockedImg.visible = true;
            this._lightBeams.alpha = 0;
            this._lightBeams.visible = true;
            this._state = 3;
            this._stateTime = Gameplay.Gameplay.instance.timer.time;
        };
        Image.prototype.update = function () {
            var fnc = Image._processFnc[this._state];
            if (fnc != null)
                fnc.call(this);
        };
        Image.prototype.processShow = function () {
            var progress = (Gameplay.Gameplay.instance.timer.time - this._stateTime) / 1000;
            if (progress > 1)
                progress = 1;
            var easedProg = Phaser.Easing.Cubic.Out(progress);
            this._layer.alpha = easedProg;
            var w = Game.Global.scale.resolution.x;
            this._layer.x = w - (w / 2) * easedProg;
            if (progress == 1) {
                this._state = 0;
                this._onStateChange.dispatch(0);
            }
        };
        Image.prototype.processHide = function () {
            var hw = Game.Global.scale.resolution.x / 2;
            var progress = (Gameplay.Gameplay.instance.timer.time - this._stateTime) / 1000;
            if (progress > 1) {
                this._layer.visible = false;
                this._state = 4;
                this._onStateChange.dispatch(4);
                return;
            }
            progress = Phaser.Easing.Cubic.In(progress);
            this._layer.x = hw + hw * progress;
            this._layer.alpha = 1 - progress;
        };
        Image.prototype.processUnlock = function () {
            var timer = Gameplay.Gameplay.instance.timer;
            var progress1 = (timer.time - this._stateTime) / 2000;
            if (progress1 >= 1) {
                this._state = 4;
                this._layer.visible = false;
                this._onStateChange.dispatch(4);
                return;
            }
            var progress2 = progress1 / 0.4;
            if (progress2 < 1 || this._lockedImg.visible) {
                if (progress2 >= 1) {
                    progress2 = 1;
                    this._lockedImg.visible = false;
                    this._lockIcon.visible = false;
                }
                this._lockedImg.alpha = 1 - progress2;
                this._unlockedImg.alpha = progress2;
                var easedProg = Phaser.Easing.Cubic.Out(progress2);
                this._lockIcon.alpha = 1 - easedProg;
                this._lockIcon.scale.set(0.75 + 2 * easedProg);
                this._lightBeams.alpha = easedProg;
                this._layer.scale.set(1 + 0.5 * Phaser.Easing.Elastic.Out(progress2));
            }
            if (progress1 >= 0.6) {
                progress2 = Phaser.Easing.Cubic.In((progress1 - 0.6) / 0.4);
                this._layer.scale.set(1.5 + 1 * progress2);
                this._layer.alpha = 1 - progress2;
            }
            this._lightBeams.angle += (timer.delta * 0.8);
        };
        Image.prototype.handleResize = function (res) {
            this._layer.y = (res.y / 2) - 100;
            if (this._state == 0 || this._state == 3)
                this._layer.x = res.x / 2;
        };
        return Image;
    }());
    PowUnlocking.Image = Image;
})(PowUnlocking || (PowUnlocking = {}));
var PowUnlocking;
(function (PowUnlocking) {
    var Panel = (function () {
        function Panel() {
            var game = Game.Global.game;
            this._layer = game.make.group(null);
            this._layer.exists = false;
            this._layer.visible = false;
            this._progBar = new PowUnlocking.ProgressBar(this._layer);
            this._progBar.onStateChange.add(this.handleProgBarStateChange, this);
            this._image = new PowUnlocking.Image(this._layer);
            this._image.onStateChange.add(this.handleImageStateChange, this);
        }
        Panel.prototype.reset = function () {
            var parent = this._layer.parent;
            if (parent != null) {
                this._layer.visible = this._layer.exists = false;
                parent.remove(this._layer, false, true);
            }
            this._state = 3;
        };
        Panel.prototype.update = function () {
            if (this._state == 3) {
                return false;
            }
            else if (this._state == 2) {
                if (Gameplay.Gameplay.instance.timer.time - this._stateTime >= 1500)
                    this.hide();
            }
            this._image.update();
            this._progBar.update();
            return true;
        };
        Panel.prototype.show = function (originDis, newDis) {
            var gameplay = Gameplay.Gameplay.instance;
            gameplay.hudLayer.add(this._layer);
            this._layer.visible = true;
            this._image.show();
            this._progBar.show(originDis, newDis);
            this._state = 0;
        };
        Panel.prototype.hide = function () {
            this._state = 1;
            this._image.hide();
            this._progBar.hide();
        };
        Panel.prototype.handleImageStateChange = function (state) {
            switch (state) {
                case 4: {
                    if (this._state == 5) {
                        Gamee2.Gamee.logEvent("POWERUP_UNLOCKED", Game.Global.powerUps.firstLockedPowerUp.name);
                        var nextPow = Game.Global.powerUps.unlockPowerUp();
                        if (nextPow == null) {
                            this.hide();
                        }
                        else {
                            this._state = 6;
                            this._image.show();
                            this._progBar.showNext();
                        }
                    }
                    break;
                }
                case 0: {
                    if (this._state == 6) {
                        this._state = 4;
                        this._progBar.fill();
                    }
                    break;
                }
            }
        };
        Panel.prototype.handleProgBarStateChange = function (state) {
            switch (state) {
                case 0: {
                    this._state = 4;
                    this._progBar.fill();
                    break;
                }
                case 5: {
                    this._state = 5;
                    this._image.unlockPowerUp();
                    Game.AudioUtils.playSound("powerupUnlock");
                    break;
                }
                case 6: {
                    this._state = 2;
                    this._stateTime = Gameplay.Gameplay.instance.timer.time;
                    break;
                }
                case 1: {
                    this.reset();
                    break;
                }
            }
        };
        return Panel;
    }());
    PowUnlocking.Panel = Panel;
})(PowUnlocking || (PowUnlocking = {}));
var PowUnlocking;
(function (PowUnlocking) {
    var ProgressBar = (function () {
        function ProgressBar(parent) {
            if (ProgressBar._processFnc == undefined) {
                ProgressBar._processFnc = [
                    null,
                    null,
                    this.processShow,
                    this.processHide,
                    this.processFill,
                    null,
                    null,
                ];
            }
            var add = Game.Global.game.add;
            var make = Game.Global.game.make;
            this._layer = add.group(parent);
            this._layer.exists = false;
            this._partLayer = add.group(this._layer);
            this._partPool = new Collections.Pool(undefined, 5, true, function () {
                return new Helpers.SimpleParticle(Gameplay.Gameplay.instance.timer, "atlas_A", undefined, 1, 0, Phaser.Easing.Cubic.Out);
            }, this);
            this._partList = new Collections.LinkedList(5);
            this._bg = add.image(0, 0, "atlas_A", "powerUpProgBarBg", this._layer);
            this._fill = add.image(0, 0, "atlas_A", "powerUpProgBarFill", this._layer);
            this._fill.crop(new Phaser.Rectangle(0, 0, this._fill.width, this._fill.height), false);
            this._title = make.bitmapText(this._bg.width / 2, this._bg.height / 2, "fntWhite30", "", 30);
            this._title.anchor.set(0.5, 0.59);
            this._layer.add(this._title);
            this._info = add.group(this._layer);
            this._info.y = this._layer.height + 20;
            this._info.add(make.bitmapText(0, 0, "fntWhite30", "SCORE", 30), true);
            var txt = make.bitmapText(this._info.width + 10, 0, "fntWhite30", "", 30);
            txt.tint = 0xef1471;
            this._info.add(txt, true);
            this._info.add(make.bitmapText(0, 0, "fntWhite30", " MORE POINTS TO UNLOCK", 30), true);
            Game.Global.scale.onResChange.add(this.handleResize, this);
            this.handleResize(Game.Global.scale.resolution);
            this._onStateChange = new Phaser.Signal();
        }
        Object.defineProperty(ProgressBar.prototype, "onStateChange", {
            get: function () { return this._onStateChange; },
            enumerable: true,
            configurable: true
        });
        ProgressBar.prototype.reset = function () {
            this._layer.visible = false;
            this._state = 1;
            this._partList.forEach(function (particle) {
                particle.reset();
                this._partPool.returnItem(particle);
                return true;
            }, this);
            this._partList.clear();
        };
        ProgressBar.prototype.update = function () {
            var fnc = ProgressBar._processFnc[this._state];
            if (fnc != null)
                fnc.call(this);
            this._partList.forEach(function (particle, node) {
                if (!particle.update())
                    this._partPool.returnItem(this._partList.removeNode(node));
                return true;
            }, this);
        };
        ProgressBar.prototype.show = function (startValue, endValue) {
            var pows = Game.Global.powerUps;
            this._curValue = startValue;
            this._tarValue = endValue;
            this._fill.cropRect.width = ((startValue - pows.lastUnlockPoints) / pows.firstLockedPowerUp.unlockPrice) * this._bg.width;
            this._fill.updateCrop();
            this._title.text = pows.firstLockedPowerUp.name;
            this.updateInfoText(pows.firstLockedPowerUp.unlockPrice - (startValue - pows.lastUnlockPoints));
            this._layer.alpha = 0;
            this._layer.visible = true;
            this._state = 2;
            this._stateTime = Gameplay.Gameplay.instance.timer.time;
        };
        ProgressBar.prototype.hide = function () {
            this._state = 3;
            this._stateTime = Gameplay.Gameplay.instance.timer.time;
        };
        ProgressBar.prototype.showNext = function () {
            var pow = Game.Global.powerUps.firstLockedPowerUp;
            this._title.text = pow.name;
            this.updateInfoText(pow.unlockPrice);
            this._fill.cropRect.width = 0;
            this._fill.updateCrop();
        };
        ProgressBar.prototype.fill = function () {
            if (this._curValue == this._tarValue) {
                this._state = 6;
                this._onStateChange.dispatch(6);
            }
            else {
                this._state = 4;
                this._partNextTime = Gameplay.Gameplay.instance.timer.time;
            }
        };
        ProgressBar.prototype.updateInfoText = function (remPoints) {
            var txt = this._info.children[1];
            txt.setText(remPoints.toString());
            this._info.children[2].x = txt.x + txt.width + 10;
            this._info.x = this._bg.x + (this._bg.width - this._info.width) / 2;
        };
        ProgressBar.prototype.processShow = function () {
            var progress = (Gameplay.Gameplay.instance.timer.time - this._stateTime) / 1000;
            if (progress > 1)
                progress = 1;
            var easedProg = Phaser.Easing.Cubic.Out(progress);
            var startPos = -this._layer.width / 2;
            var endPos = (Game.Global.scale.resolution.x - this._layer.width) / 2;
            this._layer.alpha = easedProg;
            this._layer.x = startPos + (endPos - startPos) * easedProg;
            if (progress == 1) {
                this._state = 0;
                this._onStateChange.dispatch(0);
            }
        };
        ProgressBar.prototype.processHide = function () {
            var progress = (Gameplay.Gameplay.instance.timer.time - this._stateTime) / 1000;
            if (progress >= 1) {
                this.reset();
                this._onStateChange.dispatch(1);
                return;
            }
            var easedProg = Phaser.Easing.Cubic.In(progress);
            var startPos = (Game.Global.scale.resolution.x - this._layer.width) / 2;
            this._layer.alpha = 1 - easedProg;
            this._layer.x = startPos - (startPos + (this._layer.width / 2)) * easedProg;
        };
        ProgressBar.prototype.processFill = function () {
            var timer = Gameplay.Gameplay.instance.timer;
            var pows = Game.Global.powerUps;
            var pow = pows.firstLockedPowerUp;
            this._curValue += 100 * timer.delta;
            if (this._curValue > this._tarValue)
                this._curValue = this._tarValue;
            this.updateInfoText(Math.max(0, Math.round(pow.unlockPrice - (this._curValue - pows.lastUnlockPoints))));
            var wRat = (this._curValue - pows.lastUnlockPoints) / pow.unlockPrice;
            if (wRat >= 1) {
                wRat = 1;
                this._curValue = pows.lastUnlockPoints + pow.unlockPrice;
            }
            this._fill.cropRect.width = this._bg.width * wRat;
            this._fill.updateCrop();
            if (timer.time >= this._partNextTime) {
                var rnd = Game.Global.game.rnd;
                var particle = this._partPool.getItem().show(this._partLayer, this._fill.width, this._fill.height * 0.75, 0, rnd.realInRange(50, 100), 1000, rnd.realInRange(0, 360), "platParticle_" + rnd.integerInRange(0, 1));
                this._partList.add(particle);
                this._partNextTime = timer.time + 50;
            }
            if (wRat == 1) {
                this._state = 5;
                this._onStateChange.dispatch(5);
            }
            else if (this._curValue == this._tarValue) {
                this._state = 6;
                this._onStateChange.dispatch(6);
            }
        };
        ProgressBar.prototype.handleResize = function (res) {
            this._layer.y = (res.y / 2) + 20;
            if (this._state != 2 && this._state != 3)
                this._layer.x = (res.x - this._layer.width) / 2;
        };
        return ProgressBar;
    }());
    PowUnlocking.ProgressBar = ProgressBar;
})(PowUnlocking || (PowUnlocking = {}));
var Helpers;
(function (Helpers) {
    var ScreenOverlay = (function () {
        function ScreenOverlay(parent, timer) {
            this._layer = Game.Global.game.add.graphics(0, 0, parent);
            this._layer.visible = this._layer.exists = false;
            this._onRedraw = new Phaser.Signal();
            this._onStateProgress = new Phaser.Signal();
            this._onStateChange = new Phaser.Signal();
            if (timer != undefined && timer != null) {
                this._timer = timer;
                this._ownTimer = false;
            }
            else {
                this._timer = new Helpers.GameTimer();
                this._ownTimer = true;
            }
            this._state = 0;
            Game.Global.scale.onResChange.add(this.handleResize, this);
        }
        Object.defineProperty(ScreenOverlay.prototype, "layer", {
            get: function () { return this._layer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScreenOverlay.prototype, "onRedraw", {
            get: function () { return this._onRedraw; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScreenOverlay.prototype, "onStateProgress", {
            get: function () { return this._onStateProgress; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScreenOverlay.prototype, "onStateChange", {
            get: function () { return this._onStateChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScreenOverlay.prototype, "onInputDown", {
            get: function () { return this._layer.events.onInputDown; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScreenOverlay.prototype, "inputEnabled", {
            get: function () { return this._layer.inputEnabled; },
            set: function (value) { this._layer.inputEnabled = value; },
            enumerable: true,
            configurable: true
        });
        ScreenOverlay.prototype.update = function () {
            if (this._state == 0 || this._state == 1)
                return;
            if (this._ownTimer)
                this._timer.update();
            var progress = (this._timer.time - this._stateTime) / this._stateLen;
            if (progress > 1)
                progress = 1;
            var easedProg = this._stateEase(progress);
            this._onStateProgress.dispatch(this, this._state, progress, easedProg);
            if (this._state == 2) {
                if (progress < 1) {
                    this._layer.alpha = easedProg;
                }
                else {
                    this._layer.alpha = 1;
                    this._state = 1;
                    this._onStateChange.dispatch(this, this._state);
                }
            }
            else {
                if (progress < 1) {
                    this._layer.alpha = 1 - easedProg;
                }
                else {
                    this.reset();
                    this._onStateChange.dispatch(this, this._state);
                }
            }
        };
        ScreenOverlay.prototype.reset = function () {
            if (this._layer.visible) {
                this._layer.visible = this._layer.exists = false;
                this._state = 0;
            }
        };
        ScreenOverlay.prototype.show = function (color, alpha, len, ease, bringToTop) {
            if (len === void 0) { len = 0; }
            if (bringToTop === void 0) { bringToTop = false; }
            this._color = color;
            this._alpha = alpha;
            if (len <= 0) {
                this._layer.alpha = 1;
                this._state = 1;
            }
            else {
                if (this._ownTimer)
                    this._timer.start();
                this._layer.alpha = 0;
                if (ease == undefined)
                    ease = Phaser.Easing.Linear;
                this._stateEase = ease;
                this._stateTime = this._timer.time;
                this._stateLen = len;
                this._state = 2;
            }
            this._layer.visible = this._layer.exists = true;
            if (bringToTop)
                this._layer.parent.bringToTop(this._layer);
            this.redraw();
            this._onStateChange.dispatch(this, this._state);
        };
        ScreenOverlay.prototype.hide = function (len, ease) {
            if (len === void 0) { len = 0; }
            if (len <= 0) {
                this.reset();
            }
            else {
                if (this._ownTimer)
                    this._timer.start();
                this._stateTime = this._timer.time;
                this._stateLen = len;
                this._stateEase = ease;
                this._state = 3;
            }
            this._onStateChange.dispatch(this, this._state);
        };
        ScreenOverlay.prototype.handleResize = function (res) {
            if (this._state != 0)
                this.redraw();
        };
        ScreenOverlay.prototype.redraw = function () {
            var camera = Game.Global.game.camera;
            this._layer.clear();
            this._layer.beginFill(this._color, this._alpha);
            this._layer.drawRect(0, 0, camera.width, camera.height);
            this._layer.endFill();
            this._onRedraw.dispatch(this._layer);
        };
        return ScreenOverlay;
    }());
    Helpers.ScreenOverlay = ScreenOverlay;
})(Helpers || (Helpers = {}));
var PowerUps;
(function (PowerUps) {
    var Manager = (function () {
        function Manager() {
            if (Manager.powerUps == undefined) {
                Manager.powerUps = [
                    new PowerUps.Entry(0, "TIRE SHIELD", 20000, 50, "TireShield"),
                    new PowerUps.Entry(1, "EXTRA FUEL", 40000, 50, "ExtraFuel"),
                    new PowerUps.Entry(2, "SPEED BOOST", 80000, 75, "Boost"),
                    new PowerUps.Entry(3, "DOUBLE MONEY", 120000, 100, "DoubleMoney")
                ];
            }
            this._fLockedPowerUpId = 0;
            this._lUnlockPoints = 0;
            this.ensureValidity();
        }
        Object.defineProperty(Manager.prototype, "firstLockedPowerUpId", {
            get: function () { return this._fLockedPowerUpId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Manager.prototype, "firstLockedPowerUp", {
            get: function () { return (this._fLockedPowerUpId >= 0 ? Manager.powerUps[this._fLockedPowerUpId] : null); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Manager.prototype, "lastUnlockPoints", {
            get: function () { return this._lUnlockPoints; },
            enumerable: true,
            configurable: true
        });
        Manager.prototype.unlockPowerUp = function () {
            this.firstLockedPowerUp.state = 1;
            this._lUnlockPoints += this.firstLockedPowerUp.unlockPrice;
            if (++this._fLockedPowerUpId == Manager.powerUps.length) {
                this._fLockedPowerUpId = -1;
                return null;
            }
            return Manager.powerUps[this._fLockedPowerUpId];
        };
        Manager.prototype.ensureValidity = function () {
            var pow = this.firstLockedPowerUp;
            if (pow == null)
                return;
            var unlockAll = (Gamee2.Gamee.initialized && Gamee2.Gamee.initData.gameContext == "battle");
            var remPoints = Game.Global.playerProfile.points - this._lUnlockPoints;
            while (pow != null && (unlockAll || pow.unlockPrice <= remPoints)) {
                remPoints -= this.firstLockedPowerUp.unlockPrice;
                pow = this.unlockPowerUp();
            }
        };
        return Manager;
    }());
    PowerUps.Manager = Manager;
})(PowerUps || (PowerUps = {}));
var PowerUps;
(function (PowerUps) {
    var Entry = (function () {
        function Entry(type, name, unlockPrice, price, assetsKey) {
            this._type = type;
            this._name = name;
            this._unlockPrice = unlockPrice;
            this._price = price;
            this._assetsKey = assetsKey;
            this._state = 0;
        }
        Object.defineProperty(Entry.prototype, "type", {
            get: function () { return this._type; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "name", {
            get: function () { return this._name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "active", {
            get: function () { return this._state == 2 || this._state == 3; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "state", {
            get: function () { return this._state; },
            set: function (value) { this._state = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "price", {
            get: function () { return this._price; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "unlockPrice", {
            get: function () { return this._unlockPrice; },
            enumerable: true,
            configurable: true
        });
        Entry.prototype.reset = function () {
            if (this._state != 0)
                this._state = 1;
        };
        Entry.prototype.getBtnKey = function (btnState) {
            return "btn" + this._assetsKey + "_" + btnState;
        };
        Entry.prototype.getIconKey = function () {
            return "icon" + this._assetsKey;
        };
        return Entry;
    }());
    PowerUps.Entry = Entry;
})(PowerUps || (PowerUps = {}));
var PowSelection;
(function (PowSelection) {
    var PowerUpsPanel = (function () {
        function PowerUpsPanel(parent) {
            var game = Game.Global.game;
            this._layer = game.add.group(parent);
            var btnX = 0;
            this._powerUpBtns = [];
            this._powerUpLocks = [];
            this._powerUpPriceTags = [];
            this._powerUpsPanel = game.add.group(this._layer);
            var powerUps = PowerUps.Manager.powerUps;
            for (var i = 0; i < powerUps.length; i++) {
                var pu = powerUps[i];
                var panel = game.add.group(this._powerUpsPanel);
                panel.x = btnX;
                var btn = new PowSelection.PowerUpButton(i, 0, 0, panel, pu);
                this._powerUpBtns.push(btn);
                if (pu.state == 0) {
                    var lock = game.add.image(btn.width, btn.height, "atlas_A", "powerUpLock", panel);
                    lock.scale.set(0.75);
                    lock.anchor.set(1, 1);
                    this._powerUpLocks.push(lock);
                }
                else {
                    this._powerUpLocks.push(null);
                }
                var priceTag = game.add.group(panel);
                game.add.image(0, 0, "atlas_A", "iconCoin1", priceTag);
                priceTag.addChild(game.make.bitmapText(42, 0, "fntWhite30", pu.price.toString(), 30));
                priceTag.position.set((btn.width - priceTag.width) / 2, btn.height + 10);
                this._powerUpPriceTags.push(priceTag);
                btnX += PowerUpsPanel.BUTTONS_SPACING;
            }
            this._freePowShaker = new Helpers.ValueShaker(100, 6, 0, 5, 0);
            this._freePowId = -1;
            this._freePowLabel = game.make.group(null);
            this._freePowLabel.visible = false;
            this._freePowLabel.exists = false;
            game.add.image(0, -5, "atlas_A", "iconVideo", this._freePowLabel).scale.set(0.7);
            this._freePowLabel.addChild(game.make.bitmapText(52, 0, "fntWhite30", "FREE", 30));
            this._freePowLabel.x = (this._powerUpBtns[0].width - this._freePowLabel.width) / 2;
            this._freePowLabel.y = this._powerUpPriceTags[0].y;
            this._progBarPanel = game.add.group(this._layer);
            this._progBarPanel.exists = false;
            this._progBarPanel.visible = true;
            this._progBarBg = game.add.image(0, 0, "atlas_A", "powerUpProgBarBg", this._progBarPanel);
            this._progBarFill = game.add.image(0, 0, "atlas_A", "powerUpProgBarFill", this._progBarPanel);
            this._progBarFill.crop(new Phaser.Rectangle(0, 0, this._progBarFill.width, this._progBarFill.height), false);
            this._progBarTitle = game.make.bitmapText(this._progBarPanel.width / 2, this._progBarPanel.height / 2, "fntWhite30", "", 30);
            this._progBarTitle.anchor.set(0.5, 0.59);
            this._progBarPanel.add(this._progBarTitle);
            this._progBarInfo = game.add.group(this._progBarPanel);
            this._progBarInfo.add(game.make.bitmapText(0, 0, "fntWhite30", "SCORE", 30), true);
            var txt = game.make.bitmapText(this._progBarInfo.width + 10, 0, "fntWhite30", "", 30);
            txt.tint = 0xef1471;
            this._progBarInfo.add(txt, true);
            this._progBarInfo.add(game.make.bitmapText(0, 0, "fntWhite30", "MORE POINTS TO UNLOCK", 30), true);
            this._progBarInfo.scale.set(0.80);
            this._progBarInfo.y = this._progBarPanel.height + 10;
            this._progBarPanel.x = (this._layer.width - this._progBarPanel.width) / 2;
            Game.Global.scale.onResChange.add(this.handleResize, this);
            this.handleResize(Game.Global.scale.resolution);
        }
        Object.defineProperty(PowerUpsPanel.prototype, "freePowerup", {
            get: function () { return (this._freePowId >= 0 ? PowerUps.Manager.powerUps[this._freePowId] : null); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PowerUpsPanel.prototype, "height", {
            get: function () { return this._layer.height; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PowerUpsPanel.prototype, "onButtonClick", {
            get: function () { return this._powerUpBtns[0].type.onClick; },
            enumerable: true,
            configurable: true
        });
        PowerUpsPanel.prototype.update = function () {
            if (this._freePowId >= 0) {
                var time = Gameplay.Gameplay.instance.timer.time;
                var active = this._freePowShaker.active;
                this._freePowShaker.update(time);
                if (!this._freePowShaker.active) {
                    if (active) {
                        this._freePowNextShakeTime = time + 1000;
                    }
                    else if (time >= this._freePowNextShakeTime) {
                        this._freePowShaker.start(time);
                        this._freePowShaker.update(time);
                    }
                }
                this._freePowLabel.parent.y = this._freePowShaker.value;
            }
        };
        PowerUpsPanel.prototype.reset = function () {
            Gameplay.Gameplay.instance.screenOverlay.onStateProgress.remove(this.handleScreenOverlayStateProgress, this);
            this._freePowShaker.reset();
        };
        PowerUpsPanel.prototype.show = function () {
            var powerUps = Game.Global.powerUps;
            var coins = Game.Global.playerProfile.coins;
            if (Game.Global.playerProfile.freePowerupDelay == 0 && (!Gamee2.Gamee.initialized || Gamee2.Gamee.adState == Gamee2.eAdState.ready)) {
                Game.Global.playerProfile.resetFreePowerupDelay();
                this.offerFreePowerup();
            }
            else {
                this.cancelFreePowerup();
            }
            for (var i = 0; i < PowerUps.Manager.powerUps.length; i++) {
                var pow = PowerUps.Manager.powerUps[i];
                var btn = this._powerUpBtns[i];
                btn.reset();
                if (pow.state == 0) {
                    btn.enabled = false;
                    this._powerUpLocks[i].visible = true;
                    this._powerUpPriceTags[i].visible = false;
                }
                else {
                    btn.enabled = (coins >= pow.price || this._freePowId == i);
                    if (this._powerUpLocks[i] != null)
                        this._powerUpLocks[i].visible = false;
                    if (this._freePowId != i) {
                        this._powerUpPriceTags[i].getChildAt(0).frameName = btn.enabled ? "iconCoin1" : "iconCoin2";
                        this._powerUpPriceTags[i].visible = true;
                    }
                }
            }
            this._progBarPanel.y = (powerUps.firstLockedPowerUpId == 0 ? PowerUpsPanel.PROGBAR_Y1 : PowerUpsPanel.PROGBAR_Y2);
            if (powerUps.firstLockedPowerUpId >= 0) {
                var nextPowerUp = PowerUps.Manager.powerUps[powerUps.firstLockedPowerUpId];
                this._progBarTitle.text = nextPowerUp.name;
                this._progBarFill.cropRect.width = ((Game.Global.playerProfile.points - powerUps.lastUnlockPoints) / nextPowerUp.unlockPrice) * this._progBarBg.width;
                this._progBarFill.updateCrop();
                var txt = this._progBarInfo.getChildAt(1);
                txt.text = (nextPowerUp.unlockPrice - (Game.Global.playerProfile.points - powerUps.lastUnlockPoints)).toString();
                this._progBarInfo.getChildAt(2).x = txt.x + txt.width + 10;
                this._progBarInfo.x = (this._progBarBg.width - this._progBarInfo.width) >> 1;
            }
            else {
                this._progBarPanel.visible = false;
            }
            this.updateContentPos();
        };
        PowerUpsPanel.prototype.hide = function () {
            Gameplay.Gameplay.instance.screenOverlay.onStateProgress.add(this.handleScreenOverlayStateProgress, this);
        };
        PowerUpsPanel.prototype.cancelFreePowerup = function () {
            if (this._freePowId < 0)
                return;
            this._powerUpPriceTags[this._freePowId].visible = true;
            this._freePowLabel.visible = false;
            this._freePowLabel.parent.y = 0;
            this._freePowId = -1;
        };
        PowerUpsPanel.prototype.updateButtons = function () {
            var coins = Game.Global.playerProfile.coins;
            for (var i = 0; i < PowerUps.Manager.powerUps.length; i++) {
                if (this._powerUpBtns[i].enabled && coins < PowerUps.Manager.powerUps[i].price && i != this._freePowId) {
                    this._powerUpBtns[i].enabled = false;
                    if (this._powerUpPriceTags[i].visible)
                        this._powerUpPriceTags[i].getChildAt(0).frameName = "iconCoin2";
                }
            }
        };
        PowerUpsPanel.prototype.getPowerUpBtnX = function (btnId) {
            return this._layer.x + this._powerUpsPanel.x + this._powerUpBtns[btnId].x;
        };
        PowerUpsPanel.prototype.getPowerUpBtnY = function (btnId) {
            return this._layer.y + this._powerUpsPanel.y + this._powerUpBtns[btnId].y;
        };
        PowerUpsPanel.prototype.offerFreePowerup = function () {
            var pows = Game.Global.powerUps;
            this._freePowId = Game.Global.game.rnd.integerInRange(0, (pows.firstLockedPowerUpId > 0 ? pows.firstLockedPowerUpId : PowerUps.Manager.powerUps.length) - 1);
            this._powerUpPriceTags[this._freePowId].visible = false;
            this._freePowLabel.visible = true;
            this._powerUpsPanel.getChildAt(this._freePowId).add(this._freePowLabel);
            this._freePowNextShakeTime = Gameplay.Gameplay.instance.timer.time + 1000;
        };
        PowerUpsPanel.prototype.handleScreenOverlayStateProgress = function (overlay, state, progress, easedProgress) {
            if (progress == 1) {
                this.reset();
            }
            else {
                this._layer.y = (Game.Global.scale.resolution.y - this._layer.height - PowerUpsPanel.PROGBAR_BOT_BORDER_OFFSET) + ((this._layer.height + PowerUpsPanel.PROGBAR_BOT_BORDER_OFFSET) * easedProgress);
            }
        };
        PowerUpsPanel.prototype.updateContentPos = function () {
            var res = Game.Global.scale.resolution;
            this._layer.x = (res.x - this._layer.width) / 2;
            this._layer.y = res.y - this._layer.height - PowerUpsPanel.PROGBAR_BOT_BORDER_OFFSET;
        };
        PowerUpsPanel.prototype.handleResize = function (res) {
            this.updateContentPos();
        };
        PowerUpsPanel.BUTTONS_SPACING = 150;
        PowerUpsPanel.PROGBAR_Y1 = 150;
        PowerUpsPanel.PROGBAR_Y2 = 190;
        PowerUpsPanel.PROGBAR_BOT_BORDER_OFFSET = 60;
        return PowerUpsPanel;
    }());
    PowSelection.PowerUpsPanel = PowerUpsPanel;
})(PowSelection || (PowSelection = {}));
var Ghost;
(function (Ghost) {
    var Entry = (function () {
        function Entry() {
        }
        Object.defineProperty(Entry.prototype, "time", {
            get: function () { return this._time; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "x", {
            get: function () { return this._x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "y", {
            get: function () { return this._y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "angle", {
            get: function () { return this._angle; },
            enumerable: true,
            configurable: true
        });
        Entry.prototype.load = function (dataView, dataOffset) {
            this._time = dataView.getUint32(dataOffset, false);
            this._x = dataView.getUint32(dataOffset + Entry.DATA_OFF_X, false);
            this._y = dataView.getInt16(dataOffset + Entry.DATA_OFF_Y, false);
            this._angle = dataView.getInt16(dataOffset + Entry.DATA_OFF_ANGLE, false);
        };
        Entry.save = function (time, bikeSprite, dataView, dataOffset) {
            dataView.setUint32(dataOffset, time, false);
            dataView.setUint32(dataOffset + Entry.DATA_OFF_X, Math.round(bikeSprite.x), false);
            dataView.setInt16(dataOffset + Entry.DATA_OFF_Y, Math.round(bikeSprite.y), false);
            dataView.setInt16(dataOffset + Entry.DATA_OFF_ANGLE, Math.round(Phaser.Math.radToDeg(bikeSprite.rotation)), false);
        };
        Entry.DATA_OFF_TIME = 0;
        Entry.DATA_OFF_X = 4;
        Entry.DATA_OFF_Y = Entry.DATA_OFF_X + 4;
        Entry.DATA_OFF_ANGLE = Entry.DATA_OFF_Y + 2;
        Entry.DATA_SIZE = Entry.DATA_OFF_ANGLE + 2;
        return Entry;
    }());
    Ghost.Entry = Entry;
})(Ghost || (Ghost = {}));
var Ghost;
(function (Ghost) {
    var Player = (function () {
        function Player(timer, parent) {
            this._timer = timer;
            this._flags = 0;
            this._visible = true;
            this._entryA = new Ghost.Entry();
            this._entryB = new Ghost.Entry();
            var add = Game.Global.game.add;
            this._sprite = add.image(0, 0, "atlas_A", "bike_0_ghost", parent);
            this._sprite.visible = this._sprite.exists = false;
            this._avatar = new HUD.Avatar(parent);
            World.ActCheckpoint.instance.onActivate.add(function () {
                this._cpEntriesBufOffset = this._entriesBufOffset;
            }, this);
        }
        Object.defineProperty(Player.prototype, "position", {
            get: function () { return this._sprite.position; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "complete", {
            get: function () { return (this._flags & 2) != 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "visible", {
            get: function () { return this._visible; },
            set: function (visible) {
                if (visible == this._visible)
                    return;
                this._visible = visible;
                if ((this._flags & (1 | 2)) != 0 && Gameplay.Gameplay.instance.mode != 7) {
                    this._sprite.visible = visible;
                    if (this._avatarReady)
                        this._avatar.container.visible = visible;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "score", {
            get: function () { return this._score; },
            enumerable: true,
            configurable: true
        });
        Player.prototype.init = function (entriesBuf, entriesBufLen, bikeType, score, avatarKey) {
            this._entriesBuf = new DataView(entriesBuf);
            this._entriesBufLen = entriesBufLen;
            this._bikeType = bikeType;
            this._score = score;
            if (avatarKey != undefined && Game.Global.game.cache.checkImageKey(avatarKey)) {
                this._avatar.show(0, 0, avatarKey);
                this._avatar.container.visible = false;
                this._avatarReady = true;
            }
            else {
                this._avatar.reset();
                this._avatarReady = false;
            }
            this._flags = 4;
        };
        Player.prototype.reset = function () {
            this._flags &= ~(1 | 2);
            if ((this._flags & 4) != 0) {
                this._timeOffset = 0;
                this._entriesBufOffset = 0;
                this._entryA.load(this._entriesBuf, this._entriesBufOffset);
                this._entriesBufOffset += Ghost.Entry.DATA_SIZE;
                this._entryB.load(this._entriesBuf, this._entriesBufOffset);
                this._entriesBufOffset += Ghost.Entry.DATA_SIZE;
                this.setSprite();
                this.updateSprite(0);
            }
            this._sprite.visible = false;
            this._avatar.container.visible = false;
        };
        Player.prototype.resetFromCP = function () {
            if ((this._flags & 1) == 0)
                return;
            if (this._cpEntriesBufOffset == this._entriesBufLen)
                return;
            this._flags &= ~(2 | 1);
            this._entriesBufOffset = this._cpEntriesBufOffset - Ghost.Entry.DATA_SIZE * 2;
            this._entryA.load(this._entriesBuf, this._entriesBufOffset);
            this._entriesBufOffset += Ghost.Entry.DATA_SIZE;
            this._entryB.load(this._entriesBuf, this._entriesBufOffset);
            this._entriesBufOffset += Ghost.Entry.DATA_SIZE;
            this._timeOffset = World.ActCheckpoint.instance.actTime - this._startTime;
            var time = this._timer.time - (this._timer.time - World.ActCheckpoint.instance.actTime + this._startTime);
            var progress = (time - this._entryA.time) / (this._entryB.time - this._entryA.time);
            this.setSprite();
            this._sprite.visible = false;
            this._avatar.container.visible = false;
            this.updateSprite(progress);
        };
        Player.prototype.start = function () {
            if ((this._flags & (1 | 2 | 4)) == 4) {
                this._flags |= 1;
                this._startTime = this._timer.time;
                var alpha = (Gamee2.Gamee.startFlags & Gamee2.eStartFlag.replay) != 0 ? 1 : 0;
                var visible = this._visible || Gameplay.Gameplay.instance.mode == 7;
                this._sprite.alpha = alpha;
                this._sprite.visible = visible;
                if (this._avatarReady) {
                    this._avatar.container.alpha = alpha;
                    this._avatar.container.visible = visible;
                }
            }
        };
        Player.prototype.update = function () {
            if ((this._flags & (1 | 2)) != 1)
                return;
            if (this._sprite.alpha != 1)
                this._sprite.alpha = this._avatar.container.alpha = Math.min(1, (this._timer.time - this._startTime) / 1500);
            var time = (this._timer.time - this._startTime) + this._timeOffset;
            if (this._entryB.time <= time) {
                if (this._entriesBufOffset == this._entriesBufLen) {
                    this._flags |= 2;
                    this.updateSprite(1);
                    this._sprite.frameName = "deadGhost";
                    this._sprite.anchor.set(0.5, 0.5);
                    this._sprite.angle = 0;
                    return;
                }
                else {
                    var entry = this._entryA;
                    this._entriesBufOffset;
                    entry.load(this._entriesBuf, this._entriesBufOffset);
                    this._entriesBufOffset += Ghost.Entry.DATA_SIZE;
                    this._entryA = this._entryB;
                    this._entryB = entry;
                }
            }
            var progress = (time - this._entryA.time) / (this._entryB.time - this._entryA.time);
            if (progress > 1)
                progress = 1;
            this.updateSprite(progress);
        };
        Player.prototype.setSprite = function () {
            this._sprite.frameName = this._bikeType.ghost.spriteKey;
            this._sprite.anchor.copyFrom(this._bikeType.ghost.anchor);
        };
        Player.prototype.updateSprite = function (progress) {
            this._sprite.x = this._entryA.x + (this._entryB.x - this._entryA.x) * progress;
            this._sprite.y = this._entryA.y + (this._entryB.y - this._entryA.y) * progress;
            this._sprite.angle = this._entryA.angle + (this._entryB.angle - this._entryA.angle) * progress;
            this._avatar.container.position.set(this._sprite.x, this._sprite.y - 140);
        };
        return Player;
    }());
    Ghost.Player = Player;
})(Ghost || (Ghost = {}));
var Ghost;
(function (Ghost) {
    var Recorder = (function () {
        function Recorder(timer, bike) {
            this._timer = timer;
            this._bike = bike;
            this._dataView = new DataView(new ArrayBuffer(Recorder.DATA_MAX_SIZE));
            this._dataOffset = 0;
            World.ActCheckpoint.instance.onActivate.add(function () {
                this._cpDataOffset = this._dataOffset;
                this._cpLastRecTime = this._lastRecTime;
            }, this);
        }
        Object.defineProperty(Recorder.prototype, "entryCnt", {
            get: function () { return this._dataOffset / Ghost.Entry.DATA_SIZE; },
            enumerable: true,
            configurable: true
        });
        Recorder.prototype.reset = function () {
            this._dataOffset = 0;
            this._recordTimeOffset = 0;
            this._recording = false;
        };
        Recorder.prototype.resetFromCP = function () {
            this._dataOffset = this._cpDataOffset;
            this._recordTimeOffset = World.ActCheckpoint.instance.actTime - this._recordStartTime;
            this._recording = false;
        };
        Recorder.prototype.start = function () {
            this._recording = true;
            this._recordStartTime = this._timer.time;
            this.saveRecord();
        };
        Recorder.prototype.stop = function () {
            this._recording = false;
        };
        Recorder.prototype.update = function () {
            if (this._recording && this._timer.time - this._lastSaveTime >= Recorder.SAVE_INTERVAL && this._dataOffset < Recorder.DATA_MAX_SIZE)
                this.saveRecord();
        };
        Recorder.prototype.initPlayer = function (player) {
            player.init(this._dataView.buffer.slice(0, this._dataOffset), this._dataOffset, this._bike.type, 0, "avatar");
        };
        Recorder.prototype.serialize = function (data) {
            data.bikeTypeUID = this._bike.type.uid;
            data.ghostEntries = Helpers.arrayBufferToBase64(this._dataView.buffer, this._dataOffset);
            data.ghostEntriesLen = this._dataOffset;
        };
        Recorder.prototype.saveRecord = function () {
            Ghost.Entry.save(this._timer.time + this._recordTimeOffset - this._recordStartTime, this._bike.bodySprite, this._dataView, this._dataOffset);
            this._dataOffset += Ghost.Entry.DATA_SIZE;
            this._lastSaveTime = this._timer.time;
        };
        Recorder.SAVE_INTERVAL = 1000 / 2;
        Recorder.DATA_MAX_SIZE = (1000 / Recorder.SAVE_INTERVAL) * 60 * 10 * Ghost.Entry.DATA_SIZE;
        return Recorder;
    }());
    Ghost.Recorder = Recorder;
})(Ghost || (Ghost = {}));
var Helpers;
(function (Helpers) {
    function arrayBufferToBase64(ab, len) {
        var binary = '';
        var bytes = new Uint8Array(ab);
        for (var i = 0; i < len; i++)
            binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    }
    Helpers.arrayBufferToBase64 = arrayBufferToBase64;
    function base64ToArrayBuffer(ab, base64) {
        var binary = atob(base64);
        var bytes = new Uint8Array(ab);
        var len = binary.length;
        for (var i = 0; i < len; i++)
            bytes[i] = binary.charCodeAt(i);
        return ab;
    }
    Helpers.base64ToArrayBuffer = base64ToArrayBuffer;
})(Helpers || (Helpers = {}));
var Helpers;
(function (Helpers) {
    var SimpleParticle = (function () {
        function SimpleParticle(timer, textureKey, frameKey, startAlpha, endAlpha, moveEase) {
            if (startAlpha === void 0) { startAlpha = 1; }
            if (endAlpha === void 0) { endAlpha = 0; }
            if (moveEase === void 0) { moveEase = null; }
            this._timer = timer;
            this._image = Game.Global.game.make.image(0, 0, textureKey, frameKey);
            this._image.anchor.set(0.5);
            this._image.visible = this._image.exists = false;
            this._startAlpha = startAlpha;
            this._endAlpha = endAlpha;
            this._moveEase = moveEase == undefined ? null : moveEase;
        }
        SimpleParticle.prototype.reset = function () {
            this._image.visible = this._image.exists = false;
            return this;
        };
        SimpleParticle.prototype.show = function (parent, startX, startY, moveX, moveY, moveLen, angle, frameKey) {
            if (angle === void 0) { angle = 0; }
            parent.add(this._image);
            this._image.frameName = frameKey;
            this._image.position.set(startX, startY);
            this._image.angle = angle;
            this._image.alpha = this._startAlpha;
            this._image.visible = true;
            this._startX = startX;
            this._startY = startY;
            this._moveX = moveX;
            this._moveY = moveY;
            this._moveLen = moveLen;
            this._startTime = this._timer.time;
            return this;
        };
        SimpleParticle.prototype.update = function () {
            var progress = (this._timer.time - this._startTime) / this._moveLen;
            if (progress >= 1) {
                this._image.visible = false;
                return false;
            }
            if (this._moveEase != null)
                progress = this._moveEase.call(this, progress);
            this._image.alpha = this._startAlpha - (this._startAlpha - this._endAlpha) * progress;
            this._image.position.set(this._startX + this._moveX * progress, this._startY + this._moveY * progress);
            return true;
        };
        return SimpleParticle;
    }());
    Helpers.SimpleParticle = SimpleParticle;
})(Helpers || (Helpers = {}));
var HUD;
(function (HUD) {
    var Avatar = (function () {
        function Avatar(parent) {
            var add = Game.Global.game.add;
            this._container = add.group(parent);
            this._container.visible = this._container.exists = false;
            this._image = add.image(1, 1, "atlas_A", "avatarFrame", this._container);
            this._frame = add.image(0, 0, "atlas_A", "avatarFrame", this._container);
            this._imageMask = add.graphics(0, 0, this._container);
            this._imageMask.beginFill(0xFFFFFF, 1);
            this._imageMask.drawCircle(this._frame.width / 2, this._frame.height / 2, this._frame.width - 2);
            this._imageMask.endFill();
            this._image.mask = this._imageMask;
            this._container.pivot.set(this._frame.width / 2, this._frame.height / 2);
        }
        Object.defineProperty(Avatar.prototype, "container", {
            get: function () { return this._container; },
            enumerable: true,
            configurable: true
        });
        Avatar.prototype.show = function (x, y, avatarKey, parent) {
            this._image.loadTexture(avatarKey);
            this._image.width = this._frame.width - 2;
            this._image.height = this._frame.height - 2;
            if (parent != undefined && this._container.parent != parent)
                parent.add(this._container);
            this._container.position.set(x, y);
            this._container.visible = true;
        };
        Avatar.prototype.reset = function () {
            this._container.visible = false;
        };
        return Avatar;
    }());
    HUD.Avatar = Avatar;
})(HUD || (HUD = {}));
var Helpers;
(function (Helpers) {
    var ValueShaker = (function () {
        function ValueShaker(cycleTime, cycleCnt, iniValue, valueMaxChange, mode) {
            this._cycleIniLen = cycleTime;
            this._cycleIniCnt = cycleCnt;
            this._cycleIniDis = valueMaxChange;
            this._iniValue = iniValue;
            this._mode = mode;
            this._outEase = this.linearEase;
            this._inEase = this.linearEase;
            this._active = false;
        }
        Object.defineProperty(ValueShaker.prototype, "active", {
            get: function () {
                return this._active;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ValueShaker.prototype, "value", {
            get: function () {
                return (this._active ? this._curValue : this._iniValue);
            },
            enumerable: true,
            configurable: true
        });
        ValueShaker.prototype.linearEase = function (value) {
            return value;
        };
        ValueShaker.prototype.start = function (time) {
            this._active = true;
            this._cycleStartTime = time;
            this._cycleLen = this._cycleIniLen;
            this._cycleDis = this._cycleIniDis;
            this._cycleCnt = 0;
        };
        ValueShaker.prototype.reset = function () {
            this._active = false;
        };
        ValueShaker.prototype.update = function (time) {
            if (!this._active)
                return this._iniValue;
            var cycleTotalTime = (time - this._cycleStartTime);
            do {
                var cycleTime = Math.min(cycleTotalTime, this._cycleLen);
                var cycleProgress = cycleTime / (this._cycleLen / 2);
                cycleTotalTime -= cycleTime;
                if (cycleProgress <= 1) {
                    this._curValue = this._outEase.call(this, cycleProgress) * this._cycleDis;
                }
                else {
                    if (cycleProgress > 2)
                        cycleProgress = 2;
                    this._curValue = this._inEase.call(this, 1 - (cycleProgress - 1)) * this._cycleDis;
                }
                if (cycleProgress == 2) {
                    if (++this._cycleCnt != this._cycleIniCnt) {
                        this._cycleStartTime += this._cycleLen;
                        this._cycleLen = (this._cycleIniLen / this._cycleIniCnt) * (this._cycleIniCnt - this._cycleCnt);
                        var cycleDir = (this._cycleDis > 0 ? -1 : 1);
                        this._cycleDis = (this._cycleIniDis / this._cycleIniCnt) * (this._cycleIniCnt - this._cycleCnt);
                        if (this._mode == 0) {
                            this._cycleDis *= cycleDir;
                        }
                        cycleTotalTime = time - this._cycleStartTime;
                    }
                    else {
                        this._active = false;
                        return this._iniValue;
                    }
                }
            } while (cycleTotalTime != 0);
            return this._iniValue + this._curValue;
        };
        return ValueShaker;
    }());
    Helpers.ValueShaker = ValueShaker;
})(Helpers || (Helpers = {}));
var Opponents;
(function (Opponents) {
    var Entry = (function () {
        function Entry(gameePlayer) {
            this._uid = gameePlayer.userID;
            this._name = gameePlayer.name;
            this._score = gameePlayer.highScore;
            this._avatarUrl = gameePlayer.avatar;
            this._flags = 8;
            this._replayData = null;
            this._overcomeAttemptCnt = 0;
        }
        Object.defineProperty(Entry.prototype, "uid", {
            get: function () { return this._uid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "name", {
            get: function () { return this._name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "score", {
            get: function () { return this._score; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "avatarUrl", {
            get: function () { return this._avatarUrl; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "avatarKey", {
            get: function () { return "avatar_" + this._uid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "replayLoaded", {
            get: function () { return (this._flags & 4) != 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "replayData", {
            get: function () { return this._replayData; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "avatarLoaded", {
            get: function () { return (this._flags & 1) != 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "overcomeAttemptCnt", {
            get: function () { return this._overcomeAttemptCnt; },
            set: function (attemptCnt) { this._overcomeAttemptCnt = attemptCnt; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entry.prototype, "valid", {
            get: function () { return (this._flags & 8) != 0; },
            enumerable: true,
            configurable: true
        });
        Entry.prototype.release = function () {
            if ((this._flags & 1) != 0) {
                this._flags &= ~(1 | 8);
                Game.Global.game.cache.removeImage(this.avatarKey, true);
            }
        };
        Entry.prototype.update = function (gameePlayer) {
            if (gameePlayer.userID == this._uid && this._score != gameePlayer.highScore) {
                this._score = gameePlayer.highScore;
                this._flags &= ~(4 | 2);
                this._replayData = null;
            }
        };
        Entry.prototype.setAvatarLoaded = function () {
            this._flags |= 1;
        };
        Entry.prototype.setReplayData = function (data) {
            if (data != null && data.length != 0) {
                this._flags |= 4;
                this._replayData = data;
                return true;
            }
            this._flags &= ~4;
            this._replayData = null;
            return false;
        };
        return Entry;
    }());
    Opponents.Entry = Entry;
})(Opponents || (Opponents = {}));
var Opponents;
(function (Opponents) {
    var Manager = (function () {
        function Manager() {
            this._opponents = new Collections.LinkedList(10);
            this._ghostOpponent = null;
            this._newGhostData = false;
            this._onAsyncComplete = new Phaser.Signal();
            this._opponentsTmpArray = [];
        }
        Object.defineProperty(Manager, "instance", {
            get: function () { return Manager._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Manager.prototype, "opponents", {
            get: function () { return this._opponents; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Manager.prototype, "ghostOpponent", {
            get: function () { return this._ghostOpponent; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Manager.prototype, "newGhostData", {
            get: function () { return this._newGhostData; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Manager.prototype, "onAsyncComplete", {
            get: function () { return this._onAsyncComplete; },
            enumerable: true,
            configurable: true
        });
        Manager.prototype.init = function (gameeFriends) {
            var _this = this;
            var i;
            var battle = (Gamee2.Gamee.initialized && Gamee2.Gamee.initData.gameContext == "battle");
            this._newGhostData = false;
            this._opponentsTmpArray.length = 0;
            if (gameeFriends != undefined && gameeFriends != null) {
                var _loop_1 = function () {
                    var friend = gameeFriends[i];
                    var opponent = null;
                    this_1._opponents.forEach(function (op, node) {
                        if (friend.userID == op.uid) {
                            opponent = op;
                            _this._opponents.removeNode(node);
                            return false;
                        }
                        return true;
                    }, this_1);
                    if (opponent != null) {
                        opponent.update(friend);
                    }
                    else {
                        opponent = new Opponents.Entry(friend);
                    }
                    this_1._opponentsTmpArray.push(opponent);
                };
                var this_1 = this;
                for (i = 0; i < gameeFriends.length; i++) {
                    _loop_1();
                }
            }
            this.releaseOpponents();
            this._opponentsTmpArray.forEach(function (opponent) {
                _this._opponents.add(opponent);
            }, this);
            if (this._ghostOpponent != null) {
                if (!this._ghostOpponent.valid || (++this._ghostOpponent.overcomeAttemptCnt % 3) == 0 && !battle) {
                    this._ghostOpponent = null;
                    this._newGhostData = true;
                }
            }
            if (this._opponents.size == 0) {
                this._onAsyncComplete.dispatch();
                return;
            }
            if (this._ghostOpponent == null) {
                if (!battle) {
                    this._opponentsTmpArray.sort(function (a, b) {
                        if (a.overcomeAttemptCnt < b.overcomeAttemptCnt)
                            return -1;
                        if (a.overcomeAttemptCnt > b.overcomeAttemptCnt)
                            return 1;
                        return 0;
                    });
                }
                this.selectGhostOpponent();
            }
            if (this._ghostOpponent != null && !this._ghostOpponent.replayLoaded) {
                this._newGhostData = true;
                this.loadGhostOpponentReplay();
            }
            else {
                this.loadGhostOpponentAvatar();
            }
        };
        Manager.prototype.selectGhostOpponent = function () {
            var opponents = this._opponentsTmpArray;
            if (opponents.length == 0)
                return (this._ghostOpponent = null);
            if (Gamee2.Gamee.initialized && Gamee2.Gamee.initData.gameContext != "battle") {
                var minAttemptCnt = opponents[0].overcomeAttemptCnt;
                var cnt = 1;
                for (var i = 1; i < opponents.length && opponents[i].overcomeAttemptCnt == minAttemptCnt; i++)
                    cnt++;
                return (this._ghostOpponent = opponents[Game.Global.game.rnd.integerInRange(0, cnt - 1)]);
            }
            else {
                return (this._ghostOpponent = opponents[0]);
            }
        };
        Manager.prototype.loadGhostOpponentReplay = function () {
            var _this = this;
            Gamee2.Gamee.requestPlayerReplay(function (replayData) {
                _this._ghostOpponent.setReplayData(replayData);
                if (!_this._ghostOpponent.replayLoaded) {
                    _this._opponentsTmpArray.splice(_this._opponentsTmpArray.indexOf(_this._ghostOpponent), 1);
                    _this.selectGhostOpponent();
                    if (_this._ghostOpponent != null && !_this._ghostOpponent.replayLoaded) {
                        _this.loadGhostOpponentReplay();
                        return;
                    }
                }
                _this.loadGhostOpponentAvatar();
            }, this, this._ghostOpponent.uid);
        };
        Manager.prototype.loadGhostOpponentAvatar = function () {
            var _this = this;
            if (this._ghostOpponent == null || this._ghostOpponent.avatarLoaded) {
                this._onAsyncComplete.dispatch();
                return;
            }
            if (this._loader == undefined) {
                this._loader = new Phaser.Loader(Game.Global.game);
                this._loader.crossOrigin = "anonymous";
                this._loader.onLoadComplete.add(function () {
                    _this._ghostOpponent.setAvatarLoaded();
                    _this._onAsyncComplete.dispatch();
                }, this);
            }
            this._loader.reset();
            this._loader.image(this._ghostOpponent.avatarKey, this._ghostOpponent.avatarUrl);
            this._loader.start();
        };
        Manager.prototype.releaseOpponents = function () {
            this._opponents.forEach(function (opponent) {
                opponent.release();
                return true;
            }, this);
            this._opponents.clear();
        };
        Manager._instance = new Manager();
        return Manager;
    }());
    Opponents.Manager = Manager;
})(Opponents || (Opponents = {}));
var Game;
(function (Game) {
    var PlayerProfile = (function () {
        function PlayerProfile() {
            this._onCoinsChange = new Phaser.Signal();
            this._onUnannouncedBikeCntChange = new Phaser.Signal();
            this._unannouncedBikeCnt = 0;
            this._freePowerupDelay = PlayerProfile.FREE_POWERUP_INTERVAL;
        }
        Object.defineProperty(PlayerProfile.prototype, "coins", {
            get: function () { return this._coins; },
            set: function (value) {
                if (this._coins != value) {
                    this._coins = value;
                    this._flags |= 4;
                    this._onCoinsChange.dispatch(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerProfile.prototype, "onCoinsChange", {
            get: function () { return this._onCoinsChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerProfile.prototype, "points", {
            get: function () { return this._points; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerProfile.prototype, "totalReachedDistance", {
            get: function () { return this._totReachedDis; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerProfile.prototype, "raceMaxReachedDistance", {
            get: function () { return this._raceMaxReachedDis; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerProfile.prototype, "gameMaxReacheddistance", {
            get: function () { return this._gameMaxReachedDis; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerProfile.prototype, "newMaxGameDistance", {
            get: function () { return (this._flags & 1) != 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerProfile.prototype, "newMaxRaceDistance", {
            get: function () { return (this._flags & 2) != 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerProfile.prototype, "battleSettingsBought", {
            get: function () { return (this._flags & 16) != 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerProfile.prototype, "bikeTypeUID", {
            get: function () { return this._bikeTypeUID; },
            set: function (uid) {
                if (this._bikeTypeUID != uid) {
                    this._bikeTypeUID = uid;
                    this._flags |= 4;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerProfile.prototype, "unannouncedBikeCnt", {
            get: function () { return this._unannouncedBikeCnt; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerProfile.prototype, "onUnannouncedBikeCntChange", {
            get: function () { return this._onUnannouncedBikeCntChange; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerProfile.prototype, "freePowerupDelay", {
            get: function () { return this._freePowerupDelay; },
            enumerable: true,
            configurable: true
        });
        PlayerProfile.prototype.reset = function () {
            this._flags = 0;
            this._coins = 0;
            this._points = 0;
            this._totReachedDis = 0;
            this._raceMaxReachedDis = 0;
            this._gameMaxReachedDis = 0;
            this._bikeTypeUID = Game.Global.NORMAL_DEF_BIKE_UID;
            this._unlockedBikesMask = (1 << Game.Global.NORMAL_DEF_BIKE_UID);
            this._announcedBikesMask = 0;
            this._unannouncedBikeCnt = 0;
            if (Gamee2.Gamee.initialized && Gamee2.Gamee.initData.gameContext == "battle")
                this._bikeTypeUID = Game.Global.BATTLE_BIKE_UID;
        };
        PlayerProfile.prototype.fromSerializedString = function (dataText) {
            if (dataText.length != 0) {
                var data = JSON.parse(dataText);
                this._flags = 0;
                this._coins = data.coins != undefined ? data.coins : 0;
                this._points = data.points != undefined ? data.points : 0;
                this._totReachedDis = data.totReachedDis != undefined ? data.totReachedDis : 0;
                this._raceMaxReachedDis = data.raceMaxReachedDis != undefined ? data.raceMaxReachedDis : 0;
                this._gameMaxReachedDis = 0;
                this._bikeTypeUID = data.bikeTypeUID != undefined ? data.bikeTypeUID : Game.Global.NORMAL_DEF_BIKE_UID;
                this._unlockedBikesMask = data.unlockedBikes != undefined ? data.unlockedBikes : 2;
                this._announcedBikesMask = data.announcedBikes != undefined ? data.announcedBikes : 0;
                this._freePowerupDelay = data.freePowUpDelay != undefined ? data.freePowUpDelay : PlayerProfile.FREE_POWERUP_INTERVAL;
                if (data.battleSetBought != undefined && data.battleSetBought)
                    this._flags |= 16;
                if (Gamee2.Gamee.initialized && Gamee2.Gamee.initData.gameContext == "battle")
                    this._bikeTypeUID = Game.Global.BATTLE_BIKE_UID;
            }
            else {
                this.reset();
            }
        };
        PlayerProfile.prototype.toSerializedString = function () {
            var data = {
                coins: this._coins,
                points: this._points,
                totReachedDis: this._totReachedDis,
                raceMaxReachedDis: this._raceMaxReachedDis,
                bikeTypeUID: this._bikeTypeUID,
                unlockedBikes: this._unlockedBikesMask,
                announcedBikes: this._announcedBikesMask,
                freePowUpDelay: this._freePowerupDelay,
                battleSetBought: (this._flags & 16) != 0
            };
            return JSON.stringify(data);
        };
        PlayerProfile.prototype.saveRaceResult = function (distance, points) {
            this._flags &= ~(1 | 2);
            this._totReachedDis += distance;
            if (this._gameMaxReachedDis < distance) {
                this._gameMaxReachedDis = distance;
                this._flags |= (1 | 4);
                if (distance > this._raceMaxReachedDis) {
                    this._flags |= 2;
                    this._raceMaxReachedDis = distance;
                }
            }
            this._points += points;
            if (Game.Global.powerUps.firstLockedPowerUpId != 0 && this._freePowerupDelay != 0)
                this._freePowerupDelay--;
        };
        PlayerProfile.prototype.resetFreePowerupDelay = function () {
            this._freePowerupDelay = PlayerProfile.FREE_POWERUP_INTERVAL;
        };
        PlayerProfile.prototype.save = function (onlyImmediateRequest) {
            if (onlyImmediateRequest === void 0) { onlyImmediateRequest = false; }
            if ((this._flags & 4) != 0 && (!onlyImmediateRequest || (this._flags & 8) != 0)) {
                this.resetSaveRequest();
                if (Gamee2.Gamee.initialized)
                    Gamee2.Gamee.gameSave(this.toSerializedString());
            }
        };
        PlayerProfile.prototype.resetSaveRequest = function () {
            this._flags &= ~(4 | 8);
        };
        PlayerProfile.prototype.handleBattleSettingsPurchased = function () {
            this._flags |= (16 | 4 | 8);
            this.save();
        };
        PlayerProfile.prototype.isBikeUnlocked = function (bikeType) {
            if (!bikeType.gameeCurrencyPrice || bikeType.gameeCurrencyPrice.currency != 3)
                return (this._unlockedBikesMask & (1 << bikeType.uid)) != 0;
            return Gamee2.Gamee.initialized && Gamee2.Gamee.initData.playerMembershipType == "vip";
        };
        PlayerProfile.prototype.unlockBike = function (bikeType) {
            if (bikeType.gameeCurrencyPrice.currency == 3 || this.isBikeUnlocked(bikeType))
                return;
            this.setBikeAnnouncedFlag(bikeType);
            this._unlockedBikesMask |= (1 << bikeType.uid);
            this._flags |= 4 | 8;
        };
        PlayerProfile.prototype.setBikeAnnouncedFlag = function (bikeType) {
            if (bikeType.canBePurchasedNews) {
                this._announcedBikesMask |= (1 << bikeType.uid);
                this._onUnannouncedBikeCntChange.dispatch(--this._unannouncedBikeCnt);
                this._flags |= 4;
            }
        };
        PlayerProfile.prototype.getBikeAnnouncedFlag = function (bikeType) {
            return (this._announcedBikesMask & (1 << bikeType.uid)) != 0;
        };
        PlayerProfile.prototype.validateBikesAnnouncedFlag = function () {
            var newsCnt = 0;
            Game.Global.bikeTypes.forEach(function (bike) {
                if (bike.ingameCurrencyPrice) {
                    var bikeMask = (1 << bike.uid);
                    if (bike.canBePurchased) {
                        if ((this._announcedBikesMask & bikeMask) == 0)
                            newsCnt++;
                    }
                    else if ((this._announcedBikesMask & bikeMask) != 0) {
                        this._announcedBikesMask &= ~bikeMask;
                        this._flags |= 4;
                    }
                }
            }, this);
            if (this._unannouncedBikeCnt != newsCnt) {
                this._unannouncedBikeCnt = newsCnt;
                this._onUnannouncedBikeCntChange.dispatch(newsCnt);
            }
        };
        PlayerProfile.FREE_POWERUP_INTERVAL = 4;
        return PlayerProfile;
    }());
    Game.PlayerProfile = PlayerProfile;
})(Game || (Game = {}));
var PopupMessage;
(function (PopupMessage) {
    var MessageBase = (function () {
        function MessageBase(timer, type) {
            this._active = false;
            this._timer = timer;
            this._type = type;
        }
        Object.defineProperty(MessageBase.prototype, "startY", {
            get: function () { return this._startY; },
            enumerable: true,
            configurable: true
        });
        MessageBase.prototype.update = function () {
            if (!this._active)
                return false;
            var time = this._timer.time - this._time;
            if (!this._type.updateMessage(time, this)) {
                this._active = false;
                return false;
            }
            return true;
        };
        MessageBase.prototype.kill = function () {
            this._active = false;
            this.getMsgContainer().visible = false;
        };
        MessageBase.prototype.showMessage = function (x, y, type) {
            var msg = this.getMsgContainer();
            msg.x = x;
            msg.y = y;
            msg.alpha = 1;
            msg.visible = true;
            this._startY = y;
            this._time = this._timer.time;
            this._active = true;
            if (type != undefined)
                this._type = type;
        };
        return MessageBase;
    }());
    PopupMessage.MessageBase = MessageBase;
})(PopupMessage || (PopupMessage = {}));
var PopupMessage;
(function (PopupMessage) {
    var MessageType = (function () {
        function MessageType(moveDistance, moveTime, moveEase, alphaDelay, alphaTime, alphaEase) {
            this._moveDistance = moveDistance;
            this._moveTime = moveTime;
            this._moveEase = moveEase;
            this._alphaDelay = alphaDelay;
            this._alphaTime = alphaTime;
            this._alphaEase = alphaEase;
        }
        Object.defineProperty(MessageType.prototype, "moveDistance", {
            get: function () { return this._moveDistance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "moveTime", {
            get: function () { return this._moveTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "moveEase", {
            get: function () { return this._moveEase; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "alphaDelay", {
            get: function () { return this._alphaDelay; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "alphaTime", {
            get: function () { return this._alphaTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "alphaEase", {
            get: function () { return this._alphaEase; },
            enumerable: true,
            configurable: true
        });
        MessageType.prototype.updateMessage = function (time, msg) {
            var completeMask = 0;
            var msgContainer = msg.getMsgContainer();
            var progress = time / this._moveTime;
            if (progress >= 1) {
                progress = 1;
                completeMask |= 1;
            }
            msgContainer.y = msg.startY - (this._moveEase(progress) * this._moveDistance);
            if (time > this._alphaDelay) {
                progress = (time - this._alphaDelay) / this._alphaTime;
                if (progress >= 1) {
                    progress = 1;
                    completeMask |= 2;
                }
                msgContainer.alpha = 1 - this._alphaEase(progress);
            }
            if (completeMask == 3)
                return false;
            return true;
        };
        return MessageType;
    }());
    PopupMessage.MessageType = MessageType;
})(PopupMessage || (PopupMessage = {}));
var SlideMessage;
(function (SlideMessage) {
    var eMessageState;
    (function (eMessageState) {
        eMessageState[eMessageState["completed"] = 0] = "completed";
        eMessageState[eMessageState["slideIn"] = 1] = "slideIn";
        eMessageState[eMessageState["slideOutDelay"] = 2] = "slideOutDelay";
        eMessageState[eMessageState["slideOut"] = 3] = "slideOut";
    })(eMessageState = SlideMessage.eMessageState || (SlideMessage.eMessageState = {}));
    var MessageBase = (function () {
        function MessageBase(timer, type) {
            this._state = eMessageState.completed;
            this._timer = timer;
            this._type = type;
            this._onStateChange = new Phaser.Signal();
        }
        Object.defineProperty(MessageBase.prototype, "state", {
            get: function () { return this._state; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageBase.prototype, "onStateChange", {
            get: function () { return this._onStateChange; },
            enumerable: true,
            configurable: true
        });
        MessageBase.prototype.update = function () {
            if (this._state == eMessageState.completed)
                return false;
            var state = this._type.updateMessage(this._timer.time - this._time, this);
            if (state != this._state) {
                this._state = state;
                this._time = this._timer.time;
                this.onStateChange.dispatch(state);
            }
            return this._state != eMessageState.completed;
        };
        MessageBase.prototype.kill = function () {
            this.getMsgContainer().visible = false;
            this._state = eMessageState.completed;
        };
        MessageBase.prototype.setPosition = function (x, y) {
            var container = this.getMsgContainer();
            var pos = (container.fixedToCamera ? container.cameraOffset : container.position);
            pos.x = x;
            if (y != undefined)
                pos.y = y;
        };
        MessageBase.prototype.showMessage = function (type) {
            if (type != undefined)
                this._type = type;
            this._time = this._timer.time;
            this._state = eMessageState.slideIn;
            var msg = this.getMsgContainer();
            msg.alpha = type.slideInAlphaStart;
            msg.visible = true;
            this.setPosition(this._type.getMsgStartX(this), Math.round(this._type.slideArea.y + (this._type.slideArea.height - msg.height) / 2));
            this.onStateChange.dispatch(eMessageState.slideIn);
        };
        return MessageBase;
    }());
    SlideMessage.MessageBase = MessageBase;
})(SlideMessage || (SlideMessage = {}));
var SlideMessage;
(function (SlideMessage) {
    var MessageType = (function () {
        function MessageType(slideDir, slideArea, slideInTime, slideInEase, slideInAlphaStart, slideInAlphaEase, slideOutTime, slideOutDelay, slideOutEase, slideOutAlphaEnd, slideOutAlphaEase) {
            this._dir = slideDir;
            this._slideArea = slideArea;
            this._slideInTime = slideInTime;
            this._slideInEase = slideInEase;
            this._slideInAlphaStart = slideInAlphaStart;
            this._slideInAlphaEase = (slideInAlphaEase == undefined || slideInAlphaEase == null ? slideInEase : slideInAlphaEase);
            this._slideOutTime = slideOutTime;
            this._slideOutDelay = slideOutDelay;
            this._slideOutEase = slideOutEase;
            this._slideOutAlphaEnd = slideOutAlphaEnd;
            this._slideOutAlphaEase = (slideOutAlphaEase == undefined || slideOutAlphaEase == null ? slideOutEase : slideOutAlphaEase);
        }
        Object.defineProperty(MessageType.prototype, "slideArea", {
            get: function () { return this._slideArea; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideDir", {
            get: function () { return this._dir; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideInTime", {
            get: function () { return this._slideInTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideInEase", {
            get: function () { return this._slideInEase; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideInAlphaStart", {
            get: function () { return this._slideInAlphaStart; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideInAlphaEase", {
            get: function () { return this._slideInAlphaEase; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideOutTime", {
            get: function () { return this._slideOutTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideOutDelay", {
            get: function () { return this._slideOutDelay; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideOutEase", {
            get: function () { return this._slideOutEase; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideOutAlphaEnd", {
            get: function () { return this._slideOutAlphaEnd; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageType.prototype, "slideOutAlphaEase", {
            get: function () { return this._slideOutAlphaEase; },
            enumerable: true,
            configurable: true
        });
        MessageType.prototype.updateMessage = function (time, msg) {
            var msgContainer = msg.getMsgContainer();
            var res = msg.state;
            switch (res) {
                case SlideMessage.eMessageState.slideIn: {
                    var progress = time / this._slideInTime;
                    if (progress >= 1) {
                        progress = 1;
                        res = SlideMessage.eMessageState.slideOutDelay;
                    }
                    if (this._slideInAlphaStart != 1)
                        msgContainer.alpha = this._slideInAlphaStart + this._slideInAlphaEase(progress) * (1 - this._slideInAlphaStart);
                    var startX = this.getMsgStartX(msg);
                    msg.setPosition(startX + this._slideInEase(progress) * (this.getMsgCenterX(msg) - startX));
                    break;
                }
                case SlideMessage.eMessageState.slideOutDelay: {
                    if (time < this._slideOutDelay)
                        break;
                    res = SlideMessage.eMessageState.slideOut;
                    break;
                }
                case SlideMessage.eMessageState.slideOut: {
                    var progress = time / this._slideOutTime;
                    if (progress >= 1) {
                        msgContainer.visible = false;
                        res = SlideMessage.eMessageState.completed;
                        break;
                    }
                    var centerX = this.getMsgCenterX(msg);
                    msg.setPosition(centerX + (this.getMsgEndX(msg) - centerX) * this._slideOutEase(progress));
                    if (this._slideOutAlphaEnd != 1)
                        msgContainer.alpha = 1 - (1 - this._slideOutAlphaEnd) * this._slideOutAlphaEase(progress);
                    break;
                }
            }
            return res;
        };
        MessageType.prototype.getMsgStartX = function (msg) {
            return (this._dir < 0 ? this._slideArea.right : this._slideArea.x - msg.getMsgContainer().width);
        };
        MessageType.prototype.getMsgCenterX = function (msg) {
            return this._slideArea.x + (this._slideArea.width - msg.getMsgContainer().width) / 2;
        };
        MessageType.prototype.getMsgEndX = function (msg) {
            return (this._dir < 0 ? this._slideArea.x - msg.getMsgContainer().width : this._slideArea.right);
        };
        return MessageType;
    }());
    SlideMessage.MessageType = MessageType;
})(SlideMessage || (SlideMessage = {}));
var Gameplay;
(function (Gameplay) {
    var BikeControls = (function () {
        function BikeControls(parentLayer) {
            if (!Game.Global.game.device.desktop) {
                this._btnLayer = Game.Global.game.add.group(parentLayer);
                var btnType = new Controls.ButtonType(new Phaser.Point(0.5), undefined, undefined, this._btnLayer);
                this._buttons = [
                    new Controls.Button(BikeControls.BUTTON_TILT_LEFT, btnType, 0, 0, null, false, [new Controls.ButtonState("atlas_A", "btnLeft_0"), new Controls.ButtonState("atlas_A", "btnLeft_1")]),
                    new Controls.Button(BikeControls.BUTTON_TILT_RIGHT, btnType, 0, 0, null, false, [new Controls.ButtonState("atlas_A", "btnRight_0"), new Controls.ButtonState("atlas_A", "btnRight_1")]),
                    new Controls.Button(BikeControls.BUTTON_THRUST, btnType, 0, 0, null, false, [new Controls.ButtonState("atlas_A", "btnForward_0"), new Controls.ButtonState("atlas_A", "btnForward_1")]),
                    new Controls.Button(BikeControls.BUTTON_BREAK, btnType, 0, 0, null, false, [new Controls.ButtonState("atlas_A", "btnBack_0"), new Controls.ButtonState("atlas_A", "btnBack_1")]),
                ];
                Game.Global.scale.onResChange.add(this.handleResize, this);
                this.handleResize(Game.Global.scale.resolution);
            }
            else {
                this._btnLayer = null;
            }
            this._keyLeft = Game.Global.game.input.keyboard.addKey(Phaser.KeyCode.LEFT);
            this._keyRight = Game.Global.game.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
            this._keyUp = Game.Global.game.input.keyboard.addKey(Phaser.KeyCode.UP);
            this._keyDown = Game.Global.game.input.keyboard.addKey(Phaser.KeyCode.DOWN);
        }
        Object.defineProperty(BikeControls.prototype, "visible", {
            get: function () { return this._btnLayer != null && this._btnLayer.visible; },
            set: function (visible) {
                if (this._btnLayer != null)
                    this._btnLayer.visible = this._btnLayer.exists = visible;
            },
            enumerable: true,
            configurable: true
        });
        BikeControls.prototype.update = function () {
            var bike = Gameplay.Gameplay.instance.bike;
            var desktop = Game.Global.game.device.desktop;
            if (this._keyLeft.isDown || (!desktop && this._buttons[BikeControls.BUTTON_TILT_LEFT].pressed)) {
                bike.tilt(-1);
            }
            else if (this._keyRight.isDown || (!desktop && this._buttons[BikeControls.BUTTON_TILT_RIGHT].pressed)) {
                bike.tilt(1);
            }
            else {
                bike.stopTilt();
            }
            if (this._keyUp.isDown || (!desktop && this._buttons[BikeControls.BUTTON_THRUST].pressed)) {
                bike.engineOn = true;
            }
            else {
                bike.engineOn = false;
                if (this._keyDown.isDown || (!desktop && this._buttons[BikeControls.BUTTON_BREAK].pressed)) {
                    bike.break = true;
                }
                else {
                    bike.break = false;
                }
            }
        };
        BikeControls.prototype.handleResize = function (res) {
            var y = Math.round(res.y * 0.77);
            this._buttons[BikeControls.BUTTON_TILT_LEFT].x = 110;
            this._buttons[BikeControls.BUTTON_TILT_LEFT].y = y;
            this._buttons[BikeControls.BUTTON_TILT_RIGHT].x = 256;
            this._buttons[BikeControls.BUTTON_TILT_RIGHT].y = y;
            this._buttons[BikeControls.BUTTON_THRUST].x = res.x - 110;
            this._buttons[BikeControls.BUTTON_THRUST].y = Math.round(res.y * 0.65);
            this._buttons[BikeControls.BUTTON_BREAK].x = res.x - 210;
            this._buttons[BikeControls.BUTTON_BREAK].y = Math.round(res.y * 0.78);
        };
        BikeControls.BUTTON_TILT_LEFT = 0;
        BikeControls.BUTTON_TILT_RIGHT = 1;
        BikeControls.BUTTON_THRUST = 2;
        BikeControls.BUTTON_BREAK = 3;
        return BikeControls;
    }());
    Gameplay.BikeControls = BikeControls;
})(Gameplay || (Gameplay = {}));
var World;
(function (World) {
    var BgLayer = (function () {
        function BgLayer(parent, atlasKey, frameKey, scale, defY, hRatio, vRatio) {
            var res = Game.Global.scale.resolution;
            var frame = Game.Global.game.cache.getFrameByName(atlasKey, frameKey);
            this._sprite = Game.Global.game.add.tileSprite(0, 0, res.x, frame.height, atlasKey, frameKey, parent);
            this._sprite.fixedToCamera = true;
            this._sprite.scale.set(scale, scale);
            Game.Global.scale.onResChange.add(this.handleResize, this);
            this._defY = defY;
            this._hRatio = hRatio / scale;
            this._vRatio = vRatio;
        }
        BgLayer.prototype.setFrame = function (frameKey, defY) {
            this._sprite.frameName = frameKey;
            this._defY = defY;
        };
        BgLayer.prototype.update = function (viewX, viewY) {
            this._sprite.tilePosition.x = -Math.round(viewX * this._hRatio);
            this._sprite.cameraOffset.y = Math.round(this._defY - (viewY * this._vRatio));
        };
        BgLayer.prototype.handleResize = function (res) {
            this._sprite.width = res.x;
            this._sprite.height = res.y;
        };
        return BgLayer;
    }());
    World.BgLayer = BgLayer;
})(World || (World = {}));
var World;
(function (World) {
    var AssetCoinAnim = (function () {
        function AssetCoinAnim(animKey, frameKey, frameCnt, frameRate) {
            this._animKey = animKey;
            this._frameKey = frameKey;
            this._frameCnt = frameCnt;
            this._frameRate = frameRate;
        }
        AssetCoinAnim.prototype.playAnimation = function (sprite) {
            if (!sprite.animations.getAnimation(this._animKey))
                sprite.animations.add(this._animKey, Phaser.Animation.generateFrameNames(this._frameKey, 0, this._frameCnt - 1), this._frameRate, true, false);
            sprite.play(this._animKey);
        };
        return AssetCoinAnim;
    }());
    World.AssetCoinAnim = AssetCoinAnim;
    var Assets = (function () {
        function Assets(uid, name, terrainTexId, terrainVOffset, bgTexId, bgLayerDefY, decoGroupId, coinAnim) {
            this._uid = uid;
            this._name = name;
            this._terrainTexId = terrainTexId;
            this._terrainVOffset = terrainVOffset;
            this._bgTexId = bgTexId;
            this._bgLayerDefY = bgLayerDefY;
            this._decoGroupId = decoGroupId;
            this._coinAnim = coinAnim;
        }
        Object.defineProperty(Assets.prototype, "uid", {
            get: function () { return this._uid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Assets.prototype, "name", {
            get: function () { return this._name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Assets.prototype, "terrainTexId", {
            get: function () { return this._terrainTexId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Assets.prototype, "terrainVOffset", {
            get: function () { return this._terrainVOffset; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Assets.prototype, "bgTexId", {
            get: function () { return this._bgTexId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Assets.prototype, "bgLayerDefY", {
            get: function () { return this._bgLayerDefY; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Assets.prototype, "decoGroupId", {
            get: function () { return this._decoGroupId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Assets.prototype, "coinAnim", {
            get: function () { return this._coinAnim; },
            enumerable: true,
            configurable: true
        });
        return Assets;
    }());
    World.Assets = Assets;
})(World || (World = {}));
var World;
(function (World) {
    var BlockCheckpoint = (function () {
        function BlockCheckpoint(data, dataPos) {
            this._x = data.getUint16(dataPos, false);
            dataPos += 2;
            this._bikeY = data.getInt16(dataPos, false);
            dataPos += 2;
            this._bikeAngle = data.getInt16(dataPos, false);
            dataPos += 2;
        }
        Object.defineProperty(BlockCheckpoint.prototype, "x", {
            get: function () { return this._x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockCheckpoint.prototype, "bikeY", {
            get: function () { return this._bikeY; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockCheckpoint.prototype, "bikeAngle", {
            get: function () { return this._bikeAngle; },
            enumerable: true,
            configurable: true
        });
        BlockCheckpoint.DATA_SIZE = 6;
        return BlockCheckpoint;
    }());
    World.BlockCheckpoint = BlockCheckpoint;
    var BlockNodeCheckpoint = (function () {
        function BlockNodeCheckpoint() {
        }
        Object.defineProperty(BlockNodeCheckpoint.prototype, "blockNode", {
            get: function () { return this._blockNode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockNodeCheckpoint.prototype, "blockCheckpoint", {
            get: function () { return this._blockCheckpoint; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockNodeCheckpoint.prototype, "position", {
            get: function () { return this._blockNode.worldX + this._blockCheckpoint.x; },
            enumerable: true,
            configurable: true
        });
        BlockNodeCheckpoint.prototype.init = function (blockNode, blockCheckpoint) {
            this._blockNode = blockNode;
            this._blockCheckpoint = blockCheckpoint;
            return this;
        };
        return BlockNodeCheckpoint;
    }());
    World.BlockNodeCheckpoint = BlockNodeCheckpoint;
    var ActCheckpoint = (function () {
        function ActCheckpoint() {
            this._bikeRestartPoint = new Phaser.Point();
            this._onActivate = new Phaser.Signal();
            this._active = false;
        }
        Object.defineProperty(ActCheckpoint, "instance", {
            get: function () { return ActCheckpoint._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActCheckpoint.prototype, "actTime", {
            get: function () { return this._actTime; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActCheckpoint.prototype, "blockNode", {
            get: function () { return this._blockNode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActCheckpoint.prototype, "bikeRestartPoint", {
            get: function () { return this._bikeRestartPoint; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActCheckpoint.prototype, "bikeRestartAngle", {
            get: function () { return this._bikeRestartAngle; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActCheckpoint.prototype, "onActivate", {
            get: function () { return this._onActivate; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActCheckpoint.prototype, "active", {
            get: function () { return this._active; },
            enumerable: true,
            configurable: true
        });
        ActCheckpoint.prototype.reset = function () {
            this._active = false;
        };
        ActCheckpoint.prototype.activate = function (data) {
            this._blockNode = data.blockNode;
            this._bikeRestartPoint.set(data.position, data.blockCheckpoint.bikeY);
            this._bikeRestartAngle = data.blockCheckpoint.bikeAngle;
            this._active = true;
            this._actTime = Gameplay.Gameplay.instance.timer.time;
            this._onActivate.dispatch(this);
        };
        ActCheckpoint._instance = new ActCheckpoint();
        return ActCheckpoint;
    }());
    World.ActCheckpoint = ActCheckpoint;
})(World || (World = {}));
var WorldGround;
(function (WorldGround) {
    var ActSegment = (function () {
        function ActSegment(freeSegments, actSegments) {
            this._freeSegments = freeSegments;
            this._actSegments = actSegments;
            this._phyVertices = new Collections.FixedArray();
            this._phyFixture = null;
        }
        Object.defineProperty(ActSegment.prototype, "blockNode", {
            get: function () { return this._blockNode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActSegment.prototype, "data", {
            get: function () { return this._data; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActSegment.prototype, "prev", {
            get: function () { return this._prev; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActSegment.prototype, "next", {
            get: function () { return this.getNextSegment(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActSegment.prototype, "vertexAWorldX", {
            get: function () { return this._blockNode.worldX + this._data.vertexA.x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActSegment.prototype, "vertexBWorldX", {
            get: function () { return this._blockNode.worldX + this._data.vertexB.x; },
            enumerable: true,
            configurable: true
        });
        ActSegment.prototype.init = function (blockNode, blockSegmentId, prev, next) {
            this._blockNode = blockNode;
            this._blockSegmentId = blockSegmentId;
            this._data = blockNode.block.segments[blockSegmentId];
            this._prev = prev;
            this._next = next;
            var addAtEnd = true;
            if (prev != null) {
                prev._next = this;
            }
            else if (next != null) {
                next._prev = this;
                addAtEnd = false;
            }
            this._actSegments.addItem(this, addAtEnd);
            blockNode.activate();
            return this;
        };
        ActSegment.prototype.release = function () {
            if (this._next != null)
                this._next._prev = this._prev;
            if (this._prev != null)
                this._prev._next = this._next;
            this._phyVertices.reset();
            this.destroyPhysics();
            this._freeSegments.returnItem(this._actSegments.removeItem(this._prev != null));
            this._prev = null;
            this._next = null;
        };
        ActSegment.prototype.createPhysics = function (body) {
            if (this._phyFixture != null)
                return;
            if (this._phyVertices.entryCnt == 0)
                this.calculatePhyVertices();
            var phySet = WorldGround.Physics.settings[0];
            this._phyFixture = body.addChain(this._phyVertices.entries, 0, this._phyVertices.entryCnt >> 1, false);
            this._phyFixture.GetFilterData().categoryBits = 2;
            this._phyFixture.SetFriction(phySet.friction);
            this._phyFixture.SetRestitution(phySet.restitution);
        };
        ActSegment.prototype.destroyPhysics = function () {
            if (this._phyFixture != null) {
                this._phyFixture.m_body.DestroyFixture(this._phyFixture);
                this._phyFixture = null;
            }
        };
        ActSegment.prototype.getNextSegment = function () {
            if (this._next == null) {
                var segment = this._freeSegments.getItem();
                var blockNode = this._blockNode;
                var blockSegmentId = ++this._blockSegmentId;
                if (blockSegmentId == blockNode.block.segments.length) {
                    blockNode = blockNode.next;
                    blockSegmentId = 0;
                }
                segment.init(blockNode, blockSegmentId, this, null);
                this._next = segment;
            }
            return this._next;
        };
        ActSegment.prototype.calculatePhyVertices = function () {
            var vertices = this._phyVertices;
            var blockWorldX = this._blockNode.worldX;
            if (this._prev == null) {
                vertices.addEntry(this._data.vertexA.x + blockWorldX);
                vertices.addEntry(this._data.vertexA.y + ActSegment.PHY_GROUND_OFFSET);
            }
            else {
                var ver1 = this._prev.data.vertexB;
                vertices.addEntry(ver1.x + this._prev.blockNode.worldX);
                vertices.addEntry(ver1.y + ActSegment.PHY_GROUND_OFFSET);
                if (Math.abs(ver1.y - this._data.vertexA.y) > 2) {
                    vertices.addEntry(this._data.vertexA.x + blockWorldX);
                    vertices.addEntry(this._data.vertexA.y + ActSegment.PHY_GROUND_OFFSET);
                }
            }
            if (this._data.type == 1) {
                vertices.addEntry(this._data.vertexB.x + blockWorldX);
                vertices.addEntry(this._data.vertexB.y + ActSegment.PHY_GROUND_OFFSET);
                return;
            }
            var ts = Math.min(1, 1 / (this._data.length / ActSegment.PHY_SEGMENT_LEN));
            var t = ts;
            do {
                var pos = this._data.getPosition(t);
                vertices.addEntry(pos.x + blockWorldX);
                vertices.addEntry(pos.y + ActSegment.PHY_GROUND_OFFSET);
                t += ts;
            } while (t <= 1);
            if (vertices.entries[vertices.entryCnt - 2] != this._data.vertexB.x + blockWorldX) {
                vertices.addEntry(this._data.vertexB.x + blockWorldX);
                vertices.addEntry(this._data.vertexB.y + ActSegment.PHY_GROUND_OFFSET);
            }
        };
        ActSegment.prototype.renderDebugInfo = function (x, y, lineHeight) {
            Game.Global.game.debug.text("Segment | A: " + this.vertexAWorldX + "x" + this.data.vertexA.y + " | B: " + this.vertexBWorldX + "x" + this.data.vertexB.y, x, y);
            return y + lineHeight;
        };
        ActSegment.PHY_SEGMENT_LEN = 20;
        ActSegment.PHY_GROUND_OFFSET = 20;
        return ActSegment;
    }());
    WorldGround.ActSegment = ActSegment;
})(WorldGround || (WorldGround = {}));
var WorldGround;
(function (WorldGround) {
    var PhySettings = (function () {
        function PhySettings(friction, restitution) {
            this.friction = friction;
            this.restitution = restitution;
        }
        return PhySettings;
    }());
    WorldGround.PhySettings = PhySettings;
    var Physics = (function () {
        function Physics(viewer) {
            this._viewer = viewer;
            this._body = new Phaser.Physics.Box2D.Body(Game.Global.game, null, 0, 0, 0, Game.Global.game.physics.box2d);
            this._body.static = true;
            this._lSegment = null;
        }
        Object.defineProperty(Physics.prototype, "body", {
            get: function () { return this._body; },
            enumerable: true,
            configurable: true
        });
        Physics.prototype.destroy = function () {
            this._body.destroy();
        };
        Physics.prototype.reset = function (segment) {
            this._body.clearFixtures();
            this._lSegment = segment;
            segment.createPhysics(this._body);
            while (segment.vertexBWorldX < this._viewer.viewRX) {
                segment = segment.next;
                segment.createPhysics(this._body);
            }
            this._rSegment = segment;
        };
        Physics.prototype.applySettings = function (settings) {
            var set = Physics.settings[0];
            if (settings.friction.isNewValue) {
                set.friction = settings.friction.applyNewValue();
                this._body.friction = set.friction;
            }
            if (settings.restitution.isNewValue) {
                set.restitution = settings.restitution.applyNewValue();
                this._body.restitution = set.restitution;
            }
        };
        Physics.prototype.update = function (viewLX, viewRX) {
            var preLX = this._viewer.viewLX;
            var preRX = this._viewer.viewRX;
            if (viewRX > preRX) {
                while (this._rSegment.vertexBWorldX < viewRX) {
                    this._rSegment = this._rSegment.next;
                    this._rSegment.createPhysics(this._body);
                }
            }
            else if (viewRX < preRX) {
                while (this._rSegment.vertexAWorldX > viewRX) {
                    this._rSegment.destroyPhysics();
                    this._rSegment = this._rSegment.prev;
                }
            }
            if (viewLX > preLX) {
                while (this._lSegment.vertexBWorldX < viewLX) {
                    this._lSegment.destroyPhysics();
                    this._lSegment = this._lSegment.next;
                }
            }
            else if (viewLX < preLX) {
                while (this._lSegment.vertexAWorldX > viewLX) {
                    this._lSegment = this._lSegment.prev;
                    this._lSegment.createPhysics(this._body);
                }
            }
        };
        Physics.prototype.renderDebugInfo = function (x, y, lineHeight) {
            var debug = Game.Global.game.debug;
            debug.text("=== TERRAIN PHYSICS ===", x, y);
            y += lineHeight;
            y = this._lSegment.renderDebugInfo(x, y, lineHeight);
            y = this._rSegment.renderDebugInfo(x, y, lineHeight);
            return y;
        };
        Physics.settings = [
            new PhySettings(1, 0)
        ];
        return Physics;
    }());
    WorldGround.Physics = Physics;
})(WorldGround || (WorldGround = {}));
var WorldGround;
(function (WorldGround) {
    var SegmentPos = (function () {
        function SegmentPos() {
            this.x = 0;
            this.y = 0;
            this.t = 0;
        }
        SegmentPos.prototype.copyFrom = function (source) {
            this.x = source.x;
            this.y = source.y;
            this.t = source.t;
            return this;
        };
        return SegmentPos;
    }());
    WorldGround.SegmentPos = SegmentPos;
    var Segment = (function () {
        function Segment() {
            this._vertexA = new Phaser.Point();
            this._vertexB = new Phaser.Point();
            this._vertexC = new Phaser.Point();
        }
        Object.defineProperty(Segment.prototype, "type", {
            get: function () { return this._type; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Segment.prototype, "vertexA", {
            get: function () { return this._vertexA; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Segment.prototype, "vertexB", {
            get: function () { return this._vertexB; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Segment.prototype, "width", {
            get: function () { return (this._vertexB.x - this._vertexA.x) + 1; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Segment.prototype, "length", {
            get: function () { return this._length; },
            enumerable: true,
            configurable: true
        });
        Segment.prototype.load = function (data, dataPos) {
            this._type = data.getUint8(dataPos++);
            this._length = data.getUint16(dataPos);
            dataPos += 2;
            this._vertexA.x = data.getUint16(dataPos);
            dataPos += 2;
            this._vertexA.y = data.getUint16(dataPos);
            dataPos += 2;
            this._vertexB.x = data.getUint16(dataPos);
            dataPos += 2;
            this._vertexB.y = data.getUint16(dataPos);
            dataPos += 2;
            if (this._type == 0) {
                this._vertexC.x = data.getUint16(dataPos);
                dataPos += 2;
                this._vertexC.y = data.getUint16(dataPos);
                dataPos += 2;
            }
            return dataPos;
        };
        Segment.prototype.getPosition = function (t) {
            return Segment.getPosition(this._vertexA, this._vertexB, this._vertexC, this._type, t);
        };
        Segment.prototype.getY = function (pos) {
            var td = 1 / ((this._vertexB.x - this._vertexA.x) + 1);
            var p = Segment.getPosition(this._vertexA, this._vertexB, this._vertexC, this._type, pos.t);
            var miss;
            while ((miss = Math.abs(pos.x - p.x)) > 0.5) {
                if (p.x < pos.x) {
                    pos.t += miss * td;
                }
                else {
                    pos.t -= miss * td;
                }
                p = Segment.getPosition(this._vertexA, this._vertexB, this._vertexC, this._type, pos.t);
            }
            pos.y = p.y;
        };
        Segment.getPosition = function (start, end, angle, type, t) {
            var res = Segment._tmpPos;
            if (type == 1) {
                res.x = start.x + (end.x - start.x) * t;
                res.y = start.y + (end.y - start.y) * t;
            }
            else {
                res.x = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * angle.x + t * t * end.x;
                res.y = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * angle.y + t * t * end.y;
            }
            res.t = t;
            return res;
        };
        Segment._tmpPos = new SegmentPos();
        Segment.MAX_HEIGHT = 1280;
        return Segment;
    }());
    WorldGround.Segment = Segment;
})(WorldGround || (WorldGround = {}));
var WorldObjects;
(function (WorldObjects) {
    var ObjectData = (function () {
        function ObjectData(descriptor) {
            this._descriptor = descriptor;
        }
        Object.defineProperty(ObjectData.prototype, "descriptor", {
            get: function () { return this._descriptor; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectData.prototype, "lX", {
            get: function () { return this._lX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectData.prototype, "rX", {
            get: function () { return this._rX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectData.prototype, "x", {
            get: function () { return this._x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectData.prototype, "y", {
            get: function () { return this._y; },
            enumerable: true,
            configurable: true
        });
        ObjectData.create = function (data, dataOffset, array) {
            var descriptor = World.DataManager.objectDescriptors[data.getUint8(dataOffset++)];
            var self = descriptor.createData();
            dataOffset = self.init(data, dataOffset);
            array.push(self);
            return dataOffset;
        };
        ObjectData.prototype.init = function (data, dataOffset) {
            this._lX = data.getUint16(dataOffset, false);
            dataOffset += 2;
            this._rX = data.getUint16(dataOffset, false);
            dataOffset += 2;
            this._x = data.getUint16(dataOffset, false);
            dataOffset += 2;
            this._y = data.getInt16(dataOffset, false);
            dataOffset += 2;
            return dataOffset;
        };
        return ObjectData;
    }());
    WorldObjects.ObjectData = ObjectData;
    var ObjectDataRotable = (function (_super) {
        __extends(ObjectDataRotable, _super);
        function ObjectDataRotable() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(ObjectDataRotable.prototype, "angle", {
            get: function () { return this._angle; },
            enumerable: true,
            configurable: true
        });
        ObjectDataRotable.prototype.init = function (data, dataOffset) {
            dataOffset = _super.prototype.init.call(this, data, dataOffset);
            this._angle = data.getFloat32(dataOffset, false);
            dataOffset += 4;
            return dataOffset;
        };
        return ObjectDataRotable;
    }(ObjectData));
    WorldObjects.ObjectDataRotable = ObjectDataRotable;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var ObjectDescriptor = (function () {
        function ObjectDescriptor(objectType, dataType, objectsPool) {
            this._objectType = objectType;
            this._dataType = dataType;
            this._objectsPool = objectsPool;
        }
        Object.defineProperty(ObjectDescriptor.prototype, "objectType", {
            get: function () { return this._objectType; },
            enumerable: true,
            configurable: true
        });
        ObjectDescriptor.prototype.createData = function () {
            return new this._dataType(this);
        };
        ObjectDescriptor.prototype.getObject = function (data) {
            return this._objectsPool.getItem();
        };
        ObjectDescriptor.prototype.releaseObject = function (object) {
            this._objectsPool.returnItem(object);
        };
        return ObjectDescriptor;
    }());
    WorldObjects.ObjectDescriptor = ObjectDescriptor;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var ObjectBase = (function () {
        function ObjectBase() {
        }
        Object.defineProperty(ObjectBase.prototype, "data", {
            get: function () { return this._data; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectBase.prototype, "blockNode", {
            get: function () { return this._blockNode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectBase.prototype, "blockObjectId", {
            get: function () { return this._blockObjectId; },
            enumerable: true,
            configurable: true
        });
        ObjectBase.prototype.activate = function (data, blockNode, blockObjectId) {
            this._data = data;
            this._blockNode = blockNode;
            this._blockObjectId = blockObjectId;
            blockNode.markObjectAsActive(blockObjectId);
            this._checkViewPos = true;
            return this;
        };
        ObjectBase.prototype.deactivate = function () {
            this._data.descriptor.releaseObject(this);
            this._blockNode.markObjectAsInactive(this._blockObjectId);
        };
        ObjectBase.prototype.update = function (viewLX, viewRX) {
            if (this._checkViewPos) {
                if (this.getRX() < viewLX) {
                    this.deactivate();
                    WorldObjects.Viewer.instance.addSleepObject(this);
                    return false;
                }
                else if (this.getLX() > viewRX) {
                    this.deactivate();
                    return false;
                }
            }
            return true;
        };
        ObjectBase.prototype.getLX = function () { return this._blockNode.worldX + this._data.lX; };
        ObjectBase.prototype.getRX = function () { return this._blockNode.worldX + this._data.rX; };
        return ObjectBase;
    }());
    WorldObjects.ObjectBase = ObjectBase;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var ObjSpikes = (function (_super) {
        __extends(ObjSpikes, _super);
        function ObjSpikes() {
            var _this = _super.call(this) || this;
            _this._sprite = Game.Global.game.add.sprite(0, 0, "atlas_A", "obsSpikes", WorldObjects.Viewer.instance.getLayer(1));
            _this._sprite.anchor.set(0.5, 0.5);
            Game.Global.game.physics.box2d.enable(_this._sprite);
            var body = _this._sprite.body;
            body.setRectangle(_this._sprite.width - 10, _this._sprite.height - 16, 0, 0);
            body.sensor = true;
            body.static = true;
            body.setCollisionCategory(16);
            body.kill();
            _this._sprite.kill();
            return _this;
        }
        ObjSpikes.prototype.activate = function (data, blockNode, blockObjectId) {
            _super.prototype.activate.call(this, data, blockNode, blockObjectId);
            this._sprite.reset(data.x + blockNode.worldX, data.y);
            this._sprite.body.angle = data.angle;
            return this;
        };
        ObjSpikes.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this._sprite.body.kill();
            this._sprite.kill();
        };
        return ObjSpikes;
    }(WorldObjects.ObjectBase));
    WorldObjects.ObjSpikes = ObjSpikes;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var ObjPickupBase = (function (_super) {
        __extends(ObjPickupBase, _super);
        function ObjPickupBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ObjPickupBase.prototype.activate = function (data, blockNode, blockObjectId) {
            _super.prototype.activate.call(this, data, blockNode, blockObjectId);
            this._sprite.data = this;
            this._sprite.reset(data.x + blockNode.worldX, data.y);
            this._sprite.alpha = 1;
            this._state = 0;
            return this;
        };
        ObjPickupBase.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this._sprite.body.kill();
            this._sprite.kill();
        };
        ObjPickupBase.prototype.update = function (viewLX, viewRX) {
            var res = _super.prototype.update.call(this, viewLX, viewRX);
            if (this._state == 1) {
                var progress = (Gameplay.Gameplay.instance.timer.time - this._time) / 500;
                if (progress >= 1) {
                    this.deactivate();
                    return false;
                }
                this._sprite.alpha = 1 - Phaser.Easing.Cubic.Out(progress);
                this._sprite.body.y = this._data.y - Phaser.Easing.Cubic.Out(progress) * 100;
            }
            return res;
        };
        ObjPickupBase.prototype.pickup = function () {
            if (this._state != 0)
                return false;
            this._blockNode.markObjectAsDisabled(this._blockObjectId);
            this._checkViewPos = false;
            this._state = 1;
            this._time = Gameplay.Gameplay.instance.timer.time;
            return true;
        };
        return ObjPickupBase;
    }(WorldObjects.ObjectBase));
    WorldObjects.ObjPickupBase = ObjPickupBase;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var ObjCoin = (function (_super) {
        __extends(ObjCoin, _super);
        function ObjCoin() {
            var _this = _super.call(this) || this;
            _this._sprite = Game.Global.game.add.sprite(0, 0, "atlas_A", "bnsCoin_0", WorldObjects.Viewer.instance.getLayer(1));
            _this._sprite.anchor.set(0.5);
            Game.Global.game.physics.box2d.enable(_this._sprite);
            var body = _this._sprite.body;
            body.setCircle(23, 0, 0);
            body.sensor = true;
            body.static = true;
            body.setCollisionCategory(8);
            body.kill();
            _this._sprite.kill();
            return _this;
        }
        ObjCoin.prototype.activate = function (data, blockNode, blockObjectId) {
            _super.prototype.activate.call(this, data, blockNode, blockObjectId);
            World.DataManager.instance.worldAssets[blockNode.worldId].coinAnim.playAnimation(this._sprite);
            return this;
        };
        ObjCoin.prototype.pickup = function () {
            var gameplay = Gameplay.Gameplay.instance;
            if (gameplay.bike.dead)
                return false;
            if (!_super.prototype.pickup.call(this))
                return false;
            var coinVal = gameplay.worldView.objects.getCoinValue();
            var multiplier = PowerUps.Manager.powerUps[3].active ? 2 : 1;
            gameplay.popupMessages.activateObject().show(this._sprite.x, this._sprite.y, (multiplier == 1 ? "+" : "+2X") + coinVal);
            Game.Global.playerProfile.coins += coinVal * multiplier;
            Game.AudioUtils.playSound("pickupCoin");
            return true;
        };
        return ObjCoin;
    }(WorldObjects.ObjPickupBase));
    WorldObjects.ObjCoin = ObjCoin;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var ObjDecoration = (function (_super) {
        __extends(ObjDecoration, _super);
        function ObjDecoration() {
            var _this = _super.call(this) || this;
            _this._image = Game.Global.game.add.image(0, 0, "atlas_A", "deco_0", WorldObjects.Viewer.instance.getLayer(0));
            _this._image.anchor.set(0.5, 0.5);
            _this._image.visible = _this._image.exists = false;
            return _this;
        }
        ObjDecoration.prototype.activate = function (data, blockNode, blockObjectId) {
            _super.prototype.activate.call(this, data, blockNode, blockObjectId);
            WorldObjects.Viewer.instance.getLayer(data.depth == 0 ? 0 : 2).add(this._image);
            this._image.frameName = "deco_" + data.frameId;
            this._image.angle = data.angle;
            this._image.position.set(data.x + blockNode.worldX, data.y);
            this._image.visible = true;
            return this;
        };
        ObjDecoration.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this._image.visible = false;
        };
        return ObjDecoration;
    }(WorldObjects.ObjectBase));
    WorldObjects.ObjDecoration = ObjDecoration;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var DecorationData = (function (_super) {
        __extends(DecorationData, _super);
        function DecorationData() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(DecorationData.prototype, "frameId", {
            get: function () { return this._frameId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DecorationData.prototype, "depth", {
            get: function () { return this._depth; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DecorationData.prototype, "groupId", {
            get: function () { return this._groupId; },
            enumerable: true,
            configurable: true
        });
        DecorationData.prototype.init = function (data, dataOffset) {
            dataOffset = _super.prototype.init.call(this, data, dataOffset);
            this._frameId = data.getUint8(dataOffset++);
            this._depth = data.getUint8(dataOffset++);
            this._groupId = data.getUint8(dataOffset++);
            return dataOffset;
        };
        return DecorationData;
    }(WorldObjects.ObjectDataRotable));
    WorldObjects.DecorationData = DecorationData;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var PlatformData = (function (_super) {
        __extends(PlatformData, _super);
        function PlatformData() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(PlatformData.prototype, "type", {
            get: function () { return this._type; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformData.prototype, "rope1AttachPos", {
            get: function () { return this._rope1AttachPos; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformData.prototype, "rope2AttachPos", {
            get: function () { return this._rope2AttachPos; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformData.prototype, "size", {
            get: function () { return this._size; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformData.prototype, "depth", {
            get: function () { return this._depth; },
            enumerable: true,
            configurable: true
        });
        PlatformData.prototype.init = function (data, dataOffset) {
            dataOffset = _super.prototype.init.call(this, data, dataOffset);
            this._type = data.getUint8(dataOffset++);
            this._rope1AttachPos = data.getInt8(dataOffset++) / 127;
            this._rope2AttachPos = data.getInt8(dataOffset++) / 127;
            this._size = data.getUint8(dataOffset++);
            this._depth = data.getUint8(dataOffset++);
            return dataOffset;
        };
        return PlatformData;
    }(WorldObjects.ObjectDataRotable));
    WorldObjects.PlatformData = PlatformData;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var PlatformDescriptor = (function (_super) {
        __extends(PlatformDescriptor, _super);
        function PlatformDescriptor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PlatformDescriptor.prototype.getObject = function (data) {
            return this._objectsPool[data.type].getItem();
        };
        PlatformDescriptor.prototype.releaseObject = function (object) {
            this._objectsPool[object.data.type].returnItem(object);
        };
        return PlatformDescriptor;
    }(WorldObjects.ObjectDescriptor));
    WorldObjects.PlatformDescriptor = PlatformDescriptor;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var PlatRope = (function () {
        function PlatRope() {
            this._image = Game.Global.game.add.image(0, 0, "atlas_A", "rope", WorldObjects.Viewer.instance.getLayer(1));
            this._image.anchor.set(0.5, 0);
            this._image.angle = 180;
            this._image.visible = this._image.exists = false;
            this._image.crop(new Phaser.Rectangle(0, 0, 8, 128), false);
        }
        Object.defineProperty(PlatRope.prototype, "x", {
            get: function () { return this._image.x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatRope.prototype, "y", {
            get: function () { return this._image.y; },
            enumerable: true,
            configurable: true
        });
        PlatRope.prototype.show = function (attachRatio, platform) {
            var platW = platform.width;
            var platType = platform.getPlatformType();
            var ropePos = this._image.position;
            ropePos.x = Math.round((-platW / 2) + (attachRatio * platW));
            ropePos.y = Math.round((-platform.height / 2) + platType.bodyVOffset + (platType.bodyHeight / 2));
            PlatRope._tmpPoint.set(0, 0);
            var attachDis = PlatRope._tmpPoint.distance(this._image.position, false);
            var attachDir = PlatRope._tmpPoint.angle(this._image.position, false) + platform.angle;
            ropePos.x = Math.round(platform.x + Math.cos(attachDir) * attachDis);
            ropePos.y = Math.round(platform.y + Math.sin(attachDir) * attachDis);
            this.update();
            return this;
        };
        PlatRope.prototype.hide = function () {
            this._image.visible = false;
            return this;
        };
        PlatRope.prototype.update = function () {
            var h = Math.ceil(this._image.y - Game.Global.game.camera.y);
            if (h > 0) {
                if (this._image.cropRect.height != h) {
                    this._image.cropRect.height = h;
                    this._image.updateCrop();
                }
                this._image.visible = true;
            }
            else {
                this._image.visible = false;
            }
        };
        PlatRope._tmpPoint = new Phaser.Point();
        return PlatRope;
    }());
    WorldObjects.PlatRope = PlatRope;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var PlatformType = (function () {
        function PlatformType(bodyHeight, bodyVOffset, density, friction, restitution) {
            if (density === void 0) { density = 1; }
            if (friction === void 0) { friction = 1; }
            if (restitution === void 0) { restitution = 0; }
            this._bodyHeight = bodyHeight;
            this._bodyVOffset = bodyVOffset;
            this._density = density;
            this._friction = friction;
            this._restitution = restitution;
        }
        Object.defineProperty(PlatformType.prototype, "bodyHeight", {
            get: function () { return this._bodyHeight; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformType.prototype, "bodyVOffset", {
            get: function () { return this._bodyVOffset; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformType.prototype, "density", {
            get: function () { return this._density; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformType.prototype, "friction", {
            get: function () { return this._friction; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformType.prototype, "restitution", {
            get: function () { return this._restitution; },
            enumerable: true,
            configurable: true
        });
        return PlatformType;
    }());
    WorldObjects.PlatformType = PlatformType;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var PlatformBase = (function (_super) {
        __extends(PlatformBase, _super);
        function PlatformBase() {
            var _this = this;
            if (PlatformBase._ropePool == undefined)
                PlatformBase._ropePool = new Collections.Pool(WorldObjects.PlatRope, 4, true);
            _this = _super.call(this) || this;
            var add = Game.Global.game.add;
            var frame = "platform_0_";
            _this._cpSprite = add.sprite(0, 0, "atlas_A", frame + "cp", WorldObjects.Viewer.instance.getLayer(1));
            _this._cpSprite.crop(new Phaser.Rectangle(0, 0, 0, 0), false);
            _this._lpSprite = add.image(0, 0, "atlas_A", frame + "lp");
            _this._lpSprite.anchor.set(1, 0.5);
            _this._cpSprite.addChild(_this._lpSprite);
            _this._rpSprite = add.image(0, 0, "atlas_A", frame + "rp");
            _this._rpSprite.anchor.set(0, 0.5);
            _this._cpSprite.addChild(_this._rpSprite);
            Game.Global.game.physics.box2d.enable(_this._cpSprite);
            _this._body = _this._cpSprite.body;
            _this._body.kill();
            _this._cpSprite.visible = _this._cpSprite.exists = false;
            _this._ropes = new Collections.FixedArray();
            return _this;
        }
        Object.defineProperty(PlatformBase.prototype, "position", {
            get: function () { return this._cpSprite.position; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformBase.prototype, "x", {
            get: function () { return this._body.x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformBase.prototype, "y", {
            get: function () { return this._body.y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformBase.prototype, "width", {
            get: function () { return this._cpSprite.width + this._lpSprite.width + this._rpSprite.width; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformBase.prototype, "lPartWidth", {
            get: function () { return this._lpSprite.width; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformBase.prototype, "rPartWidth", {
            get: function () { return this._rpSprite.width; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformBase.prototype, "cPartWidth", {
            get: function () { return this._cpSprite.width; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformBase.prototype, "height", {
            get: function () { return this._cpSprite.height; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformBase.prototype, "angle", {
            get: function () { return this._body.rotation; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformBase.prototype, "frameBaseKey", {
            get: function () { return "platform_" + this._data.type + "_"; },
            enumerable: true,
            configurable: true
        });
        PlatformBase.prototype.activate = function (data, blockNode, blockObjectId) {
            _super.prototype.activate.call(this, data, blockNode, blockObjectId);
            var type = this.getPlatformType();
            var d = data;
            var frameKey = this.frameBaseKey;
            this._cpSprite.frameName = frameKey + "cp";
            this._lpSprite.frameName = frameKey + "lp";
            this._rpSprite.frameName = frameKey + "rp";
            var cpFrame = Game.Global.game.cache.getFrameByName("atlas_A", this._cpSprite.frameName);
            this._cpSprite.cropRect.setTo(0, 0, 64 * d.size, cpFrame.height);
            this._cpSprite.updateCrop();
            this._lpSprite.x = -(this._cpSprite.width >> 1);
            this._rpSprite.x = -this._lpSprite.x;
            this._cpSprite.visible = this._cpSprite.exists = true;
            var parent = WorldObjects.Viewer.instance.getLayer(d.depth == 0 ? 0 : 1);
            parent.add(this._cpSprite);
            parent.bringToTop(this._cpSprite);
            this.createFixture();
            this._body.mass *= type.density;
            this._body.friction = type.friction;
            this._body.restitution = type.restitution;
            this._body.setCollisionCategory(32);
            this._body.setCollisionMask(this.getCollisionMask());
            this._body.angle = d.angle;
            this._body.reset(d.x + blockNode.worldX, d.y);
            this.activateRopes();
            return this;
        };
        PlatformBase.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this._body.kill();
            this._cpSprite.visible = this._cpSprite.exists = false;
            var i = this._ropes.entryCnt;
            while (i-- != 0)
                PlatformBase._ropePool.returnItem(this._ropes.entries[i].hide());
            this._ropes.reset();
        };
        PlatformBase.prototype.update = function (viewLX, viewRX) {
            if (!_super.prototype.update.call(this, viewLX, viewRX))
                return false;
            var i = this._ropes.entryCnt;
            while (i-- != 0)
                this._ropes.entries[i].update();
            return true;
        };
        PlatformBase.prototype.createFixture = function () {
            var type = this.getPlatformType();
            this._body.setRectangle(this._cpSprite.width + this._lpSprite.width + this._rpSprite.width, type.bodyHeight, 0, -((this._cpSprite.height - type.bodyHeight) >> 1) + type.bodyVOffset);
        };
        PlatformBase.prototype.activateRopes = function () {
            var data = this._data;
            this.activateRope(data.rope1AttachPos);
            this.activateRope(data.rope2AttachPos);
        };
        PlatformBase.prototype.activateRope = function (placement) {
            if (placement < 0 || placement > 1)
                return;
            this._ropes.addEntry(PlatformBase._ropePool.getItem().show(placement, this));
        };
        return PlatformBase;
    }(WorldObjects.ObjectBase));
    WorldObjects.PlatformBase = PlatformBase;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var StaticPlatform = (function (_super) {
        __extends(StaticPlatform, _super);
        function StaticPlatform() {
            var _this = _super.call(this) || this;
            _this._body.static = true;
            return _this;
        }
        StaticPlatform.prototype.getCollisionMask = function () {
            return 4;
        };
        StaticPlatform.prototype.getPlatformType = function () {
            return StaticPlatform._type;
        };
        StaticPlatform._type = new WorldObjects.PlatformType(20, 2);
        return StaticPlatform;
    }(WorldObjects.PlatformBase));
    WorldObjects.StaticPlatform = StaticPlatform;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var SwingPlatform = (function (_super) {
        __extends(SwingPlatform, _super);
        function SwingPlatform() {
            var _this = _super.call(this) || this;
            _this._holderBody = new Phaser.Physics.Box2D.Body(Game.Global.game, null, 0, 0);
            _this._holderBody.static = true;
            _this._holderBody.setCollisionCategory(128);
            _this._holderBody.kill();
            return _this;
        }
        SwingPlatform.prototype.activate = function (data, blockNode, blockObjectId) {
            _super.prototype.activate.call(this, data, blockNode, blockObjectId);
            if (data.rope1AttachPos >= 0) {
                var rope = this._ropes.entries[0];
                this._holderBody.reset(rope.x, rope.y);
                var w = this.width;
                var type = this.getPlatformType();
                var anchorX = (-w / 2) + (w * data.rope1AttachPos);
                var anchorY = (-this.height / 2) + type.bodyVOffset + (type.bodyHeight / 2);
                if (data.type == 2) {
                    this._holderJoint = Game.Global.game.physics.box2d.revoluteJoint(this._holderBody, this._body, 0, 0, anchorX, anchorY, 0, 25, true, -25, 25, true);
                }
                else {
                    this._holderJoint = Game.Global.game.physics.box2d.revoluteJoint(this._holderBody, this._body, 0, 0, anchorX, anchorY, 0, 10, true);
                }
            }
            this._body.setZeroRotation();
            this._body.setZeroVelocity();
            return this;
        };
        SwingPlatform.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this._holderBody.kill();
            if (this._holderJoint != null) {
                Game.Global.game.physics.box2d.world.DestroyJoint(this._holderJoint);
                this._holderJoint = null;
            }
        };
        SwingPlatform.prototype.getCollisionMask = function () {
            return 2 | 32 | 4;
        };
        SwingPlatform.prototype.getPlatformType = function () {
            return SwingPlatform._types[this._data.type - 2];
        };
        SwingPlatform.prototype.createFixture = function () {
            if (this._data.type == 2) {
                _super.prototype.createFixture.call(this);
            }
            else {
                var width = this.width;
                var anchorX = Math.round(width / 2);
                var anchorY = Math.round(this.height / 2);
                this._body.setPolygon([2 - anchorX, 2 - anchorY, width - 2 - anchorX, 2 - anchorY, width - 24 - anchorX, 22 - anchorY, 24 - anchorX, 22 - anchorY]);
            }
        };
        SwingPlatform._types = [new WorldObjects.PlatformType(20, 2), new WorldObjects.PlatformType(22, 2)];
        return SwingPlatform;
    }(WorldObjects.PlatformBase));
    WorldObjects.SwingPlatform = SwingPlatform;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var FragilePlatform = (function (_super) {
        __extends(FragilePlatform, _super);
        function FragilePlatform() {
            var _this = _super.call(this) || this;
            _this._body.static = true;
            _this._body.setCategoryContactCallback(4, _this.handleBikeContact, _this);
            return _this;
        }
        FragilePlatform.prototype.activate = function (data, blockNode, blockObjectId) {
            _super.prototype.activate.call(this, data, blockNode, blockObjectId);
            this._bikeContactCnt = 0;
            this._health = 1;
            this._life = 3;
            return this;
        };
        FragilePlatform.prototype.update = function (viewLX, viewRX) {
            if (!_super.prototype.update.call(this, viewLX, viewRX))
                return false;
            if (this._cpSprite.visible && this._bikeContactCnt != 0) {
                var bikeVelocity = Gameplay.Gameplay.instance.bike.getVelocity();
                if (bikeVelocity > FragilePlatform.BIKE_VELOCITY_LIMIT) {
                    if (this._nextParticleTime <= Gameplay.Gameplay.instance.timer.time) {
                        this._nextParticleTime = Gameplay.Gameplay.instance.timer.time + 75;
                        var bike = Gameplay.Gameplay.instance.bike;
                        var contactPos = FragilePlatform._tmpPoint;
                        for (var i = 0; i < 2; i++) {
                            bike.getWheel(i).getGroundContactPoint(contactPos, 32);
                            WorldObjects.Viewer.instance.showPlatformParticle(this, contactPos.x, contactPos.y + 24);
                        }
                    }
                    var healthLost = (0.05 + ((bikeVelocity - FragilePlatform.BIKE_VELOCITY_LIMIT) / 6) * 0.15) * Gameplay.Gameplay.instance.timer.delta;
                    if ((this._health -= healthLost) <= 0) {
                        if (--this._life == 0) {
                            WorldObjects.Viewer.instance.showPlatformParticles(this);
                            this._body.kill();
                            this._cpSprite.visible = this._cpSprite.exists = false;
                        }
                        else {
                            var frameKey = "platform_" + this._data.type + "_";
                            this._lpSprite.frameName = frameKey + "lp_" + this._life;
                            this._rpSprite.frameName = frameKey + "rp_" + this._life;
                            this._cpSprite.frameName = frameKey + "cp_" + this._life;
                            this._health = 1;
                        }
                    }
                }
            }
            return true;
        };
        FragilePlatform.prototype.getCollisionMask = function () {
            return 4;
        };
        FragilePlatform.prototype.getPlatformType = function () {
            return FragilePlatform._type;
        };
        FragilePlatform.prototype.handleBikeContact = function (body1, body2, fixture1, fixture2, begin, contact) {
            if (begin) {
                if (this._bikeContactCnt++ == 0)
                    this._nextParticleTime = Gameplay.Gameplay.instance.timer.time;
            }
            else {
                this._bikeContactCnt--;
            }
        };
        FragilePlatform._type = new WorldObjects.PlatformType(22, 2);
        FragilePlatform.BIKE_VELOCITY_LIMIT = 4;
        FragilePlatform._tmpPoint = new Phaser.Point();
        return FragilePlatform;
    }(WorldObjects.PlatformBase));
    WorldObjects.FragilePlatform = FragilePlatform;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var ObjBoost = (function (_super) {
        __extends(ObjBoost, _super);
        function ObjBoost() {
            var _this = _super.call(this) || this;
            _this._sprite = Game.Global.game.add.sprite(0, 0, "atlas_A", "boostOff", WorldObjects.Viewer.instance.getLayer(0));
            Game.Global.game.physics.box2d.enable(_this._sprite);
            var body = _this._sprite.body;
            body.setRectangle(_this._sprite.width - 4, _this._sprite.height - 4, 0, 0);
            body.sensor = true;
            body.static = true;
            body.setCollisionCategory(64);
            body.kill();
            _this._sprite.kill();
            _this._sprite.animations.add("def", Phaser.Animation.generateFrameNames("boostOn_", 0, 4), 18, true, false);
            return _this;
        }
        ObjBoost.prototype.activate = function (data, blockNode, blockObjectId) {
            _super.prototype.activate.call(this, data, blockNode, blockObjectId);
            this._sprite.reset(data.x + blockNode.worldX, data.y);
            this._sprite.body.angle = data.angle;
            if (PowerUps.Manager.powerUps[2].active) {
                this._sprite.animations.play("def");
            }
            else {
                this._sprite.body.kill();
                this._sprite.animations.stop();
                this._sprite.frameName = "boostOff";
            }
            return this;
        };
        ObjBoost.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this._sprite.body.kill();
            this._sprite.kill();
        };
        return ObjBoost;
    }(WorldObjects.ObjectBase));
    WorldObjects.ObjBoost = ObjBoost;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var WorldTrans = (function (_super) {
        __extends(WorldTrans, _super);
        function WorldTrans() {
            var _this = _super.call(this) || this;
            _this._image = Game.Global.game.add.image(0, 0, "atlas_A", "worldTrans" + "L", WorldObjects.Viewer.instance.getLayer(2));
            _this._image.scale.set(2, 2);
            _this._image.visible = _this._image.exists = false;
            return _this;
        }
        WorldTrans.prototype.activate = function (data, blockNode, blockObjectId) {
            _super.prototype.activate.call(this, data, blockNode, blockObjectId);
            this._image.frameName = "worldTrans" + (data.leftSide ? "L" : "R");
            this._image.position.set(blockNode.worldX + data.x, data.y);
            this._image.visible = true;
            if (!data.leftSide) {
                this._applyWorldChange = (blockNode.worldX - Gameplay.Gameplay.instance.worldView.viewLX > (Game.Global.scale.resolution.x >> 1));
            }
            else {
                this._applyWorldChange = false;
            }
            return this;
        };
        WorldTrans.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this._image.visible = false;
        };
        WorldTrans.prototype.update = function (viewLX, viewRX) {
            if (!_super.prototype.update.call(this, viewLX, viewRX))
                return false;
            var view = Gameplay.Gameplay.instance.worldView;
            if (!this._applyWorldChange || view.viewLX >= viewLX)
                return true;
            if (this._blockNode.worldX <= viewLX + (Game.Global.scale.resolution.x >> 1)) {
                view.changeWorld(this._data.worldId);
                this._applyWorldChange = false;
            }
            return true;
        };
        return WorldTrans;
    }(WorldObjects.ObjectBase));
    WorldObjects.WorldTrans = WorldTrans;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var WorldTransData = (function (_super) {
        __extends(WorldTransData, _super);
        function WorldTransData() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(WorldTransData.prototype, "leftSide", {
            get: function () { return this._lSide; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorldTransData.prototype, "worldId", {
            get: function () { return this._worldId; },
            enumerable: true,
            configurable: true
        });
        WorldTransData.prototype.setup = function (blockNode, leftSide, worldId) {
            var x = 0;
            if ((this._lSide = leftSide)) {
                x += blockNode.block.width - WorldTransData.LSIDE_WIDTH;
            }
            this._x = x;
            this._y = (WorldGround.Segment.MAX_HEIGHT / 2) - 60;
            this._lX = x;
            this._rX = x + (leftSide ? WorldTransData.LSIDE_WIDTH : WorldTransData.RSIDE_WIDTH);
            this._worldId = worldId;
        };
        WorldTransData.LSIDE_WIDTH = 92;
        WorldTransData.RSIDE_WIDTH = 94;
        return WorldTransData;
    }(WorldObjects.ObjectData));
    WorldObjects.WorldTransData = WorldTransData;
})(WorldObjects || (WorldObjects = {}));
var WorldObjects;
(function (WorldObjects) {
    var ObjectInfo = (function () {
        function ObjectInfo() {
        }
        Object.defineProperty(ObjectInfo.prototype, "blockNode", {
            get: function () { return this._blockNode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectInfo.prototype, "blockObjectId", {
            get: function () { return this._blockObjectId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectInfo.prototype, "objectData", {
            get: function () { return this._blockNode.getObject(this._blockObjectId); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectInfo.prototype, "lX", {
            get: function () { return this._blockNode.worldX + this.objectData.lX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectInfo.prototype, "rX", {
            get: function () { return this._blockNode.worldX + this.objectData.rX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ObjectInfo.prototype, "valid", {
            get: function () { return this._blockNode != null; },
            enumerable: true,
            configurable: true
        });
        ObjectInfo.prototype.setTo = function (blockNode, blockObjectId) {
            this._blockNode = blockNode;
            this._blockObjectId = blockObjectId;
            return this;
        };
        ObjectInfo.prototype.getNext = function (res) {
            var objId = this._blockObjectId;
            var node = this._blockNode;
            if (++objId == node.getObjectCnt()) {
                objId = 0;
                node = node.next;
                while (node.getObjectCnt() == 0)
                    node = node.next;
            }
            res.setTo(node, objId);
            return res;
        };
        ObjectInfo.prototype.getPrev = function (res) {
            var objId = this._blockObjectId;
            var node = this._blockNode;
            if (objId-- == 0) {
                node = node.previous;
                while (node != null && node.block.length == 0)
                    node = node.previous;
                if (node == null)
                    return null;
                objId = node.getObjectCnt() - 1;
            }
            res.setTo(node, objId);
            return res;
        };
        ObjectInfo.prototype.moveToNext = function () {
            this.getNext(this);
        };
        ObjectInfo.prototype.moveToPrev = function () {
            this.getPrev(this);
        };
        return ObjectInfo;
    }());
    var Viewer = (function () {
        function Viewer(viewer, parentLayer) {
            Viewer._instance = this;
            this._viewer = viewer;
            this._layers = [];
            for (var i = 0; i < 3; i++)
                this._layers.push(Game.Global.game.add.group(parentLayer));
            parentLayer.moveDown(this._layers[0]);
            this._actObjects = new Collections.LinkedList(10);
            this._nextObject = new ObjectInfo();
            this._sleepObjects = new Collections.LinkedList(5);
            this._sleepObjectsPool = new Collections.Pool(ObjectInfo, 5, true);
            this._particlesPool = new Collections.Pool(undefined, 5, true, function () {
                return new Helpers.SimpleParticle(Gameplay.Gameplay.instance.timer, "atlas_A", undefined, 1, 0, Phaser.Easing.Sinusoidal.In);
            }, this);
            this._particles = new Collections.LinkedList(5);
            var lPart = Game.Global.game.add.image(0, 0, "atlas_A", "platform_0_lp");
            lPart.anchor.set(1, 0);
        }
        Object.defineProperty(Viewer, "instance", {
            get: function () { return Viewer._instance; },
            enumerable: true,
            configurable: true
        });
        Viewer.prototype.reset = function () {
            var fxLayer = Gameplay.Gameplay.instance.fxLayer;
            var frgLayer = this._layers[2];
            while (frgLayer.z < fxLayer.z)
                frgLayer.parent.moveUp(frgLayer);
            while (!this._actObjects.isEmpty)
                this._actObjects.removeElementAtIndex(0).deactivate();
            while (!this._sleepObjects.isEmpty)
                this._sleepObjectsPool.returnItem(this._sleepObjects.removeElementAtIndex(0));
            while (!this._particles.isEmpty)
                this._particlesPool.returnItem(this._particles.removeElementAtIndex(0).reset());
            var blockNode = this._viewer.ground.firstActSegment.blockNode;
            var objId = 0;
            while (blockNode.getObjectCnt() == 0)
                blockNode = blockNode.next;
            var objData = blockNode.getObject(0);
            var viewLX = this._viewer.viewLX;
            var viewRX = this._viewer.viewRX;
            while (blockNode.worldX + objData.lX <= viewRX) {
                if (blockNode.worldX + objData.rX > viewLX) {
                    var descriptor = objData.descriptor;
                    if (descriptor.objectType != 2 || objData.groupId == World.DataManager.instance.worldAssets[blockNode.worldId].decoGroupId)
                        this._actObjects.add(objData.descriptor.getObject(objData).activate(objData, blockNode, objId));
                }
                if (++objId == blockNode.getObjectCnt()) {
                    blockNode = blockNode.next;
                    objId = 0;
                }
                objData = blockNode.getObject(objId);
            }
            this._nextObject.setTo(blockNode, objId);
            this._lCoinTime = Gameplay.Gameplay.instance.timer.time;
            this._coinsInRow = 0;
        };
        Viewer.prototype.update = function (viewLX, viewRX) {
            this._actObjects.forEach(function (object, node) {
                if (!object.update(viewLX, viewRX))
                    this._actObjects.removeNode(node);
                return true;
            }, this);
            var viewPos = this._viewer.viewLX;
            if (viewPos < viewLX) {
                while (!this._sleepObjects.isEmpty && this._sleepObjects.first.rX < this._viewer.viewMinLX)
                    this._sleepObjectsPool.returnItem(this._sleepObjects.removeNode(this._sleepObjects.firstNode));
            }
            else if (viewPos > viewLX) {
                while (!this._sleepObjects.isEmpty && this._sleepObjects.last.rX >= viewLX) {
                    var obj = this._sleepObjects.removeNode(this._sleepObjects.lastNode);
                    this._actObjects.add(obj.objectData.descriptor.getObject(obj.objectData).activate(obj.objectData, obj.blockNode, obj.blockObjectId));
                    this._sleepObjectsPool.returnItem(obj);
                }
            }
            viewPos = this._viewer.viewRX;
            if (viewPos < viewRX) {
                var obj = this._nextObject;
                while (obj.lX <= viewRX) {
                    if (obj.blockNode.isObjectActivationAllowed(obj.blockObjectId)) {
                        var objData = obj.objectData;
                        if (objData.descriptor.objectType != 2 || objData.groupId == World.DataManager.instance.worldAssets[obj.blockNode.worldId].decoGroupId)
                            this._actObjects.add(objData.descriptor.getObject(objData).activate(objData, obj.blockNode, obj.blockObjectId));
                    }
                    obj.moveToNext();
                }
            }
            else if (viewPos > viewRX) {
                var obj = this._nextObject.getPrev(this._sleepObjectsPool.getItem());
                while (obj.valid && obj.lX > viewRX) {
                    this._nextObject.setTo(obj.blockNode, obj.blockObjectId);
                    this._nextObject.getPrev(obj);
                }
                this._sleepObjectsPool.returnItem(obj);
            }
            if (!this._particles.isEmpty) {
                var time = Gameplay.Gameplay.instance.timer.time;
                this._particles.forEach(function (particle, node) {
                    if (!particle.update())
                        this._particlesPool.returnItem(this._particles.removeNode(node));
                    return true;
                }, this);
            }
        };
        Viewer.prototype.getLayer = function (layer) {
            return this._layers[layer];
        };
        Viewer.prototype.getCoinValue = function () {
            var time = Gameplay.Gameplay.instance.timer.time;
            if (time - this._lCoinTime > Viewer.MAX_COIN_ROW_INTERVAL)
                this._coinsInRow = 0;
            this._lCoinTime = time;
            return ++this._coinsInRow;
        };
        Viewer.prototype.showPlatformParticle = function (platform, x, y) {
            var rnd = Game.Global.game.rnd;
            var parent = this.getLayer(platform.data.depth == 0 ? 0 : 1);
            this._particles.add(this._particlesPool.getItem().show(parent, x, y, 0, rnd.integerInRange(Viewer.PLAT_PARTICLE_MIN_FALL_SPEED, Viewer.PLAT_PARTICLE_MAX_FALL_SPEED), 1000, rnd.realInRange(0, 360), "platParticle_" + rnd.integerInRange(0, 1)));
        };
        Viewer.prototype.showPlatformParticles = function (platform) {
            var rnd = Game.Global.game.rnd;
            var frameKey = platform.frameBaseKey;
            var platSize = platform.data.size;
            var platAngle = platform.angle;
            var platAngleDegree = Phaser.Math.radToDeg(platAngle);
            var platX = platform.x;
            var platY = platform.y;
            var platLPW = platform.lPartWidth;
            var platCPTotW = platform.cPartWidth;
            var platCPW = platCPTotW / platSize;
            var platRPW = platform.rPartWidth;
            var dis = -(platCPTotW + platLPW) / 2;
            var parent = this.getLayer(platform.data.depth == 0 ? 0 : 1);
            this._particles.add(this._particlesPool.getItem().show(parent, platX + Math.cos(platAngle) * dis, platY + Math.sin(platAngle) * dis, 0, rnd.integerInRange(Viewer.PLAT_PARTICLE_MIN_FALL_SPEED, Viewer.PLAT_PARTICLE_MAX_FALL_SPEED), 1000, platAngleDegree + rnd.realInRange(-Viewer.PLAT_PARTICLE_ANGLE_DIF_RANGE, Viewer.PLAT_PARTICLE_ANGLE_DIF_RANGE), frameKey + "lp_1"));
            dis += (platLPW + platCPW) / 2;
            for (var i = 0; i < platSize; i++) {
                this._particles.add(this._particlesPool.getItem().show(parent, platX + Math.cos(platAngle) * dis, platY + Math.sin(platAngle) * dis, 0, rnd.integerInRange(Viewer.PLAT_PARTICLE_MIN_FALL_SPEED, Viewer.PLAT_PARTICLE_MAX_FALL_SPEED), 1000, platAngleDegree + rnd.realInRange(-Viewer.PLAT_PARTICLE_ANGLE_DIF_RANGE, Viewer.PLAT_PARTICLE_ANGLE_DIF_RANGE), frameKey + "particle"));
                dis += platCPW;
            }
            dis -= platCPW / 2;
            dis += platRPW / 2;
            this._particles.add(this._particlesPool.getItem().show(parent, platX + Math.cos(platAngle) * dis, platY + Math.sin(platAngle) * dis, 0, rnd.integerInRange(Viewer.PLAT_PARTICLE_MIN_FALL_SPEED, Viewer.PLAT_PARTICLE_MAX_FALL_SPEED), 1000, platAngleDegree + rnd.realInRange(-Viewer.PLAT_PARTICLE_ANGLE_DIF_RANGE, Viewer.PLAT_PARTICLE_ANGLE_DIF_RANGE), frameKey + "rp_1"));
        };
        Viewer.prototype.addSleepObject = function (object) {
            if (this._sleepObjects.isEmpty) {
                this._sleepObjects.add(this._sleepObjectsPool.getItem().setTo(object.blockNode, object.blockObjectId));
                return;
            }
            var node = this._sleepObjects.lastNode;
            var objRX = object.getRX();
            var objInf = this._sleepObjectsPool.getItem().setTo(object.blockNode, object.blockObjectId);
            if (node.element.rX > objRX) {
                node = node.prev;
                if (node == null) {
                    this._sleepObjects.add(objInf, 0);
                    return;
                }
            }
            this._sleepObjects.addToNode(objInf, node, false);
        };
        Viewer.prototype.renderDebugInfo = function (x, y, lineHeight) {
            var debug = Game.Global.game.debug;
            debug.text("=== GAME OBJECTS === ", x, y);
            y += lineHeight;
            debug.text("Active: " + this._actObjects.size, x, y);
            y += lineHeight;
            return y;
        };
        Viewer.PLAT_PARTICLE_MIN_FALL_SPEED = 100;
        Viewer.PLAT_PARTICLE_MAX_FALL_SPEED = 250;
        Viewer.PLAT_PARTICLE_ANGLE_DIF_RANGE = 20;
        Viewer.MAX_COIN_ROW_INTERVAL = 1000;
        return Viewer;
    }());
    WorldObjects.Viewer = Viewer;
})(WorldObjects || (WorldObjects = {}));
var Gameplay;
(function (Gameplay_1) {
    var Gameplay = (function (_super) {
        __extends(Gameplay, _super);
        function Gameplay() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._plAvatarLoaded = false;
            return _this;
        }
        Object.defineProperty(Gameplay, "instance", {
            get: function () { return Gameplay._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "timer", {
            get: function () { return this._timer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "mode", {
            get: function () { return this._mode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "worldView", {
            get: function () { return this._worldView; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "bike", {
            get: function () { return this._bike; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "ghost", {
            get: function () { return this._ghost; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "fxLayer", {
            get: function () { return this._fxLayer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "hudLayer", {
            get: function () { return this._hudLayer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "hudCoins", {
            get: function () { return this._hudCoins; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "hudFuel", {
            get: function () { return this._hudFuel; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "hudPowerUps", {
            get: function () { return this._hudPowerUps; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "screenOverlay", {
            get: function () { return this._screenOverlay; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "hudTapToPlay", {
            get: function () { return this._hudTapToPlay; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "score", {
            get: function () { return this._score; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "stuntScore", {
            get: function () { return this._stuntScore; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "credits", {
            get: function () { return this._credits; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "popupMessages", {
            get: function () { return this._popupMessages; },
            enumerable: true,
            configurable: true
        });
        Gameplay.prototype.init = function () {
            Gameplay._instance = this;
            Gameplay._gameModeProcessFnc = [
                null,
                this.processCountdown,
                this.processGameOver,
                this.processKeepPlaying,
                null,
                this.processPowsUnlock,
                this.processRestartFromCP
            ];
            World.ActCheckpoint.instance.onActivate.add(function () {
                this._cpScore = this._score;
            }, this);
        };
        Gameplay.prototype.create = function () {
            this.game.time.advancedTiming = true;
            this.camera.bounds = null;
            this._timer = new Helpers.GameTimer();
            var gravity = Gameplay.DEF_GRAVITY;
            if (Gamee2.Gamee.initialized && Gamee2.Gamee.initData.gameContext == "battle")
                gravity = Math.round(Gameplay.DEF_GRAVITY - (Gameplay.DEF_GRAVITY - Gameplay.MIN_GRAVITY) * (Game.Global.battleSettings.gravity / 5));
            this.physics.startSystem(Phaser.Physics.BOX2D);
            this._box2d = this.physics.box2d;
            this._box2d.setPTMRatio(Gameplay.PIXELS_TO_METERS);
            this._box2d.gravity.y = gravity;
            this._gameplayLayer = this.add.group();
            var worldAssets;
            if (!Gamee2.Gamee.initialized || Gamee2.Gamee.initData.gameContext == "normal") {
                worldAssets = [
                    Game.Global.getEnviroment(0),
                    Game.Global.getEnviroment(2)
                ];
            }
            else {
                worldAssets = [
                    Game.Global.getEnviroment(Game.Global.battleSettings.assetUID)
                ];
            }
            this._world = new World.DataManager(worldAssets);
            this._worldView = new World.Viewer(this._gameplayLayer);
            this._ghost = new Ghost.Player(this._timer, this._gameplayLayer);
            this._bike = new Bike.Bike(this._gameplayLayer);
            this._fxLayer = this.add.group(this._gameplayLayer);
            new Bike.ParticleMng(this._bike, this._fxLayer, this._timer);
            if (Gamee2.Gamee.initialized && Gamee2.Gamee.initData.gameContext == "battle")
                this._peephole = new Gameplay_1.Peephole(this._gameplayLayer, this._bike);
            this._hudLayer = this.add.group(this._gameplayLayer);
            this._hudLayer.fixedToCamera = true;
            this._hudCoins = new HUD.Coins();
            this._hudFuel = new HUD.FuelGauge(this._timer, this._bike.fuel, this._hudLayer);
            this._hudPowerUps = new HUD.PowIconPanel(this._hudLayer);
            this._stuntScore = new HUD.StuntScore(this._hudLayer);
            this._controls = new Gameplay_1.BikeControls(this._hudLayer);
            this._countdown = new HUD.Countdown(this._timer);
            this._hudTapToPlay = new HUD.TapToPlay();
            this._popupMessages = new Collections.GameObjects(function () { return new HUD.PopupMsg(this._fxLayer); }, this, 3);
            this._hudLoadingMsg = new HUD.LoadingMessage(this._timer);
            this._screenCrackFx = this.make.image(0, 0, "atlas_A", "screenCrack");
            this._screenCrackFx.exists = false;
            this._screenCrackFx.visible = false;
            this._screenOverlay = new Helpers.ScreenOverlay(this._hudLayer);
            this._keepPlaying = new HUD.KeepPlaying(this._timer);
            this._selectPowerUps = new PowSelection.Panel();
            this._selectPowerUps.onSignal.add(this.handlePowSelectionSignal, this);
            this._unlockPowerUps = new PowUnlocking.Panel();
            this._screenBase = new Gameplay_1.MinorScreenBase();
            this._bikesScreen = new Gameplay_1.BikesScreen(this._screenBase);
            if (!Gamee2.Gamee.initialized || (Gamee2.Gamee.initData.gameContext == "normal" && (Gamee2.Gamee.initData.platform != "web" && Gamee2.Gamee.initData.platform != "mobile_web")))
                this._battleCreator = new Gameplay_1.BattleCreator(this._screenBase);
            var resetMode = -1;
            if (Gamee2.Gamee.initialized) {
                this._mode = 4;
                if ((Gamee2.Gamee.startFlags & Gamee2.eStartFlag.replay) == 0)
                    resetMode = 2;
            }
            else {
                resetMode = 0;
            }
            if (resetMode >= 0)
                this.reset(resetMode);
            Game.Global.scale.onResChange.add(this.handleResize, this);
            this.handleResize(Game.Global.scale.resolution);
            if (Gamee2.Gamee.initialized) {
                Game.AudioUtils.sfxOn = Gamee2.Gamee.initData.sound;
                Gamee2.Gamee.onStart.add(this.handleGameeStart, this);
                Gamee2.Gamee.onPause.add(this.handleGameePause, this);
                Gamee2.Gamee.onResume.add(this.handleGameeResume, this);
                Gamee2.Gamee.onMute.add(this.handleGameeMute, this);
                Gamee2.Gamee.onUnmute.add(this.handleGameeUnmute, this);
                Gamee2.Gamee.onGhostChange.add(this.handleGameeGhostChange, this);
                this.handleGameeStart0();
            }
        };
        Gameplay.prototype.update = function () {
            if (this._mode == 0) {
                this._timer.update();
                if (this._state == 0) {
                    this._controls.update();
                    this._bike.update();
                    if (Game.Global.gameMode != 0)
                        this._ghost.update();
                    this._worldView.update();
                }
                else if (this._state == 2 || this._state == 3 || this._state == 5) {
                    this._bike.update();
                }
                else if (this._state == 4) {
                    this._selectPowerUps.update();
                }
                if (this._peephole)
                    this._peephole.update();
                this._stuntScore.update();
                this._popupMessages.updateObjects();
                this._hudFuel.update();
                this._hudCoins.update();
                this._hudPowerUps.update();
                this._screenOverlay.update();
                if (this._state != 0) {
                    var fnc = Gameplay._gameModeProcessFnc[this._state];
                    if (fnc != null)
                        fnc.call(this);
                    this._hudTapToPlay.update();
                }
            }
            else if (this._mode == 5) {
                if (!this._bikesScreen.update()) {
                    if (this._gameeOnReady == 1) {
                        this._gameeOnReady = 0;
                        this.reset(0);
                    }
                    else {
                        this.showGameplayLayer(true);
                        this._hudCoins.reset(this._hudLayer, this._timer);
                        this._mode = 0;
                        if (this._bikesScreen.newBikeSelected)
                            this._bike.reset();
                    }
                }
            }
            else if (this._mode == 6) {
                if (!this._battleCreator.update()) {
                    if (this._gameeOnReady == 2) {
                        this._gameeOnReady = 0;
                        this.reset(0);
                    }
                    else {
                        this.showGameplayLayer(true);
                        this._mode = 0;
                    }
                }
            }
            else if (this._mode == 7) {
                this._timer.update();
                this._ghost.update();
                this._worldView.update();
                if (this._replayRestartTime == null) {
                    if (this._ghost.complete)
                        this._replayRestartTime = this._timer.time + 2000;
                }
                else if (this._timer.time >= this._replayRestartTime) {
                    this._replayRestartTime = null;
                    this._worldView.reset();
                    this._ghost.reset();
                    this._ghost.start();
                    this._worldView.update();
                }
            }
            else if (this._mode == 3) {
                this._timer.update();
                this._hudLoadingMsg.update();
            }
        };
        Gameplay.prototype.preRender = function () {
            if (this._mode == 0)
                this._bike.preRender();
        };
        Gameplay.prototype.addScore = function (score) {
            this._score += score;
            Gamee2.Gamee.score = this._score;
        };
        Gameplay.prototype.gameOver = function () {
            var _this = this;
            this._controls.visible = false;
            this.camera.onFadeComplete.addOnce(function () {
                if (_this._bike.deathReason == 1) {
                    _this._screenCrackFx.visible = true;
                    _this._hudLayer.addChild(_this._screenCrackFx);
                }
                _this.camera.flash(0xFFFFFF, 500);
                _this._state = 2;
                _this._gameOverTime = _this._timer.time + 1000;
            }, this);
            this.camera.fade(0xFFFFFF, 100);
        };
        Gameplay.prototype.startCountdown = function () {
            if (this._peephole && Game.Global.battleSettings.visibility != 0)
                this._peephole.activate(Game.Global.battleSettings.visibility);
            this._controls.visible = true;
            this._state = 1;
            this._countdown.start();
        };
        Gameplay.prototype.startRide = function () {
            this._box2d.resume();
            this._bike.start();
            if (Game.Global.gameMode != 0)
                this._ghost.start();
            this._controls.visible = true;
            this._state = 0;
        };
        Gameplay.prototype.endGame = function () {
            if (Gamee2.Gamee.initialized) {
                this._mode = 1;
                this.game.paused = true;
                this._box2d.pause();
                var replayData = void 0;
                if (Gamee2.Gamee.player == null || Gamee2.Gamee.player.highScore < this._score) {
                    var ghostData = {
                        bikeTypeUID: 0,
                        score: this._score,
                        pathBlocksUID: [],
                        pathBlocksWorldId: [],
                        pathGroupId: 0,
                        pathGroupRemWidthRatio: 0,
                        pathGroupUsedBlocks: [],
                        ghostEntries: "",
                        ghostEntriesLen: 0
                    };
                    this._bike.ghostRecorder.serialize(ghostData);
                    this._world.serialize(ghostData);
                    replayData = JSON.stringify(ghostData);
                }
                Gamee2.Gamee.gameOver(replayData, Game.Global.playerProfile.toSerializedString());
                Game.Global.playerProfile.resetSaveRequest();
            }
            else {
                this.reset(0);
            }
        };
        Gameplay.prototype.resetFromCP = function () {
            var _this = this;
            this._score = this._cpScore;
            Gamee2.Gamee.score = this._score;
            var i = PowerUps.Manager.powerUps.length;
            while (i-- != 0) {
                if (PowerUps.Manager.powerUps[i].state != 2)
                    PowerUps.Manager.powerUps[i].reset();
            }
            this._worldView.resetFromCP();
            this._bike.resetFromCP();
            if (Game.Global.gameMode != 0)
                this._ghost.resetFromCP();
            this.resetBase();
            this._screenOverlay.show(0, 0.5, 0, undefined, true);
            this._screenOverlay.inputEnabled = true;
            this._hudTapToPlay.show(this._screenOverlay.onInputDown, this._hudLayer, this.camera.width / 2, this.camera.height / 2);
            this._hudTapToPlay.onInputDown.addOnce(function () {
                _this._hudTapToPlay.reset();
                _this._screenOverlay.reset();
                _this._screenOverlay.inputEnabled = false;
                _this.startRide();
                Gamee2.Gamee.logEvent("CONTINUE", "1");
            }, this);
            this._state = 6;
        };
        Gameplay.prototype.reset = function (mode) {
            this._box2d.pause();
            this._timer.start();
            this._score = 0;
            this._credits = 1;
            var i = PowerUps.Manager.powerUps.length;
            while (i-- != 0)
                PowerUps.Manager.powerUps[i].reset();
            if (Game.Global.gameMode == 0 || Game.Global.gameMode == 1) {
                if (this._bike.ghostRecorder.entryCnt > 10) {
                    if (Game.Global.gameMode == 0 || Game.Global.playerProfile.newMaxGameDistance) {
                        this._bike.ghostRecorder.initPlayer(this._ghost);
                        Game.Global.gameMode = 1;
                    }
                }
            }
            this._world.reset();
            this._worldView.reset();
            if (mode != 1) {
                this._bike.reset();
            }
            else {
                this._bike.visible = false;
            }
            this._ghost.reset();
            if (Game.Global.gameMode == 3 && mode == 0)
                Gamee2.Gamee.ghostScore = this._ghost.score;
            if (this._peephole)
                this._peephole.reset();
            this.resetBase();
            if (mode != 1) {
                if (mode == 0) {
                    Game.Global.playerProfile.validateBikesAnnouncedFlag();
                    this._raceStartPoints = Game.Global.playerProfile.points;
                    if (this._raceStartPoints != 0 || (Gamee2.Gamee.initialized && Gamee2.Gamee.initData.gameContext == "battle")) {
                        this._controls.visible = false;
                        this._selectPowerUps.show();
                        this._state = 4;
                    }
                    else {
                        this.startCountdown();
                    }
                    this._mode = 0;
                }
                else {
                    if (this._mode != 4) {
                        this._screenOverlay.show(0, 0.5, 0, undefined, true);
                        this._hudLoadingMsg.show(this.camera.width / 2, Math.round(this.camera.height * 0.35), this._hudLayer);
                        this._mode = 3;
                    }
                    this._controls.visible = false;
                }
                this._hudLayer.visible = true;
                this._bikesScreen.reset();
                if (this._battleCreator)
                    this._battleCreator.reset();
                this.showGameplayLayer(true);
            }
            else {
                this._hudLayer.visible = false;
                this._ghost.start();
                this._replayRestartTime = null;
                this._mode = 7;
            }
        };
        Gameplay.prototype.resetBase = function () {
            this._worldView.update();
            Game.Global.powerUps.ensureValidity();
            this._stuntScore.reset();
            this._popupMessages.reset();
            this._hudCoins.reset(this._hudLayer, this._timer);
            this._hudFuel.reset();
            this._hudPowerUps.reset();
            this._countdown.reset();
            this._keepPlaying.reset();
            this._hudTapToPlay.reset();
            this._hudLoadingMsg.hide();
            this._screenOverlay.reset();
            this._screenOverlay.inputEnabled = false;
            if (this._screenCrackFx.parent != null) {
                this._screenCrackFx.visible = false;
                this._screenCrackFx.parent.removeChild(this._screenCrackFx);
            }
            this._selectPowerUps.reset();
            this._unlockPowerUps.reset();
        };
        Gameplay.prototype.processCountdown = function () {
            if (!this._countdown.update())
                this.startRide();
        };
        Gameplay.prototype.processPowsUnlock = function () {
            if (!this._unlockPowerUps.update()) {
                this.endGame();
            }
        };
        Gameplay.prototype.processGameOver = function () {
            if (this._gameOverTime <= this._timer.time) {
                if (this._credits != 0 && World.ActCheckpoint.instance.active && this._bike.reachedDistance > 100 && (!Gamee2.Gamee.initialized || Gamee2.Gamee.adState == Gamee2.eAdState.ready)) {
                    this._keepPlaying.show();
                    this._state = 3;
                }
                else {
                    if (this._peephole)
                        this._peephole.deactivate();
                    this.showPowsUnlocking();
                }
            }
        };
        Gameplay.prototype.processKeepPlaying = function () {
            var _this = this;
            if (!this._keepPlaying.update()) {
                if (this._keepPlaying.result) {
                    this._credits--;
                    if (Gamee2.Gamee.ready) {
                        this._mode = 2;
                        if (!Gamee2.Gamee.showAd(function (res) {
                            _this._mode = 0;
                            if (res) {
                                _this.resetFromCP();
                            }
                            else {
                                _this.showPowsUnlocking();
                            }
                        }, this)) {
                            this.showPowsUnlocking();
                        }
                    }
                    else {
                        this.resetFromCP();
                    }
                }
                else {
                    this.showPowsUnlocking();
                }
            }
        };
        Gameplay.prototype.processRestartFromCP = function () {
            this._worldView.update();
            if (!this._box2d.paused && this._bike.getWheel(0).onGround && this._bike.getWheel(1).onGround) {
                var body = this._bike.bodySprite.body;
                body.setZeroRotation();
                body.setZeroVelocity();
                body = this._bike.headSprite.body;
                body.setZeroRotation();
                body.setZeroVelocity();
                this._box2d.pause();
            }
        };
        Gameplay.prototype.showPowsUnlocking = function () {
            Game.Global.playerProfile.saveRaceResult(this._bike.reachedDistance, this._score);
            if (Game.Global.powerUps.firstLockedPowerUpId >= 0) {
                this._screenOverlay.show(0, 0.75, 1000, Phaser.Easing.Cubic.Out, true);
                this._unlockPowerUps.show(this._raceStartPoints, Game.Global.playerProfile.points);
                this._state = 5;
            }
            else {
                this.endGame();
            }
        };
        Gameplay.prototype.showGameplayLayer = function (show) {
            if (this._gameplayLayer.visible != show) {
                if (show) {
                    this._gameplayLayer.visible = this._gameplayLayer.exists = true;
                    Game.Global.game.world.addChild(this._gameplayLayer);
                }
                else {
                    this._gameplayLayer.visible = this._gameplayLayer.exists = false;
                    this._gameplayLayer.parent.removeChild(this._gameplayLayer);
                }
            }
        };
        Gameplay.prototype.handleResize = function (res) {
            this._screenCrackFx.width = res.x;
            this._screenCrackFx.height = res.y;
            if (this._mode == 0 && this._state == 6)
                this._hudTapToPlay.position.set(res.x / 2, res.y / 2);
        };
        Gameplay.prototype.handlePowSelectionSignal = function (signal) {
            switch (signal) {
                case 0: {
                    this.startCountdown();
                    break;
                }
                case 2: {
                    this._mode = 5;
                    this.showGameplayLayer(false);
                    this._bikesScreen.show(this._hudCoins);
                    break;
                }
                case 3: {
                    this._mode = 6;
                    this.showGameplayLayer(false);
                    this._battleCreator.show();
                    break;
                }
            }
        };
        Gameplay.prototype.initGhost = function (data, avatarKey) {
            if (data) {
                try {
                    var ghostData = JSON.parse(data);
                    this._ghost.init(Helpers.base64ToArrayBuffer(new ArrayBuffer(ghostData.ghostEntriesLen), ghostData.ghostEntries), ghostData.ghostEntriesLen, Game.Global.getBikeType(ghostData.bikeTypeUID), ghostData.score, avatarKey);
                    this._world.initFromSerializedData(ghostData);
                    return true;
                }
                catch (e) {
                    return false;
                }
            }
            return false;
        };
        Gameplay.prototype.handleGameeStart = function (flags) {
            Gamee2.Gamee.loadAd();
            this.game.paused = false;
            if (this._mode == 4) {
                switch (this._gameeOnReady) {
                    case 0: {
                        this.reset(0);
                        break;
                    }
                    case 1: {
                        this._mode = 5;
                        break;
                    }
                    case 2: {
                        this._mode = 6;
                        break;
                    }
                }
                return;
            }
            if (this._mode == 1 || (this._mode == 7 && Gamee2.Gamee.initData.gameContext == "battle" && (flags & Gamee2.eStartFlag.replay) == 0)) {
                this.reset(2);
                this.handleGameeStart0();
            }
            else {
                this.reset(0);
            }
        };
        Gameplay.prototype.handleGameeStart0 = function () {
            if ((Gamee2.Gamee.startFlags & Gamee2.eStartFlag.replay) != 0) {
                Game.Global.gameMode = 3;
                this.initGhost(Gamee2.Gamee.initData.replayData.data);
            }
            else if (Game.Global.gameMode == 3 && Gamee2.Gamee.initData.gameContext == "battle") {
                Game.Global.gameMode = 0;
            }
            if (Game.Global.gameMode != 3 && (Gamee2.Gamee.initData.platform == "ios" || Gamee2.Gamee.initData.platform == "android")) {
                Gamee2.Gamee.requestSocial(this.handleGameeStart1, this, 5);
            }
            else {
                Gamee2.Gamee.requestPlayerData(this.handleGameeStart1, this);
            }
        };
        Gameplay.prototype.handleGameeStart1 = function () {
            var _this = this;
            if (!this._plAvatarLoaded && Gamee2.Gamee.player != null) {
                this.load.onLoadComplete.addOnce(function () {
                    _this._plAvatarLoaded = true;
                    _this.handleGameeStart2();
                });
                this.load.baseURL = "";
                this.load.image("avatar", Gamee2.Gamee.player.avatar);
                this.load.start();
            }
            else {
                this.handleGameeStart2();
            }
        };
        Gameplay.prototype.handleGameeStart2 = function () {
            if (Game.Global.gameMode != 3 && (Gamee2.Gamee.initData.platform == "ios" || Gamee2.Gamee.initData.platform == "android")) {
                Opponents.Manager.instance.onAsyncComplete.addOnce(this.handleGameeStart3, this);
                Opponents.Manager.instance.init(Gamee2.Gamee.friends);
            }
            else {
                this.handleGameeStart3();
            }
        };
        Gameplay.prototype.handleGameeStart3 = function () {
            var _this = this;
            if (Game.Global.gameMode == 3) {
                if ((Gamee2.Gamee.startFlags & Gamee2.eStartFlag.replay) != 0) {
                    this.reset(1);
                    return;
                }
            }
            else {
                var opponents = Opponents.Manager.instance;
                if (opponents.ghostOpponent != null) {
                    if (opponents.newGhostData) {
                        this.initGhost(opponents.ghostOpponent.replayData, opponents.ghostOpponent.avatarKey);
                        Game.Global.gameMode = 2;
                    }
                }
                else if (Game.Global.gameMode == 2) {
                    Game.Global.gameMode = 0;
                }
            }
            if (this._mode == 4) {
                this._gameeOnReady = 0;
                if (Gamee2.Gamee.initData.gameContext == "normal" && Gamee2.Gamee.initData.initData) {
                    try {
                        console.log(Gamee2.Gamee.initData.initData);
                        var shopInitData = JSON.parse(Gamee2.Gamee.initData.initData);
                        if (shopInitData.type && (shopInitData.type == "bike" || shopInitData.type == "battle")) {
                            var currency = shopInitData.currency == "gems" ? 2 : 1;
                            if (shopInitData.type == "bike") {
                                var bike = Game.Global.getBikeType(shopInitData.id);
                                var bikePrice = bike.gameeCurrencyPrice;
                                if (bikePrice.currency != currency || bikePrice.price != shopInitData.cost)
                                    bikePrice.set(shopInitData.cost, currency, true);
                                Game.Global.playerProfile.validateBikesAnnouncedFlag();
                                this.showGameplayLayer(false);
                                this._bikesScreen.show(this._hudCoins, bike.uid);
                                this._gameeOnReady = 1;
                            }
                            else {
                                var unlockPrice = this._battleCreator.unlockPrice[0];
                                if (unlockPrice.price != shopInitData.cost || unlockPrice.currency != currency)
                                    unlockPrice.set(shopInitData.cost, currency, true);
                                this.showGameplayLayer(false);
                                this._battleCreator.show();
                                this._gameeOnReady = 2;
                            }
                        }
                    }
                    catch (e) {
                    }
                }
                Gamee2.Gamee.gameReady();
            }
            else {
                this.camera.onFadeComplete.addOnce(function () {
                    _this.reset(0);
                    _this.camera.flash(0xFFFFFF, 250);
                }, this);
                this.camera.fade(0xFFFFFF, 250);
            }
        };
        Gameplay.prototype.handleGameePause = function () {
            this.game.paused = true;
        };
        Gameplay.prototype.handleGameeResume = function () {
            this.game.paused = false;
        };
        Gameplay.prototype.handleGameeMute = function () {
            Game.AudioUtils.stopSound("engineAcceleration");
            Game.AudioUtils.stopSound("engineIdle");
            Game.AudioUtils.sfxOn = false;
        };
        Gameplay.prototype.handleGameeUnmute = function () {
            Game.AudioUtils.sfxOn = true;
        };
        Gameplay.prototype.handleGameeGhostChange = function (visible) {
            this._ghost.visible = visible;
        };
        Gameplay.PIXELS_TO_METERS = 50;
        Gameplay.DEF_GRAVITY = 500;
        Gameplay.MIN_GRAVITY = 200;
        Gameplay.BIKE_START_X = 100;
        return Gameplay;
    }(Phaser.State));
    Gameplay_1.Gameplay = Gameplay;
})(Gameplay || (Gameplay = {}));
var World;
(function (World) {
    var eFlag;
    (function (eFlag) {
        eFlag[eFlag["active"] = 1] = "active";
        eFlag[eFlag["lWordlChange"] = 2] = "lWordlChange";
        eFlag[eFlag["rWorldChange"] = 4] = "rWorldChange";
    })(eFlag || (eFlag = {}));
    var BlockNode = (function () {
        function BlockNode(prevNode, block, worldId, nextNodeWorldId) {
            this._block = block;
            this._worldId = worldId;
            this._flags = 0;
            if (prevNode != null) {
                this._worldX = prevNode._worldX + prevNode._block.width;
                prevNode._next = this;
                if (prevNode.worldId != worldId) {
                    this._flags |= eFlag.lWordlChange;
                    this._lWorldTransData = new WorldObjects.WorldTransData(World.DataManager.objectDescriptors[5]);
                    this._lWorldTransData.setup(this, false, worldId);
                }
            }
            else {
                this._worldX = 0;
            }
            if (nextNodeWorldId != worldId) {
                this._flags |= eFlag.rWorldChange;
                this._rWorldTransData = new WorldObjects.WorldTransData(World.DataManager.objectDescriptors[5]);
                this._rWorldTransData.setup(this, true, nextNodeWorldId);
            }
            this._prev = prevNode;
            this._next = null;
            this._actObjectsMask = [];
            this._disObjectsMask = [];
            var i = Math.ceil(this.getObjectCnt() / 32);
            while (i-- != 0) {
                this._actObjectsMask.push(0);
                this._disObjectsMask.push(0);
            }
        }
        Object.defineProperty(BlockNode.prototype, "previous", {
            get: function () { return this._prev; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockNode.prototype, "next", {
            get: function () { return this.getNextNode(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockNode.prototype, "isLast", {
            get: function () { return this._next == null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockNode.prototype, "block", {
            get: function () { return this._block; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockNode.prototype, "worldX", {
            get: function () { return this._worldX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockNode.prototype, "worldId", {
            get: function () { return this._worldId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockNode.prototype, "activated", {
            get: function () { return (this._flags & eFlag.active) != 0; },
            enumerable: true,
            configurable: true
        });
        BlockNode.prototype.reset = function () {
            var i = this._actObjectsMask.length;
            while (i-- != 0) {
                this._actObjectsMask[i] = 0;
                this._disObjectsMask[i] = 0;
            }
            this._flags &= ~eFlag.active;
        };
        BlockNode.prototype.getObject = function (id) {
            if ((this._flags & (eFlag.lWordlChange | eFlag.rWorldChange)) == 0)
                return this._block.objects[id];
            if ((this._flags & eFlag.lWordlChange) != 0) {
                if (id == 0)
                    return this._lWorldTransData;
                id--;
            }
            if ((this._flags & eFlag.rWorldChange) != 0) {
                if (id == this._block.objects.length)
                    return this._rWorldTransData;
            }
            return this._block.objects[id];
        };
        BlockNode.prototype.getObjectCnt = function () {
            var cnt = this._block.objects.length;
            if ((this._flags & eFlag.lWordlChange) != 0)
                cnt++;
            if ((this._flags & eFlag.rWorldChange) != 0)
                cnt++;
            return cnt;
        };
        BlockNode.prototype.isObjectActivationAllowed = function (objId) {
            var maskId = objId >> 5;
            var maskPos = objId & 31;
            return ((this._disObjectsMask[maskId] & (1 << maskPos)) == 0 && (this._actObjectsMask[maskId] & (1 << maskPos)) == 0);
        };
        BlockNode.prototype.isObjectActive = function (objId) {
            return (this._actObjectsMask[objId >> 5] & (1 << objId & 31)) != 0;
        };
        BlockNode.prototype.markObjectAsActive = function (objId) {
            this._actObjectsMask[(objId >> 5)] |= (1 << (objId & 31));
        };
        BlockNode.prototype.markObjectAsInactive = function (objId) {
            this._actObjectsMask[(objId >> 5)] &= ~(1 << (objId & 31));
        };
        BlockNode.prototype.markObjectAsDisabled = function (objId) {
            this._disObjectsMask[(objId >> 5)] |= (1 << (objId & 31));
        };
        BlockNode.prototype.activate = function () {
            if ((this._flags & eFlag.active) == 0) {
                this._flags |= eFlag.active;
                World.DataManager.instance.addBlockCheckpoints(this);
            }
        };
        BlockNode.prototype.getNextNode = function () {
            if (this._next == null)
                this._next = World.DataManager.instance.initNextBlockNode(this);
            return this._next;
        };
        return BlockNode;
    }());
    World.BlockNode = BlockNode;
})(World || (World = {}));
var World;
(function (World) {
    var Block = (function () {
        function Block(uid) {
            this._uid = uid;
        }
        Object.defineProperty(Block.prototype, "uid", {
            get: function () { return this._uid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Block.prototype, "segments", {
            get: function () { return this._segments; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Block.prototype, "objects", {
            get: function () { return this._objects; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Block.prototype, "checkpoints", {
            get: function () { return this._checkpoints; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Block.prototype, "width", {
            get: function () { return this._segments[this._segments.length - 1].vertexB.x + 1; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Block.prototype, "length", {
            get: function () { return this._length; },
            enumerable: true,
            configurable: true
        });
        Block.prototype.load = function (data, dataPos) {
            var i = data.getUint16(dataPos, false);
            dataPos += 2;
            this._segments = [];
            this._length = 0;
            while (i-- != 0) {
                var segment = new WorldGround.Segment();
                this._segments.push(segment);
                dataPos = segment.load(data, dataPos);
                this._length += segment.length;
            }
            this._objects = [];
            i = data.getUint16(dataPos, false);
            dataPos += 2;
            while (i-- != 0) {
                dataPos = WorldObjects.ObjectData.create(data, dataPos, this._objects);
            }
            this._checkpoints = [];
            i = data.getUint8(dataPos++);
            while (i-- != 0) {
                this._checkpoints.push(new World.BlockCheckpoint(data, dataPos));
                dataPos += World.BlockCheckpoint.DATA_SIZE;
            }
            return dataPos;
        };
        return Block;
    }());
    World.Block = Block;
    var BlockGroup = (function () {
        function BlockGroup() {
        }
        Object.defineProperty(BlockGroup.prototype, "useRatio", {
            get: function () { return this._useRatio; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlockGroup.prototype, "blockCnt", {
            get: function () { return this._blocks.length; },
            enumerable: true,
            configurable: true
        });
        BlockGroup.prototype.load = function (data, dataPos) {
            this._useRatio = 1.1;
            var blockCnt = data.getUint8(dataPos);
            dataPos++;
            var uidToBlockMap = World.DataManager.instance.blocks;
            this._blocks = [];
            while (blockCnt-- != 0) {
                this._blocks.push(uidToBlockMap[data.getUint32(dataPos, false)]);
                dataPos += 4;
            }
            return dataPos;
        };
        BlockGroup.prototype.getBlock = function (blockId) {
            return this._blocks[blockId];
        };
        return BlockGroup;
    }());
    World.BlockGroup = BlockGroup;
})(World || (World = {}));
var World;
(function (World) {
    var DataManager = (function () {
        function DataManager(worldAssets) {
            DataManager._instance = this;
            this._worldAssets = worldAssets;
            if (DataManager._objectDescriptors.length == 0) {
                DataManager._objectDescriptors.push(new WorldObjects.ObjectDescriptor(0, WorldObjects.ObjectData, new Collections.Pool(WorldObjects.ObjCoin, 0, true)));
                DataManager._objectDescriptors.push(new WorldObjects.ObjectDescriptor(1, WorldObjects.ObjectDataRotable, new Collections.Pool(WorldObjects.ObjSpikes, 0, true)));
                DataManager._objectDescriptors.push(new WorldObjects.ObjectDescriptor(2, WorldObjects.DecorationData, new Collections.Pool(WorldObjects.ObjDecoration, 0, true)));
                var swingPool = new Collections.Pool(WorldObjects.SwingPlatform, 0, true);
                DataManager._objectDescriptors.push(new WorldObjects.PlatformDescriptor(3, WorldObjects.PlatformData, [
                    new Collections.Pool(WorldObjects.StaticPlatform, 0, true),
                    new Collections.Pool(WorldObjects.FragilePlatform, 0, true),
                    swingPool,
                    swingPool,
                ]));
                DataManager._objectDescriptors.push(new WorldObjects.ObjectDescriptor(4, WorldObjects.ObjectDataRotable, new Collections.Pool(WorldObjects.ObjBoost, 0, true)));
                DataManager._objectDescriptors.push(new WorldObjects.ObjectDescriptor(5, WorldObjects.WorldTransData, new Collections.Pool(WorldObjects.WorldTrans, 0, true)));
            }
            this._nextCheckpointsPool = new Collections.Pool(World.BlockNodeCheckpoint, 2, true);
            this._nextCheckpoints = new Collections.LinkedList(2);
            var data = new DataView(Game.Global.game.cache.getBinary("maps"));
            var dataOffset = 0;
            var i = data.getUint16(dataOffset, false);
            dataOffset += 2;
            this._blocks = [];
            while (i-- != 0) {
                var block = new World.Block(data.getUint32(dataOffset, false));
                dataOffset = block.load(data, dataOffset + 4);
                this._blocks[block.uid] = block;
            }
            this._blockGroupUnusedBlocks = new Collections.LinkedList(5);
            this._blockGroupUsedBlocks = new Collections.FixedArray();
            this._blockGroups = [];
            var groupCnt = data.getUint8(dataOffset);
            dataOffset++;
            while (groupCnt-- != 0) {
                var group = new World.BlockGroup();
                this._blockGroups.push(group);
                dataOffset = group.load(data, dataOffset);
            }
            this._worldSelProb = [];
            i = worldAssets.length;
            while (i-- != 0)
                this._worldSelProb.push(0);
        }
        Object.defineProperty(DataManager, "instance", {
            get: function () { return DataManager._instance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataManager.prototype, "worldAssets", {
            get: function () { return this._worldAssets; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataManager, "objectDescriptors", {
            get: function () { return DataManager._objectDescriptors; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataManager.prototype, "blocks", {
            get: function () { return this._blocks; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataManager.prototype, "firstBlockNode", {
            get: function () { return this._firstBlockNode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataManager.prototype, "nextCheckpoint", {
            get: function () { return this._nextCheckpoints.isEmpty ? null : this._nextCheckpoints.first; },
            enumerable: true,
            configurable: true
        });
        DataManager.prototype.reset = function () {
            World.ActCheckpoint.instance.reset();
            this._nextCheckpoints.forEach(function (cp) {
                this._nextCheckpointsPool.returnItem(cp);
                return true;
            }, this);
            this._nextCheckpoints.clear();
            if (Game.Global.gameMode == 0) {
                this._blockGroupId = -1;
                var block = this.initNextBlockGroup();
                for (var i = 0; i < this._worldSelProb.length; i++)
                    this._worldSelProb[i] = 0;
                this._nextWorldId = 0;
                this.setNewWorld(0);
                this._firstBlockNode = new World.BlockNode(null, block, 0, this.getNextBlockNodeWorldId(block, 0, 0));
            }
            else {
                var blockNode = this._firstBlockNode;
                while (true) {
                    blockNode.reset();
                    if (blockNode.isLast)
                        break;
                    blockNode = blockNode.next;
                }
            }
        };
        DataManager.prototype.initFromSerializedData = function (data) {
            var group = this._blockGroups[(this._blockGroupId = data.pathGroupId)];
            this._blockGroupUnusedBlocks.clear();
            this._blockGroupUsedBlocks.reset();
            var blockId = group.blockCnt;
            var totalWidth = 0;
            var rnd = Game.Global.game.rnd;
            while (blockId-- != 0) {
                var block_1 = group.getBlock(blockId);
                if (data.pathGroupUsedBlocks.indexOf(block_1.uid) >= 0) {
                    this._blockGroupUsedBlocks.addEntry(block_1);
                }
                else {
                    this._blockGroupUnusedBlocks.add(block_1, rnd.integerInRange(0, this._blockGroupUnusedBlocks.size));
                }
                totalWidth += block_1.width;
            }
            this._blockGroupTotWidth = totalWidth;
            this._blockGroupRemWidth = Math.round(totalWidth * data.pathGroupRemWidthRatio);
            var block = this._blocks[data.pathBlocksUID[0]];
            var blockWorldId = data.pathBlocksWorldId[0];
            var nextBlockWorldId;
            for (var i = 0; i < this._worldSelProb.length; i++)
                this._worldSelProb[i] = 0;
            this._nextWorldId = blockWorldId;
            this.setNewWorld(0);
            if (data.pathBlocksUID.length > 1) {
                nextBlockWorldId = data.pathBlocksWorldId[1];
            }
            else {
                this.getNextBlockNodeWorldId(block, 0, blockWorldId);
            }
            this._firstBlockNode = new World.BlockNode(null, block, blockWorldId, nextBlockWorldId);
            var prevNode = this._firstBlockNode;
            blockId = 1;
            while (blockId < data.pathBlocksUID.length) {
                block = this._blocks[data.pathBlocksUID[blockId]];
                var worldId = data.pathBlocksWorldId[blockId];
                if (worldId != prevNode.worldId)
                    this.setNewWorld(prevNode.worldX + prevNode.block.width);
                if (blockId + 1 < data.pathBlocksUID.length) {
                    nextBlockWorldId = data.pathBlocksWorldId[blockId + 1];
                }
                else {
                    nextBlockWorldId = this.getNextBlockNodeWorldId(block, prevNode.worldX + prevNode.block.width, worldId);
                }
                prevNode = new World.BlockNode(prevNode, block, worldId, nextBlockWorldId);
                blockId++;
            }
        };
        DataManager.prototype.initNextBlockNode = function (prevNode) {
            var block;
            if (this._blockGroupRemWidth <= 0) {
                block = this.initNextBlockGroup();
            }
            else {
                if (this._blockGroupUnusedBlocks.size == 0) {
                    var blocks = this._blockGroupUsedBlocks.entries;
                    var blockId = this._blockGroupUsedBlocks.entryCnt;
                    var rnd = Game.Global.game.rnd;
                    while (blockId-- != 0)
                        this._blockGroupUnusedBlocks.add(blocks[blockId], rnd.integerInRange(0, this._blockGroupUnusedBlocks.size));
                    this._blockGroupUsedBlocks.reset();
                }
                block = this._blockGroupUnusedBlocks.first;
                this._blockGroupUnusedBlocks.removeElementAtIndex(0);
                this._blockGroupUsedBlocks.addEntry(block);
                this._blockGroupRemWidth -= block.width;
            }
            var x = prevNode.worldX + prevNode.block.width;
            var worldId = this.getNextBlockNodeWorldId(prevNode.block, prevNode.worldX, prevNode.worldId);
            if (worldId != prevNode.worldId)
                this.setNewWorld(x);
            return new World.BlockNode(prevNode, block, worldId, this.getNextBlockNodeWorldId(block, x, worldId));
        };
        DataManager.prototype.addBlockCheckpoints = function (blockNode) {
            var checkpoints = blockNode.block.checkpoints;
            for (var i = 0; i < checkpoints.length; i++)
                this._nextCheckpoints.add(this._nextCheckpointsPool.getItem().init(blockNode, checkpoints[i]));
        };
        DataManager.prototype.activateCheckpoint = function () {
            World.ActCheckpoint.instance.activate(this._nextCheckpoints.first);
            this._nextCheckpointsPool.returnItem(this._nextCheckpoints.removeElementAtIndex(0));
        };
        DataManager.prototype.serialize = function (data) {
            var blockNode = this._firstBlockNode;
            data.pathBlocksUID.length = 0;
            data.pathBlocksWorldId.length = 0;
            while (true) {
                data.pathBlocksUID.push(blockNode.block.uid);
                data.pathBlocksWorldId.push(blockNode.worldId);
                if (blockNode.isLast)
                    break;
                blockNode = blockNode.next;
            }
            data.pathGroupId = this._blockGroupId;
            data.pathGroupRemWidthRatio = Math.max(0, this._blockGroupRemWidth) / this._blockGroupTotWidth;
            data.pathGroupUsedBlocks.length = 0;
            this._blockGroupUsedBlocks.forEach(function (block) {
                data.pathGroupUsedBlocks.push(block.uid);
            }, this);
        };
        DataManager.prototype.getWorldAssets = function (worldId) {
            return this._worldAssets[worldId];
        };
        DataManager.prototype.initNextBlockGroup = function () {
            var group;
            if (++this._blockGroupId == this._blockGroups.length)
                this._blockGroupId--;
            group = this._blockGroups[this._blockGroupId];
            this._blockGroupUnusedBlocks.clear();
            var blockId = group.blockCnt;
            var totalWidth = 0;
            var rnd = Game.Global.game.rnd;
            while (blockId-- != 0) {
                var block_2 = group.getBlock(blockId);
                this._blockGroupUnusedBlocks.add(block_2, rnd.integerInRange(0, this._blockGroupUnusedBlocks.size));
                totalWidth += block_2.width;
            }
            this._blockGroupUsedBlocks.reset();
            this._blockGroupTotWidth = totalWidth;
            this._blockGroupRemWidth = Math.round(totalWidth * group.useRatio);
            var block = this._blockGroupUnusedBlocks.first;
            this._blockGroupUnusedBlocks.removeElementAtIndex(0);
            this._blockGroupUsedBlocks.addEntry(block);
            this._blockGroupRemWidth -= block.width;
            return block;
        };
        DataManager.prototype.setNewWorld = function (worldPos) {
            if (this._worldSelProb.length == 1)
                return;
            var worldId = this._nextWorldId;
            var i = this._worldSelProb.length;
            var totProb = 0;
            while (i-- != 0) {
                if (i != worldId) {
                    totProb += ++this._worldSelProb[i];
                }
                else {
                    this._worldSelProb[worldId] = 0;
                }
            }
            this._nextWorldStartPos = worldPos + DataManager.WORLD_CHANGE_INTERVAL;
            var selProb = Game.Global.game.rnd.integerInRange(0, totProb - 1);
            i = this._worldSelProb.length;
            while (i-- != 0) {
                var worldProb = this._worldSelProb[i];
                if (worldProb != 0) {
                    if (worldProb > selProb) {
                        this._nextWorldId = i;
                        break;
                    }
                    else {
                        selProb -= worldProb;
                    }
                }
            }
        };
        DataManager.prototype.getNextBlockNodeWorldId = function (curBlock, curBlockWorldPos, curBlockWorldId) {
            if (this._worldSelProb.length == 1)
                return 0;
            if (this._nextWorldStartPos <= curBlockWorldPos + curBlock.width)
                return this._nextWorldId;
            return curBlockWorldId;
        };
        DataManager._objectDescriptors = [];
        DataManager.WORLD_CHANGE_INTERVAL = 20000;
        return DataManager;
    }());
    World.DataManager = DataManager;
})(World || (World = {}));
var WorldGround;
(function (WorldGround) {
    var ActSegmentWrap = (function () {
        function ActSegmentWrap() {
            this.pos = new WorldGround.SegmentPos();
        }
        ActSegmentWrap.prototype.copyFrom = function (segment) {
            this.segment = segment.segment;
            this.pos.copyFrom(segment.pos);
        };
        return ActSegmentWrap;
    }());
    var TileTexture = (function () {
        function TileTexture(frameName) {
            this._image = Game.Global.game.make.image(0, 0, "atlas_A", frameName);
            this._width = this._image.width;
            this._height = this._image.height;
            this._image.crop(new Phaser.Rectangle(0, 0, 1, this._height), false);
        }
        Object.defineProperty(TileTexture.prototype, "image", {
            get: function () { return this._image; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileTexture.prototype, "width", {
            get: function () { return this._width; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileTexture.prototype, "height", {
            get: function () { return this._height; },
            enumerable: true,
            configurable: true
        });
        return TileTexture;
    }());
    var Tile = (function () {
        function Tile(viewer) {
            if (Tile._surfaceTex == undefined) {
                Tile._surfaceTex = [
                    new TileTexture("surfaceTex_" + 0),
                    new TileTexture("surfaceTex_" + 1),
                    new TileTexture("surfaceTex_" + 2),
                ];
                Tile._groundTex = [
                    new TileTexture("groundTex_" + 0),
                    new TileTexture("groundTex_" + 1),
                    new TileTexture("groundTex_" + 2),
                ];
            }
            this._viewer = viewer;
            this._buffer = Game.Global.game.add.renderTexture(Tile.TILE_MAX_WIDTH, WorldGround.Segment.MAX_HEIGHT);
            this._image = Game.Global.game.make.image(0, 0, this._buffer);
            this._image.crop(new Phaser.Rectangle(0, 0, 0, 0), false);
            this._lSegment = new ActSegmentWrap();
            this._rSegment = new ActSegmentWrap();
        }
        Object.defineProperty(Tile.prototype, "lX", {
            get: function () { return this._image.x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tile.prototype, "rX", {
            get: function () { return this._image.x + this._image.width - 1; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tile.prototype, "width", {
            get: function () { return this._image.width; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tile.prototype, "visible", {
            get: function () { return this._image.visible; },
            set: function (visible) {
                this._image.visible = visible;
                this._image.exists = visible;
            },
            enumerable: true,
            configurable: true
        });
        Tile.prototype.release = function () {
            this._image.parent.removeChild(this._image);
            return this;
        };
        Tile.prototype.destroy = function () {
            this._image.destroy();
            this._buffer.destroy(true);
            return this;
        };
        Tile.prototype.activate1 = function (parent, prev, next) {
            var worldX;
            if (prev != null) {
                worldX = prev.lX + Tile.TILE_MAX_WIDTH;
                this._bufFillDir = 1;
                this._lSegment.copyFrom(prev._rSegment);
                this._lSegment.pos.x = worldX - this._lSegment.segment.blockNode.worldX;
                while (this._lSegment.pos.x > this._lSegment.segment.data.vertexB.x) {
                    this._lSegment.segment = this._lSegment.segment.next;
                    this._lSegment.pos.x = worldX - this._lSegment.segment.blockNode.worldX;
                }
            }
            else if (next != null) {
                worldX = next.lX;
                this._bufFillDir = -1;
                this._lSegment.copyFrom(next._lSegment);
                this._lSegment.pos.x = worldX - this._lSegment.segment.blockNode.worldX;
                while (this._lSegment.pos.x < this._lSegment.segment.data.vertexA.x) {
                    this._lSegment.segment = this._lSegment.segment.prev;
                    this._lSegment.pos.x = worldX - this._lSegment.segment.blockNode.worldX;
                }
            }
            else {
                worldX = 0;
                this._lSegment.segment = this._viewer.firstActSegment;
                this._lSegment.pos.x = 0;
                this._lSegment.pos.t = 0;
                this._bufFillDir = 1;
            }
            this._rSegment.copyFrom(this._lSegment);
            this.activate(parent, worldX);
            return this;
        };
        Tile.prototype.activate2 = function (parent, worldX, segment) {
            this._lSegment.segment = segment;
            this._lSegment.pos.x = worldX - segment.blockNode.worldX;
            this._lSegment.pos.t = (1 / segment.data.width) * (worldX - segment.vertexAWorldX);
            segment.data.getY(this._lSegment.pos);
            this._rSegment.copyFrom(this._lSegment);
            this._bufFillDir = 1;
            this.activate(parent, worldX);
            return this;
        };
        Tile.prototype.activate = function (parent, worldX) {
            this._buffer.clear();
            this._contentY = WorldGround.Segment.MAX_HEIGHT;
            this._contentW = 0;
            this._image.cropRect.setTo(this._bufFillDir > 0 ? 0 : Tile.TILE_MAX_WIDTH, WorldGround.Segment.MAX_HEIGHT, 0, 0);
            this._image.updateCrop();
            this._image.position.set(worldX, WorldGround.Segment.MAX_HEIGHT);
            this.visible = true;
            parent.add(this._image);
        };
        Tile.prototype.update = function (viewLX, viewTY, viewRX, viewBY) {
            var image = this._image;
            var cropRc = image.cropRect;
            var updateCrop = false;
            var i;
            if (image.x > viewLX && cropRc.x > 0) {
                i = Math.min(image.x - viewLX, cropRc.x);
                cropRc.x -= i;
                cropRc.width += i;
                image.x -= i;
                if (this._bufFillDir < 0 && cropRc.width > this._contentW)
                    this.addContentL();
                updateCrop = true;
            }
            else if (image.x < viewLX) {
                i = (viewLX - image.x);
                cropRc.x += i;
                cropRc.width -= i;
                image.x = viewLX;
                updateCrop = true;
            }
            if (image.x + cropRc.width <= viewRX && cropRc.x + cropRc.width < Tile.TILE_MAX_WIDTH) {
                i = Math.min(viewRX - (image.x + cropRc.width) + 1, Tile.TILE_MAX_WIDTH - cropRc.width);
                cropRc.width += i;
                if (this._bufFillDir > 0 && cropRc.width > this._contentW)
                    this.addContentR();
                updateCrop = true;
            }
            else if (image.x + cropRc.width - 1 > viewRX) {
                cropRc.width = viewRX - image.x + 1;
                updateCrop = true;
            }
            if (cropRc.y > viewTY) {
                if (cropRc.y > this._contentY) {
                    i = cropRc.y - Math.max(this._contentY, viewTY);
                    cropRc.y -= i;
                    cropRc.height += i;
                    image.y -= i;
                    updateCrop = true;
                }
            }
            else if (cropRc.y < viewTY && cropRc.height != 0) {
                i = viewTY - cropRc.y;
                if ((cropRc.y = viewTY) > WorldGround.Segment.MAX_HEIGHT) {
                    cropRc.y = WorldGround.Segment.MAX_HEIGHT;
                    cropRc.height = 0;
                }
                else {
                    image.y += i;
                    cropRc.height -= i;
                }
                updateCrop = true;
            }
            if (cropRc.y + cropRc.height <= viewBY) {
                if (cropRc.y + cropRc.height < WorldGround.Segment.MAX_HEIGHT) {
                    if ((cropRc.height = viewBY - cropRc.y + 1) > WorldGround.Segment.MAX_HEIGHT)
                        cropRc.height = WorldGround.Segment.MAX_HEIGHT;
                    updateCrop = true;
                }
            }
            else if (cropRc.y + cropRc.height > viewBY && cropRc.height != 0) {
                if ((cropRc.height = viewBY - cropRc.y + 1) < 0)
                    cropRc.height = 0;
                updateCrop = true;
            }
            if (updateCrop)
                image.updateCrop();
        };
        Tile.prototype.drawTerrainCol = function (bufX, bufY, worldX, worldAssets) {
            bufY += worldAssets.terrainVOffset;
            this._contentW++;
            if (this._contentY > Math.floor(bufY)) {
                if ((this._contentY = Math.floor(bufY)) < 0)
                    this._contentY = 0;
            }
            var texId = worldAssets.terrainTexId;
            var tex = Tile._groundTex[texId];
            var img = tex.image;
            var tmpBufY = bufY + Tile._surfaceTex[texId].height / 2;
            img.cropRect.setTo(worldX % tex.width, tmpBufY, 1, tex.height - tmpBufY);
            img.updateCrop();
            this._buffer.renderXY(img, bufX, tmpBufY, false);
            tex = Tile._surfaceTex[texId];
            img = tex.image;
            img.cropRect.x = worldX % tex.width;
            img.updateCrop();
            this._buffer.renderXY(img, bufX, bufY, false);
        };
        Tile.prototype.addContentL = function () {
            var remWidth = this._image.cropRect.width - this._contentW;
            var segData = this._lSegment.segment.data;
            var assets = World.DataManager.instance.getWorldAssets(this._lSegment.segment.blockNode.worldId);
            var worldX = this._image.x + remWidth - 1;
            var segTd = 1 / segData.width;
            while (true) {
                this._lSegment.segment.data.getY(this._lSegment.pos);
                this.drawTerrainCol(Tile.TILE_MAX_WIDTH - this._contentW - 1, this._lSegment.pos.y, worldX, assets);
                if (--this._lSegment.pos.x < segData.vertexA.x) {
                    this._lSegment.segment = this._lSegment.segment.prev;
                    assets = World.DataManager.instance.getWorldAssets(this._lSegment.segment.blockNode.worldId);
                    segData = this._lSegment.segment.data;
                    segTd = 1 / segData.width;
                    this._lSegment.pos.x = segData.vertexB.x;
                    this._lSegment.pos.t = 1;
                }
                else if ((this._lSegment.pos.t -= segTd) < 0) {
                    this._lSegment.pos.t = 0;
                }
                if (--remWidth == 0)
                    break;
                worldX--;
            }
        };
        Tile.prototype.addContentR = function () {
            var remWidth = this._image.cropRect.width - this._contentW;
            var segData = this._rSegment.segment.data;
            var assets = World.DataManager.instance.getWorldAssets(this._rSegment.segment.blockNode.worldId);
            var worldX = this._image.x + this._contentW;
            var segTd = 1 / segData.width;
            while (true) {
                this._rSegment.segment.data.getY(this._rSegment.pos);
                this.drawTerrainCol(this._contentW, this._rSegment.pos.y, worldX, assets);
                if (this._rSegment.pos.x++ == segData.vertexB.x) {
                    this._rSegment.segment = this._rSegment.segment.next;
                    assets = World.DataManager.instance.getWorldAssets(this._rSegment.segment.blockNode.worldId);
                    segData = this._rSegment.segment.data;
                    segTd = 1 / segData.width;
                    this._rSegment.pos.x = segData.vertexA.x;
                    this._rSegment.pos.t = 0;
                }
                else if ((this._rSegment.pos.t += segTd) > 1) {
                    this._rSegment.pos.t = 1;
                }
                if (--remWidth == 0)
                    break;
                worldX++;
            }
        };
        Tile.prototype.renderDebugInfo = function (tileId, x, y, lineHeight) {
            Game.Global.game.debug.text("Tile" + tileId + " | LX:" + this.lX + " | RX: " + this.rX + " | W: " + this.width + " | H: " + this._image.height, x, y);
            return y += lineHeight;
        };
        Tile.TILE_MAX_WIDTH = 512;
        return Tile;
    }());
    WorldGround.Tile = Tile;
})(WorldGround || (WorldGround = {}));
var WorldGround;
(function (WorldGround) {
    var Viewer = (function () {
        function Viewer(viewer, parentLayer) {
            this._viewer = viewer;
            viewer.onWorldChange.add(this.handleWorldChange, this);
            this._layer = Game.Global.game.add.group(parentLayer);
            this._freeTiles = new Collections.Pool(undefined, 3, true, function () {
                return new WorldGround.Tile(this);
            }, this);
            this._actTiles = new Collections.WrappedArray();
            this._freeSegments = new Collections.Pool(undefined, 0, true, function () {
                return new WorldGround.ActSegment(this._freeSegments, this._actSegments);
            }, this);
            this._actSegments = new Collections.WrappedArray();
            this._lowestGroundTile = Game.Global.game.add.tileSprite(0, WorldGround.Segment.MAX_HEIGHT - 1, Game.Global.scale.resolution.x, 100, "atlas_A", "lGroundTex_" + "0", this._layer);
            this._physics = new WorldGround.Physics(viewer);
        }
        Object.defineProperty(Viewer.prototype, "layer", {
            get: function () { return this._layer; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "firstActSegment", {
            get: function () { return this._actSegments.getItemAtIndex(0); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "physics", {
            get: function () { return this._physics; },
            enumerable: true,
            configurable: true
        });
        Viewer.prototype.destroy = function () {
            while (this._actTiles.itemCnt != 0)
                this._actTiles.removeItem(false).destroy();
            var i = this._freeTiles.count;
            while (i-- != 0)
                this._freeTiles.getItem().destroy();
            while (this._actSegments.itemCnt != 0)
                this._actSegments.getItemAtIndex(0).release();
            this._physics.destroy();
        };
        Viewer.prototype.reset = function () {
            this.resetBase1();
            var firstSegment = this._freeSegments.getItem();
            firstSegment.init(World.DataManager.instance.firstBlockNode, 0, null, null);
            var tile = this._actTiles.addItem(this._freeTiles.getItem(), true);
            tile.activate1(this._layer, null, null);
            tile.update(this._viewer.viewLX, this._viewer.viewTY, this._viewer.viewRX, this._viewer.viewBY);
            while (tile.rX < this._viewer.viewRX) {
                var newTile = this._actTiles.addItem(this._freeTiles.getItem(), true);
                newTile.activate1(this._layer, tile, null);
                newTile.update(this._viewer.viewLX, this._viewer.viewTY, this._viewer.viewRX, this._viewer.viewBY);
                tile = newTile;
            }
            this.resetBase2();
        };
        Viewer.prototype.resetFromCp = function () {
            this.resetBase1();
            var worldX = this._viewer.viewLX;
            var blockNode = World.ActCheckpoint.instance.blockNode;
            while (worldX < blockNode.worldX)
                blockNode = blockNode.previous;
            while (worldX >= blockNode.worldX + blockNode.block.width)
                blockNode = blockNode.next;
            var blockWorldX = blockNode.worldX;
            var segmentId = 0;
            var segment = blockNode.block.segments[0];
            while (worldX > blockWorldX + segment.vertexA.x + segment.width)
                segment = blockNode.block.segments[++segmentId];
            this._freeSegments.getItem().init(blockNode, segmentId, null, null);
            var tile = this._actTiles.addItem(this._freeTiles.getItem(), true);
            tile.activate2(this._layer, worldX, this._actSegments.getItemAtIndex(0));
            tile.update(this._viewer.viewLX, this._viewer.viewTY, this._viewer.viewRX, this._viewer.viewBY);
            while (tile.rX < this._viewer.viewRX) {
                var newTile = this._actTiles.addItem(this._freeTiles.getItem(), true);
                newTile.activate1(this._layer, tile, null);
                newTile.update(this._viewer.viewLX, this._viewer.viewTY, this._viewer.viewRX, this._viewer.viewBY);
                tile = newTile;
            }
            this.resetBase2();
        };
        Viewer.prototype.update = function (viewLX, viewRX, viewTY, viewBY) {
            var tile;
            var prePos = this._viewer.viewLX;
            if (viewLX != prePos) {
                tile = this._actTiles.getItemAtIndex(0);
                if (viewLX > prePos) {
                    if (tile.rX < viewLX)
                        this._freeTiles.returnItem(this._actTiles.removeItem(false).release());
                    if (this._actSegments.getItemAtIndex(0).vertexBWorldX < viewLX - World.Viewer.VIEW_OFFSCREEN_OFFSET)
                        this._actSegments.getItemAtIndex(0).release();
                }
                else {
                    if (tile.rX - WorldGround.Tile.TILE_MAX_WIDTH >= viewLX)
                        this._actTiles.addItem(this._freeTiles.getItem(), false).activate1(this._layer, null, tile);
                }
                this._lowestGroundTile.x = viewLX;
                this._lowestGroundTile.tilePosition.x = -viewLX;
            }
            prePos = this._viewer.viewRX;
            if (viewRX != prePos) {
                tile = this._actTiles.getLastItem();
                if (viewRX > prePos) {
                    if (tile.lX + WorldGround.Tile.TILE_MAX_WIDTH <= viewRX)
                        this._actTiles.addItem(this._freeTiles.getItem(), true).activate1(this._layer, tile, null);
                }
                else {
                    if (tile.lX > viewRX)
                        this._freeTiles.returnItem(this._actTiles.removeItem(true).release());
                }
            }
            prePos = this._viewer.viewBY;
            if (viewBY != prePos) {
                if (viewBY >= this._lowestGroundTile.y) {
                    this._lowestGroundTile.visible = true;
                    this._lowestGroundTile.height = Math.min((viewBY - viewTY), viewBY - this._lowestGroundTile.y) + 1;
                }
                else {
                    this._lowestGroundTile.visible = false;
                }
            }
            var i = this._actTiles.itemCnt;
            while (i-- != 0)
                this._actTiles.getItemAtIndex(i).update(viewLX, viewTY, viewRX, viewBY);
            this._physics.update(viewLX, viewRX);
        };
        Viewer.prototype.getGroundYOnX = function (worldX) {
            var segment = this._actSegments.getItemAtIndex(0);
            while (segment.vertexBWorldX < worldX)
                segment = segment.next;
            var segPos = new WorldGround.SegmentPos();
            segPos.x = worldX - segment.blockNode.worldX;
            var segData = segment.data;
            var segTd = 1 / segData.width;
            var segT = (segPos.x - segment.data.vertexA.x) * segTd;
            segData.getY(segPos);
            return segPos.y;
        };
        Viewer.prototype.renderDebugInfo = function (x, y, lineHeight) {
            var debug = Game.Global.game.debug;
            var tileCnt = this._actTiles.itemCnt;
            debug.text("=== TERRAIN === ", x, y);
            y += lineHeight;
            y = this._actSegments.getItemAtIndex(0).renderDebugInfo(x, y, lineHeight);
            y = this._actSegments.getLastItem().renderDebugInfo(x, y, lineHeight);
            for (var i = 0; i < tileCnt; i++)
                y = this._actTiles.getItemAtIndex(i).renderDebugInfo(i, x, y, lineHeight);
            y = this._physics.renderDebugInfo(x, y, lineHeight);
            return y;
        };
        Viewer.prototype.resetBase1 = function () {
            while (this._actTiles.itemCnt != 0) {
                var tile = this._actTiles.removeItem(false);
                tile.release();
                this._freeTiles.returnItem(tile);
            }
            while (this._actSegments.itemCnt != 0)
                this._actSegments.getItemAtIndex(0).release();
        };
        Viewer.prototype.resetBase2 = function () {
            this._lowestGroundTile.x = this._viewer.viewLX;
            this._lowestGroundTile.tilePosition.x = -this._viewer.viewLX;
            this._lowestGroundTile.visible = (this._viewer.viewBY >= this._lowestGroundTile.y);
            this._physics.reset(this._actSegments.getItemAtIndex(0));
        };
        Viewer.prototype.handleWorldChange = function (assets) {
            this._lowestGroundTile.frameName = "lGroundTex_" + assets.terrainTexId;
        };
        return Viewer;
    }());
    WorldGround.Viewer = Viewer;
})(WorldGround || (WorldGround = {}));
var World;
(function (World) {
    var Viewer = (function () {
        function Viewer(parentLayer) {
            this._worldId = 0;
            this._onWorldChange = new Phaser.Signal();
            this._onWorldChange.add(this.handleWorldChange, this);
            var worldAssets = World.DataManager.instance.getWorldAssets(0);
            this._bgLayers = [
                new World.BgLayer(parentLayer, "atlas_1", "bg_" + worldAssets.bgTexId + "_0", 2, 0, 0.2, 0.25),
                new World.BgLayer(parentLayer, "atlas_1", "bg_" + worldAssets.bgTexId + "_1", 2, worldAssets.bgLayerDefY, 0.4, 0.5),
            ];
            this._bgOverlay = new Helpers.ScreenOverlay(parentLayer, Gameplay.Gameplay.instance.timer);
            this._bgOverlay.layer.fixedToCamera = true;
            this._bgOverlay.onStateChange.add(this.handleBgOverlayStateChange, this);
            this._ground = new WorldGround.Viewer(this, parentLayer);
            this._objects = new WorldObjects.Viewer(this, parentLayer);
            this._worldBorder = new Phaser.Physics.Box2D.Body(Game.Global.game, null, 0, 0, 0, Game.Global.game.physics.box2d);
            this._worldBorder.static = true;
            this._worldBorder.restitution = 0;
            this._worldBorder.setEdge(0, 0, 0, 2000);
            this._worldBorder.setCollisionCategory(2);
            Game.Global.scale.onResChange.add(this.handleResize, this);
            this.handleResize(Game.Global.scale.resolution);
        }
        Object.defineProperty(Viewer.prototype, "viewLX", {
            get: function () { return this._viewLX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "viewRX", {
            get: function () { return this._viewRX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "viewTY", {
            get: function () { return this._viewTY; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "viewBY", {
            get: function () { return this._viewBY; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "viewMinLX", {
            get: function () { return this._viewMinLX; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "ground", {
            get: function () { return this._ground; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "objects", {
            get: function () { return this._objects; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "worldId", {
            get: function () { return this._worldId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Viewer.prototype, "onWorldChange", {
            get: function () { return this._onWorldChange; },
            enumerable: true,
            configurable: true
        });
        Viewer.prototype.reset = function () {
            var view = Game.Global.game.camera;
            this._viewLX = 0;
            this._viewRX = view.width - 1;
            this._viewTY = 0;
            this._viewBY = view.height - 1;
            this._viewMaxLX = 0;
            this._viewMinLX = 0;
            this._worldBorder.x = this._viewMinLX;
            this._ground.reset();
            this._objects.reset();
            this.resetWorld(World.DataManager.instance.firstBlockNode);
        };
        Viewer.prototype.resetFromCP = function () {
            var camera = Game.Global.game.camera;
            this._viewLX = World.ActCheckpoint.instance.bikeRestartPoint.x - this._deadZoneLX - (((camera.width - this._deadZoneRX) - this._deadZoneLX) >> 1);
            this._viewRX = this._viewLX + camera.width - 1;
            this._viewTY = 0;
            this._viewBY = camera.height - 1;
            this._viewMaxLX = this._viewLX;
            this._viewMinLX = this._viewLX;
            camera.setPosition(this._viewLX, this._viewTY);
            this._worldBorder.x = this._viewMinLX;
            this._ground.resetFromCp();
            this._objects.reset();
            this.resetWorld(World.ActCheckpoint.instance.blockNode);
        };
        Viewer.prototype.update = function () {
            var camera = Game.Global.game.camera;
            var viewLX = camera.x;
            var viewTY = camera.y;
            var gameplay = Gameplay.Gameplay.instance;
            var bikePos = (gameplay.mode != 7 ? gameplay.bike.bodySprite.position : gameplay.ghost.position);
            if (bikePos.x < viewLX + this._deadZoneLX) {
                viewLX = bikePos.x - this._deadZoneLX;
                if (viewLX < this._viewMinLX)
                    viewLX = this._viewMinLX;
            }
            else if (bikePos.x > viewLX + camera.width - this._deadZoneRX) {
                viewLX = bikePos.x + this._deadZoneRX - camera.width;
            }
            if (bikePos.y < viewTY + this._deadZoneTY) {
                if ((viewTY = bikePos.y - this._deadZoneTY) < this._viewMinY)
                    viewTY = this._viewMinY;
            }
            else if (bikePos.y > viewTY + camera.height - this._deadZoneBY) {
                if ((viewTY = bikePos.y + this._deadZoneBY - camera.height) > this._viewMaxY)
                    viewTY = this._viewMaxY;
            }
            viewLX = Math.round(viewLX);
            viewTY = Math.round(viewTY);
            camera.x = viewLX;
            camera.y = viewTY;
            var viewRX = viewLX + camera.width - 1;
            var viewBY = viewTY + camera.height - 1;
            var i = this._bgLayers.length;
            var viewY = viewTY - this._viewMinY;
            while (i-- != 0)
                this._bgLayers[i].update(viewLX, viewY);
            this._bgOverlay.update();
            this._ground.update(viewLX, viewRX, viewTY, viewBY);
            this._objects.update(viewLX, viewRX);
            this._viewLX = viewLX;
            this._viewRX = viewRX;
            this._viewTY = viewTY;
            this._viewBY = viewBY;
            if (viewLX > this._viewMaxLX) {
                this._viewMaxLX = viewLX;
                this._viewMinLX = Math.max(this._viewMaxLX - Viewer.VIEW_OFFSCREEN_OFFSET, 0);
                this._worldBorder.x = this._viewMinLX;
            }
        };
        Viewer.prototype.resetWorld = function (startBlockNode) {
            this._bgOverlay.reset();
            var blockNode = startBlockNode;
            var worldId = blockNode.worldId;
            var maxX = this._viewLX + (Game.Global.scale.resolution.x >> 1);
            while (blockNode.worldX + blockNode.block.width <= maxX) {
                blockNode = blockNode.next;
                worldId = blockNode.worldId;
            }
            if (worldId != this._worldId) {
                this._worldId = worldId;
                this._onWorldChange.dispatch(World.DataManager.instance.getWorldAssets(worldId));
            }
        };
        Viewer.prototype.changeWorld = function (worldId) {
            if (worldId != this._worldId) {
                this._newWorldId = worldId;
                this._bgOverlay.show(0xFFFFFF, 1, 500, Phaser.Easing.Cubic.In);
            }
        };
        Viewer.prototype.handleBgOverlayStateChange = function (overlay, state) {
            if (state == 1) {
                this._worldId = this._newWorldId;
                this._onWorldChange.dispatch(World.DataManager.instance.getWorldAssets(this._worldId));
                overlay.hide(500, Phaser.Easing.Cubic.Out);
            }
        };
        Viewer.prototype.handleWorldChange = function (assets) {
            this._bgLayers[0].setFrame("bg_" + assets.bgTexId + "_0", 0);
            this._bgLayers[1].setFrame("bg_" + assets.bgTexId + "_1", assets.bgLayerDefY);
        };
        Viewer.prototype.handleResize = function (res) {
            this._deadZoneLX = Math.round(res.x * 0.11);
            this._deadZoneRX = Math.round(res.x * 0.80);
            this._deadZoneTY = Math.round(res.y * 0.5);
            this._deadZoneBY = Math.round(res.y * 0.4);
            this._viewMinY = -(this._deadZoneTY + 200);
            this._viewMaxY = WorldGround.Segment.MAX_HEIGHT - this._deadZoneTY;
        };
        Viewer.prototype.renderDebugInfo = function (x, y, lineHeight, mask) {
            var debug = Game.Global.game.debug;
            if ((mask & 1) != 0) {
                debug.text("=== VIEW ===", x, y);
                y += lineHeight;
                debug.text("view | LX:" + this._viewLX + " | RX: " + this._viewRX + " | minLX: " + this._viewMinLX + " | maxLX: " + this._viewMaxLX + " | y: " + this._viewTY, x, y);
                y += lineHeight;
            }
            if ((mask & 2) != 0)
                y = this._ground.renderDebugInfo(x, y, lineHeight);
            if ((mask & 4) != 0)
                y = this._objects.renderDebugInfo(x, y, lineHeight);
            return y;
        };
        Viewer.VIEW_OFFSCREEN_OFFSET = 512;
        return Viewer;
    }());
    World.Viewer = Viewer;
})(World || (World = {}));
var HUD;
(function (HUD) {
    var StuntMessage = (function (_super) {
        __extends(StuntMessage, _super);
        function StuntMessage(parent) {
            var _this = _super.call(this, Gameplay.Gameplay.instance.timer) || this;
            if (StuntMessage._type == undefined) {
                StuntMessage._type = new SlideMessage.MessageType(-1, new Phaser.Rectangle(0, 0, 0, 0), 300, Phaser.Easing.Cubic.Out, 0, Phaser.Easing.Cubic.Out, 300, 700, Phaser.Easing.Cubic.In, 0, Phaser.Easing.Cubic.In);
                Game.Global.scale.onResChange.add(_this.handleResize, _this);
                _this.handleResize(Game.Global.scale.resolution);
            }
            var add = Game.Global.game.add;
            _this._container = add.group(parent);
            _this._container.exists = false;
            _this._message1 = add.bitmapText(0, 0, "fntWhite60", "", 60);
            _this._container.add(_this._message1);
            _this._message1.exists = false;
            _this._message1.visible = true;
            _this._message2 = add.bitmapText(0, 0, "fntRed120", "", 60);
            _this._container.add(_this._message2);
            _this._message2.exists = false;
            _this._message2.visible = true;
            return _this;
        }
        StuntMessage.prototype.show = function (message1, message2) {
            if (this.state != SlideMessage.eMessageState.completed)
                return;
            this._message1.text = message1;
            this._message2.text = message2;
            this._message2.y = this._message1.height + 20;
            if (this._message1.width > this._message2.width) {
                this._message1.x = 0;
                this._message2.x = Math.round((this._message1.width - this._message2.width) / 2);
            }
            else {
                this._message2.x = 0;
                this._message1.x = Math.round((this._message2.width - this._message1.width) / 2);
            }
            this.showMessage(StuntMessage._type);
        };
        StuntMessage.prototype.getMsgContainer = function () {
            return this._container;
        };
        StuntMessage.prototype.handleResize = function (res) {
            var rc = StuntMessage._type.slideArea;
            rc.width = Math.min(res.x, 640);
            rc.x = Math.round((res.x - rc.width) / 2);
            rc.y = 0;
            rc.height = 0;
        };
        return StuntMessage;
    }(SlideMessage.MessageBase));
    HUD.StuntMessage = StuntMessage;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var StuntScore = (function () {
        function StuntScore(parent) {
            var add = Game.Global.game.add;
            this._layer = add.group(parent);
            this._layer.exists = false;
            this._bg = add.image(0, 0, "atlas_A", "stuntScoreBg", this._layer);
            this._bg.exists = false;
            this._bg.visible = true;
            this._bg.anchor.set(0.5);
            this._scoreCounter = add.bitmapText(0, 0, "fntWhite60", "", 60);
            this._layer.add(this._scoreCounter);
            this._scoreCounter.anchor.set(0.5);
            this._scoreCounter.exists = false;
            this._scoreCounter.visible = true;
            this._resultMsg = new HUD.StuntMessage(this._layer);
            Game.Global.scale.onResChange.add(this.handleResize, this);
            this.handleResize(Game.Global.scale.resolution);
        }
        StuntScore.prototype.reset = function () {
            this._layer.visible = false;
            this._resultMsg.kill();
        };
        StuntScore.prototype.show = function (source) {
            if (this._layer.visible)
                return false;
            this._source = source;
            this._state = 0;
            this.showScore();
            this._scoreCounter.alpha = 1;
            this._scoreCounter.y = 0;
            this._scoreCounter.visible = true;
            this._bg.alpha = StuntScore.BG_MAX_ALPHA;
            this._bg.scale.set(StuntScore.SCORE_COUNT_BG_SCALE);
            this._layer.visible = true;
            this._resultMsg.kill();
            return true;
        };
        StuntScore.prototype.confirm = function (resMsg1, resMsg2) {
            this.showScore();
            if (resMsg1 != null && resMsg1.length != 0) {
                this._resultText1 = resMsg1;
                this._resultText2 = resMsg2;
                this._state = 2;
            }
            else {
                this._state = 1;
            }
            this._time = Gameplay.Gameplay.instance.timer.time;
            Game.AudioUtils.playSound("earnPoints");
        };
        StuntScore.prototype.cancel = function () {
            this._state = 3;
            this._time = Gameplay.Gameplay.instance.timer.time;
        };
        StuntScore.prototype.update = function () {
            if (!this._layer.visible)
                return;
            if (this._state == 0) {
                this.showScore();
                return;
            }
            if (this._resultMsg.state != SlideMessage.eMessageState.completed)
                this._resultMsg.update();
            var time = Gameplay.Gameplay.instance.timer.time;
            if (this._state == 1) {
                var progress = (time - this._time) / 1000;
                if (progress >= 1) {
                    this._layer.visible = false;
                    return;
                }
                progress = Phaser.Easing.Cubic.Out(progress) * StuntScore.BG_MAX_ALPHA;
                this._bg.alpha = StuntScore.BG_MAX_ALPHA - progress;
                this._scoreCounter.y = progress * StuntScore.SCORE_COUNTER_SLIDE_DIS;
            }
            else if (this._state == 2) {
                var progress = (time - this._time) / 750;
                if (progress >= 1) {
                    progress = 1;
                    this._scoreCounter.visible = false;
                    this._state = 4;
                }
                this._bg.scale.set(StuntScore.SCORE_COUNT_BG_SCALE + (StuntScore.STUNT_RES_BG_SCALE - StuntScore.SCORE_COUNT_BG_SCALE) * Phaser.Easing.Back.Out(progress));
                this._scoreCounter.y = Phaser.Easing.Cubic.Out(progress) * StuntScore.SCORE_COUNTER_SLIDE_DIS;
                if (this._resultMsg.state == SlideMessage.eMessageState.completed && progress >= 0.3)
                    this._resultMsg.show(this._resultText1, this._resultText2);
            }
            else if (this._state == 3) {
                var progress = (time - this._time) / 1000;
                if (progress >= 1) {
                    this._layer.visible = false;
                    return;
                }
                progress = 1 - Phaser.Easing.Cubic.Out(progress);
                this._bg.alpha = progress * StuntScore.BG_MAX_ALPHA;
                this._scoreCounter.alpha = progress;
            }
            else {
                if (this._state == 4) {
                    if (this._resultMsg.state == SlideMessage.eMessageState.slideOut) {
                        this._state = 5;
                        this._time = time;
                    }
                }
                else {
                    var progress = (time - this._time) / 400;
                    if (progress > 1)
                        progress = 1;
                    this._bg.scale.set(StuntScore.STUNT_RES_BG_SCALE - (StuntScore.STUNT_RES_BG_SCALE * 0.8) * Phaser.Easing.Back.In(progress));
                    this._bg.alpha = (1 - Phaser.Easing.Cubic.In(progress)) * StuntScore.BG_MAX_ALPHA;
                    if (progress == 1 && this._resultMsg.state == SlideMessage.eMessageState.completed)
                        this._layer.visible = false;
                }
            }
        };
        StuntScore.prototype.showScore = function () {
            var text = "";
            if (this._source.multiplier > 1)
                text = this._source.multiplier + "X ";
            text += "+" + Math.round(this._source.score);
            this._scoreCounter.text = text;
        };
        StuntScore.prototype.handleResize = function (res) {
            var x = res.x / 2;
            this._bg.x = x;
            this._scoreCounter.x = x;
            this._layer.y = res.y * 0.3;
        };
        StuntScore.SCORE_COUNT_BG_SCALE = 0.6;
        StuntScore.STUNT_RES_BG_SCALE = 0.7;
        StuntScore.BG_MAX_ALPHA = 0.8;
        StuntScore.SCORE_COUNTER_SLIDE_DIS = -200;
        return StuntScore;
    }());
    HUD.StuntScore = StuntScore;
})(HUD || (HUD = {}));
var HUD;
(function (HUD) {
    var PopupMsg = (function (_super) {
        __extends(PopupMsg, _super);
        function PopupMsg(parent) {
            var _this = this;
            if (PopupMsg._type == undefined)
                PopupMsg._type = new PopupMessage.MessageType(100, 500, Phaser.Easing.Cubic.Out, 400, 500, Phaser.Easing.Cubic.In);
            _this = _super.call(this, Gameplay.Gameplay.instance.timer, PopupMsg._type) || this;
            _this._msg = Game.Global.game.add.bitmapText(0, 0, "fntWhite30", "", 30);
            _this._msg.exists = false;
            _this._msg.anchor.set(0.5);
            parent.add(_this._msg);
            return _this;
        }
        PopupMsg.prototype.show = function (x, y, message) {
            this._msg.text = message;
            _super.prototype.showMessage.call(this, x, y);
        };
        PopupMsg.prototype.getMsgContainer = function () {
            return this._msg;
        };
        return PopupMsg;
    }(PopupMessage.MessageBase));
    HUD.PopupMsg = PopupMsg;
})(HUD || (HUD = {}));
var Gameplay;
(function (Gameplay) {
    var Settings = (function () {
        function Settings() {
            var game = Game.Global.game;
            this._settings = new PhySettings.Settings();
            var bikeSettings = this._settings.bike;
            this._entries = [
                new PhySettings.LbItemContent("World gravity", this._settings.gravity),
                new PhySettings.LbItemContent("Ground friction", this._settings.ground.friction),
                new PhySettings.LbItemContent("Ground elasticity", this._settings.ground.restitution),
                new PhySettings.LbItemContent("Bike tilt start impulse", bikeSettings.tilt.iniImpulse),
                new PhySettings.LbItemContent("Bike tilt torque", bikeSettings.tilt.torque),
                new PhySettings.LbItemContent("Bike body weight scale", bikeSettings.body.weightScale),
                new PhySettings.LbItemContent("Bike body angular damping", bikeSettings.body.angularDamping),
                new PhySettings.LbItemContent("Motor torque", bikeSettings.motor.torque),
                new PhySettings.LbItemContent("Motor max speed", bikeSettings.motor.maxSpeed),
                new PhySettings.LbItemContent("Motor max speed delay", bikeSettings.motor.maxSpeedDelay),
                new PhySettings.LbItemContent("Motor min speed ratio", bikeSettings.motor.minSpeedRatio),
                new PhySettings.LbItemContent("Rear wheel friction", bikeSettings.rearWheel.friction),
                new PhySettings.LbItemContent("Rear wheel elasticity", bikeSettings.rearWheel.restitution),
                new PhySettings.LbItemContent("Rear wheel angular damping", bikeSettings.rearWheel.angularDamping),
                new PhySettings.LbItemContent("Rear wheel suspension frequency", bikeSettings.rearWheel.suspensionFrequency),
                new PhySettings.LbItemContent("Rear wheel suspension damping", bikeSettings.rearWheel.suspensionDamping),
                new PhySettings.LbItemContent("Rear wheel weight scale", bikeSettings.rearWheel.weightScale),
                new PhySettings.LbItemContent("Front wheel friction", bikeSettings.frontWheel.friction),
                new PhySettings.LbItemContent("Front wheel elasticity", bikeSettings.frontWheel.restitution),
                new PhySettings.LbItemContent("Front wheel angular damping", bikeSettings.frontWheel.angularDamping),
                new PhySettings.LbItemContent("Front wheel suspension frequency", bikeSettings.frontWheel.suspensionFrequency),
                new PhySettings.LbItemContent("Front wheel suspension damping", bikeSettings.frontWheel.suspensionDamping),
                new PhySettings.LbItemContent("Front wheel weight scale", bikeSettings.frontWheel.weightScale),
            ];
            this._layer = game.add.group();
            this._layer.visible = this._layer.exists = false;
            var onItemSelect = new Phaser.Signal();
            onItemSelect.add(this.handleItemSelect, this);
            this._lbEntries = new Controls.ListBox(20, 20, PhySettings.ListBoxItem.WIDTH + 20, Game.Global.scale.resolution.y - 160, true, PhySettings.ListBoxItem.HEIGHT, 0, function () {
                return new PhySettings.ListBoxItem(this._lbEntries, onItemSelect);
            }, this, this._layer);
            this._lbEntries.content = this._entries;
            var btnType = new Controls.ButtonType(new Phaser.Point(0, 0), [
                new Controls.ButtonState("atlas_A", "comBtn_0"),
                new Controls.ButtonState("atlas_A", "comBtn_1")
            ], new Phaser.Point(0.5, 0.5), this._layer);
            var btnContent = game.make.bitmapText(0, 0, "fntWhite30", "Apply", 30);
            btnContent.anchor.set(0.5);
            var btn = new Controls.Button(0, btnType, 10, 0, btnContent, false);
            btn.y = Game.Global.scale.resolution.y - btn.height - 20;
            btn.onClick.add(this.handleBtnApplyClick, this);
            btnContent = game.make.bitmapText(0, 0, "fntWhite30", "Cancel", 30);
            btnContent.anchor.set(0.5);
            btn = new Controls.Button(0, btnType, btn.x + btn.width + 10, btn.y, btnContent, false);
            btn.onClick.add(this.handleBtnCancelClick, this);
            btnContent = game.make.bitmapText(0, 0, "fntWhite30", "Load", 30);
            btnContent.anchor.set(0.5);
            btn = new Controls.Button(0, btnType, btn.x + btn.width + 10, btn.y, btnContent, false);
            btn.onClick.add(this.handleBtnLoadClick, this);
            btnContent = game.make.bitmapText(0, 0, "fntWhite30", "Save", 30);
            btnContent.anchor.set(0.5);
            btn = new Controls.Button(0, btnType, btn.x + btn.width + 10, btn.y, btnContent, false);
            btn.onClick.add(this.handleBtnSaveClick, this);
            var sliderType = new Controls.SliderType("atlas_A", "sliderBar", "sliderThumb", new Phaser.Rectangle(0, 0, 600, 10), false);
            this._slider = new Controls.Slider(0, sliderType, this._layer);
            this._slider.x = 20;
            this._slider.y = btn.y - 40;
            this._slider.onValueChange.add(this.handleSliderValueChange, this);
            this._selItemContent = this._lbEntries.visibleItems.getItemAtIndex(0).content;
            this._selItemContent.selected = true;
        }
        Settings.prototype.open = function () {
            this._layer.position.copyFrom(Game.Global.game.camera.position);
            this._layer.visible = this._layer.exists = true;
            this._lbEntries.activate();
        };
        Settings.prototype.close = function () {
            if (this._layer.visible) {
                this._layer.visible = this._layer.exists = false;
                this._lbEntries.deactivate();
            }
        };
        Settings.prototype.update = function () {
            if (!this._layer.visible)
                return false;
            this._lbEntries.update();
            return true;
        };
        Settings.prototype.handleBtnCancelClick = function () {
            this._settings.reset();
            this.close();
        };
        Settings.prototype.handleBtnApplyClick = function () {
            this._settings.apply();
            this.close();
        };
        Settings.prototype.handleItemSelect = function (item) {
            this._selItemContent.selected = false;
            this._selItemContent = item.content;
            this._selItemContent.selected = true;
            var val = item.content.value;
            this._slider.setRange(val.min, val.max, val.value, val.resolution);
        };
        Settings.prototype.handleBtnLoadClick = function () {
            this._settings.load();
            var lbEntries = this._lbEntries.visibleItems;
            var i = lbEntries.itemCnt;
            while (i-- != 0)
                lbEntries.getItemAtIndex(i).updateValue();
        };
        Settings.prototype.handleBtnSaveClick = function () {
            this._settings.save();
        };
        Settings.prototype.handleSliderValueChange = function (value) {
            this._selItemContent.value.newValue = value;
            if (this._selItemContent.lbItem != null)
                this._selItemContent.lbItem.updateValue();
        };
        return Settings;
    }());
    Gameplay.Settings = Settings;
})(Gameplay || (Gameplay = {}));
var PhySettings;
(function (PhySettings) {
    var LbItemContent = (function () {
        function LbItemContent(name, value) {
            this._name = name;
            this._value = value;
            this._lbItem = null;
            this._selected = false;
        }
        Object.defineProperty(LbItemContent.prototype, "name", {
            get: function () { return this._name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LbItemContent.prototype, "value", {
            get: function () { return this._value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LbItemContent.prototype, "lbItem", {
            get: function () { return this._lbItem; },
            set: function (item) { this._lbItem = item; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LbItemContent.prototype, "selected", {
            get: function () { return this._selected; },
            set: function (selected) {
                if (this._lbItem != null)
                    this._lbItem.select(selected);
                this._selected = selected;
            },
            enumerable: true,
            configurable: true
        });
        return LbItemContent;
    }());
    PhySettings.LbItemContent = LbItemContent;
    var ListBoxItem = (function (_super) {
        __extends(ListBoxItem, _super);
        function ListBoxItem(listbox, onSelect) {
            var _this = _super.call(this, listbox) || this;
            var game = Game.Global.game;
            _this._onSelect = onSelect;
            _this._partBg = game.add.image(0, ListBoxItem.BG_Y, "atlas_A", "lbEntryBg", _this._container);
            _this._partBg.inputEnabled = true;
            _this._partBg.events.onInputDown.add(_this.handleOnInputDown, _this);
            _this._partName = game.make.bitmapText(ListBoxItem.NAME_X, ListBoxItem.NAME_Y, "fntWhite30", "", 30);
            _this._container.add(_this._partName);
            _this._partValue = game.make.bitmapText(ListBoxItem.VALUE_X, ListBoxItem.VALUE_Y, "fntWhite30", "", 30);
            _this._container.add(_this._partValue);
            return _this;
        }
        Object.defineProperty(ListBoxItem.prototype, "onSelect", {
            get: function () { return this._onSelect; },
            enumerable: true,
            configurable: true
        });
        ListBoxItem.prototype.activate = function (id, pos, content) {
            _super.prototype.activate.call(this, id, pos, content);
            var data = content;
            this._partName.text = data.name;
            this.updateValue();
            data.lbItem = this;
            this.select(data.selected);
            this._container.visible = true;
            return this;
        };
        ListBoxItem.prototype.deactivate = function () {
            _super.prototype.deactivate.call(this);
            this._content.lbItem = null;
            return this;
        };
        ListBoxItem.prototype.updateValue = function () {
            var data = this._content;
            this._partValue.text = Math.round(((data.value.newValue - data.value.min) / (data.value.max - data.value.min)) * 100) + " % + (" + data.value.newValue + ")";
        };
        ListBoxItem.prototype.select = function (select) {
            this._partBg.frameName = (select ? "lbEntryBgSel" : "lbEntryBg");
        };
        ListBoxItem.prototype.handleOnInputDown = function () {
            this._onSelect.dispatch(this);
        };
        ListBoxItem.WIDTH = 600;
        ListBoxItem.HEIGHT = 92;
        ListBoxItem.BG_Y = 0;
        ListBoxItem.NAME_X = 20;
        ListBoxItem.NAME_Y = 11;
        ListBoxItem.VALUE_X = 20;
        ListBoxItem.VALUE_Y = 46;
        return ListBoxItem;
    }(Controls.ListBoxItemBase));
    PhySettings.ListBoxItem = ListBoxItem;
})(PhySettings || (PhySettings = {}));
var Game;
(function (Game) {
    Game.CURRENCY_ICON_ASSET_KEY = [
        ["iconCoin1", "iconCoin2"],
        ["iconGameeCoin1", "iconGameeCoin2"],
        ["iconGameeGem1", "iconGameeGem2"],
        ["iconGameeVIP"]
    ];
    var Price = (function () {
        function Price(price, currency, sale) {
            if (sale === void 0) { sale = false; }
            this._price = price;
            this._currency = currency;
            this._sale = sale;
        }
        Object.defineProperty(Price.prototype, "price", {
            get: function () { return this._price; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Price.prototype, "currency", {
            get: function () { return this._currency; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Price.prototype, "sale", {
            get: function () { return this._sale; },
            enumerable: true,
            configurable: true
        });
        Price.prototype.set = function (price, currency, sale) {
            this._price = price;
            this._currency = currency;
            this._sale = sale;
        };
        return Price;
    }());
    Game.Price = Price;
    var Global = (function () {
        function Global() {
        }
        Global.init = function () {
            Global.game = new Phaser.Game({
                width: 128,
                height: 128,
                renderer: Phaser.CANVAS,
                parent: "content",
                transparent: false,
                physicsConfig: null,
                forceSetTimeOut: false,
                disableVisibilityChange: true,
            });
            Global.playerProfile = new Game.PlayerProfile();
            var coinAnim = new World.AssetCoinAnim("coin", "bnsCoin_", 9, 18);
            var pumpkinAnim = new World.AssetCoinAnim("pumpkin", "bnsPumpkin_", 8, 18);
            Global.enviroments = [
                new World.Assets(0, "city", 0, 0, 0, 500, 0, coinAnim),
                new World.Assets(1, "ruined city", 0, 0, 2, 500, 0, coinAnim),
                new World.Assets(2, "desert", 1, -8, 1, 800, 1, coinAnim),
                new World.Assets(3, "halloween", 2, -8, 3, 0, 2, pumpkinAnim)
            ];
            Global.powerUps = new PowerUps.Manager();
            Global.gameMode = 0;
            Global.game.state.add("Boot", Game.Boot);
            Global.game.state.add("Gameplay", Gameplay.Gameplay);
            Global.game.state.start("Boot");
        };
        Global.getBikeType = function (typeUID) {
            if (typeUID == Global.BATTLE_BIKE_UID)
                return Global.battleBikeType;
            var i = Global.bikeTypes.length;
            while (i-- != 0) {
                if (Global.bikeTypes[i].uid == typeUID)
                    return Global.bikeTypes[i];
            }
            return null;
        };
        Global.getEnviroment = function (uid) {
            var i = Global.enviroments.length;
            while (i-- != 0)
                if (Global.enviroments[i].uid == uid)
                    return Global.enviroments[i];
            return undefined;
        };
        Global.OPT_GAMEE = true;
        Global.EXTRA_LIFE_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAABUCAYAAAALSYAIAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAEG5JREFUeNrsnUuTHEe1x39ZVd3z0GuMLBn5JZvFxbDwHa8gggX2xmuZDQstsPgCtj4B9idAfAKLCAY2RHhuhHdeYAcEeIUHjBaEI7CEA8lCsqbH8+6uysOiM3tOZWXW9LxnfKmIiurp6anO/OU/zzl5KjPHiAj/PQ7/KHb6B3Nm2z95Dph152X3c3h86K4fAAtA7wjq7sv4HPC/wEzw+x7wF3ddcGXd83FVSgDMThWfAP8y8BN3fW4X5VkAfgnMA7cPEPbrwA+BKxHQ4xzzwP+5a++owM+4iryxS9ip4wPg7f1SmCvbG66sM/tYzpuunLd3Az7b5Ze+CXwG/Hyfofve8zt3vryH+8wAb7lyvrnP0H3v+Qx4ZzcMdqT4OVPMui+aTX0mBwqEwl1zwAAYAyIIsDl8hwEwwLBNCW44Ze2ka19x5ZxJOzeh45TXQcgAY4blEhGsKpsvZ8vRc2W8se+mZs4UbzqFN44MmELoIkyZIejMmFFRdZFFnyKUwLpAH8NGunK3gdecL9hO5T93aozCngCmzRZ048oZfrMuowUGIqxj6LuzxUy+1iaSHYGfM8U7scpkwDSWU2YYHuXGjIBrBZlEhQSwrmLWVWxdYD1esR5w3dnWFPTfxXpjDpzCcsZsCSIzpgZel1N0WVX5/HVFYCPdAD3glZRIxgI/Z4oZ4N2YrZ1GOOOU44H7ymRKRR5+TU0eelgx93pN4CtJdu9rEfhJ6GeNcAbZKmMEeqycvowh/MpfRVgWWCXD7gC+B79dUN6AngFnsJw2Q+D+bKuUV9NIScZsVciYIXB/FeGMgVMiPLLCShP+OyqqSEKfQJjJYBLITEZmDDl1xfurL19N8a6MVgRRZcwd/Aw4hzAlFUtkI78VlCmp/KTiY+ali3AOy4Qx5FlG4Srjwee6G09O0n3mGfIzZ8jPn8d0uwCU9+5RPnhA//PPk4rX1yUrLErUAftKNaBPGXgiY0sIEejjKJ5YrwQqp/hKhNKdS2JYa4qkB7ykQ85WxTtH+nqooG9gKbKM3BgKd+aqYvnEBFMvvsjU7CzFN78ZNTNeUXZpifWPP2bjz3+mXF2tKV73gm8YobDCA0sI/13nzGrQpw08mZsa9LAn1sxhyrmqXqkVX8kwAspULzHADAJCCN+b6pe2VbwLGT8OlX7eQdfA/TXPc07/4AdMf//7ZJOT0WgmBD9qgLU1ln/zG/r37jUUr5W2aIX7VXsgcMrA00VWA9sG34wT1UR6ZeXMzUjx1o6U34sr/4YLDNLOdc4UtYFLBpynYlJB1/AnLl7k7I9+ROfixWi3NW3gfXceDFj+1a/o373b6Nairncry6ME/OnM8HyRNUxJFHjCD7FNSNlmajT8RxINjV8BPoiOXOdM8XroTM94m66hZxlFljF1+TKP/fSndC9erHVtH056VYVd0/88sr/dLqdffbXWqB13jl5nGc8WORMR85UBl4ucTpYNT1dGfy0i1zxyakGlfpc81X0fM0Kn6ZV+1padrP1yCuGUi15C8zL5/PPM/PjHZJ1Oo8v6kWqIKIznjQvZDNB58kk6RUFVlmTOxvqIYqR6Y/h2F25tllTqnv/TLTiVZ7Uel4WvIyrPgnFGLI4fOdgg8on2Eu8XgNMiLNY/9bLzmzdr4J3an9OQTmMpTNaAPvXssyPoYcy+nX3X9xf3eR++5XmOsXYEOvNd3TUCQJHnXO7CP/rDLvtUp+BckdcaPQXZROx6bJBHMIAyDqj+jipmkowZmiQ3Ot5wg0J1vNEA796sDZC6kS7XmZ7m7JUrSehR8No8JMJXefCArCxHDZIppYmyiQJc6hQsVpZS4Nlu0YAeez1WWYNy6njeN4ARqX2uNsoNxienxLJBro3O7JwpZq9KuVCoSGZWq3HaSG1E6sGfefVVinPnogqjxcxEG8FV0ADlrVvkSjVh19cnwLcnu1iBTmguApOXaoiwnLFw0uhRbCgeBzl3Zcp92OkaOQcmjGFKJIxy3gCuecX/JLTtXTcwytW1+9RTTL74Yr0SQeG3i2hqNt4ran0d+8knZKpL6y5OAF2A6aABwzLEAKfMi0mZwkAsmVK7j8hG8B30XI1DKmPoNsFf0eBrkUwHqce+7pz+3veiFUtVSL74Arl/f6sy589jLl2CPN/6jLVU77+P2dgYAvI5Eg1dKU5afAYJ2MQEoqC2+iMH2ADWmBF8bQL9NZOAmwjTBlZEKLe+ZWbOFLOFev5YG/2FI79ieprJ73ynrpLYkHttjeqjj7C3biFra/Fo5oknMBcuwOQk8q9/Ye/eHd1n5HC9jXXv1aArtZnAfDVsd8ScjB11qecI4d9nqhda5UdqDeCE1AXK4GFPMWeKptojtnHiu9+FLKtVLnRK9qOPsH/6E9Lvt3Zh7t/Hqp7glR76AhMJO6N+Irx/ALUBPmGmUqbGuJDWqLLqnp8pxY/e96kFY+iIhN/ywyJUe0e1qL5x55ln6jZdd+XlZQbvvYfcudManiUr5m29r1wi7Awjie3AxaIrs83ftdl5o3phrQG0b9HvuZ/zyLODInw8Ftpq/7q4dCluAtfWGPz615jFxZESt6tQtGL60ZtTefJzY9yXFuC7KaMJBlGx+9Xgq0aYMA21vFyko766A81nZqJq6f/2t7C42JrzGAeSRMyFft/sZDZEi8PcbRklDIkDtTcaIPhs8zHkcJ5JLRMZFs90Opi82WGqv/8duXs3mf7dawMwpl3fyf0P5AjhtjRMKlcTP6yNvl1+8sn+16Elm3ksIO/TkYWPpspY+raqsP1+HYC12H/+k8OYeWl2eB76EZoSFe5KQjgZsFTjyVa+Qf+x7dVnLNjV1VHYuFtlnpRDEqBjYBvvuYRf+EgwqvjwCbsAg88/r998cxP9EEWCAvE1boQ22CN2iuGgCWQhAt40bwL0P/201hPodBo5lK+z2vVImkT+qCZY98RKz5yrgb8q5W3UU/CK4QPb0cMHd8P+nTvIYLBld6enow0k/w/MzqjOkbk3IQ8rwmbzNh/6bO68frcvalqDf87Y77P5179uwS0KzMxM0rF8HeCHao+JTDMKZ8b52XFlXfG9q1LOe/C/1L9Zx9D3N1A3W/3jHxH3hEgA8/jj0Vb+OqwyifXcaENEGsAqdptNFPM+quGqlAva3IgzN6N5Lu4sez02/va3rZTot77VgN5W8BMZxSTMScgmFKkVod/MxY9ErmcZvK1/uyaGMuw6wOr771MtLSEiZE8/nbRt6LTuSVV9QtkSpIRtrCFEWG3OgLt9VcoPQvDzqOnFFbAsW3NI/HyScm2NlffeG2YSL16Es2drHrzmZE+gvU+JJXSY4VkFIt0UYbWp9rf1AApnbnrAL/SnlsXQZ2t2rL/x5mefsf6HPwxV/8ILdehB2HWS7L0EY5JYbG61ygM2eqLTckTtqFnO4VKcG1r1Aizb+swpf67+/vf0P/2U4oUXRgWIDR5Oir1P2vXQvrt6hkrX0/pWhVa1N8A71V/X761gWPUmx93YilBZy/K77w6Hw2fP1hRw0uy9tNn10HEGCreKS6XmzYcDJoI5/dFp2nOm+Bj1ZKoDXMpkND2u46ardYyh0+1STE5iVlcbc+V3Mp3iuEAnMvIMlR3OlxyIMLCWgZvT/5XE5006cUdNjT9qqh8AiwmTUw4GlCsrTe8eG9EeM2c7LnRty6vAzGgW6xKFfpPI0tEoeBfy3Kg5WgyrVqLwq0g8q+09QT7juEU6EksHEFk0EXGi+lxqpiEbprsVvHIGt2t3ETPqZq3wVYG1emKRjhwD2CRSAo2VKkrhZWB2HlliU7OvkVgBmATvHO210OQ8tM0vb1V/KtI5QvhJ6AngNZMSgb9qheUm9PkwBzau4qMmZw3Doq23uC5UaOsbodgRw2+FHsm1hOYl7PF9Ga7RohmzX2srx7ZL6q9KeT3M2S+JYSUFP2wEnVI4YvjjQNfrbxuBRNgA1vLQNmaJtZqYscG7o7FaeVGGGcwyoYTGUDqV00kk1w4buoZfbeNIfV2/jNv1sTbAGAu8e1hS6zqls/d67U9M/TaynDKW0zlI+CnoEF9hHoaOsdh9Mb4Gd57hxhXsC3gHfz4c9m5guG/Zgm5t0vGGadNYjH8Q8Nugt8XqlXOqZaRXL9nhutbI6PTauOXa0bYpV6V8K/TUGxgeVkoRCdVX2zjbg4C/U+ixsLEmJGtZjzvT3jh2fdfgleNYCPM5PtLRpidq8yPLKBvw98Hh7ga6XrtaReqyIcKXNrrKvMHkIMD3XO6hFw6ulqy0DrCqceHvMdrZC/TG+lVl2x/YYZo8An1+pxB3u0NTFP6iGHq2qZTyEOHvFXpswfBAhPuWGPSbpLdxORDwUWciDv6aHD582SZkHFfplbPluhHuVxILG2/uxJnuJ3gfPjXgf2kN6xHgY8PfZpAlbVnGljh9J+Zl4K5fxKEv7AU67GLfSeLdDbb2kXE5HcMFLJNZNlbuXdTCrsynkNVCB3E/mxb1S2RO446hq576MA39lb1Cy9if42aY0+kDD6xhwz0g2HaQFW4eMUa4GUs37wf0gYO+kobe2yuwgv07rrO1F2UN/gXsaOHaOA8lUE+rsmAltWmBTyL3smPolgOFvt/gUXZvW/hJR6lWV2Ru0a5fU9T4aCTfk9rvrAq2PCmDZFcNurDnAdJhgx8Lfmqac67svV5bmumlLpF9BCA+WVRUwsuDL4ORqHamCfPiQ+eF/YR0EOC3hT8ZmB1JKF/cQl38Kjqvft0AwQyG2HaF0QcYSuWlCP+uJLWn2L5DP0jwrfAfxzK1E5uvFuyO1ry6BohBD9O7ta2sIuOLRMh4YNAPGnwS/j1reEwsM5lpmJ6a2XGqH+0ZoNaOxhoqZtc9/DKRCjgK6IcBPgrfj3CxwgwWaXG6ehOecCk7gUPVoWMVeWRXBQOk++k4/TUOdjv1QwE/FnzMlvq16fB7v/jVt7V9cSKONbZhW6j0jVHC62BDxuMA3sP/UI9wBXgkhr6FC5kMFz0YUzs9dL8jht8pIwa+LfFVNaBzZNAPG3w0vQAubvbwI/Y+C04TSRWE0zJiDnXFDrcmLI8Y+lGAb4VvK+FiXneWftejTO2sF45mY2YmdKgtW+XuKct4ksD7yi4w3Bd4xr+5huGLSngiG24v5c2N9XsDB/G8dsaNSUgKes8Od0DlmEDfzyTZbvP5je69geGeSysP9OmSbQM9Q1encPUo1NrR+bBKQn/7qKAfpeI1/JcYbnw8Gw60HjMy2g3Q7weWRXZzCpfIeNv+ID7vxTv6m0dZ8YyjP27HBisl8FAMSwJ9pfi+tcOfEz2iL8Kmtfw7Dr3nYvSbR13pguNx9Jzy3wlj/Z6bsXbOSE3xsT0ph4u+4CtM7L8tHPho9CSC1ybgDsEex8M1t3AOCy5nE4tq1jEsk8Uil0MPF0+CqQmPt2JObwPDIll9MqyaJLVMxldx6PPHDfpxBe/DvJdCWH0Mi+SNoX6PLJbSheHjyNeOG/TjDF5HPDWbXAGLDnTpXm+mI5frx7Vyxxm8jngaUcgyGY8i6leO+uZxrthxB+9BXiOYqaxHrUEvef64RC4nHbx2um32OuoX/gt+f475mN13PeLaSarISQMf2v3bJ8Gex47/DACv/X8NuMpr7QAAAABJRU5ErkJggg==";
        Global.EXTRA_LIFE_PRICE = 5;
        Global.NORMAL_DEF_BIKE_UID = 1;
        Global.BATTLE_BIKE_UID = 7;
        return Global;
    }());
    Game.Global = Global;
    window.onload = function () {
        Global.init();
    };
})(Game || (Game = {}));
var Helpers;
(function (Helpers) {
    var GameTimer = (function () {
        function GameTimer() {
            Game.Global.game.onPause.add(this.handleGamePause, this);
            Game.Global.game.onResume.add(this.handleGameResume, this);
            this._started = false;
        }
        Object.defineProperty(GameTimer.prototype, "paused", {
            get: function () { return this._paused; },
            enumerable: true,
            configurable: true
        });
        GameTimer.prototype.destroy = function () {
            Game.Global.game.onPause.removeAll(this);
            Game.Global.game.onResume.removeAll(this);
        };
        GameTimer.prototype.start = function () {
            this._timeBase = Game.Global.game.time.elapsedSince(0);
            this.time = 0;
            this.delta = 1;
            this._started = true;
            this._paused = false;
        };
        GameTimer.prototype.stop = function () {
            this._started = false;
        };
        GameTimer.prototype.update = function () {
            if (this._paused || !this._started)
                return;
            var time = Game.Global.game.time;
            this.time = time.elapsedSince(this._timeBase);
            this.delta = time.elapsedMS / (1000 / 60);
        };
        GameTimer.prototype.pause = function () {
            if (this._paused || !this._started)
                return;
            this._paused = true;
            this._pauseStartTime = this.time;
        };
        GameTimer.prototype.resume = function () {
            if (!this._paused || !this._started)
                return;
            this._paused = false;
            this._timeBase += (Game.Global.game.time.elapsedSince(this._timeBase) - this._pauseStartTime);
        };
        GameTimer.prototype.handleGamePause = function () {
            this.pause();
        };
        GameTimer.prototype.handleGameResume = function () {
            this.resume();
        };
        return GameTimer;
    }());
    Helpers.GameTimer = GameTimer;
})(Helpers || (Helpers = {}));
var KineticScrolling;
(function (KineticScrolling) {
    var Settings = (function () {
        function Settings() {
            this.kineticMovement = true;
            this.timeConstantScroll = 325;
            this.horizontalScroll = false;
            this.verticalScroll = false;
            this.deltaWheel = 40;
        }
        return Settings;
    }());
    KineticScrolling.Settings = Settings;
    var Scrolling = (function () {
        function Scrolling(horizontalScroll, verticalScroll) {
            this._pressed = false;
            this._dragging = false;
            this._autoScrollX = false;
            this._autoScrollY = false;
            this._directionWheel = 0;
            this._active = false;
            this._settings = new Settings();
            this._settings.horizontalScroll = horizontalScroll;
            this._settings.verticalScroll = verticalScroll;
            this._x = 0;
            this._y = 0;
            this._onPosChange = new Phaser.Signal();
        }
        Object.defineProperty(Scrolling.prototype, "settings", {
            get: function () { return this._settings; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scrolling.prototype, "area", {
            get: function () { return this._area; },
            set: function (area) { this._area = area; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scrolling.prototype, "x", {
            get: function () { return this._x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scrolling.prototype, "y", {
            get: function () { return this._y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scrolling.prototype, "onPosChange", {
            get: function () { return this._onPosChange; },
            enumerable: true,
            configurable: true
        });
        Scrolling.prototype.activate = function () {
            if (!this._active) {
                this._active = true;
                var input = Game.Global.game.input;
                input.onDown.add(this.handleInputDown, this);
                input.onUp.add(this.handleInputUp, this);
                input.addMoveCallback(this.handleInputMove, this);
                input.mouse.mouseWheelCallback = this.handleMouseWheel.bind(this);
            }
        };
        Scrolling.prototype.deactivate = function () {
            if (this._active) {
                this._active = false;
                var input = Game.Global.game.input;
                input.onDown.remove(this.handleInputDown, this);
                input.deleteMoveCallback(this.handleInputMove, this);
                input.onUp.remove(this.handleInputUp, this);
                input.mouse.mouseWheelCallback = null;
            }
        };
        Scrolling.prototype.update = function () {
            var elapsed = Date.now() - this._timeStamp;
            this._velocityWheelXAbs = Math.abs(this._velocityWheelX);
            this._velocityWheelYAbs = Math.abs(this._velocityWheelY);
            var x = this._x;
            var y = this._y;
            if (this._autoScrollX && this._amplitudeX != 0) {
                var delta = -this._amplitudeX * Math.exp(-elapsed / this._settings.timeConstantScroll);
                if (delta > 0.5 || delta < -0.5) {
                    x = this._targetX - delta;
                }
                else {
                    this._autoScrollX = false;
                    x = this._targetX;
                }
            }
            if (this._autoScrollY && this._amplitudeY != 0) {
                var delta = -this._amplitudeY * Math.exp(-elapsed / this._settings.timeConstantScroll);
                if (delta > 0.5 || delta < -0.5) {
                    y = this._targetY - delta;
                }
                else {
                    this._autoScrollY = false;
                    y = this._targetY;
                }
            }
            if (!this._autoScrollX && !this._autoScrollY) {
                this._dragging = false;
            }
            if (this._settings.horizontalScroll && this._velocityWheelXAbs > 0.1) {
                this._dragging = true;
                this._amplitudeX = 0;
                this._autoScrollX = false;
                x -= this._velocityWheelX;
                this._velocityWheelX *= 0.95;
            }
            if (this._settings.verticalScroll && this._velocityWheelYAbs > 0.1) {
                this._dragging = true;
                this._autoScrollY = false;
                y -= this._velocityWheelY;
                this._velocityWheelY *= 0.95;
            }
            if (x != this._x || y != this._y) {
                this.updatePosition(this._x - x, this._y - y);
            }
        };
        Scrolling.prototype.handleInputDown = function (pointer) {
            if (this._area != undefined && this._area != null) {
                if (!this._area.contains(pointer.x, pointer.y))
                    return;
            }
            this._pressed = true;
            this._timeStamp = Date.now();
            this._startX = pointer.x;
            this._startY = pointer.y;
            this._velocityX = this._velocityY = this._amplitudeX = this._amplitudeY = 0;
        };
        Scrolling.prototype.handleInputMove = function (pointer) {
            if (!this._pressed)
                return;
            var now = Date.now();
            var elapsed = now - this._timeStamp;
            this._timeStamp = now;
            var deltaX = 0;
            var deltaY = 0;
            if (this._settings.horizontalScroll) {
                deltaX = pointer.x - this._startX;
                if (deltaX != 0) {
                    this._dragging = true;
                    this._startX = pointer.x;
                }
                this._velocityX = 0.8 * (1000 * deltaX / (1 + elapsed)) + 0.2 * this._velocityX;
            }
            if (this._settings.verticalScroll) {
                deltaY = pointer.y - this._startY;
                if (deltaY != 0) {
                    this._dragging = true;
                    this._startY = pointer.y;
                }
                this._velocityY = 0.8 * (1000 * deltaY / (1 + elapsed)) + 0.2 * this._velocityY;
            }
            this.updatePosition(deltaX, deltaY);
        };
        Scrolling.prototype.handleInputUp = function () {
            if (!this._pressed)
                return;
            this._pressed = false;
            this._autoScrollX = false;
            this._autoScrollY = false;
            if (!this._settings.kineticMovement)
                return;
            var now = Date.now();
            var elapsed = now - this._timeStamp;
            if (elapsed > 100)
                return;
            this._timeStamp = now;
            if (Game.Global.game.input.activePointer.withinGame) {
                if (this._velocityX > 10 || this._velocityX < -10) {
                    this._amplitudeX = 0.8 * this._velocityX;
                    this._targetX = Math.round(this._x - this._amplitudeX);
                    this._autoScrollX = true;
                }
                if (this._velocityY > 10 || this._velocityY < -10) {
                    this._amplitudeY = 0.8 * this._velocityY;
                    this._targetY = Math.round(this._y - this._amplitudeY);
                    this._autoScrollY = true;
                }
            }
            else {
                this._velocityWheelXAbs = Math.abs(this._velocityWheelX);
                this._velocityWheelYAbs = Math.abs(this._velocityWheelY);
                if (this._settings.horizontalScroll && this._velocityWheelXAbs < 0.1) {
                    this._autoScrollX = true;
                }
                if (this._settings.verticalScroll && this._velocityWheelYAbs < 0.1) {
                    this._autoScrollY = true;
                }
            }
        };
        Scrolling.prototype.handleMouseWheel = function () {
            if (!this._settings.horizontalScroll && !this._settings.verticalScroll)
                return;
            var input = Game.Global.game.input;
            if (this._area != undefined && this._area != null) {
                if (!this._area.contains(input.activePointer.x, input.activePointer.y))
                    return;
            }
            event.preventDefault();
            var delta = input.mouse.wheelDelta * 120 / this._settings.deltaWheel;
            if (this._directionWheel != input.mouse.wheelDelta) {
                this._velocityWheelX = 0;
                this._velocityWheelY = 0;
                this._directionWheel = input.mouse.wheelDelta;
            }
            if (this._settings.verticalScroll) {
                this._autoScrollY = false;
                this._velocityWheelY += delta;
            }
            else if (this._settings.horizontalScroll) {
                this._autoScrollX = false;
                this._velocityWheelX += delta;
            }
        };
        Scrolling.prototype.updatePosition = function (deltaX, deltaY) {
            this._x -= deltaX;
            this._y -= deltaY;
            this._onPosChange.dispatch(deltaX, deltaY, this._x, this._y);
        };
        return Scrolling;
    }());
    KineticScrolling.Scrolling = Scrolling;
})(KineticScrolling || (KineticScrolling = {}));
var Helpers;
(function (Helpers) {
    var ScaleManager = (function () {
        function ScaleManager(minRes, maxRes) {
            this._res = new Phaser.Point();
            this._scale = new Phaser.Point();
            this._minRes = minRes;
            this._maxRes = maxRes;
            this._onResChange = new Phaser.Signal();
            this._minAspectRatio = Math.min(minRes.x, maxRes.x) / Math.max(minRes.y, maxRes.y);
            this._maxAspectRatio = Math.max(minRes.x, maxRes.x) / Math.min(minRes.y, maxRes.y);
            if (this._minAspectRatio > this._maxAspectRatio) {
                var i = this._minAspectRatio;
                this._minAspectRatio = this._maxAspectRatio;
                this._maxAspectRatio = i;
            }
            var scale = Game.Global.game.scale;
            scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            scale.pageAlignHorizontally = true;
            scale.pageAlignVertically = true;
            scale.setResizeCallback(this.handleResize, this);
            this.handleResize(Game.Global.game.scale, null);
        }
        Object.defineProperty(ScaleManager.prototype, "minWidth", {
            get: function () { return this._minRes.x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScaleManager.prototype, "maxWidth", {
            get: function () { return this._maxRes.x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScaleManager.prototype, "minHeight", {
            get: function () { return this._minRes.y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScaleManager.prototype, "maxHeight", {
            get: function () { return this._maxRes.y; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScaleManager.prototype, "resolution", {
            get: function () { return this._res; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScaleManager.prototype, "onResChange", {
            get: function () { return this._onResChange; },
            enumerable: true,
            configurable: true
        });
        ScaleManager.prototype.calcNewRes = function () {
            var scale = Game.Global.game.scale;
            var extResW = window.innerWidth;
            var extResH = window.innerHeight;
            var ratio = extResW / extResH;
            if (ratio < this._minAspectRatio) {
                extResH = Math.floor(extResW / this._minAspectRatio);
            }
            else if (ratio > this._maxAspectRatio) {
                extResW = Math.floor(extResH * this._maxAspectRatio);
            }
            var intResW = extResW;
            var intResH = extResH;
            if (intResW < this._minRes.x) {
                intResH = Math.round(intResH * (this._minRes.x / intResW));
                intResW = this._minRes.x;
            }
            else if (intResW > this._maxRes.x) {
                intResH = Math.round(intResH * (this._maxRes.x / intResW));
                intResW = this._maxRes.x;
            }
            if (intResH < this._minRes.y) {
                intResW = Math.round(intResW * (this._minRes.y / intResH));
                intResH = this._minRes.y;
            }
            else if (intResH > this._maxRes.y) {
                intResW = Math.round(intResW * (this._maxRes.y / intResH));
                intResH = this._maxRes.y;
            }
            intResW = Math.min(Math.max(this._minRes.x, intResW), this._maxRes.x);
            intResH = Math.min(Math.max(this._minRes.y, intResH), this._maxRes.y);
            this._res.set(intResW, intResH);
            this._scale.set(extResW / intResW, extResH / intResH);
        };
        ScaleManager.prototype.handleResize = function (scale, parentBounds) {
            if (!scale.incorrectOrientation) {
                var oldScaleX = this._scale.x;
                var oldScaleY = this._scale.y;
                var oldW = this._res.x;
                var oldH = this._res.y;
                this.calcNewRes();
                var newRes = (this._res.x != Game.Global.game.width) || (this._res.y != Game.Global.game.height);
                if (newRes || Math.abs(this._scale.x - oldScaleX) > 0.001 || Math.abs(this._scale.y - oldScaleY) > 0.001) {
                    if (newRes)
                        Game.Global.game.scale.setGameSize(this._res.x, this._res.y);
                    Game.Global.game.scale.setUserScale(this._scale.x, this._scale.y);
                    this._onResChange.dispatch(this._res, this._scale);
                }
            }
        };
        return ScaleManager;
    }());
    Helpers.ScaleManager = ScaleManager;
})(Helpers || (Helpers = {}));
var PhySettings;
(function (PhySettings) {
    var SettingVal = (function () {
        function SettingVal(val, min, max, resolution) {
            this._min = min;
            this._max = max;
            this._resolution = resolution;
            this._value = Math.round(Math.min(Math.max(val, min), max) / resolution) * resolution;
            this._newValue = this._value;
        }
        Object.defineProperty(SettingVal.prototype, "min", {
            get: function () { return this._min; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingVal.prototype, "max", {
            get: function () { return this._max; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingVal.prototype, "resolution", {
            get: function () { return this._resolution; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingVal.prototype, "newValue", {
            get: function () { return this._newValue; },
            set: function (value) {
                value = Math.round(Math.min(Math.max(value, this._min), this._max) / this._resolution) * this._resolution;
                this._newValue = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingVal.prototype, "value", {
            get: function () { return this._value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingVal.prototype, "isNewValue", {
            get: function () { return this._newValue != this._value; },
            enumerable: true,
            configurable: true
        });
        SettingVal.prototype.applyNewValue = function () {
            this._value = this._newValue;
            return this._value;
        };
        SettingVal.prototype.resetNewValue = function () {
            this._newValue = this._value;
        };
        return SettingVal;
    }());
    PhySettings.SettingVal = SettingVal;
    var WheelSettings = (function () {
        function WheelSettings(wheelId) {
            this._wheelId = wheelId;
            var bikeType = Game.Global.bikeTypes[0];
            var wheel = (wheelId == 0 ? bikeType.fWheel : bikeType.rWheel);
            this._friction = new SettingVal(wheel.friction, 0.1, 1, 0.1);
            this._angularDamping = new SettingVal(wheel.angularDamping, 0.1, 2, 0.1);
            this._restitution = new SettingVal(wheel.restitution, 0, 1, 0.1);
            this._weightScale = new SettingVal(wheel.density, 0.1, 4, 0.1);
            this._suspensionFreq = new SettingVal(wheel.spring.frequency, 1, 15, 0.5);
            this._suspensionDamp = new SettingVal(wheel.spring.damping, 0.1, 1, 0.05);
        }
        Object.defineProperty(WheelSettings.prototype, "friction", {
            get: function () { return this._friction; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WheelSettings.prototype, "angularDamping", {
            get: function () { return this._angularDamping; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WheelSettings.prototype, "restitution", {
            get: function () { return this._restitution; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WheelSettings.prototype, "weightScale", {
            get: function () { return this._weightScale; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WheelSettings.prototype, "suspensionFrequency", {
            get: function () { return this._suspensionFreq; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WheelSettings.prototype, "suspensionDamping", {
            get: function () { return this._suspensionDamp; },
            enumerable: true,
            configurable: true
        });
        WheelSettings.prototype.reset = function () {
            this._friction.resetNewValue();
            this._angularDamping.resetNewValue();
            this._restitution.resetNewValue();
            this._weightScale.resetNewValue();
            this._suspensionFreq.resetNewValue();
            this._suspensionDamp.resetNewValue();
        };
        WheelSettings.prototype.load = function () {
            this._friction.newValue = parseFloat(localStorage.getItem("wheelFric" + this._wheelId));
            this._angularDamping.newValue = parseFloat(localStorage.getItem("wheelADamp" + this._wheelId));
            this._restitution.newValue = parseFloat(localStorage.getItem("wheelRes" + this._wheelId));
            this._weightScale.newValue = parseFloat(localStorage.getItem("wheelWeight" + this._wheelId));
            this._suspensionFreq.newValue = parseFloat(localStorage.getItem("suspenFreq" + this._wheelId));
            this._suspensionDamp.newValue = parseFloat(localStorage.getItem("suspenDamp" + this._wheelId));
        };
        WheelSettings.prototype.save = function () {
            localStorage.setItem("wheelFric" + this._wheelId, this._friction.newValue.toString());
            localStorage.setItem("wheelADamp" + this._wheelId, this._angularDamping.newValue.toString());
            localStorage.setItem("wheelRes" + this._wheelId, this._restitution.newValue.toString());
            localStorage.setItem("wheelWeight" + this._wheelId, this._weightScale.newValue.toString());
            localStorage.setItem("suspenFreq" + this._wheelId, this._suspensionFreq.newValue.toString());
            localStorage.setItem("suspenDamp" + this._wheelId, this._suspensionDamp.newValue.toString());
        };
        return WheelSettings;
    }());
    PhySettings.WheelSettings = WheelSettings;
    var MotorSettings = (function () {
        function MotorSettings() {
            var defSet = Game.Global.bikeTypes[0].motor;
            this._torque = new SettingVal(defSet.torque, 1, 100, 1);
            this._maxSpeed = new SettingVal(defSet.maxSpeed, 10, 50, 1);
            this._maxSpeedDelay = new SettingVal(defSet.maxSpeedDelay, 500, 3000, 100);
            this._minSpeedRatio = new SettingVal(defSet.minSpeedRatio, 0.1, 0.5, 0.05);
        }
        Object.defineProperty(MotorSettings.prototype, "torque", {
            get: function () { return this._torque; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotorSettings.prototype, "maxSpeed", {
            get: function () { return this._maxSpeed; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotorSettings.prototype, "maxSpeedDelay", {
            get: function () { return this._maxSpeedDelay; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MotorSettings.prototype, "minSpeedRatio", {
            get: function () { return this._minSpeedRatio; },
            enumerable: true,
            configurable: true
        });
        MotorSettings.prototype.reset = function () {
            this._torque.resetNewValue();
            this._maxSpeed.resetNewValue();
            this._maxSpeedDelay.resetNewValue();
            this._minSpeedRatio.resetNewValue();
        };
        MotorSettings.prototype.load = function () {
            this._torque.newValue = parseInt(localStorage.getItem("motorTorq"));
            this._maxSpeed.newValue = parseInt(localStorage.getItem("motorSpeed"));
            this._maxSpeedDelay.newValue = parseInt(localStorage.getItem("motorMaxSpeedDelay"));
            this._minSpeedRatio.newValue = parseFloat(localStorage.getItem("motorMinSpeedRatio"));
        };
        MotorSettings.prototype.save = function () {
            localStorage.setItem("motorTorq", this._torque.newValue.toString());
            localStorage.setItem("motorSpeed", this._maxSpeed.newValue.toString());
            localStorage.setItem("motorMaxSpeedDelay", this._maxSpeedDelay.newValue.toString());
            localStorage.setItem("motorMinSpeedRatio", this._minSpeedRatio.newValue.toString());
        };
        return MotorSettings;
    }());
    PhySettings.MotorSettings = MotorSettings;
    var BodySettings = (function () {
        function BodySettings() {
            var defSet = Game.Global.bikeTypes[0].body;
            this._weightScale = new SettingVal(1, 1, 5, 0.1);
            this._aDamping = new SettingVal(defSet.angularDamping, 0.1, 2, 0.05);
        }
        Object.defineProperty(BodySettings.prototype, "weightScale", {
            get: function () { return this._weightScale; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BodySettings.prototype, "angularDamping", {
            get: function () { return this._aDamping; },
            enumerable: true,
            configurable: true
        });
        BodySettings.prototype.reset = function () {
            this._weightScale.resetNewValue();
            this._aDamping.resetNewValue();
        };
        BodySettings.prototype.load = function () {
            this._weightScale.newValue = parseFloat(localStorage.getItem("bodyWeight"));
            this._aDamping.newValue = parseFloat(localStorage.getItem("bodyADamp"));
        };
        BodySettings.prototype.save = function () {
            localStorage.setItem("bodyWeight", this._weightScale.newValue.toString());
            localStorage.setItem("bodyADamp", this._aDamping.newValue.toString());
        };
        return BodySettings;
    }());
    PhySettings.BodySettings = BodySettings;
    var TiltSettings = (function () {
        function TiltSettings() {
            var defSet = Game.Global.bikeTypes[0].tilt;
            this._iniImpulse = new SettingVal(defSet.iniImpulse, 1, 10, 1);
            this._torque = new SettingVal(defSet.torque, 1, 15, 1);
        }
        Object.defineProperty(TiltSettings.prototype, "iniImpulse", {
            get: function () { return this._iniImpulse; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TiltSettings.prototype, "torque", {
            get: function () { return this._torque; },
            enumerable: true,
            configurable: true
        });
        TiltSettings.prototype.reset = function () {
            this._iniImpulse.resetNewValue();
            this._torque.resetNewValue();
        };
        TiltSettings.prototype.load = function () {
            this._iniImpulse.newValue = parseFloat(localStorage.getItem("tiltImpulse"));
            this._torque.newValue = parseFloat(localStorage.getItem("tiltTorque"));
        };
        TiltSettings.prototype.save = function () {
            localStorage.setItem("tiltImpulse", this._iniImpulse.newValue.toString());
            localStorage.setItem("tiltTorque", this._torque.newValue.toString());
        };
        return TiltSettings;
    }());
    PhySettings.TiltSettings = TiltSettings;
    var BikeSettings = (function () {
        function BikeSettings() {
            this._tilt = new TiltSettings();
            this._body = new BodySettings();
            this._frontWheel = new WheelSettings(0);
            this._rearWheel = new WheelSettings(1);
            this._motor = new MotorSettings();
        }
        Object.defineProperty(BikeSettings.prototype, "tilt", {
            get: function () { return this._tilt; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BikeSettings.prototype, "body", {
            get: function () { return this._body; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BikeSettings.prototype, "frontWheel", {
            get: function () { return this._frontWheel; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BikeSettings.prototype, "rearWheel", {
            get: function () { return this._rearWheel; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BikeSettings.prototype, "motor", {
            get: function () { return this._motor; },
            enumerable: true,
            configurable: true
        });
        BikeSettings.prototype.reset = function () {
            this._tilt.reset();
            this._body.reset();
            this._frontWheel.reset();
            this._rearWheel.reset();
            this._motor.reset();
        };
        BikeSettings.prototype.load = function () {
            this._tilt.load();
            this._body.load();
            this._frontWheel.load();
            this._rearWheel.load();
            this._motor.load();
        };
        BikeSettings.prototype.save = function () {
            this._tilt.save();
            this._body.save();
            this._frontWheel.save();
            this._rearWheel.save();
            this._motor.save();
        };
        return BikeSettings;
    }());
    PhySettings.BikeSettings = BikeSettings;
    var GroundSettings = (function () {
        function GroundSettings() {
            var defSet = WorldGround.Physics.settings[0];
            this._friction = new SettingVal(defSet.friction, 0.1, 1, 0.05);
            this._restitution = new SettingVal(defSet.restitution, 0, 1, 0.05);
        }
        Object.defineProperty(GroundSettings.prototype, "friction", {
            get: function () { return this._friction; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GroundSettings.prototype, "restitution", {
            get: function () { return this._restitution; },
            enumerable: true,
            configurable: true
        });
        GroundSettings.prototype.reset = function () {
            this._friction.resetNewValue();
            this._restitution.resetNewValue();
        };
        GroundSettings.prototype.load = function () {
            this._friction.newValue = parseFloat(localStorage.getItem("groundFric"));
            this._restitution.newValue = parseFloat(localStorage.getItem("groundRest"));
        };
        GroundSettings.prototype.save = function () {
            localStorage.setItem("groundFric", this._friction.newValue.toString());
            localStorage.setItem("groundRest", this._restitution.newValue.toString());
        };
        return GroundSettings;
    }());
    PhySettings.GroundSettings = GroundSettings;
    var Settings = (function () {
        function Settings() {
            this._gravity = new SettingVal(Game.Global.game.physics.box2d.gravity.y, 100, 1000, 10);
            this._ground = new GroundSettings();
            this._bike = new BikeSettings();
        }
        Object.defineProperty(Settings.prototype, "gravity", {
            get: function () { return this._gravity; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "ground", {
            get: function () { return this._ground; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "bike", {
            get: function () { return this._bike; },
            enumerable: true,
            configurable: true
        });
        Settings.prototype.apply = function () {
            var box2d = Game.Global.game.physics.box2d;
            if (this._gravity.isNewValue)
                box2d.gravity.y = this._gravity.applyNewValue();
            Gameplay.Gameplay.instance.worldView.ground.physics.applySettings(this._ground);
        };
        Settings.prototype.reset = function () {
            this._gravity.resetNewValue();
            this._ground.reset();
            this._bike.reset();
        };
        Settings.prototype.load = function () {
            this._gravity.newValue = parseInt(localStorage.getItem("gravity"));
            this._ground.load();
            this._bike.load();
        };
        Settings.prototype.save = function () {
            localStorage.setItem("gravity", this._gravity.newValue.toString());
            this._ground.save();
            this._bike.save();
        };
        return Settings;
    }());
    PhySettings.Settings = Settings;
})(PhySettings || (PhySettings = {}));
var Game;
(function (Game) {
    ;
    var Sounds = (function () {
        function Sounds() {
        }
        Sounds.AUDIO_JSON = {
            "resources": [
                "sfx.ogg",
                "sfx.mp3"
            ],
            "spritemap": {
                "applause": {
                    "start": 0,
                    "end": 1.9610430839002269,
                    "loop": false
                },
                "click": {
                    "start": 3,
                    "end": 3.078888888888889,
                    "loop": false
                },
                "countdown1": {
                    "start": 5,
                    "end": 5.414852607709751,
                    "loop": false
                },
                "countdown2": {
                    "start": 7,
                    "end": 7.470408163265306,
                    "loop": false
                },
                "crash": {
                    "start": 9,
                    "end": 10.452925170068028,
                    "loop": false
                },
                "earnPoints": {
                    "start": 12,
                    "end": 13.36,
                    "loop": false
                },
                "engineAcceleration": {
                    "start": 15,
                    "end": 19.629319727891158,
                    "loop": false
                },
                "engineIdle": {
                    "start": 21,
                    "end": 26.32265306122449,
                    "loop": false
                },
                "flatTire": {
                    "start": 28,
                    "end": 29.45485260770975,
                    "loop": false
                },
                "impact": {
                    "start": 31,
                    "end": 32.144625850340134,
                    "loop": false
                },
                "nitro": {
                    "start": 34,
                    "end": 35.88081632653061,
                    "loop": false
                },
                "pickupCoin": {
                    "start": 37,
                    "end": 38.01539682539683,
                    "loop": false
                },
                "powerupBreak": {
                    "start": 40,
                    "end": 40.51195011337869,
                    "loop": false
                },
                "powerupUnlock": {
                    "start": 42,
                    "end": 44.77315192743764,
                    "loop": false
                },
                "purchase1": {
                    "start": 46,
                    "end": 47.550657596371884,
                    "loop": false
                },
                "purchase2": {
                    "start": 49,
                    "end": 49.61725623582767,
                    "loop": false
                }
            }
        };
        return Sounds;
    }());
    Game.Sounds = Sounds;
})(Game || (Game = {}));

