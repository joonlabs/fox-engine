import fox from "../../../../src/index.js";
import {PlayerMovement} from "../components/playerMovement.js";
import {FollowGameObject} from "../../../../src/packages/components/basic/index.js";

export class Player {
    constructor({x, y, texture, layer, lightingLayer, scene, movement}) {
        this.x = x
        this.y = y

        this.player = new fox.GameObjects.Sprite({
            x:x,
            y:y,
            width: 16 * 3,
            height: 16 * 3,
            z: 2,
            texture : fox.AssetManager.getTexture({name: "Player_"+texture+"_Idle1"})
        })
        layer.addObject({name: "Player"+texture, object: this.player})
        this.player.addComponent({
            name: "collider",
            component : new fox.Colliders.RectangleCollider({
                width: 16 * 3,
                height: 16 * 3,
                debug: {hitbox: false}
            })
        })
        this.player.addComponent({
            name : "movement",
            component: new PlayerMovement({
                playerType: texture,
                keyLeft : movement.keyLeft,
                keyRight : movement.keyRight,
                keyUp : movement.keyUp,
                scene: scene,
                layer : layer
            })
        })
        this.player.addComponent({
            name : "animator",
            component: new fox.Animator({
                animations : {
                    "idle" : new fox.Animation({
                        frames: [
                            {duration: 11, texture: fox.AssetManager.getTexture({name: "Player_" + texture + "_Idle1"})},
                            {duration: 11, texture: fox.AssetManager.getTexture({name: "Player_" + texture + "_Idle2"})},
                        ]
                    }),
                    "jump" : new fox.Animation({
                        frames: [
                            {duration: 40, texture: fox.AssetManager.getTexture({name: "Player_" + texture + "_Jump1"})},
                            {duration: 40, texture: fox.AssetManager.getTexture({name: "Player_" + texture + "_Jump2"})},
                        ]
                    }),
                    "runRight" : new fox.Animation({
                        frames: [
                            {duration: 10, texture: fox.AssetManager.getTexture({name: "Player_" + texture + "_Run_Right1"})},
                            {duration: 10, texture: fox.AssetManager.getTexture({name: "Player_" + texture + "_Run_Right2"})},
                            {duration: 10, texture: fox.AssetManager.getTexture({name: "Player_" + texture + "_Run_Right3"})},
                            {duration: 10, texture: fox.AssetManager.getTexture({name: "Player_" + texture + "_Run_Right4"})},
                        ]
                    }),
                    "runLeft" : new fox.Animation({
                        frames: [
                            {duration: 10, texture: fox.AssetManager.getTexture({name: "Player_" + texture + "_Run_Left1"})},
                            {duration: 10, texture: fox.AssetManager.getTexture({name: "Player_" + texture + "_Run_Left2"})},
                            {duration: 10, texture: fox.AssetManager.getTexture({name: "Player_" + texture + "_Run_Left3"})},
                            {duration: 10, texture: fox.AssetManager.getTexture({name: "Player_" + texture + "_Run_Left4"})},
                        ]
                    })
                },
            })
        })

        this.light = new fox.GameObjects.Lights.PointLight({
            radius: 85 * 3,
            intensity: 1,
            hue: (texture === "Pink")
                ? new fox.Color({r: 255, g: 120, b: 232})
                : new fox.Color({r: 65, g: 182, b: 247})
        })
        this.light.addComponent({
            name: "FollowPlayer",
            component: new FollowGameObject({gameObject: this.player})
        })

        lightingLayer.addObject({name: "light"+texture, object: this.light})
    }
}