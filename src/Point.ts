class Point {
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
    x: number;
    y: number;

    toString = () : string => {
        return `${this.x},${this.y}`;
    }

    add(other: Point): Point {
        return new Point(this.x + other.x, this.y + other.y);
    }

    getAngle() {
        var angle = Math.atan2(this.y, this.x);
        return angle;
    }
}

export default Point;