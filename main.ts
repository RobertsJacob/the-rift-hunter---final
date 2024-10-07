namespace SpriteKind {
    export const Decoration = SpriteKind.create()
    export const PowerPotion = SpriteKind.create()
    export const HealPotion = SpriteKind.create()
    export const PLasmaRefil = SpriteKind.create()
    export const NPC = SpriteKind.create()
    export const Other = SpriteKind.create()
}
function Start_Level () {
    info.startCountdown(0)
    In_Tutorial = 0
    color.clearFadeEffect()
    Game_Active = 0
    music.stopAllSounds()
    music.play(music.createSong(assets.song`In game 1`), music.PlaybackMode.LoopingInBackground)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Other)
    sprites.destroyAllSpritesOfKind(SpriteKind.NPC)
    player1 = sprites.create(assets.image`Rift Hunter`, SpriteKind.Player)
    DirectionArow = sprites.create(assets.image`Left`, SpriteKind.Player)
    Level += 1
    Chooose_Island()
    Finish_Islands()
    tiles.placeOnRandomTile(player1, sprites.castle.tileDarkGrass2)
    Spawn_Rifts()
    Game_Active = 1
    info.setLife(4)
    MovmentDisable = 0
    scene.cameraFollowSprite(player1)
    if (Level > DIFFICULTY_CAP - 3) {
        game.splash("Be Wary Hunter", "The Rifts Are Strong here")
        Talo_Spawn_Time = 900
    } else if (Level > DIFFICULTY_CAP - 4) {
        Talo_Spawn_Time = 1500
    } else {
        Talo_Spawn_Time = 3000
    }
}
function Game_Over () {
    if (Talos_Defeated > High_score) {
        High_score = Talos_Defeated
    }
    Game_Active = 0
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    sprites.destroyAllSpritesOfKind(SpriteKind.Other)
    timer.after(100, function () {
        music.stopAllSounds()
        Fake_PLayer = sprites.create(assets.image`Rift Hunter`, SpriteKind.Other)
        Fake_PLayer.setPosition(player1.x, player1.y)
        color.FadeToBlack.startScreenEffect(5000)
        animation.runImageAnimation(
        Fake_PLayer,
        assets.animation`Death`,
        100,
        false
        )
        timer.after(2000, function () {
            music.play(music.createSong(assets.song`Game Over`), music.PlaybackMode.LoopingInBackground)
            info.setScore(Talos_Defeated)
            game.splash("You have been Defeated", "Level: " + Level + " Reached " + Talos_Defeated + ": Talos Defeated " + High_score + ": High Score")
            timer.after(3000, function () {
                game.reset()
            })
        })
    })
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite5, otherSprite4) {
    sprites.destroy(sprite5, effects.rings, 100)
    sprites.destroy(otherSprite4, effects.fire, 100)
    if (!(In_Tutorial == 1)) {
        if (Math.percentChance(20)) {
            Power_Potion = sprites.create(assets.image`Power Potion`, SpriteKind.PowerPotion)
            tiles.placeOnTile(Power_Potion, otherSprite4.tilemapLocation())
        } else {
            Plasma_Refil = sprites.create(assets.image`PlasmaRefil`, SpriteKind.PLasmaRefil)
            tiles.placeOnTile(Plasma_Refil, otherSprite4.tilemapLocation())
        }
        Talos_Defeated += 1
    } else {
        Power_Potion = sprites.create(assets.image`Power Potion`, SpriteKind.PowerPotion)
        tiles.placeOnTile(Power_Potion, otherSprite4.tilemapLocation())
        pauseUntil(() => !(controller.anyButton.isPressed()))
        game.showLongText("Quick! Grab the potion and close the portal", DialogLayout.Bottom)
        timer.after(10000, function () {
            if (!(Game_Active == 0)) {
                game.splash("Ok, your taking too long")
                Game_Over()
            }
        })
    }
})
function tick () {
    if (Player_Powered == 1) {
        if (!(MovmentDisable == 1)) {
            controller.moveSprite(player1, 100, 100)
        } else {
            controller.moveSprite(player1, 0, 0)
        }
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
            music.play(music.createSoundEffect(WaveShape.Noise, 646, 1, 255, 255, 100, SoundExpressionEffect.Vibrato, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
            tiles.setTileAt(location, assets.tile`Wall Destroy`)
            tiles.setWallAt(location, false)
        }
        if (tiles.tileAtLocationEquals(location, assets.tile`Wall Broke 1`)) {
            music.play(music.createSoundEffect(WaveShape.Noise, 646, 1, 205, 255, 100, SoundExpressionEffect.Vibrato, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
            tiles.setTileAt(location, assets.tile`Wall Destroy`)
            tiles.setWallAt(location, false)
        }
    }
})
function Spawn_Enemy () {
    if (Rift_Number > 0 && Game_Active == 1) {
        Talo = sprites.create(assets.image`Talo R`, SpriteKind.Enemy)
        tiles.placeOnRandomTile(Talo, assets.tile`Corrupted rock`)
        Talo.follow(player1, 30)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.NPC, function (sprite, otherSprite) {
    if (Dialougs == 1) {
        MovmentDisable = 1
        tiles.placeOnTile(player1, tiles.getTileLocation(3, 12))
        Dialougs = 0
        music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
        game.splash("Please HELP dear Rift Hunter", "There is somthing ahead")
        game.splash("I'll Give you some CHARGES", "to break those blocks")
        PLasmaAmount = 20
        game.showLongText("Press A to shoot a plasma Charge. The counter in the top right tells you how many you have. But be carful not to run out", DialogLayout.Bottom)
        MovmentDisable = 0
    } else {
        tiles.placeOnTile(player1, tiles.getTileLocation(3, 13))
        game.splash("Break the blocks", "with those CHARGES I gave you")
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
scene.onOverlapTile(SpriteKind.Player, assets.tile`TriggerRock`, function (sprite, location) {
    MovmentDisable = 1
    tiles.placeOnTile(player1, tiles.getTileLocation(3, 5))
    tiles.setWallAt(tiles.getTileLocation(2, 7), true)
    tiles.setWallAt(tiles.getTileLocation(3, 7), true)
    tiles.setWallAt(tiles.getTileLocation(4, 7), true)
    timer.after(10, function () {
        Rift = sprites.create(assets.image`rift small`, SpriteKind.Decoration)
        tiles.placeOnTile(Rift, tiles.getTileLocation(8, 4))
        scene.cameraFollowSprite(Rift)
        tiles.setTileAt(Rift.tilemapLocation(), assets.tile`Corrupted rock`)
        animation.runImageAnimation(
        Rift,
        assets.animation`RiftOpen`,
        100,
        false
        )
        music.play(music.createSoundEffect(WaveShape.Noise, 646, 1, 255, 0, 800, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        animation.runImageAnimation(
        Rift,
        assets.animation`RiftIdle`,
        100,
        true
        )
        music.play(music.createSoundEffect(WaveShape.Sine, 1, 1, 0, 0, 1000, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.UntilDone)
        timer.after(1200, function () {
            MovmentDisable = 0
            scene.cameraFollowSprite(player1)
            pauseUntil(() => !(controller.A.isPressed()))
            PLasmaAmount = 20
            game.showLongText("This is a RIFT, evil TALOS will spawn and try to hurt you. To stop them, shoot a CHARGE at them.", DialogLayout.Bottom)
            Talo = sprites.create(assets.image`Talo R`, SpriteKind.Enemy)
            tiles.placeOnRandomTile(Talo, assets.tile`Corrupted rock`)
            Talo.setVelocity(-29, -13)
            timer.after(1000, function () {
                Talo.setVelocity(-8, 6)
            })
        })
    })
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Game_Active == 1) {
        if (PLasmaAmount > 0) {
            music.play(music.createSoundEffect(WaveShape.Triangle, 825, 1, 255, 0, 150, SoundExpressionEffect.Vibrato, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
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
function UnPower_player () {
    Player_Powered = 0
    animation.runImageAnimation(
    player1,
    assets.animation`Rift Hunter Player Small - idle`,
    1000,
    true
    )
}
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
    if (Game_Active == 1) {
        if (Player_Powered == 1) {
            tiles.setTileAt(location, assets.tile`Rock`)
            Rift_Number += -1
            if (Rift_Number > 0) {
                CloseRiftAni = sprites.create(assets.image`rift small`, SpriteKind.Food)
                tiles.placeOnTile(CloseRiftAni, location)
                animation.runImageAnimation(
                CloseRiftAni,
                assets.animation`RiftClose`,
                100,
                false
                )
                music.play(music.createSoundEffect(WaveShape.Noise, 1449, 1, 255, 0, 1000, SoundExpressionEffect.Tremolo, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
                timer.after(800, function () {
                    info.changeCountdownBy(-7)
                    sprites.destroy(CloseRiftAni)
                })
            } else {
                Game_Active = 0
                CloseRiftAni = sprites.create(assets.image`rift small`, SpriteKind.Other)
                tiles.placeOnTile(CloseRiftAni, location)
                animation.runImageAnimation(
                CloseRiftAni,
                assets.animation`RiftClose`,
                100,
                false
                )
                music.stopAllSounds()
                music.play(music.createSong(assets.song`WinTheme`), music.PlaybackMode.InBackground)
                MovmentDisable = 1
                sprites.destroyAllSpritesOfKind(SpriteKind.Decoration)
                sprites.destroyAllSpritesOfKind(SpriteKind.Player)
                sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
                sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
                UnPower_player()
                Fake_PLayer = sprites.create(assets.image`Rift Hunter`, SpriteKind.Other)
                tiles.placeOnTile(Fake_PLayer, location)
                timer.after(3000, function () {
                    if (In_Tutorial == 0) {
                        if (Level >= DIFFICULTY_CAP) {
                            if (Talos_Defeated > High_score) {
                                High_score = Talos_Defeated
                            }
                            info.setScore(Talos_Defeated)
                            game.setGameOverMessage(true, "" + High_score + ": High Score")
                            Fake_PLayer = sprites.create(assets.image`Rift Hunter`, SpriteKind.Other)
                            Fake_PLayer.setPosition(player1.x, player1.y)
                            animation.runImageAnimation(
                            Fake_PLayer,
                            assets.animation`Rift Hunter Big Power`,
                            100,
                            true
                            )
                            game.gameOver(true)
                        } else if (Level < 2) {
                            Talo_Spawn_Time = 2000
                            game.splash("Congrats! But Another", "island Needs Your Help")
                        } else {
                            if (randint(1, 2) == 2) {
                                game.splash("Your Getting good", "At this hunter!")
                            } else {
                                if (randint(1, 2) == 2) {
                                    game.splash("" + Level + " Rifts already?", "Good Job!")
                                } else {
                                    game.splash("Great Job Hunter", "Keep Going")
                                }
                            }
                        }
                        color.FadeToBlack.startScreenEffect(1000)
                        music.play(music.createSoundEffect(WaveShape.Noise, 1, 5000, 255, 0, 2000, SoundExpressionEffect.Warble, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
                        Fake_PLayer.setVelocity(50, 50)
                        timer.after(2100, function () {
                            Start_Level()
                        })
                    } else {
                        game.splash("You are now ready")
                        game.reset()
                    }
                })
            }
        }
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Decoration, function (sprite, otherSprite) {
    if (Player_Powered == 1) {
        sprites.destroy(otherSprite)
        info.changeCountdownBy(-7)
    }
})
function Spash_Text (text: string, text2: string) {
    if (Game_Active == 0) {
        game.splash(text, text2)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.PowerPotion, function (sprite22, otherSprite3) {
    music.play(music.createSoundEffect(WaveShape.Square, 1449, 1, 255, 0, 1000, SoundExpressionEffect.Warble, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
    Powerup_on_screen += -1
    PowerPlayer()
    sprites.destroy(otherSprite3, effects.confetti, 500)
})
info.onCountdownEnd(function () {
    UnPower_player()
})
scene.onHitWall(SpriteKind.Projectile, function (sprite4, location2) {
    if (tiles.tileAtLocationEquals(location2, assets.tile`Wall0`)) {
        music.play(music.createSoundEffect(WaveShape.Noise, 646, 513, 205, 0, 300, SoundExpressionEffect.Vibrato, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        sprites.destroy(sprite4, effects.none, 0)
        tiles.setTileAt(location2, assets.tile`Wall Broke 1`)
    } else if (tiles.tileAtLocationEquals(location2, assets.tile`Wall Broke 1`)) {
        music.play(music.createSoundEffect(WaveShape.Noise, 2965, 1, 255, 255, 300, SoundExpressionEffect.Vibrato, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        sprites.destroy(sprite4, effects.none, 0)
        tiles.setTileAt(location2, assets.tile`Wall Destroy`)
        tiles.setWallAt(location2, false)
        if (!(In_Tutorial == 1)) {
            if (Math.percentChance(20)) {
                Power_Potion = sprites.create(assets.image`Power Potion`, SpriteKind.PowerPotion)
                tiles.placeOnTile(Power_Potion, location2)
            } else if (Math.percentChance(50)) {
                Heal_Potion = sprites.create(assets.image`Healpotion`, SpriteKind.HealPotion)
                animation.runImageAnimation(
                Heal_Potion,
                assets.animation`Life`,
                80,
                true
                )
                tiles.placeOnTile(Heal_Potion, location2)
            }
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
    for (let index = 0; index < Level; index++) {
        Rift = sprites.create(assets.image`rift small`, SpriteKind.Decoration)
        tiles.placeOnRandomTile(Rift, assets.tile`Rock`)
        scene.cameraFollowSprite(Rift)
        tiles.setTileAt(Rift.tilemapLocation(), assets.tile`Corrupted rock`)
        Rift_Number += 1
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
        music.play(music.createSoundEffect(WaveShape.Sine, 1, 1, 0, 0, 1000, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.UntilDone)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.HealPotion, function (sprite22, otherSprite3) {
    Powerup_on_screen += -1
    info.changeLifeBy(1)
    sprites.destroy(otherSprite3)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.PLasmaRefil, function (sprite22, otherSprite3) {
    music.play(music.createSoundEffect(WaveShape.Noise, 825, 2430, 255, 0, 200, SoundExpressionEffect.Vibrato, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
    PLasmaAmount += randint(1, 2)
    sprites.destroy(otherSprite3)
})
info.onLifeZero(function () {
    Game_Over()
})
function Finish_Islands () {
    Tile_Y = 0
    for (let index = 0; index < 16; index++) {
        Tile_X = 0
        for (let index = 0; index < 16; index++) {
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`myTile6`) || (tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`myTile8`) || tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`myTile7`))) {
                tiles.setWallAt(tiles.getTileLocation(Tile_X, Tile_Y), true)
            } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`Corrupted rock`)) {
                tiles.setWallAt(tiles.getTileLocation(Tile_X, Tile_Y), false)
            } else if (tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`myTile3`) || (tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`myTile4`) || tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`myTile1`))) {
                tiles.setWallAt(tiles.getTileLocation(Tile_X, Tile_Y), true)
            }
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`Rock`)) {
                if (randint(0, 10) == 10) {
                    tiles.setTileAt(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`Wall0`)
                    tiles.setWallAt(tiles.getTileLocation(Tile_X, Tile_Y), true)
                }
            }
            if (tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`WallWater`) || tiles.tileAtLocationEquals(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`Water2`)) {
                tiles.setWallAt(tiles.getTileLocation(Tile_X, Tile_Y), true)
                if (randint(0, 5) == 5) {
                    tiles.setTileAt(tiles.getTileLocation(Tile_X, Tile_Y), assets.tile`Water2`)
                }
            }
            Tile_X += 1
        }
        Tile_Y += 1
    }
}
function Tutorial () {
    In_Tutorial = 1
    Game_Active = 0
    Rift_Locations = []
    music.stopAllSounds()
    music.play(music.createSong(assets.song`In game 1`), music.PlaybackMode.LoopingInBackground)
    sprites.destroyAllSpritesOfKind(SpriteKind.Projectile)
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    PLasmaAmount = 0
    Game_Active = 1
    player1 = sprites.create(assets.image`Rift Hunter`, SpriteKind.Player)
    DirectionArow = sprites.create(assets.image`Left`, SpriteKind.Player)
    tiles.setCurrentTilemap(tilemap`Tutorial`)
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
        Talo = sprites.create(assets.image`Talo R`, SpriteKind.Projectile)
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
        Talo = sprites.create(assets.image`Talo R`, SpriteKind.Projectile)
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
        Plasma_Refil = sprites.create(assets.image`PlasmaRefil`, SpriteKind.PLasmaRefil)
        tiles.placeOnRandomTile(Plasma_Refil, assets.tile`Rock`)
    }
    Powerup_on_screen += 1
}
let Island = 0
let Villager: Sprite = null
let Rift_Locations: number[] = []
let Tile_X = 0
let Tile_Y = 0
let Heal_Potion: Sprite = null
let Powerup_on_screen = 0
let CloseRiftAni: Sprite = null
let Plasma: Sprite = null
let Player_Direction = ""
let Rift: Sprite = null
let Talo: Sprite = null
let HIT_movement = 0
let Invincibility = 0
let Player_Powered = 0
let Plasma_Refil: Sprite = null
let Power_Potion: Sprite = null
let Fake_PLayer: Sprite = null
let High_score = 0
let Talo_Spawn_Time = 0
let DirectionArow: Sprite = null
let In_Tutorial = 0
let Skip = 0
let Game_Active = 0
let MovmentDisable = 0
let PLasmaAmount = 0
let Rift_Number = 0
let Level = 0
let DIFFICULTY_CAP = 0
let player1: Sprite = null
let Dialougs = 0
let Talos_Defeated = 0
Talos_Defeated = 0
Dialougs = 1
player1 = sprites.create(assets.image`Rift Hunter`, SpriteKind.Player)
let RiftCloseTime = 0
let RiftPLayerOn = 0
DIFFICULTY_CAP = 10
Level = 0
Rift_Number = 0
PLasmaAmount = 20
music.play(music.createSong(assets.song`Main Theme`), music.PlaybackMode.LoopingInBackground)
Rift_Number = 0
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
    Start_Level()
}
Talos_Defeated = 0
game.onUpdate(function () {
    if (Game_Active == 1) {
        info.setScore(PLasmaAmount)
    }
})
game.onUpdate(function () {
    tick()
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
game.onUpdate(function () {
    if (In_Tutorial == 1) {
        if (PLasmaAmount == 1) {
            game.splash("You Wasted all of them?")
            Game_Over()
            PLasmaAmount = 0
        }
    }
})
game.onUpdate(function () {
    if (In_Tutorial == 1) {
        if (info.life() == 4) {
            info.setLife(5)
            Talo = sprites.create(assets.image`Talo R`, SpriteKind.Enemy)
            tiles.placeOnRandomTile(Talo, assets.tile`Corrupted rock`)
            Talo.setVelocity(-29, -13)
            timer.after(1000, function () {
                Talo.setVelocity(-8, 6)
            })
        }
    }
})
game.onUpdateInterval(Talo_Spawn_Time, function () {
    if (In_Tutorial == 0) {
        Spawn_Enemy()
    }
})
game.onUpdateInterval(10000, function () {
    if (Game_Active == 1 && !(In_Tutorial == 1)) {
        SpawnPowerups(1)
    }
})
