import {Collider} from './collider.js'
/**
* The RectangleCollider represents a specific type of collider. It's shape is (obviously) a rectangle.
*
* @class RectangleCollider
*/
export class RectangleCollider extends Collider{
    /**
     * Construct method of the object
     * @method constructor
     * @param {number} x X-position of the collider
     * @param {number} y Y-position of the collider
     * @param {object} offset Offset vector of the collider from it's parent Object
     * @param {number} width Width of the collider
     * @param {number} height Height of the collider
     * @param {number} rotation Rotation of the collider
     * @param {object} rotationPosition Rotation position vector of the Collider relative to it self
     * @param {object} parentObject Reference to the parent object
     * @param {object} debug Debug options (hitbox)
     * @returns RectangleCollider
     */
    constructor({x, y, offset, width, height, rotation, rotationPosition, parentObject, debug}={}){
        super({x:x, y:y, offset:offset, width:width, height:height, rotation:rotation, rotationPosition:rotationPosition, parentObject:parentObject, debug:debug})
    }
    
    /**
     * Render method of the RectangleCollider
     * @method onAfterRender
     * @param {number} x X-position to be drawn (by camera)
     * @param {number} y Y-position to be drawn (by camera)
     * @param {number} zoom zoom of the camera
     * @param {object} camera Camera object that caused the method
     * @param {object} object Parent object for rendering purposes (e.g. layer)
     * @returns {void}
     */
    onAfterRender({x, y, width, height, zoom, camera, object, renderer}={}, _this=this){
        if(_this.debug.hitbox){
            x += parseInt(_this.offset.x*zoom)
            y += parseInt(_this.offset.y*zoom)
            let width = parseInt(_this.dimensions.width*zoom),
                height = parseInt(_this.dimensions.height*zoom),
                rotationPosition = _this.rotationPosition.multS({scalar:zoom})
            
            renderer.strokeRect({x:x, y:y, width:width, height:height, color:"#de5a1f", rotation:object.rotation, rotationPosition:rotationPosition, lineWidth: parseInt(4*zoom), ctx:object.layer.ctx})
        }
    }
    
    /**
     * Returns the positions of the (rotated) corners of the RectangleCollider
     * @method getCorners
     * @returns {object}
     */
    getCorners(_this=this){
        let center = _this.position.add({vector: _this.rotationPosition})
        return {
            "upperLeft": {
                x : center.x + ((_this.position.x-center.x)*Math.cos(_this.rotation) - (_this.position.y-center.y)*Math.sin(_this.rotation)),
                y : center.y + ((_this.position.x-center.x)*Math.sin(_this.rotation) + (_this.position.y-center.y)*Math.cos(_this.rotation))
            },
            "upperRight": {
                x : center.x + ((_this.position.x+_this.dimensions.width-center.x)*Math.cos(_this.rotation) - (_this.position.y-center.y)*Math.sin(_this.rotation)),
                y : center.y + ((_this.position.x+_this.dimensions.width-center.x)*Math.sin(_this.rotation) + (_this.position.y-center.y)*Math.cos(_this.rotation))
            },
            "lowerLeft": {
                x : center.x + ((_this.position.x-center.x)*Math.cos(_this.rotation) - (_this.position.y-center.y+_this.dimensions.height)*Math.sin(_this.rotation)),
                y : center.y + ((_this.position.x-center.x)*Math.sin(_this.rotation) + (_this.position.y-center.y+_this.dimensions.height)*Math.cos(_this.rotation))
            },
            "lowerRight": {
                x : center.x + ((_this.position.x+_this.dimensions.width-center.x)*Math.cos(_this.rotation) - (_this.position.y-center.y+_this.dimensions.height)*Math.sin(_this.rotation)),
                y : center.y + ((_this.position.x+_this.dimensions.width-center.x)*Math.sin(_this.rotation) + (_this.position.y-center.y+_this.dimensions.height)*Math.cos(_this.rotation))
            }
        }
    }
}