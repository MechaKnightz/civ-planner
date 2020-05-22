import Hex from './Hex'

class River {
    constructor(hex: Hex, hex2: Hex)
    {
        this.hex = hex;
        this.hex2 = hex2;
    }
    hex: Hex;
    hex2: Hex;

    toString = () : string => {
        return `${this.hex.position.q},${this.hex.position.r},${this.hex2.position.q},${this.hex2.position.r},`;
    }

    static indexOfRiver(rivers: River[], searchRiver: River): number {
        var res = -1;
        rivers.forEach((river, i) => {
            if((river.hex.position.q === searchRiver.hex.position.q &&
                river.hex.position.r === searchRiver.hex.position.r &&
                river.hex2.position.q === searchRiver.hex2.position.q &&
                river.hex2.position.r === searchRiver.hex2.position.r) ||
                (river.hex.position.q === searchRiver.hex2.position.q &&
                river.hex.position.r === searchRiver.hex2.position.r &&
                river.hex2.position.q === searchRiver.hex.position.q &&
                river.hex2.position.r === searchRiver.hex.position.r))
                    res = i;
        });
        return res
    }
}

export default River;