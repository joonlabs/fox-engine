import {Renderer} from './renderer.js'
/**
* The Canvas2D is the basic renderer using the html5 canvas2d api
*
* @class Canvas2D
*/
export class Canvas2D extends Renderer{
    /**
     * Construct method of the object
     * @method constructor
     * @returns Canvas2D
     */
    constructor({}={}){
        super({})
    }
    
    /**
     * Clears the canvases buffer
     * @method clearRect
     * @param {number} x Starting x position to be cleared
     * @param {number} y Starting y position to be cleared
     * @param {number} width Width of therect to be cleared
     * @param {number} height Height of therect to be cleared
     * @param {object} layer Layer to be cleared
     * @return {void}
     */
    clearRect({x, y, width, height, ctx}, _this=this){
        ctx.clearRect(x, y, width, height)
    }
    
    /**
     * Fills a rect on the canvas
     * @method fillRect
     * @param {number} x X position of the rect
     * @param {number} y Y position of the rect
     * @param {number} width Width of therect
     * @param {number} height Height of therect
     * @param {number} rotation Rotation of therect
     * @param {object} rotationPosition rotationPosition of therect
     * @param {object} color Color of therect
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    fillRect({x, y, width, height, rotation, rotationPosition, color, ctx}, _this=this){
        if(_this.rotation%(Math.PI*2)!=0){
            ctx.save()
            ctx.translate(x+rotationPosition.x, y+rotationPosition.y)
            x = -rotationPosition.x
            y = -rotationPosition.y
            ctx.rotate(rotation)
        }
        
        ctx.fillStyle = color.toString()
        ctx.fillRect(x, y, width, height)
        
        if(_this.rotation%(Math.PI*2)!=0){
            ctx.restore() 
        }
    }
    
    /**
     * Strokes a rect on the canvas
     * @method strokeRect
     * @param {number} x X position of the rect
     * @param {number} y Y position of the rect
     * @param {number} width Width of therect
     * @param {number} height Height of therect
     * @param {number} rotation Rotation of therect
     * @param {object} rotationPosition rotationPosition of therect
     * @param {number} lineWidth Line width of the rect's stroke
     * @param {object} color Color of therect
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    strokeRect({x, y, width, height, rotation, rotationPosition, lineWidth, color, ctx}, _this=this){
        if(rotation%(Math.PI*2)!=0){
            ctx.save()
            ctx.translate(x+rotationPosition.x, y+rotationPosition.y)
            x = -rotationPosition.x
            y = -rotationPosition.y
            ctx.rotate(rotation)
        }
        
        ctx.beginPath()
        ctx.strokeStyle = color.toString()
        ctx.lineWidth = lineWidth
        ctx.rect(parseInt(x+lineWidth/2), parseInt(y+lineWidth/2), parseInt(width-lineWidth), parseInt(height-lineWidth))
        ctx.stroke()
        
        if(rotation%(Math.PI*2)!=0){
            ctx.restore() 
        }
    }
    
    /**
     * Fills a cirlce on the canvas
     * @method fillCircle
     * @param {number} x X position of the circle
     * @param {number} y Y position of the circle
     * @param {number} radius Radius of the circle
     * @param {number} rotation Rotation of the circle
     * @param {object} rotationPosition rotationPosition of the circle
     * @param {number} angleStart Starting Angle of the circle's fill
     * @param {number} angleEnd Ending Angle of the circle's fill
     * @param {object} color Color of the cirlce
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    fillCircle({x, y, radius, rotation, rotationPosition, angleStart, angleEnd, color, ctx}, _this=this){
        if(rotation%(Math.PI*2)!=0){
            ctx.save()
            ctx.translate(x, y)
            x = +rotationPosition.x-radius
            y = +rotationPosition.y-radius
            ctx.rotate(rotation)
        }
        
        ctx.fillStyle = color.toString()
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.arc(x, y, radius, angleStart, angleEnd)
        ctx.closePath()
        ctx.fill()
        
        
        
        if(rotation%(Math.PI*2)!=0){
            ctx.restore() 
        }
    }
    
    
    /**
     * Strokes a cirlce on the canvas
     * @method strokeCircle
     * @param {number} x X position of the circle
     * @param {number} y Y position of the circle
     * @param {number} radius Radius of the circle
     * @param {number} rotation Rotation of the circle
     * @param {object} rotationPosition rotationPosition of the circle
     * @param {number} angleStart Starting Angle of the circle's stroke
     * @param {number} angleEnd Ending Angle of the circle's stroke
     * @param {number} lineWidth lineWidth of the circle's stroke
     * @param {object} color Color of the cirlce' stroke
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    strokeCircle({x, y, radius, rotation, rotationPosition, angleStart, angleEnd, lineWidth, color, ctx}, _this=this){
        if(rotation%(Math.PI*2)!=0){
            ctx.save()
            ctx.translate(x, y)
            x = +rotationPosition.x-radius
            y = +rotationPosition.y-radius
            ctx.rotate(rotation)
        }
        
        ctx.beginPath()
        ctx.strokeStyle = color.toString()
        ctx.lineWidth = lineWidth
        ctx.moveTo(x, y)
        ctx.arc(x, y, parseInt(radius - lineWidth/2), angleStart, angleEnd)
        ctx.closePath()
        ctx.stroke()

        if(rotation%(Math.PI*2)!=0){
            ctx.restore() 
        }
    }
    
    
    /**
     * Renders a texture to the layer
     * @method renderTexture
     * @param {object} texture Texture to be rendered
     * @param {number} x X position of the texture
     * @param {number} y Y position of the texture
     * @param {number} width Width of the texture
     * @param {number} height Height of the texture
     * @param {number} rotation Rotation of the texture
     * @param {object} rotationPosition rotationPosition of the texture
     * @param {object} layer Layer to be rendered to
     * @return {void}
     */
    renderTexture({texture, x, y, width, height, rotation, rotationPosition, ctx}, _this=this){
        if(rotation%(Math.PI*2)!=0){
            ctx.save()
            ctx.translate(x+rotationPosition.x, y+rotationPosition.y)
            x = -rotationPosition.x
            y = -rotationPosition.y
            ctx.rotate(rotation)
        }
        
        if(width && height){
            ctx.drawImage(texture, x, y, width, height)
        }else{
            ctx.drawImage(texture, x, y)
        }

        if(rotation%(Math.PI*2)!=0){
            ctx.restore() 
        }
    }
}