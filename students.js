const express = require("express");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dcilcqkiq",
  secure: true,
  api_key: "166412622424926",
  api_secret: "xcVwT6T_xgpnwhCvGz8dx4VmWpk", // Click 'View API Keys' above to copy your API secret
});
const route = express.Router();
// const db = require("../db/database");
var db = require("knex")({
  client: "pg",
  connection: {
    user: "postgres",
    database: "students",
    host: "localhost",
    password: "admin",
  },
  debug: false,
  pool: {
    min: 1,
    max: 2,
  },
  migrations: {
    tableName: "knex_migrations",
  },
});
// sql normalization Screenshot 2024-10-21 215639.png
const getImgFromCloudinary = async (req, res) => {
  const publicId = req.body.publicId;
  console.log(publicId);
  let cleanedUrl = publicId.replace(/%20/g, "");

  // Generate the URL for the image
  const imageUrl = cloudinary.url(publicId, {
    width: 300, // Optional: set image width
    height: 300, // Optional: set image height
    crop: "scale", // Optional: specify how to crop
  });
  cleanedUrl = imageUrl.replace(/%20/g, "");
  // Redirect to the image URL or send the URL in the response
  return res.json({ imageUrl });
};

const inputApi = async (req, res) => {
  try {
    const { name, email, bioData, blog } = req.body;
    // if (password.length < 6) throw "password must be min 6 charaters";
    const [chat1Data] = await db("studentsblog")
      .insert({
        name,
        email,
        bioData,
        blog,
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
route.post("/image", getImgFromCloudinary);

route.post("/inputApi", inputApi);
module.exports = route;
