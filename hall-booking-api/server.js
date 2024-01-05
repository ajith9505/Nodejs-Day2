const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//App endpoints
app.get("/rooms", listRooms);
app.post("/create-room", createRoom);
app.post("/booking", booking);
app.get("/rooms-bookings", listroomsWithBookings);
app.get("/customer-history", customerHistory);
app.get("/booked-customers", bookedCustomers);

const rooms = [
    {
        roomId: 1,
        seats: 30,
        amenities: "Wifi",
        pricePerHour: 1500
    },
    {
        roomId: 2,
        seats: 40,
        amenities: "AC",
        pricePerHour: 2000
    },
    {
        roomId: 3,
        seats: 35,
        amenities: "Ac",
        pricePerHour: 1750
    }
];
const bookings = [
    {
        customerName: "Test",
        roomId: 3,
        date: "01-05-2010",
        startTime: "04:00 PM",
        endTime: "05:00 PM",
        bookingId: 1,
        bookingDate: "2024-01-05",
        bookingStatus: "Confirmed"
    }
];

//function to list all rooms
function listRooms(req, res) {
    res.json(rooms);
};

//fuction to create room
function createRoom(req, res) {
    const { seats, amenities, pricePerHour } = req.body;


    const roomId = rooms.length+1
    //Add the room in the list
    const room = {
        roomId,
        seats,
        amenities,
        pricePerHour,
    }
    rooms.push(room);
    res.json({ message: room });
};

//function to book a room
function booking(req, res) {
    const { roomId, customerName, date, startTime, endTime } = req.body;

    //check if the room exists
    const room = rooms.find((room) => room.roomId === roomId);
    if (!room) {
        return res.status(400).json({ message: 'Room not Available' })
    }

    //check if the room is available for booking
    const booking=bookings.find((booking) => booking.roomId === roomId && booking.date === date && booking.startTime === startTime );
    if (booking) {
        return res.status(400).json({ message: 'Room is not available for specified time' });
    }
    //Generate a unique bookingId
    const bookingId = bookings.length + 1;

    //Add the booking to the list
    const bookingData = {
        customerName,
        roomId,
        date,
        startTime,
        endTime,
        bookingId,
        bookingDate: new Date(),
        bookingStatus: 'Confirmed',
    }
    bookings.push(bookingData);
    res.json({ message: bookingData });
};

//Function for list all rooms with bookings
function listroomsWithBookings(req, res) {
    const roomsWithBookings = rooms.map((room) => {
        const roomBookings = bookings.filter((booking) => booking.roomId === room.roomId);
        return {
            roomNumber: room.roomroomId,
            bookings: roomBookings.map((booking) => ({
                customerName: booking.customerName,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                bookingStatus: booking.bookingStatus,
            })),
        };
    });
    res.send(roomsWithBookings[1]);
};

//Function for list all customer with bookings
function bookedCustomers(req, res) {
    const customersWithBookings = bookings.map((booking) => ({
        customerName: booking.customerName,
        roomId: booking.roomId,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingStatus: booking.bookingStatus,
    }));
    res.json(customersWithBookings);
};

//Function for customer history
function customerHistory(req, res) {
    const customerName = req.query.name;

        const customerHistory =bookings.filter((booking) => booking.customerName === customerName);

    res.json(customerHistory);
};
app.listen(PORT, () => {
    console.log(`Hall Booking Api listening a http://locahost:${PORT}`);
});