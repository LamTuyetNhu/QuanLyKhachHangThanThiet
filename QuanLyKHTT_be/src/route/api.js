import express from "express";
import APIController from "../controller/APIController";
let router = express.Router();

const initAPIRoute = (app) => {
  /* Admin */
// Đăng nhập
router.post("/loginAdmin", APIController.loginAdmin);

//CRUD Khách Hàng
router.get("/admin", APIController.getHomeAdmin); 
router.get("/admin/customer", APIController.getAllCustomer)
router.post("/admin/customerSearch", APIController.getSearch)
router.get("/admin/edit/:idKH", APIController.getDetailCustomer)
router.post("/createCustomer", APIController.createCustomer)
router.post("/updateCustomer", APIController.updateCustomer)
router.post("/deleteCustomer", APIController.deleteCustomer)
router.post("/updateCoinCustomer", APIController.updateCoinsCustomer) 

// //CRUD Voucher
router.get("/admin/voucher", APIController.getAllVoucher)
router.post("/admin/voucherSearch", APIController.getVoucherSearch)
router.post("/createNewVoucher", APIController.createVoucher)
router.get("/admin/updateVoucher/:idVoucher", APIController.getUpdateVoucher)
router.post("/updateVoucher", APIController.updateVoucher)
router.post("/deleteVoucher", APIController.deleteVoucher)

// //CRUD Sinh Nhật Khách Hàng
router.get("/admin/customerbirthday", APIController.getCustomerBirthday)
router.post("/updatePointCustomer", APIController.updatePointCustomer)
router.get("/admin/givevoucher/:idKH", APIController.getGiveVoucher)
router.post("/giveVoucherCustomer", APIController.giveVoucherCustomer)

// //upload
router.get("/infoAdmin", APIController.getInfoAdmin);
router.get("/admin/updateAdmin/:idAdmin", APIController.getInfoAdmin)
router.post("/updateProfileAdmin", APIController.updateAdmin);
router.get("/admin/updatePassAdmin/:idAdmin", APIController.getInfoAdmin)
router.post("/updatePassAdmin", APIController.updateNewPassword);

/* Khách hàng */
router.post("/loginCustomer", APIController.loginCustomer)
router.post("/registerCustomer", APIController.registerCustomer)
router.get("/customer/:email", APIController.getCustomer)
router.post("/customer/updateCustomer", APIController.updateInfo)
router.get("/customer/voucher/:email", APIController.getMyVoucher)
router.post("/customer/usedVoucher", APIController.usedVoucher)
router.post("/customer/updatepassword", APIController.updatePasswordCustomer)

  return app.use("/api", router);
};

// module.exports = initWebRoute;
export default initAPIRoute;
