import HexPoint from './HexPoint'

class Hex {
    constructor(position: HexPoint, graphics: SVGElement)
    {
        this.position = position;
        this.graphics = graphics;
    }
    position: HexPoint;
    graphics: SVGElement;
}

export default Hex;