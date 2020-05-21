import Point from './Point'

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
}

export default Utils;