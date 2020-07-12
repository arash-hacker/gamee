var app = app || {}
app.objects = app.objects || {}

app.objects.Sound = function(state) {
    this.state = state
    this.create()
}

app.objects.Sound.prototype.create = function() {
    if(app.isCustom) {
        this.sound = this.state.add.sprite(this.state.game.width - 20 - 42, 20, 'sound')
        this.sound.inputEnabled = true
        this.sound.events.onInputDown.add(this.toggle, this)
    }
    
    app.snd.music && app.snd.music.stop()
    app.snd.music = this.state.game.add.audio('music')
    app.snd.music.volume = 0
    app.settings.isSoundMuted ? this.mute() : this.unmute()
}

app.objects.Sound.prototype.toggle = function() {
    app.settings.isSoundMuted ? this.unmute() : this.mute()
}

app.objects.Sound.prototype.mute = function() {
    app.settings.isSoundMuted = true
    if(app.isCustom) this.sound.frame = 1
    app.snd.music.fadeOut()
    this.state.player.mute()
}
app.objects.Sound.prototype.unmute = function() {
    app.settings.isSoundMuted = false
    if(app.isCustom) this.sound.frame = 0
    app.snd.music.volume = app.settings.musicVolume
    app.snd.music.fadeIn(1000, true)
    this.state.player.unmute()
}

