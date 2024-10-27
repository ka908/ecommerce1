const express = require("express");

const route = express.Router();

const db = require("../db/database");

const inputWarehouse = async (req, res) => {
  try {
    const { wareHouse } = req.body;
    // if (password.length < 6) throw "password must be min 6 charaters";
    const [chat1Data] = await db("eCustomerWareHouse")
      .insert({
        wareHouse,
      })
      .returning("id");
    return res.json({ msg: `record inserted` });
  } catch (e) {
    return res.status(500).json("thers is an issue");
  }
};

const outputApi = async (req, res) => {
  try {
    // lodash.findKey
    const name = req.body.name;
    // console.log(name);
    const [check] = await db("studentsblog").select("*").where({ name: name });
    // console.log(typeof check);
    const prse = JSON.stringify(check);
    const regex = /"hobbies":"([^"]+)"/;
    const match = prse.match(regex);
    // console.log(regex);
    const abc = check.bioData;
    const get = abc.course;
    const blog = check.blog;
    const getBlog = blog["1st-blog"];
    const getBlog1 = blog["2nd-blog"];

    // console.log(prse);
    if (match) {
      console.log(`Hobbies: ${match[1]}`); // Output: Hobbies: Japan
    } else {
      console.log("Hobbies not found.");
    }
    return res.json({
      course: get,
      blog1: getBlog,
      blog2: getBlog1,
      hobby: match[1],
    });
  } catch (e) {
    return res.status(500).json("thers is an issue");
  }
};

route.get("/outputApi", outputApi);
// route.post("/image", getImgFromCloudinary);

route.post("/inputWarehouse", inputWarehouse);
module.exports = route;
