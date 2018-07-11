"use strict"

class Point {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    addXY(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }

    subtractXY(x, y) {
        this.x -= x;
        this.y -= y;
        return this;
    }

    scaleXY(x, y) {
        this.x *= x;
        this.y *= y;
        return this;
    }

    setPoint(x, y) {
        this.x = point.x;
        this.y = point.y;
        return this;
    }

    addPoint(point) {
        this.x += point.x;
        this.y += point.y;
        return this;
    }

    subtractPoint(point) {
        this.x -= point.x;
        this.y -= point.y;
        return this;
    }

    scalePoint(x, y) {
        this.x *= point.x;
        this.y *= point.y;
        return this;
    }

    scale(factor){
        this.x *= factor;
        this.y *= factor;
        return this;
    }

}


module.exports = Point;