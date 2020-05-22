import CubePoint from './CubePoint'
import Point from './Point'
import Hex from './Hex'
import Utils from './Utils'

class HexPoint {
    constructor(q: number, r: number)
    {
        this.q = q;
        this.r = r;
    }
    q: number;
    r: number;

    
    pointCoord(): Point {
        var x = Hex.radius * (Math.sqrt(3) * this.q + Math.sqrt(3) / 2 * this.r);
		var y = Hex.radius * (3. / 2 * this.r);
		return new Point(x, y);
    }
    
    getAllHexCorners(): Point[] {
        var res: Point[] = [];
		for (var i = 0; i < 6; i++) {
			res.push(this.getHexCorner(i)); 
		}
		return res;
	}
    
    //i == 0 is top right
	//i == 1 is bot right
	//i == 5 is top 
	getHexCorner(i: number): Point {
		var angle_deg = 60 * i - 30;
        var angle_rad = Math.PI / 180 * angle_deg;
        var center = this.pointCoord();
		return new Point(center.x + Hex.radius * Math.cos(angle_rad),
			center.y + Hex.radius * Math.sin(angle_rad))
	}

    toPixel(): Point {
        var x = Hex.radius * (Math.sqrt(3) * this.q + Math.sqrt(3) / 2 * this.r);
		var y = Hex.radius * (3. / 2 * this.r);
		return new Point(x, y);;
    }

    static fromPixel(point: Point): HexPoint{
        var q = (Math.sqrt(3) / 3 * point.x - 1. / 3 * point.y) / Hex.radius;
		var r = (2. / 3 * point.y) / Hex.radius;
		return HexPoint.hexRound(new HexPoint(q, r));
    }

    static axialToCube(hex: HexPoint): CubePoint {
		var x = hex.q;
		var z = hex.r;
		var y = -x - z;
		return new CubePoint( x, y, z );
	}

	static cubeToAxial(cube: CubePoint): HexPoint {
		var q = cube.x;
		var r = cube.z;
		return new HexPoint(q, r );
	}

	static hexRound(hex: HexPoint): HexPoint {
		return this.cubeToAxial(this.cubeRound(this.axialToCube(hex)));
	}

	static cubeRound(cube: CubePoint): CubePoint {
		var rx = Math.round(cube.x);
		var ry = Math.round(cube.y);
		var rz = Math.round(cube.z);

		var x_diff = Math.abs(rx - cube.x);
		var y_diff = Math.abs(ry - cube.y);
		var z_diff = Math.abs(rz - cube.z);

		if (x_diff > y_diff && x_diff > z_diff)
			rx = -ry - rz;
		else if (y_diff > z_diff)
			ry = -rx - rz;
		else
			rz = -rx - ry;
		return { x: rx, y: ry, z: rz };
	}
	
    toString = () : string => {
        return `${this.q},${this.r}`;
	}
	
	getBorderPoints(neighbour: HexPoint): [Point, Point] {
        var basePoint = this.pointCoord();
        var neighbourPoint = neighbour.pointCoord();

        var vec = new Point(neighbourPoint.x - basePoint.x, neighbourPoint.y - basePoint.y);

        var midPoint = new Point(vec.x / 2, vec.y / 2);

        var clockwise = vec.getAngle() + Math.PI / 2;
        var counterClockwise = vec.getAngle() - Math.PI / 2;

        return [Utils.vectorFromAngleAndLength(basePoint.add(midPoint), clockwise, Hex.radius / 2), 
            Utils.vectorFromAngleAndLength(basePoint.add(midPoint), counterClockwise, Hex.radius / 2)];
    }
}

export default HexPoint;