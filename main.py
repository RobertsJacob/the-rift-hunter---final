namespace SpriteKind {
    export const Decoration = SpriteKind.create()
    export const PowerPotion = SpriteKind.create()
    export const HealPotion = SpriteKind.create()
    export const PLasmaRefil = SpriteKind.create()
    export const NPC = SpriteKind.create()
}
function Start_Level () {
    i = 0
    Dialougs = [
    "hELLO",
    "You are very stinky",
    "eee",
    "rr",
    "rerere",
    "rererererere"
    ]
    Game_Active = 0
    Rift_Locations = []
    music.stopAllSounds()
    music.play(music.createSong(assets.song`In game 1`), music.PlaybackMode.LoopingInBackground)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    Game_Active = 1
    player1 = sprites.create(assets.image`Rift Hunter`, SpriteKind.Player)
    DirectionArow = sprites.create(assets.image`Left`, SpriteKind.Player)
    Chooose_Island()
    Finish_Islands()
    tiles.placeOnRandomTile(player1, sprites.castle.tileDarkGrass2)
    Spawn_Rifts()
    info.setLife(5)
    MovmentDisable = 0
    scene.cameraFollowSprite(player1)
    Difficulty += 1
    if (Difficulty > DIFFICULTY_CAP) {
        Talo_Spawn_Time = 500
    } else if (Difficulty > 5) {
        Talo_Spawn_Time = 900
    } else {
        Talo_Spawn_Time = 3000
    }
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite5, otherSprite4) {
    sprites.destroy(sprite5, effects.rings, 100)
    sprites.destroy(otherSprite4, effects.fire, 100)
    if (Math.percentChance(20)) {
        Power_Potion = sprites.create(assets.image`Power Potion`, SpriteKind.PowerPotion)
        tiles.placeOnTile(Power_Potion, otherSprite4.tilemapLocation())
    } else {
        Plasma_Refil = sprites.create(assets.image`PlasmaRefil`, SpriteKind.PLasmaRefil)
        tiles.placeOnTile(Plasma_Refil, otherSprite4.tilemapLocation())
    }
})
function tick () {
    if (Player_Powered == 1) {
        controller.moveSprite(player1, 100, 100)
    } else if (Invincibility == 1) {
        controller.moveSprite(player1, 0, 0)
        player1.setVelocity(HIT_movement, HIT_movement)
    } else if (MovmentDisable == 1) {
        controller.moveSprite(player1, 0, 0)
    } else {
        controller.moveSprite(player1, 60, 60)
    }
    if (Game_Active == 0) {
        player1.setFlag(SpriteFlag.Invisible, true)
    } else {
        player1.setFlag(SpriteFlag.Invisible, false)
    }
    console.log(Game_Active)
}
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (Player_Powered == 1) {
        if (tiles.tileAtLocationEquals(location, assets.tile`Wall0`)) {
            music.play(music.createSoundEffect(WaveShape.Triangle, 1583, 1, 219, 56, 100, SoundExpressionEffect.Warble, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
            tiles.setTileAt(location, assets.tile`Wall Destroy`)
            tiles.setWallAt(location, false)
        }
        if (tiles.tileAtLocationEquals(location, assets.tile`Wall Broke 1`)) {
            music.play(music.createSoundEffect(WaveShape.Triangle, 1583, 1, 219, 56, 100, SoundExpressionEffect.Warble, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
            tiles.setTileAt(location, assets.tile`Wall Destroy`)
            tiles.setWallAt(location, false)
        }
    }
})
function Spawn_Enemy () {
    if (tiles.getTilesByType(assets.tile`Corrupted rock`).length > 0) {
        Talo = sprites.create(assets.image`Ialo R`, SpriteKind.Enemy)
        tiles.placeOnRandomTile(Talo, assets.tile`Corrupted rock`)
        Talo.follow(player1, 30)
    }
}
// LALALALALALLALA
sprites.onOverlap(SpriteKind.Player, SpriteKind.NPC, function (sprite, otherSprite) {
    if (i > Dialougs.length) {
        i = 0
    } else {
        i += 1
    }
    tiles.placeOnTile(player1, otherSprite.tilemapLocation().getNeighboringLocation(CollisionDirection.Left))
    if (true) {
    	
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Skip == 0) {
        Skip = 1
    }
})
controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Player_Powered == 1) {
        animation.runImageAnimation(
        player1,
        assets.animation`Rift Hunter Player Small - idle2`,
        100,
        true
        )
        animation.runImageAnimation(
        player1,
        assets.animation`Rift Hunter Player Small - idle2`,
        100,
        true
        )
    } else if (Invincibility == 1) {
    	
    } else {
        animation.runImageAnimation(
        player1,
        assets.animation`Rift Hunter Player Small - Walk`,
        200,
        true
        )
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Game_Active == 1) {
        if (PLasmaAmount > 0) {
            music.play(music.createSoundEffect(WaveShape.Triangle, 825, 1, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        }
        if (Player_Direction == "Right") {
            Plasma = sprites.createProjectileFromSprite(assets.image`Plasma Ball`, player1, 50, 0)
        } else if (Player_Direction == "Left") {
            Plasma = sprites.createProjectileFromSprite(assets.image`Plasma Ball`, player1, -50, 0)
        } else if (Player_Direction == "Down") {
            Plasma = sprites.createProjectileFromSprite(assets.image`Plasma Ball`, player1, 0, 50)
        } else if (Player_Direction == "Up") {
            Plasma = sprites.createProjectileFromSprite(assets.image`Plasma Ball`, player1, 0, -50)
        }
        PLasmaAmount += -1
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite2, otherSprite) {
    if (Player_Powered == 1) {
        sprites.destroy(otherSprite, effects.fire, 500)
        info.changeCountdownBy(-1)
    } else {
        HurtPLayer()
        sprites.destroy(otherSprite)
    }
})
controller.anyButton.onEvent(ControllerButtonEvent.Released, function () {
    if (!(controller.anyButton.isPressed())) {
        if (Player_Powered == 1) {
            animation.runImageAnimation(
            player1,
            assets.animation`Rift Hunter Player Small - idle1`,
            100,
            true
            )
        } else {
            animation.runImageAnimation(
            player1,
            assets.animation`Rift Hunter Player Small - idle`,
            1000,
            true
            )
        }
    }
})
function PowerPlayer () {
    Player_Powered = 1
    animation.runImageAnimation(
    player1,
    assets.animation`Rift Hunter Player Small - idle1`,
    100,
    true
    )
    scene.cameraShake(4, 500)
    info.startCountdown(10)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`Corrupted rock`, function (sprite, location) {
    if (controller.B.isPressed() && Player_Powered == 1) {
        let list: tiles.Location[] = []
        list.removeAt(list.indexOf(location))
        tiles.setTileAt(location, assets.tile`Rock2`)
        if (tiles.getTilesByType(assets.tile`Corrupted rock`).length <= 0) {
            CloseRiftAni = sprites.create(assets.image`rift small`, SpriteKind.Food)
            tiles.placeOnTile(CloseRiftAni, location)
            animation.runImageAnimation(
            CloseRiftAni,
            assets.animation`RiftClose`,
            100,
            false
            )
            music.play(music.createSoundEffect(WaveShape.Noise, 1449, 1, 255, 0, 1000, SoundExpressionEffect.Tremolo, InterpolationCurve.Logarithmic), music.PlaybackMode.UntilDone)
        } else {
            CloseRiftAni = sprites.create(assets.image`rift small`, SpriteKind.Food)
            tiles.placeOnTile(CloseRiftAni, location)
            animation.runImageAnimation(
            CloseRiftAni,
            assets.animation`RiftClose`,
            100,
            false
            )
        }
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Decoration, function (sprite, otherSprite) {
    if (controller.B.isPressed() && Player_Powered == 1) {
        sprites.destroy(otherSprite)
    }
})
function Spash_Text (text: string, text2: string) {
    if (Game_Active == 0) {
        game.splash(text, text2)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.PowerPotion, function (sprite22, otherSprite3) {
    Powerup_on_screen += -1
    PowerPlayer()
    sprites.destroy(otherSprite3, effects.confetti, 500)
})
info.onCountdownEnd(function () {
    Player_Powered = 0
    animation.runImageAnimation(
    player1,
    assets.animation`Rift Hunter Player Small - idle`,
    1000,
    true
    )
})
scene.onHitWall(SpriteKind.Projectile, function (sprite4, location2) {
    if (tiles.tileAtLocationEquals(location2, assets.tile`Wall0`)) {
        music.play(music.createSoundEffect(WaveShape.Noise, 4561, 1263, 205, 64, 141, SoundExpressionEffect.Tremolo, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
        sprites.destroy(sprite4, effects.none, 0)
        tiles.setTileAt(location2, assets.tile`Wall Broke 1`)
    } else if (tiles.tileAtLocationEquals(location2, assets.tile`Wall Broke 1`)) {
        music.play(music.createSoundEffect(WaveShape.Triangle, 1583, 1, 219, 56, 100, SoundExpressionEffect.Warble, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        sprites.destroy(sprite4, effects.none, 0)
        tiles.setTileAt(location2, assets.tile`Wall Destroy`)
        tiles.setWallAt(location2, false)
        if (Math.percentChance(20)) {
            Power_Potion = sprites.create(assets.image`Power Potion`, SpriteKind.PowerPotion)
            tiles.placeOnTile(Power_Potion, location2)
        }
    }
})
function HurtPLayer () {
    HIT_movement = 30
    if (Invincibility == 0) {
        Invincibility = 1
        info.changeLifeBy(-1)
        animation.runImageAnimation(
        player1,
        assets.animation`Rift Hunter Player Small - idle3`,
        100,
        false
        )
        music.play(music.createSoundEffect(WaveShape.Noise, 2563, 0, 255, 0, 500, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.UntilDone)
        Invincibility = 0
    }
}
function Spawn_Rifts () {
    while (Rift_Number <= Difficulty) {
        if (Game_Active == 1) {
            MovmentDisable = 1
            Rift = sprites.create(assets.image`rift small`, SpriteKind.Decoration)
            tiles.placeOnRandomTile(Rift, assets.tile`Rock`)
            scene.cameraFollowSprite(Rift)
            tiles.setTileAt(Rift.tilemapLocation(), assets.tile`Corrupted rock`)
            Rift_Number += 1
            Rift_Locations.push(Rift.tilemapLocation())
            animation.runImageAnimation(
            Rift,
            assets.animation`RiftOpen`,
            100,
            false
            )
            music.play(music.createSoundEffect(WaveShape.Noise, 646, 1, 255, 0, 800, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.UntilDone)
            animation.runImageAnimation(
            Rift,
            assets.animation`RiftIdle`,
            100,
            true
            )
            pause(800)
            console.log(Rift_Locations)
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.HealPotion, function (sprite22, otherSprite3) {
    Powerup_on_screen += -1
    info.changeLifeBy(1)
    sprites.destroy(otherSprite3)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.PLasmaRefil, function (sprite22, otherSprite3) {
    PLasmaAmount += randint(1, 2)
    sprites.destroy(otherSprite3)
})
function Finish_Islands () {
    Tile_Y = 0
    for (let index = 0; index < 16; index++) {
        Tile_X = 0
        for (let index = 0; index < 16; index++) {
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`myTile6`) || (tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`myTile8`) || tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`myTile7`))) {
                tiles.setWallAt(tiles.getTileLocation(Tile_X, Tile_Y), true)
            }
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`Rock`)) {
                if (randint(0, 10) == 10) {
                    tiles.setTileAt(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`Wall0`)
                    tiles.setWallAt(tiles.getTileLocation(Tile_X, Tile_Y), true)
                }
            }
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`WallWater`)) {
                tiles.setWallAt(tiles.getTileLocation(Tile_X, Tile_Y), true)
                if (randint(0, 10) == 10) {
                    tiles.setTileAt(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`Water2`)
                }
            }
            Tile_X += 1
        }
        Tile_Y += 1
    }
}
function Tutorial () {
    Game_Active = 0
    Rift_Locations = []
    music.stopAllSounds()
    music.play(music.createSong(assets.song`In game 1`), music.PlaybackMode.LoopingInBackground)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    Game_Active = 1
    player1 = sprites.create(assets.image`Rift Hunter`, SpriteKind.Player)
    DirectionArow = sprites.create(assets.image`Left`, SpriteKind.Player)
    tiles.setCurrentTilemap(tilemap`Tutorial0`)
    Finish_Islands()
    tiles.placeOnRandomTile(player1, sprites.castle.tileDarkGrass2)
    info.setLife(5)
    MovmentDisable = 0
    scene.cameraFollowSprite(player1)
    Villager = sprites.create(assets.image`Villager`, SpriteKind.NPC)
    tiles.placeOnRandomTile(Villager, assets.tile`RockVillager`)
}
function Intro_Movie () {
    color.setPalette(
    color.originalPalette
    )
    scene.setBackgroundImage(assets.image`Tile Screen Old`)
    music.stopAllSounds()
    music.play(music.createSong(assets.song`MovieTheme`), music.PlaybackMode.LoopingInBackground)
    scene.setBackgroundImage(assets.image`intro`)
    Spash_Text("The Great Kingdom of Rason", "Was A peacful place")
    Spash_Text("But that all changed", "when The Talos Came")
    Rift = sprites.create(assets.image`rift small`, SpriteKind.Projectile)
    Rift.setPosition(32, 82)
    animation.runImageAnimation(
    Rift,
    assets.animation`RiftOpen`,
    100,
    false
    )
    music.play(music.createSoundEffect(WaveShape.Noise, 646, 1, 255, 0, 800, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.UntilDone)
    animation.runImageAnimation(
    Rift,
    assets.animation`RiftIdle`,
    100,
    true
    )
    for (let index = 0; index < 4; index++) {
        Talo = sprites.create(assets.image`Ialo R`, SpriteKind.Projectile)
        Talo.setPosition(32, randint(77, 93))
        Talo.setVelocity(100, randint(0, 20))
        pause(randint(50, 200))
    }
    for (let index = 0; index < 2; index++) {
        pause(randint(50, 200))
        Rift = sprites.create(assets.image`rift small`, SpriteKind.Projectile)
        Rift.setPosition(randint(0, 160), randint(0, 60))
        animation.runImageAnimation(
        Rift,
        assets.animation`RiftOpen`,
        100,
        false
        )
        music.play(music.createSoundEffect(WaveShape.Noise, 646, 1, 255, 0, 800, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.UntilDone)
        animation.runImageAnimation(
        Rift,
        assets.animation`RiftIdle`,
        100,
        true
        )
    }
    for (let index = 0; index < 4; index++) {
        Talo = sprites.create(assets.image`Ialo R`, SpriteKind.Projectile)
        Talo.setPosition(32, randint(77, 93))
        Talo.setVelocity(100, randint(0, 20))
        pause(randint(50, 200))
    }
    pause(2000)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    Spash_Text("They came from the rifts", "Spreading Chaos all over")
    Spash_Text("And it is your job", "To stop them")
    Spash_Text("As...", "THE RIFT HUNTER")
    Tutorial()
}
function Chooose_Island () {
    Island = randint(1, 6)
    if (Island == 1) {
        tiles.setCurrentTilemap(tilemap`Island 1`)
    } else if (Island == 2) {
        tiles.setCurrentTilemap(tilemap`Island2`)
    } else if (Island == 3) {
        tiles.setCurrentTilemap(tilemap`Island 3`)
    } else if (Island == 4) {
        tiles.setCurrentTilemap(tilemap`Island5`)
    } else if (Island == 5) {
        tiles.setCurrentTilemap(tilemap`Island 6`)
    } else {
        tiles.setCurrentTilemap(tilemap`Island 4`)
    }
}
function SpawnPowerups (Powers_alowed: number) {
    for (let index = 0; index < Powers_alowed; index++) {
        if (Powerup_on_screen == Powers_alowed) {
            break;
        }
        if (randint(1, 5) == 1) {
            Power_Potion = sprites.create(assets.image`Power Potion`, SpriteKind.PowerPotion)
            tiles.placeOnRandomTile(Power_Potion, assets.tile`Rock`)
        } else if (randint(1, 2) == 1) {
            Heal_Potion = sprites.create(assets.image`Healpotion`, SpriteKind.HealPotion)
            animation.runImageAnimation(
            Heal_Potion,
            assets.animation`Life`,
            80,
            true
            )
            tiles.placeOnRandomTile(Heal_Potion, assets.tile`Rock`)
        }
    }
    Powerup_on_screen += 1
}
function New_Level () {
    game.splash("")
    MovmentDisable = 1
    Rift = sprites.create(assets.image`rift small`, SpriteKind.Decoration)
    scene.cameraFollowSprite(Rift)
    tiles.placeOnRandomTile(Rift, assets.tile`Rock`)
    animation.runImageAnimation(
    Rift,
    assets.animation`RiftOpen`,
    100,
    false
    )
    music.play(music.createSoundEffect(WaveShape.Noise, 646, 1, 255, 0, 800, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.UntilDone)
    animation.runImageAnimation(
    Rift,
    assets.animation`RiftIdle`,
    100,
    true
    )
    pause(800)
}
let Heal_Potion: Sprite = null
let Island = 0
let Villager: Sprite = null
let Tile_X = 0
let Tile_Y = 0
let Rift: Sprite = null
let Powerup_on_screen = 0
let CloseRiftAni: Sprite = null
let Plasma: Sprite = null
let Player_Direction = ""
let Talo: Sprite = null
let HIT_movement = 0
let Invincibility = 0
let Player_Powered = 0
let Plasma_Refil: Sprite = null
let Power_Potion: Sprite = null
let Talo_Spawn_Time = 0
let DirectionArow: Sprite = null
let Dialougs: string[] = []
let i = 0
let Skip = 0
let Game_Active = 0
let MovmentDisable = 0
let Rift_Locations: tiles.Location[] = []
let PLasmaAmount = 0
let Rift_Number = 0
let Difficulty = 0
let DIFFICULTY_CAP = 0
let player1: Sprite = null
player1 = sprites.create(assets.image`Rift Hunter`, SpriteKind.Player)
let RiftCloseTime = 0
let RiftPLayerOn = 0
DIFFICULTY_CAP = 10
Difficulty = 1
Rift_Number = 0
PLasmaAmount = 20
Rift_Locations = []
music.play(music.createSong(assets.song`Main Theme`), music.PlaybackMode.LoopingInBackground)
Rift_Number = 1
MovmentDisable = 0
Game_Active = 0
Skip = 0
scene.setBackgroundImage(assets.image`Tile Screen New`)
tick()
pauseUntil(() => controller.A.isPressed())
pauseUntil(() => !(controller.A.isPressed()))
scene.setBackgroundImage(assets.image`Tutorial ask`)
pauseUntil(() => controller.A.isPressed() || controller.B.isPressed())
music.stopAllSounds()
color.FadeToBlack.startScreenEffect(300)
music.play(music.createSoundEffect(WaveShape.Noise, 5000, 1, 255, 0, 1200, SoundExpressionEffect.Tremolo, InterpolationCurve.Logarithmic), music.PlaybackMode.UntilDone)
if (Skip == 0) {
    pause(100)
    color.clearFadeEffect()
    Intro_Movie()
} else {
    color.clearFadeEffect()
    Start_Level()
}
game.onUpdate(function () {
    tick()
})
game.onUpdate(function () {
    info.setScore(PLasmaAmount)
})
game.onUpdate(function () {
    if (controller.left.isPressed()) {
        Player_Direction = "Left"
        DirectionArow.setImage(assets.image`Left`)
    } else if (controller.right.isPressed()) {
        Player_Direction = "Right"
        DirectionArow.setImage(assets.image`Right`)
    } else if (controller.up.isPressed()) {
        Player_Direction = "Up"
        DirectionArow.setImage(assets.image`Up`)
    } else if (controller.down.isPressed()) {
        Player_Direction = "Down"
        DirectionArow.setImage(assets.image`Down`)
    }
    DirectionArow.setPosition(player1.x, player1.y)
})
game.onUpdateInterval(Talo_Spawn_Time, function () {
    Spawn_Enemy()
})
game.onUpdateInterval(10000, function () {
    if (Game_Active == 1) {
        SpawnPowerups(1)
    }
})
