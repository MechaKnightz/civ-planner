import HexPoint from './HexPoint'
import Point from './Point'


class Hex {
    constructor(position: HexPoint)
    {
        this.position = position;
    }
    position: HexPoint;

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