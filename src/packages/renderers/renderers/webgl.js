import {Renderer} from './renderer.js'
import {Texture} from "../../assets/assets/index.js"
import {WebGLUtils, WebGLTexture, Framebuffers, Program, VertexArray} from "./webgl/index.js"
import {FramebufferType} from "./index.js"
import {Utils} from "../../utils/utils.js"

/**
 * The WebGL is the basic renderer using the html5 webgl api
 *
 * @class WebGL
 */
export class WebGL extends Renderer {
    /**
     * Construct method of the object
     * @method constructor
     * @returns WebGL
     */
    constructor() {
        super()
    }

    init({width, height}) {
        // init internal webgl-texture store
        this.textureStore = new Map()

        this.compiledShaders = new Map()

        this.boundFramebuffer = null
        this.boundVAO = null
        this.boundProgram = null
        this.boundTexture = {
            texture: {},
            unit: null
        }
        this.boundClearColor = null
        this.boundViewport = null
        this.boundBlendFunc = null
        this.boundBlendEquation = null
        this.uploadedCameraMatrices = new Map()
        this.boundCameraMatrixStack = []

        this.canvas = document.createElement("canvas")
        this.canvas.width = width
        this.canvas.height = height
        this.gl = this.canvas.getContext("webgl")
        this.gl.imageSmoothingEnabled = false
        this.glVao = this.gl.getExtension("OES_vertex_array_object")
        this.canvas.setAttribute("style", "image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: pixelated;")

        this.textureProgram = new Program({renderer: this, vertexShaderSrc: WebGLUtils.vertexShaderTexture, fragmentShaderSrc: WebGLUtils.fragmentShaderTexture})
        this.rectangleProgram = new Program({renderer: this, vertexShaderSrc: WebGLUtils.vertexShaderSolid, fragmentShaderSrc: WebGLUtils.fragmentShaderRectangle})
        this.circleProgram = new Program({renderer: this, vertexShaderSrc: WebGLUtils.vertexShaderSolid, fragmentShaderSrc: WebGLUtils.fragmentShaderCircle})
        this.multiplyBlendingProgram = new Program({renderer: this, vertexShaderSrc: WebGLUtils.vertexShaderBlending, fragmentShaderSrc: WebGLUtils.fragmentShaderMultiplyBlend})

        this.programs = [
            this.textureProgram,
            this.rectangleProgram,
            this.circleProgram,
            this.multiplyBlendingProgram
        ]

        // Buffer used to draw quads
        // Should be used in conjunction with gl.TRIANGLE_STRIP
        this.quadBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
          0, 0,
          0, 1,
          1, 0,
          1, 1,
        ]), this.gl.STATIC_DRAW)

        let _this = this

        this.textureVAO = new VertexArray({
            renderer: this,
            setup() {
                let positionLocation = _this.gl.getAttribLocation(_this.textureProgram.programRef, "a_position");
                let texcoordLocation = _this.gl.getAttribLocation(_this.textureProgram.programRef, "a_texcoord");

                _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, _this.quadBuffer);
                _this.gl.enableVertexAttribArray(positionLocation);
                _this.gl.vertexAttribPointer(positionLocation, 2, _this.gl.FLOAT, false, 0, 0);
                _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, _this.quadBuffer);
                _this.gl.enableVertexAttribArray(texcoordLocation);
                _this.gl.vertexAttribPointer(texcoordLocation, 2, _this.gl.FLOAT, false, 0, 0);
            }
        })

        this.multiplyBlendingVAO = new VertexArray({
            renderer: this,
            setup() {
                let positionLocation = _this.gl.getAttribLocation(_this.multiplyBlendingProgram.programRef, "a_position");
                let texcoordLocation = _this.gl.getAttribLocation(_this.multiplyBlendingProgram.programRef, "a_texcoord");

                _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, _this.quadBuffer);
                _this.gl.enableVertexAttribArray(positionLocation);
                _this.gl.vertexAttribPointer(positionLocation, 2, _this.gl.FLOAT, false, 0, 0);
                _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, _this.quadBuffer);
                _this.gl.enableVertexAttribArray(texcoordLocation);
                _this.gl.vertexAttribPointer(texcoordLocation, 2, _this.gl.FLOAT, false, 0, 0);
            }
        })

        this.rectangleVAO = new VertexArray({
            renderer: this,
            setup() {
                let positionLocation = _this.gl.getAttribLocation(_this.rectangleProgram.programRef, "a_position");

                _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, _this.quadBuffer);
                _this.gl.enableVertexAttribArray(positionLocation);
                _this.gl.vertexAttribPointer(positionLocation, 2, _this.gl.FLOAT, false, 0, 0);
            }
        })

        this.circleVAO = new VertexArray({
            renderer: this,
            setup() {
                let positionLocation = _this.gl.getAttribLocation(_this.rectangleProgram.programRef, "a_position");

                _this.gl.bindBuffer(_this.gl.ARRAY_BUFFER, _this.quadBuffer);
                _this.gl.enableVertexAttribArray(positionLocation);
                _this.gl.vertexAttribPointer(positionLocation, 2, _this.gl.FLOAT, false, 0, 0);
            }
        })

        this.VAOs = [
            this.textureVAO,
            this.rectangleVAO,
            this.circleVAO,
            this.multiplyBlendingVAO
        ]

        this.mainFramebuffer = new Framebuffers.Framebuffer({
            renderer: this,
            width: width,
            height: height,
            framebufferRef: null,
            textureRef: null,
        })

        this.gl.enable(this.gl.BLEND);
        this.setBlendFuncSeparate({srcRGB: this.gl.SRC_ALPHA, dstRGB: this.gl.ONE_MINUS_SRC_ALPHA, srcAlpha: this.gl.ONE, dstAlpha: this.gl.ONE_MINUS_SRC_ALPHA});

        super.init()
    }

    destroy() {
        for (let shader of this.compiledShaders.values()) {
            this.gl.deleteShader(shader)
        }

        this.programs.forEach(program => program.destroy())
        this.VAOs.forEach(VAO => VAO.destroy())

        for (let texture of this.textureStore.values()) {
            this.gl.deleteTexture(texture)
        }
        this.gl.getExtension('WEBGL_lose_context').loseContext();
        super.destroy();
    }

    createFramebuffer({width, height, type}) {
        switch (type) {
            case FramebufferType.MULTIPLY_BLENDING:
                return new Framebuffers.BlendingBuffer({renderer: this, width, height, fragmentShaderKey: FramebufferType.MULTIPLY_BLENDING})
            case FramebufferType.LIGHTING:
                return new Framebuffers.LightingBuffer({renderer: this, width, height})
            default:
                return new Framebuffers.Framebuffer({renderer: this, width, height})
        }
    }

    getMainFramebuffer() {
        return this.mainFramebuffer
    }

    /**
     *
     * @param {Texture | Framebuffer} texture
     * @returns {WebGLTexture}
     */
    getOrUploadTexture({texture}) {
        if (texture instanceof Framebuffers.Framebuffer) {
            return texture.texture
        } else {
            if (this.textureStore.has(texture.getId())) {
                return this.textureStore.get(texture.getId())
            } else {
                let glTexture = new WebGLTexture({
                    renderer: this,
                    level: 0,
                    format: this.gl.RGBA,
                    type: this.gl.UNSIGNED_BYTE,
                    pixels: texture.getTexture(),
                })
                this.textureStore.set(texture.getId(), glTexture)
                return glTexture
            }
        }
    }

    /**
     * @param viewport The viewport
     * @param viewport.x The viewport's x position
     * @param viewport.y The viewport's y position
     * @param viewport.width The viewport width
     * @param viewport.height The viewport height
     */
    setViewport(viewport) {
        if (!Utils.shallowEquals(this.boundViewport, viewport)) {
            this.gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height)
            this.boundViewport = viewport
        }
    }

    /**
     * @param {Color} color
     */
    setClearColor(color) {
        if (!Utils.shallowEquals(this.boundClearColor, color)) {
            this.gl.clearColor(...color.asNormalizedRGBAList())
            this.boundClearColor = color
        }
    }

    /**
     * @param blendFunc The blending functions
     * @param blendFunc.srcRGB The RGB source blending
     * @param blendFunc.dstRGB The RGB destination blending
     * @param blendFunc.srcAlpha The alpha source blending
     * @param blendFunc.dstAlpha The alpha destination blending
     */
    setBlendFuncSeparate(blendFunc) {
        if (!Utils.shallowEquals(this.boundBlendFunc, blendFunc)) {
            this.gl.blendFuncSeparate(blendFunc.srcRGB, blendFunc.dstRGB, blendFunc.srcAlpha, blendFunc.dstAlpha)
            this.boundBlendFunc = blendFunc
        }
    }

    /**
     * @param blendEquation The blending equations
     * @param blendEquation.modeRGB The RGB blending equation
     * @param blendEquation.modeAlpha The alpha blending equation
     */
    setBlendEquationSeparate(blendEquation) {
        if (!Utils.shallowEquals(this.boundBlendEquation, blendEquation)) {
            this.gl.blendEquationSeparate(blendEquation.modeRGB, blendEquation.modeAlpha)
            this.boundBlendEquation = blendEquation
        }
    }

    uploadCameraTransform() {
        const currentCameraMatrix = this.boundCameraMatrixStack[this.boundCameraMatrixStack.length-1]

        if (this.uploadedCameraMatrices.get(this.boundProgram) !== currentCameraMatrix) {
            this.boundProgram.setUniformMatrix({uniform: "u_cameraMatrix", matrix: currentCameraMatrix})
            this.uploadedCameraMatrices.set(this.boundProgram, currentCameraMatrix)
        }
    }

    pushCameraTransform({position, scale, rotation}) {
        this.boundCameraMatrixStack.push(WebGLUtils.createObjectMatrix({
            x: position.x,
            y: position.y,
            width: scale.width,
            height: scale.height,
            rotation: {
                angle: rotation,
                x: 0,
                y: 0,
            }
        }))
    }

    popCameraTransform() {
        this.boundCameraMatrixStack.pop()
    }
}