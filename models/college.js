const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollegeSchema = new Schema({
    "ms-courses": [
        {
            "specialization": String,
            "exams": [
                String
            ],
            "duration": Number,
            "intake": Number,
            "cost": Number,
            "dateOfCourse": Date,
            "filled": Number
        }
    ],
    "mba-courses": [
        {
            "specialization": String,
            "exams": [
                String
            ],
            "duration": Number,
            "intake": Number,
            "cost": Number,
            "dateOfCourse": Date,
            "filled": Number
        }
    ],
    "other-courses": [
        {
            "specialization": String,
            "exams": [
                String
            ],
            "duration": Number,
            "intake": Number,
            "cost": Number,
            "dateOfCourse": Date,
            "filled": Number
        }
    ],
    "name": String,
    "web_pages": [
        String
    ],
    "alpha_two_code": String,
    "domains": [
        String
    ],
    "country": String,
    "state-province": String
})

module.exports = mongoose.model('College', CollegeSchema);