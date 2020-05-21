import Hex from './Hex'

class River {
    constructor(hex: Hex, hex2: Hex)
    {
        this.hex = hex;
        this.hex2 = hex2;
    }
    hex: Hex;
    hex2: Hex;
}

export default River;