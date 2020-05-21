class Point {
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
    x: number;
    y: number;

    public toString = () : string => {
        return `${this.x},${this.y}`;
    }
}

export default Point;