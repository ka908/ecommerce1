const express = require("express");
const route = express.Router();
const db = require("../db/database");

const customerInput = async (req, res) => {
  try {
    const { name, email, customerOrder } = req.body;
    // if (password.length < 6) throw "password must be min 6 charaters";
    const [chat1Data] = await db("ecommerceCustomer")
      .insert({
        name,
        email,
        customerOrder,
      })
      .returning("id");
    return res.json({ msg: `record inserted` });
  } catch (e) {
    return res.status(500).json("thers is an issue");
  }
};

const orderCheck = async (req, res) => {
  const { id, name } = req.body;
  try {
    const [check] = await db("ecommerceCustomer")
      .select("*")
      .where({ name: name });
    const customer1 = check.customerOrder.item1;
    const customer2 = check.customerOrder.item2;
    const customer3 = check.customerOrder.item3;
    const customer4 = check.customerOrder.item4;
    console.log("1");

    const [checkWarehouse] = await db("eCustomerWareHouse").select("*");
    console.log("21");

    const item1 = checkWarehouse.wareHouse.item1;
    const item2 = checkWarehouse.wareHouse.item2;
    const item3 = checkWarehouse.wareHouse.item3;
    const item4 = checkWarehouse.wareHouse.item4;

    var updateObject = {};
    if (customer1) {
      updateObject = {
        item1: item1 - customer1,
        item2: item2,
        item3: item3,
        item4: item4,
      };
      console.log(updateObject);
    } else if (customer2) {
      updateObject = {
        item1: item1,
        item2: item2 - customer2,
        item3: item3,
        item4: item4,
      };
    } else if (customer3) {
      updateObject = {
        item1: item1,
        item2: item2,
        item3: item3 - customer3,
        item4: item4,
      };
    } else {
      updateObject = {
        item1: item1,
        item2: item2,
        item3: item3,
        item4: item4 - customer4,
      };
    }

    const [updateWarehouse] = await db("eCustomerWareHouse")
      .where({ id: id })
      .update({
        wareHouse: updateObject,
      });

    return res.json({ msg: updateObject });
  } catch (e) {
    return res.status(500).json("thers is an issue");
  }
};

route.patch("/orderCheck", orderCheck);
route.post("/customerInput", customerInput);

module.exports = route;
