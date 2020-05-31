/**
 * Represents the blueprint for all asset based objects, like images, audios, animations... 
 * @class Asset
 */
export class Asset{
    /**
    * Constructs the Asset Object 
    * 
    * @method constructor
    * @return Asset
    */
    constructor(){
        this.loaded = false
    }
    
    
    /**
    * Returns the raw data of the object
    * @method getData
    * @return {object}
    */
    getData(_this=this){
        
    }
}