const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const axios = require('axios');
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
//'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json'
const { type } = require('os');
const allColleges = require('./utils/colleges-list.json');
// const colleges = JSON.parse(res);
allColleges.forEach(element => {
    element["ms-courses"] = [];
    element["mba-courses"] = [];
    element["other-courses"] = [];
});
//console.log(colleges);
const all_ms_courses = [
    "software-engineering",
    "psychology",
    "mathematics",
    "biotechnology",
    "statistics",
    "it",
    "geology",
    "data-science",
    "electronics"
];
const all_mba_courses = [
    "finance",
    "marketing",
    "hr-management",
    "international-business",
    "business-analytics",
    "supply-chain",
    "consulting",
    "enterpreneurship"
]
const all_other_courses = [
    "hospitality",
    "journalism",
    "history",
    "german",
    "french",
    "economics",
    "italian"
]
for (let i = 0; i < allColleges.length; i++) {
    allColleges[i]["photo"] = 'https://images.unsplash.com/20/cambridge.JPG?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80';
    allColleges[i]["index"] = i;
    let mscourse = {}, mbacourse = {}, othercourse = {};
    for (let j = 0; j < 3; j++) {
        mscourse["specialization"] = all_ms_courses[(i + j) % all_ms_courses.length];
        mscourse["exams"] = ["toefl", "gre"];
        mscourse["duration"] = Math.floor(Math.random() * 13) + 12;
        mscourse["intake"] = Math.floor(Math.random() * 41) + 60;
        mscourse["cost"] = Math.floor(Math.random() * 20001) + 40000;
        mscourse["filled"] = 60 - Math.floor(Math.random() * 61);
        allColleges[i]["ms-courses"].push(mscourse);
        mscourse = {};
    }
    for (let j = 0; j < 3; j++) {
        mbacourse["specialization"] = all_mba_courses[(i + j) % all_mba_courses.length];
        mbacourse["exams"] = ["gmat"];
        mbacourse["duration"] = Math.floor(Math.random() * 13) + 12;
        mbacourse["intake"] = Math.floor(Math.random() * 41) + 60;
        mbacourse["cost"] = Math.floor(Math.random() * 20001) + 40000;
        mbacourse["filled"] = 60 - Math.floor(Math.random() * 61);
        allColleges[i]["mba-courses"].push(mbacourse);
        mbacourse = {};
    }
    for (let j = 0; j < 3; j++) {
        othercourse["specialization"] = all_other_courses[(i + j) % all_other_courses.length];
        othercourse["exams"] = ["pte"];
        othercourse["duration"] = Math.floor(Math.random() * 13) + 12;
        othercourse["intake"] = Math.floor(Math.random() * 41) + 60;
        othercourse["cost"] = Math.floor(Math.random() * 20001) + 40000;
        othercourse["filled"] = 60 - Math.floor(Math.random() * 61);
        allColleges[i]["other-courses"].push(othercourse);
        othercourse = {};
    }
}
const colleges = allColleges.slice(0, 99);
const countries = [];
for (let college of allColleges) {
    if (countries.includes(college.country) === false) {
        countries.push(college.country);
    }
}
countries.sort();
app.get('/', async (req, res) => {
    // console.log(allColleges[0]);
    // const colleges = allColleges.slice(0, 100);
    //console.log(countries);
    res.render('home', { colleges });
    // if (!colleges) {
    //     await getColleges();
    // }

    //console.log(colleges[0]);
})

app.get('/home', (req, res) => {
    res.cookie('/home', Date());
    res.render('home', { colleges });
})

app.get('/contact', (req, res) => {
    res.cookie('/contact', Date());
    res.render('contact');
})

app.get('/colleges', (req, res) => {
    res.cookie('/colleges', Date());
    res.render('colleges/colleges-index', { all_ms_courses, all_mba_courses, all_other_courses, countries });
})

