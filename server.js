// const React = require("react");
// const App = require("./src/index");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require('bcrypt');
// import RedisStore from "connect-redis";
// import session from "express-session";
// import {createClient} from "redis";
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const redis = require("redis");
// const redis = require("redis");
// const redis = require("redis");
// const session = require("express-session");
// const RedisStore = require("connect-redis")(session);
// const redisClient = require("redis").createClient();
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const router = express.Router();
const { spawn } = require("child_process");


const app = express();

// app.use(express.static(path.join(__dirname, "../client/public")))

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/public", "index.html"));
// });

// app.use(cors());

// const corsOptions = {
//   origin: [process.env.REACT_URL]
// };

// app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const redisUse = ;

// Initialize client.
// const createClient = redis.createClient;;
// let redisClient = createClient({ 
//   url: process.env.REDIS_URL 
// });
// redisClient.connect().catch(console.error);

// let redisStore = new RedisStore({
//   client: redisClient
// })

//Redis Client Connect
const client = redis.createClient({
  host: 'oregon-redis.render.com',
  port: 6379,
  password: 'QTWDfDMqMfqucdd3E9rOK7yPOZDM7Si7'
});

client.on('connect', function () {
  console.log('Connected to Redis');
});

//Passport Authentication
app.use(session({
  store: new RedisStore({ client }),
  resave: false,
  saveUninitialized: false,
  secret: "Sri Abirami Finance Kuruchikottai"
}))

app.use(passport.initialize());
app.use(passport.session());

//Connect to MongoDB with help of Mongoose
const mongodbCred = process.env.MONGO_DB_CRED
// mongodb://127.0.0.1:27017/saf
// mongodb+srv://vishnu3vardhan1996:<password>@sriabiramifinance.9qlxcqx.mongodb.net/test
mongoose.connect(mongodbCred, { useNewUrlParser: true });
// mongoose.set("createIndex", true);

const db = mongoose.connection;

//User Cred DB
const UserDetails = new mongoose.Schema({
  Username: String,
  Password: String
});

UserDetails.plugin(passportLocalMongoose);

const UserDetailsSchema = mongoose.model("UserDetails", UserDetails);

passport.use(UserDetailsSchema.createStrategy());

passport.serializeUser(UserDetailsSchema.serializeUser());
passport.deserializeUser(UserDetailsSchema.deserializeUser());

// Customer Number, Date, Amount, Name, Husband/Father Name, Address, Mobile number, 
// Gold Details, Gold Grams, Gold Actual Value, Attender, Aadhar Number (optional).

//Creating documents in collections.
//Schema definition for a collections.
const safSchema = new mongoose.Schema({
  Customer_number: String,
  Date: String,
  Amount: Number,
  Name: String,
  Husband_Father_Name: String,
  Address: String,
  Mobile_number: Number,
  Gold_details: String,
  Gold_grams: Number,
  Gold_actual_value: Number,
  Attender: String,
  Aadhar_number: String,
  Status: String,
  Payment_close_date: String,
  Interest_rate: Number,
  Interest_for_first_month: Number,
  Service_Charge: Number,
  Amount_after_int_and_ser_charge: Number
});

const Saf = mongoose.model("Saf", safSchema);

const DenominationSchema = new mongoose.Schema({
  Customer_number: String,
  2000: Number,
  500: Number,
  200: Number,
  100: Number,
  50: Number,
  20: Number,
  10: Number,
  5: Number,
  2: Number,
  1: Number,
  Total: Number
});

const DeSchema = mongoose.model("DenominationSchema", DenominationSchema);

const DeReceiveSchema = new mongoose.Schema({
  Customer_number: String,
  2000: Number,
  500: Number,
  200: Number,
  100: Number,
  50: Number,
  20: Number,
  10: Number,
  5: Number,
  2: Number,
  1: Number,
  Total: Number
});

const DeRecSchema = mongoose.model("DeReceiveSchema", DeReceiveSchema);

const Comments = new mongoose.Schema({
  Customer_number: String,
  Comments: String
});

const CommSchema = mongoose.model("Comments", Comments);

