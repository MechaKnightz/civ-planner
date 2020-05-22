import Point from './Point'
import Direction from './Direction'
import HexPoint from './HexPoint'

class Utils {
    static toDegrees (angle: number): number {
		return angle * (180 / Math.PI);
    }
    
    //(vector between coordinate)
    static angleBetweenCoordinates(basePoint: Point, secondPoint: Point): number {
		var deltaX = secondPoint.x - basePoint.x;
		var deltaY = basePoint.y - secondPoint.y;
		var result = Math.atan2(deltaY, deltaX);
		if(result < 0)
			return result + Math.PI * 2;
		else 
			return result;
		//return (result < 0) ? (result + 360) : result;
	}

	static perpendicularClockwise(vector: Point): Point
    {
        return new Point(vector.y, -vector.x);
	}
	
	static perpendicularCounterClockwise(vector: Point): Point
    {
        return new Point(-vector.y, vector.x);
	}

    static vectorFromAngleAndLength(base: Point, angle: number, length: number): Point{
        return new Point(length * Math.cos(angle) + base.x, length * Math.sin(angle) + base.y);
	}

	static directionToNeightbour(basePoint: HexPoint, direction: Direction): HexPoint {
		switch (direction) {
			case Direction.UpRight:
				return new HexPoint(basePoint.q + 1, basePoint.r - 1);
			case Direction.Right:
				return new HexPoint(basePoint.q + 1, basePoint.r);
			case Direction.DownRight:
				return new HexPoint(basePoint.q, basePoint.r + 1);
			case Direction.DownLeft:
				return new HexPoint(basePoint.q - 1, basePoint.r + 1);
			case Direction.Left:
				return new HexPoint(basePoint.q - 1, basePoint.r);
			case Direction.UpLeft:
				return new HexPoint(basePoint.q, basePoint.r - 1);
			default:
				throw new Error("Error neighbour");
		}
	}

	static angleToDirection(angle: number): Direction {
		if (angle < 30)
			return Direction.Right;
		else if (angle < 90)
			return Direction.UpRight;
		else if (angle < 150)
			return Direction.UpLeft;
		else if (angle < 210)
			return Direction.Left;
		else if (angle < 270)
			return Direction.DownLeft;
		else if (angle < 330)
			return Direction.DownRight;
		else
			return Direction.Right;
	}
}

export default Utils;