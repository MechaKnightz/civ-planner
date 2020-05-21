import HexPoint from './HexPoint'
import Point from './Point'
import Utils from './Utils'


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

    getBorderPoints(neighbour: Hex): [Point, Point] {
        var basePoint = this.position.pointCoord();
        var neighbourPoint = neighbour.position.pointCoord();

        var vec = new Point(neighbourPoint.x - basePoint.x, neighbourPoint.y - basePoint.y);

        var midPoint = new Point(vec.x / 2, vec.y / 2);

        // var clockwisePoint = midPoint.add(Utils.perpendicularClockwise(midPoint));
        // var counterClockwisePoint = midPoint.add(Utils.perpendicularCounterClockwise(midPoint));

        // var point1 = basePoint.add(clockwisePoint);
        // var point2 = basePoint.add(counterClockwisePoint);

        var clockwise = vec.getAngle() + Math.PI / 2;
        var counterClockwise = vec.getAngle() - Math.PI / 2;

        var vec2 = Utils.vectorFromAngleAndLength(basePoint.add(midPoint), clockwise, Hex.width / 2);

        return [Utils.vectorFromAngleAndLength(basePoint.add(midPoint), clockwise, Hex.radius / 2), 
            Utils.vectorFromAngleAndLength(basePoint.add(midPoint), counterClockwise, Hex.radius / 2)];
    }
}

export default Hex;