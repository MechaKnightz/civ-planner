import Hex from './Hex'

class River {
    constructor(hex: Hex, hex2: Hex, graphics: SVGElement)
    {
        this.hex = hex;
        this.hex2 = hex2;
        this.graphics = graphics;
    }
    hex: Hex;
    hex2: Hex;
    graphics: SVGElement;
}

export default River;