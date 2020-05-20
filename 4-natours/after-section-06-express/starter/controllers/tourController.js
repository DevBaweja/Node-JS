const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
    const id = +req.params.id;
    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Could not find tour of this ID',
        });
    }
    next();
};

exports.checkBody = (req, res, next) => {
    const { name, price } = req.body;
    if (!name || !price)
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price',
        });
    next();
};

// Tours Route Handler
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours,
        },
    });
};

exports.getTourById = (req, res) => {
    // console.log(req.params);
    const id = +req.params.id;
    const tour = tours.find((cur) => cur.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour,
        },
    });
};

exports.createNewTour = (req, res) => {
    // For req.body we have use middleware express.json()
    // console.log(req.body);

    const newId = tours[tours.length - 1].id + 1;

    const newTour = {
        id: newId,
    };
    Object.assign(newTour, req.body);

    // const newTour = Object.assign({ id: newId },req.body);
    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        }
    );
};
exports.updateTourById = (req, res) => {
    // console.log(req.params);

    res.status(200).json({
        status: 'success',
        data: {
            // TODO:
            tours: '<Updated tour here...>',
        },
    });
};
exports.deleteTourById = (req, res) => {
    // console.log(req.params);

    res.status(204).json({
        status: 'success',
        data: null,
    });
};
