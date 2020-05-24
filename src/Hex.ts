import HexPoint from './HexPoint'

enum HexType {
    None, 
    Mountain
}

export { HexType };

class Hex {
    constructor(position: HexPoint, hexType: HexType)
    {
        this.position = position;
        this.hexType = hexType;
    }
    position: HexPoint;
    hexType: HexType;

    static radius = 60;
    static width = Hex.radius * Math.sqrt(3);

    static shape = [
        0, -Hex.radius,
        Hex.width / 2, -Hex.radius / 2,
        Hex.width / 2, Hex.radius / 2,
        0, Hex.radius,
        -Hex.width / 2, Hex.radius / 2,
        -Hex.width / 2, -Hex.radius / 2,
    ]
}

export default Hex;