const Interests = new mongoose.Schema({
  Customer_number: { type: String, unique: true },
  Interest: {
    Interest_Received_Date: { type: [String] },
    Interest: { type: [Number] },
    Interest_Rate: { type: [Number] },
    Interest_for_Date: { type: [String] }
  }
});

const InterestSchema = mongoose.model("Interests", Interests);

//////////////////////////////////////////////////////

let userDetailsDB = [];

// let dropDownValue = "";
let paymentSettlement;

app.post("/customer_details/:name", (req, res) => {
  paymentSettlement = req.body;
  res.redirect("/customer_details/:name");
});

// This is your protected route
router.get(`${process.env.REACT_URL}/cust_bio_data`, isAuthenticated, (req, res) => {
  res.redirect('You have access to the protected route');
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`${process.env.REACT_URL}/login`);
}

app.use(process.env.REACT_URL, router);

app.post("/signup_27031996_saf", function (req, res) {

  const loginDetails = req.body.logindetails;
  const passwordDetails = req.body.password_detail;

  UserDetailsSchema.register(new UserDetailsSchema({ username: loginDetails }), passwordDetails, function (err, user) {
    if (err) {
      console.log(err);
      // handle error
    } else {
      // authenticate user and redirect to dashboard
      passport.authenticate("local")(req, res, function () {
        res.redirect(`${process.env.REACT_URL}/cust_bio_data`);
      });
    }
  })

  // passport.authenticate("local", function(err, user, info) {
  //   if (err) {
  //     console.log(err);
  //     res.redirect(`${process.env.REACT_URL}/signup/failure`);
  //   } else if (user) {
  //     console.log(`${process.env.REACT_URL}/cust_bio_data`);
  //     res.redirect(`${process.env.REACT_URL}/cust_bio_data`);
  //   } else {
  //     console.log("Some Issue, Debug it...");
  //     res.redirect(`${process.env.REACT_URL}/signup/failure`);
  //   }
  // })(req, res));

  //   User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
  //     if (err) {
  //         console.log(err);
  //         // handle error
  //     } else {
  //         // authenticate user and redirect to dashboard
  //         passport.authenticate("local")(req, res, function() {
  //             res.redirect('/dashboard');
  //         });
  //     }
  // });
  // );

  // UserDetailsSchema.findOne({ Username: loginDetails })
  //   .then(doc => {
  //     console.log(doc.Username)
  //     res.redirect(`${process.env.REACT_URL}/signup/failure`)
  //   })
  //   .catch(err => {
  //     const fName = req.body.fiName;
  //     const lName = req.body.laname;
  //     const loginDetails = req.body.logindetails;
  //     const password = req.body.password_detail;

  //     bcrypt.genSalt(10, function (err, salt) {
  //       if (err) {
  //         console.log(err);
  //         return;
  //       }

  //       // hash the password using the salt
  //       bcrypt.hash(password, salt, function (err, hash) {
  //         if (err) {
  //           console.log(err);
  //           return;
  //         }

  //         // save the hash to your database
  //         console.log(hash);
  //         const signUpUserDetails = new UserDetailsSchema({
  //           First_name: fName,
  //           Last_name: lName,
  //           Username: loginDetails,
  //           Password: hash
  //         })
  //         signUpUserDetails.save();
  //       });
  //     });
  //     res.redirect(`${process.env.REACT_URL}/cust_bio_data`);
  //   });
})

app.post("/login", function (req, res) {
  const loginDetails = req.body.logindetails;

  // UserDetailsSchema.findOne({ Username: loginDetails })
  // .then(doc => {
  //   console.log(doc.Password);
  //   const enteredPassword = req.body.password_detail;
  //   const storedHash = doc.Password;

  //   var loggedin;

  //   bcrypt.compare(enteredPassword, storedHash, function (err, result) {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }

  //     if (result) {
  //       console.log('Passwords match!');
  //       loggedin = "success";
  //       // res.redirect(process.env.REACT_URL);
  //       res.redirect(`${process.env.REACT_URL}/cust_bio_data`);
  //     } else {
  //       console.log('Passwords do not match.');
  //       loggedin = "failed";
  //       // res.send('Passwords do not match.');
  //       res.redirect(`${`${process.env.REACT_URL}/cust_bio_data`}/login/failure`)
  //     }
  //   });
  //   // console.log(loggedin);
  //   // if (loggedin === "success") {
  //   //   res.redirect(process.env.REACT_URL);
  //   // }
  //   // else {
  //   //   res.send("Passwords do not match.")
  //   // }

  // })
  // .catch(err => {
  //   // console.error(err);
  //   res.send("You aren't a authenticated user");
  // })

})