app.post('/colleges/ms', (req, res) => {
    //DATA IS COLLECTED HERE AFTER FORM IS SUBMITTED
    //console.log(req.body);
    const { selected_ms_course = '', selected_country, selected_max_cost } = req.body;
    //console.log(String(selected_ms_course));
    let requiredColleges = [];
    for (let college of allColleges) {
        for (let course of college["ms-courses"]) {
            if (course.specialization === String(selected_ms_course) || String(selected_ms_course) === '') {
                if (selected_country === "any" && selected_max_cost === "any") {
                    requiredColleges.push(college);
                    break;
                }
                else if (selected_country !== "any" && selected_max_cost === "any" && college["country"] === String(selected_country)) {
                    requiredColleges.push(college);
                    break;
                }
                else if (selected_max_cost !== "any" && selected_country === "any" && course["cost"] <= parseInt(selected_max_cost)) {
                    requiredColleges.push(college);
                    break;
                }
                else if (college["country"] === String(selected_country) && course["cost"] <= parseInt(selected_max_cost)) {
                    requiredColleges.push(college);
                    break;
                }
                //console.log(course);
            }
        }
    }
    requiredColleges = requiredColleges.slice(0, 99);
    //console.log(requiredColleges);
    res.render('colleges/colleges-show', { requiredColleges });
})

app.post('/colleges/mba', (req, res) => {
    //DATA IS COLLECTED HERE AFTER FORM IS SUBMITTED
    console.log(req.body);
    const { selected_mba_course = '', selected_country, selected_max_cost } = req.body;
    //console.log(String(selected_mba_course));
    let requiredColleges = [];
    for (let college of allColleges) {
        for (let course of college["mba-courses"]) {
            if (course.specialization === String(selected_mba_course) || String(selected_mba_course) === '') {
                if (selected_country === "any" && selected_max_cost === "any") {
                    requiredColleges.push(college);
                    break;
                }
                else if (selected_country !== "any" && selected_max_cost === "any" && college["country"] === String(selected_country)) {
                    requiredColleges.push(college);
                    break;
                }
                else if (selected_max_cost !== "any" && selected_country === "any" && course["cost"] <= parseInt(selected_max_cost)) {
                    requiredColleges.push(college);
                    break;
                }
                else if (college["country"] === String(selected_country) && course["cost"] <= parseInt(selected_max_cost)) {
                    requiredColleges.push(college);
                    break;
                }
                //console.log(course);
            }
        }
    }
    requiredColleges = requiredColleges.slice(0, 99);
    //console.log(requiredColleges);
    res.render('colleges/colleges-show', { requiredColleges });
})

app.post('/colleges/other', (req, res) => {
    //DATA IS COLLECTED HERE AFTER FORM IS SUBMITTED
    // console.log(req.body);
    const { selected_other_course = '', selected_country, selected_max_cost } = req.body;
    //console.log(String(selected_other_course));
    let requiredColleges = [];
    for (let college of allColleges) {
        for (let course of college["other-courses"]) {
            if (course.specialization === String(selected_other_course) || String(selected_other_course) === '') {
                if (selected_country === "any" && selected_max_cost === "any") {
                    requiredColleges.push(college);
                    break;
                }
                else if (selected_country !== "any" && selected_max_cost === "any" && college["country"] === String(selected_country)) {
                    requiredColleges.push(college);
                    break;
                }
                else if (selected_max_cost !== "any" && selected_country === "any" && course["cost"] <= parseInt(selected_max_cost)) {
                    requiredColleges.push(college);
                    break;
                }
                else if (college["country"] === String(selected_country) && course["cost"] <= parseInt(selected_max_cost)) {
                    requiredColleges.push(college);
                    break;
                }
                //console.log(course);
            }
        }
    }
    //requiredColleges = requiredColleges.slice(0, 99);
    //console.log(requiredColleges);
    res.render('colleges/colleges-show', { requiredColleges });
})

app.get('/colleges/:index/view', (req, res) => {
    const { index } = req.params;
    res.cookie(`/colleges/${index}/view`, Date());
    res.render('colleges/colleges-view', { college: allColleges[index] });
})

app.get('/exams', (req, res) => {
    res.cookie('/exams', Date());
    res.render('exams/exams-index');
})

app.post('/exams', (req, res) => {
    //DATA IS COLLECTED HERE AFTER FORM IS SUBMITTED
})

app.get('/countries', (req, res) => {
    res.cookie('/countries', Date());
    res.render('countries/countries-index', { countries });
})

app.post('/countries', (req, res) => {
    //DATA IS COLLECTED HERE AFTER FORM IS SUBMITTED
})

app.get('/contact', (req, res) => {
    res.cookie('/contact', Date());
    res.render('contact');
})

app.listen(3000, () => {
    console.log('Listening on port 3000!');
})