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
}

export default Utils;