app.get("/customer_details/:name", function (req, res) {
  const paymentStatus = paymentSettlement.payment_status;
  const finalPaymentDetails = paymentStatus;
  console.log(finalPaymentDetails);
  const custDetail = req.params.name;
  // console.log(custDetail);
  if ((custDetail.length === 5) && (finalPaymentDetails === "all")) {
    Saf.find({ Customer_number: custDetail }, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  else if ((custDetail.length === 5) && (finalPaymentDetails === "paid")) {
    Saf.find({ Customer_number: custDetail, Status: paymentStatus }, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  else if ((custDetail.length === 5) && (finalPaymentDetails === "unpaid")) {
    Saf.find({ Customer_number: custDetail, Status: paymentStatus }, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  else if ((custDetail.length === 5)) {
    Saf.find({ Customer_number: custDetail }, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  else if ((custDetail.length === 10) && (finalPaymentDetails === "all")) {
    Saf.find({ Mobile_number: custDetail }, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  else if ((custDetail.length === 10) && (finalPaymentDetails === "all")) {
    Saf.find({ Mobile_number: custDetail }, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  else if ((custDetail.length === 10) && (finalPaymentDetails === "paid")) {
    Saf.find({ Mobile_number: custDetail, Status: paymentStatus }, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  else if ((custDetail.length === 10) && (finalPaymentDetails === "unpaid")) {
    Saf.find({ Mobile_number: custDetail, Status: paymentStatus }, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  else if (custDetail.length === 10) {
    Saf.find({ Mobile_number: custDetail }, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  else if ((custDetail.length === 1) && (finalPaymentDetails === "all")) {
    Saf.find({}, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  else if ((custDetail.length === 1) && (finalPaymentDetails === "paid")) {
    Saf.find({ Status: paymentStatus }, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  else if ((custDetail.length === 1) && (finalPaymentDetails === "unpaid")) {
    Saf.find({ Status: paymentStatus }, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  else if ((custDetail.length === 1)) {
    Saf.find({}, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  else {
    Saf.find({ Name: custDetail }, { _id: 0 })
      .then((custRecord) => {
        userDetailsDB = custRecord.map((doc) => doc);
        res.json(userDetailsDB)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error searching for users');
      })
  }
  // res.redirect("/customer_details/:name");

});

// Customer Number, Date, Amount, Name, Husband/Father Name, Address, Mobile number
// Gold Details, Gold Grams, Gold Actual Value, Attender, Aadhar Number (optional).

app.post("/registration", (req, res) => {

  //For Customer Details
  const cardNo = req.body.custno;
  const dateReg = req.body.date;
  const amountGave = req.body.amount;
  const nameCust = req.body.name;
  const fatherHusbandName = req.body.hus_fat_name;
  const addressCust = req.body.address;
  const phoneNumCust = req.body.phone_no;
  const goldDetailsCust = req.body.gold_det;
  const goldGramsCust = req.body.gold_grams;
  const goldvalueCust = req.body.gold_value;
  const attenderCust = req.body.attender;
  const aadharNumberCust = req.body.aadhar;
  const paymentstatus = req.body.status;
  const interestRate = req.body.interest_rate;
  const interestGave = req.body.interest;
  const serviceCharge = req.body.service_charge;
  const amountAfterIntSer = req.body.amount_after_int;

  //For Denomination
  const twoThousand = req.body.two_t;
  const fivehundred = req.body.five_h;
  const twohundred = req.body.two_h;
  const onehundred = req.body.one_h;
  const fiftyRupees = req.body.five_ty;
  const twentyRupees = req.body.two_ty;
  const tenRupees = req.body.one_ty;
  const fiveRupees = req.body.five_coin;
  const twoRupees = req.body.two_coin;
  const oneRupees = req.body.one_coin;
  const totalOfAll = req.body.total;

  //Customer Detail updating in DB
  console.log(cardNo, dateReg, amountGave, nameCust, fatherHusbandName, addressCust, phoneNumCust, goldDetailsCust, goldGramsCust, goldvalueCust, attenderCust, aadharNumberCust);
  const safCustDetails = new Saf({
    Customer_number: cardNo,
    Date: dateReg,
    Amount: amountGave,
    Name: nameCust,
    Husband_Father_Name: fatherHusbandName,
    Address: addressCust,
    Mobile_number: phoneNumCust,
    Gold_details: goldDetailsCust,
    Gold_grams: goldGramsCust,
    Gold_actual_value: goldvalueCust,
    Attender: attenderCust,
    Aadhar_number: aadharNumberCust,
    Status: paymentstatus,
    Interest_rate: interestRate,
    Interest_for_first_month: interestGave,
    Service_Charge: serviceCharge,
    Amount_after_int_and_ser_charge: amountAfterIntSer
  })
  safCustDetails.save();

  //Denomination updating in DB
  console.log(twoThousand, fivehundred, twohundred, onehundred, fiftyRupees, twentyRupees, tenRupees, fiveRupees, twoRupees, oneRupees, totalOfAll);
  const denomiDetails = new DeSchema({
    Customer_number: cardNo,
    2000: twoThousand,
    500: fivehundred,
    200: twohundred,
    100: onehundred,
    50: fiftyRupees,
    20: twentyRupees,
    10: tenRupees,
    5: fiveRupees,
    2: twoRupees,
    1: oneRupees,
    Total: totalOfAll
  })
  denomiDetails.save();

  // Define your cURL command as an array of arguments

  const curlCmd = [
    'curl',
    '-i',
    '-X',
    'POST',
    'https://graph.facebook.com/v16.0/103113806119286/messages',
    '-H',
    'Authorization: Bearer EABiWd4RqZBKABAKo8WmuH990JvTMidafBGPRTbED4ZB5TeEJ080wNo42LzlbfZCevIhTGyUSw6epKSxbrD2dKwvoDo4u2kmMPGAO2571Qls6ZBALZAEhgfk6ZBUCN2ZCHiYhZCZAlYQMXjWYCJn6S9n6qmJemBjmHpCaycYFJcXoeK6VoiWNAwgRo55ci9ZA8Vralm35yEmc0SQAZDZD',
    '-H',
    'Content-Type: application/json',
    '-d',
    '{ "messaging_product": "whatsapp", "to": "919976235968", "type": "template", "template": { "name": "hello_world", "language": { "code": "en_US" } } }'
  ];

  // Spawn a new process to execute the cURL command
  const curlProcess = spawn(curlCmd[0], curlCmd.slice(1));

  // Listen to the output events of the child process
  curlProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  curlProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Listen to the exit event of the child process
  curlProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  res.redirect(`${process.env.REACT_URL}/cust_bio_data`);
});

let custUpdateNo;
let cardNoOfCustomer;
let paymentClosedDate;
// let textAreaValue;
// let custNoFromIndividualComp

let twoThreeZero;
let fiveTwoZero;
let twoTwoZero;
let oneTwoZero;
let fiveOneZero;
let twoOneZero;
let oneOneZero;
let fiveNoZero;
let twoNoZero;
let oneNoZero;



app.post("/cust_update/:cardno", (req, res) => {
  custUpdateNo = req.body.payment_status;
  // console.log(custUpdateNo);
  cardNoOfCustomer = req.body.card_no;
  // console.log(cardNoOfCustomer);
  paymentClosedDate = req.body.payment_close_date;
  // console.log(paymentClosedDate);
  textAreaValue = req.body.comments;
  console.log(textAreaValue);
  custNoFromIndividualComp = req.body.Cust_No;
  console.log(custNoFromIndividualComp);

  twoThreeZero = req.body.two_thou;
  fiveTwoZero = req.body.five_hund;
  twoTwoZero = req.body.two_hund;
  oneTwoZero = req.body.onehund;
  fiveOneZero = req.body.fifty;
  twoOneZero = req.body.twenty;
  oneOneZero = req.body.ten;
  fiveNoZero = req.body.five;
  twoNoZero = req.body.two;
  oneNoZero = req.body.one;

  const deReceivedDataObject = {
    Customer_number: cardNoOfCustomer,
    '2000': twoThreeZero,
    '500': fiveTwoZero,
    '200': twoTwoZero,
    '100': oneTwoZero,
    '50': fiveOneZero,
    '20': twoOneZero,
    '10': oneOneZero,
    '5': fiveNoZero,
    '2': twoNoZero,
    '1': oneNoZero
  };

  const textValueSaveInDB = { Customer_number: custNoFromIndividualComp, Comments: textAreaValue };

  Saf.findOneAndUpdate({ Customer_number: cardNoOfCustomer }, { $set: { Status: custUpdateNo } }, { new: true })
    .then(doc => {
      // console.log(doc);
    })
    .catch(err => {
      // console.log(err);
    });

  Saf.findOneAndUpdate({ Customer_number: cardNoOfCustomer }, { $set: { Payment_close_date: paymentClosedDate } }, { new: true })
    .then(doc => {
      // console.log(doc);
    })
    .catch(err => {
      // console.log(err);
    });

  DeRecSchema.findOneAndUpdate({ Customer_number: cardNoOfCustomer }, deReceivedDataObject, { upsert: true, new: true })
    .then(doc => {
      // console.log(doc);
    })
    .catch(err => {
      // console.log(err);
    });

  if (custNoFromIndividualComp) {
    CommSchema.findOneAndUpdate({ Customer_number: custNoFromIndividualComp }, textValueSaveInDB, { upsert: true, new: true })
      .then(doc => {
        // console.log(doc);
      })
      .catch(err => {
        // console.log(err);
      });
  }

  res.redirect(`${process.env.REACT_URL}/cust_update/:cardno`);
})



let DeDetailsDB = [];
let DeRecDetailsDB = [];
let CommentsDB = [];
let InterestsDB = [];

app.get("/cust_update/:cardno", (req, res) => {
  // custUpdateNo=req.body;
  const custCardNo = req.params.cardno;
  // console.log(custCardNo);

  Promise.all([
    Saf.find({ Customer_number: custCardNo }, { _id: 0 }),
    DeSchema.find({ Customer_number: custCardNo }, { _id: 0 }),
    DeRecSchema.find({ Customer_number: custCardNo }, { _id: 0 }),
    CommSchema.find({ Customer_number: custCardNo }, { _id: 0 }),
    InterestSchema.find({ Customer_number: custCardNo }, { _id: 0 }),
  ])
    .then(([safRecord, deRecord, deRecRecord, commentRecord, interestRecord]) => {
      userDetailsDB = safRecord.map((doc) => doc);
      DeDetailsDB = deRecord.map((doc) => doc);
      DeRecDetailsDB = deRecRecord.map((doc) => doc);
      CommentsDB = commentRecord.map((doc) => doc);
      InterestsDB = interestRecord.map((doc) => doc);
      const response = { userDetailsDB, DeDetailsDB, DeRecDetailsDB, CommentsDB, InterestsDB };
      res.json(response);
      // res.json(userDetailsDB)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error searching for users');
    })
})

app.post("/interest_update", function (req, res) {
  const interestCustCardNo = req.body.cardnodetails;
  const interestRate = req.body.interestrate;
  const interestDate = req.body.interestrecord;
  const actualInterest = req.body.interestdetails;
  const interestReceivedDate = req.body.daterecord;

  // 

  //Storing Interest in DB
  InterestSchema.findOneAndUpdate({ Customer_number: interestCustCardNo }, { $push: { "Interest.Interest_Received_Date": interestReceivedDate, "Interest.Interest": actualInterest, "Interest.Interest_Rate": interestRate, "Interest.Interest_for_Date": interestDate } }, { upsert: true, new: true })
    .then(doc => {
      // console.log(doc);
    })
    .catch(err => {
      // console.log(err);
    });

  // console.log(interestReceivedDate);
  // console.log(interestCustCardNo);

  res.redirect(`${process.env.REACT_URL}/cust_update/${interestCustCardNo}`);

})

app.get("/sample", function (req, res) {
  res.send('Success!')
})

app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});