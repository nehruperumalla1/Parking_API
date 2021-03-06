import assert from 'assert';
import dotenv from 'dotenv';

dotenv.config();

console.log('Parking lot size through .env is', process.env.PARKING_LOT_SIZE);

let carSlotMap = new Map();

let slotCarMap = new Map();

let availableSlots = [];

export const createParking = () => {
    loop1:
    for(let i = 10; i < 36; i++) {
        loop2:
        for(let j = 1; j <= 1000; j++) {
            availableSlots.push(i.toString(36).toUpperCase() + "-" + j);
            if(process.env.PARKING_LOT_SIZE == availableSlots.length) {
                break loop1;
            }
        }
    }
    console.log(availableSlots)
}

export const parkCar = (req, res) => {
    try {
        assert(availableSlots.length > 0);
        const vNumber = req.body.vNumber;
        if(carSlotMap.has(vNumber)) {
            res.send('Your car is already parked, if not contact the management. Thank you.')
        } else {
            let POS = Math.floor(Math.random() * Math.floor(availableSlots.length));
            const slot = availableSlots[POS];
            carSlotMap.set(vNumber, slot);
            slotCarMap.set(slot, vNumber);
            availableSlots.splice(POS, 1);
            res.status(200).send(slot);
        }
    } catch(err) {
        if(err.name == 'AssertionError') {
            res.status(200).send('Sorry, No empty space available.');
        } else {
            res.status(500).send('Something went wrong');
        }
    }
}

export const unparkCar = (req,res) => {
    const { slot } = req.params;
    try {
        assert(slotCarMap.has(slot));
        const vNumber = slotCarMap.get(slot);
        slotCarMap.delete(slot);
        carSlotMap.delete(vNumber);
        availableSlots.push(slot);
        res.status(200).send('Thank you for parking with us :)');
    } catch(err) {
        if(err.name == 'AssertionError') {
            res.status(200).send('Sorry, Wrong slot. Please try again.');
        } else {
            res.status(500).send('Something went wrong');
        }
    }
}

export const getInfo = (req, res) => {
    const slot = req.query.slot;
    const vNumber = req.query.vNumber;
    if(slot !== undefined && slotCarMap.has(slot)) {
        res.status(200).send({
            slot : slot,
            vNumber : slotCarMap.get(slot)
        })
    } else if(vNumber !== undefined && carSlotMap.has(vNumber)) {
        res.status(200).send({
            slot : carSlotMap.get(vNumber),
            vNumber : vNumber
        })
    } else {
        res.status(400).send('No Record Found!')
    }
}