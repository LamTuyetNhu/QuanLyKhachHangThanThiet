import pool from "../configs/connectDB";
let loginAdmin = async (req, res) => {
  let { email, passAdmin } = req.body;
  const [rows, fields] = await pool.execute(
    "select * from admin where idAdmin=0"
  );
  const emailValue = rows[0].email;
  const passAdminValue = rows[0].passAdmin;

  if (emailValue == email && passAdmin == passAdminValue) {
    return res.status(200).json({
      dataAdmin: rows[0],
    });
  } else {
    return res.status(500).json({ error: "\n Đăng nhập không thành công!" });
  }
};

let getHomeAdmin = async (req, res) => {
  const [rowsAdmin, fieldsAdmin] = await pool.execute(
    "select nameAdmin from admin where idAdmin=0"
  );
  const nameAdmin = rowsAdmin[0].nameAdmin;

  return res.status(200).json({
    nameAdmin,
  });
};

let createCustomer = async (req, res) => {
  let { username, password, address, email, phonenumber, dateofbirth } =
    req.body;

  await pool.execute(
    "insert into customer(username, dateofbirth, password, address, email, phonenumber) values (?, ?, ?, ?, ?, ?)",
    [username, dateofbirth, password, address, email, phonenumber]
  );

  const [rows, fields] = await pool.execute(
    "SELECT *, DATE_FORMAT(dateofbirth, '%d/%m/%Y') as formatted_dateofbirth FROM customer where trangthai = 1"
  );

  const [rowsAdmin, fieldsAdmin] = await pool.execute("select * from admin");
  const nameAdmin = rowsAdmin[0].nameAdmin;

  return res.status(200).json({
    dataUser: rows,
    nameAdmin,
  });
};

let getAllCustomer = async (req, res) => {
  const [rows, fields] = await pool.execute(
    "SELECT *, DATE_FORMAT(dateofbirth, '%d/%m/%Y') as formatted_dateofbirth FROM customer where trangthai = 1"
  );

  const [rowsAdmin, fieldsAdmin] = await pool.execute(
    "select nameAdmin from admin where idAdmin=0"
  );
  const nameAdmin = rowsAdmin[0].nameAdmin;

  return res.status(200).json({
    dataUser: rows,
    nameAdmin,
  });
};

let getSearch = async (req, res) => {
  let {input, select} = req.body;
  if(input !== '' && select === 'username') {
    const [rows, fields] = await pool.execute(
      "SELECT *, DATE_FORMAT(dateofbirth, '%d/%m/%Y') as formatted_dateofbirth FROM customer where trangthai = 1 and username LIKE ?", ['%' + input + '%']
    );

    console.log(rows)
  
    const [rowsAdmin, fieldsAdmin] = await pool.execute(
      "select nameAdmin from admin where idAdmin=0"
    );
    const nameAdmin = rowsAdmin[0].nameAdmin;
  
    return res.status(200).json({
      dataUser: rows,
      nameAdmin,
    });
  } else if(input !== '' && select === 'phonenumber') {
    console.log("Tim ttheo sdt")
    const [rows, fields] = await pool.execute(
      "SELECT *, DATE_FORMAT(dateofbirth, '%d/%m/%Y') as formatted_dateofbirth FROM customer where trangthai = 1 and phonenumber=?", [input]
    );

    console.log(rows)
  
    const [rowsAdmin, fieldsAdmin] = await pool.execute(
      "select nameAdmin from admin where idAdmin=0"
    );
    const nameAdmin = rowsAdmin[0].nameAdmin;
  
    return res.status(200).json({
      dataUser: rows,
      nameAdmin,
    });
  } else if(input !== '' && select === 'address') {
    console.log("Tim theo dia chi")
    const [rows, fields] = await pool.execute(
      "SELECT *, DATE_FORMAT(dateofbirth, '%d/%m/%Y') as formatted_dateofbirth FROM customer where trangthai = 1 and address LIKE ?", ['%' + input + '%']
    );

    console.log(rows)
  
    const [rowsAdmin, fieldsAdmin] = await pool.execute(
      "select nameAdmin from admin where idAdmin=0"
    );
    const nameAdmin = rowsAdmin[0].nameAdmin;
  
    return res.status(200).json({
      dataUser: rows,
      nameAdmin,
    });
  } else {
    console.log("Khong tim thay kq")
  }
};

let getDetailCustomer = async (req, res) => {
  const [rowsAdmin, fieldsAdmin] = await pool.execute(
    "select nameAdmin from admin where idAdmin=0"
  );
  const nameAdmin = rowsAdmin[0].nameAdmin;

  const idKH = req.params.idKH;
  try {
    let [rows, fields] = await pool.execute(
      "select *, DATE_FORMAT(dateofbirth, '%d/%m/%Y') as formatted_dateofbirth from customer where idKH = ?",
      [idKH]
    );

    return res.status(200).json({
      dataUser: rows[0],
      nameAdmin,
    });
  } catch (error) {
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let updateCustomer = async (req, res) => {
  let { username, address, email, phonenumber, idKH } = req.body;

  try {
    await pool.execute(
      "update customer set username= ?, address= ?, email= ?, phonenumber= ? where idKH= ?",
      [username, address, email, phonenumber, idKH]
    );

    return res.status(200).json({
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let deleteCustomer = async (req, res) => {
  let idKH = req.body.idKH;
  await pool.execute("update customer set trangthai= 0 where idKH = ?", [idKH]);
  // const [rows, fields] = await pool.execute("SELECT *, DATE_FORMAT(dateofbirth, '%d/%m/%Y') as formatted_dateofbirth FROM customer where trangthai = 1");

  return res.status(200).json({
    message: "Xóa thành công!",
  });
};

let updateCoinsCustomer = async (req, res) => {
  let { point, idKH, addcoin } = req.body;
  try {
    await pool.execute("update customer set point= ? where idKH= ?", [
      addcoin / 100 + point * 1,
      idKH,
    ]);

    return res.status(200).json({
      message: "Thành công",
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không cập nhật được!" });
  }
};

/* Voucher */
let getAllVoucher = async (req, res) => {
  const [rows, fields] = await pool.execute(
    "SELECT *, DATE_FORMAT(ngaytao, '%d/%m/%Y') as formatted_ngaytao, DATE_FORMAT(ngayhethan, '%d/%m/%Y') as formatted_ngayhethan FROM voucher where dasudung = 0 and ngaytao <= ngayhethan and soluong > 0 and ngayhethan >= CURDATE()"
  );

  const [rowsAdmin, fieldsAdmin] = await pool.execute(
    "select nameAdmin from admin where idAdmin=0"
  );
  const nameAdmin = rowsAdmin[0].nameAdmin;

  return res.status(200).json({
    dataVoucher: rows,
    nameAdmin,
  });
};

let getVoucherSearch = async (req, res) => {
  let {input, select} = req.body;
  if(input !== '' && select === 'nameVoucher') {
    const [rows, fields] = await pool.execute(
      "SELECT *, DATE_FORMAT(ngaytao, '%d/%m/%Y') as formatted_ngaytao, DATE_FORMAT(ngayhethan, '%d/%m/%Y') as formatted_ngayhethan FROM voucher where dasudung = 0 and ngaytao <= ngayhethan and soluong > 0 and ngayhethan >= CURDATE() and nameVoucher LIKE ?", ['%' + input + '%']
    );

    console.log("1: ", rows)
  
    const [rowsAdmin, fieldsAdmin] = await pool.execute(
      "select nameAdmin from admin where idAdmin=0"
    );
    const nameAdmin = rowsAdmin[0].nameAdmin;
  
    return res.status(200).json({
      dataVoucher: rows,
      nameAdmin,
    });
  } else if(input !== '' && select === 'nguoitao') {
    const [rows, fields] = await pool.execute(
      "SELECT *, DATE_FORMAT(ngaytao, '%d/%m/%Y') as formatted_ngaytao, DATE_FORMAT(ngayhethan, '%d/%m/%Y') as formatted_ngayhethan FROM voucher where dasudung = 0 and ngaytao <= ngayhethan and soluong > 0 and ngayhethan >= CURDATE() and nguoitao like ?", ['%' + input + '%']
    );

    console.log("2: ", rows)
  
    const [rowsAdmin, fieldsAdmin] = await pool.execute(
      "select nameAdmin from admin where idAdmin=0"
    );
    const nameAdmin = rowsAdmin[0].nameAdmin;
  
    return res.status(200).json({
      dataVoucher: rows,
      nameAdmin,
    });
  } else {
    return res
      .status(500)
      .json({ error: "Không hiển thị được trang voucher!" });
  }
};

let createVoucher = async (req, res) => {
  let { nameVoucher, soluong, giam, toida, nguoitao, ngaytao, ngayhethan } =
    req.body;

  await pool.execute(
    "insert into voucher(nameVoucher, soluong, giam, toida, nguoitao, ngaytao, ngayhethan) values (?, ?, ?, ?, ?, ?, ?)",
    [nameVoucher, soluong, giam, toida, nguoitao, ngaytao, ngayhethan]
  );

  const [rows, fields] = await pool.execute(
    "SELECT *, DATE_FORMAT(ngaytao, '%d/%m/%Y') as formatted_ngaytao, DATE_FORMAT(ngayhethan, '%d/%m/%Y') as formatted_ngayhethan FROM voucher where dasudung = 0 and ngaytao <= ngayhethan and soluong=0 and ngayhethan >= CURDATE()"
  );

  const [rowsAdmin, fieldsAdmin] = await pool.execute("select * from admin");
  const nameAdmin = rowsAdmin[0].nameAdmin;

  return res.status(200).json({
    dataVoucher: rows,
    nameAdmin,
  });
};

let getUpdateVoucher = async (req, res) => {
  try {
    let idVoucher = req.params.idVoucher;
    let [rows, fields] = await pool.execute(
      "SELECT *, DATE_FORMAT(ngaytao, '%d/%m/%Y') as formatted_ngaytao, DATE_FORMAT(ngayhethan, '%d/%m/%Y') as formatted_ngayhethan FROM voucher WHERE idVoucher = ?",
      [idVoucher]
    );

    // console.log(rows)
    const [rowsAdmin, fieldsAdmin] = await pool.execute("select * from admin");
    const nameAdmin = rowsAdmin[0].nameAdmin;

    return res.status(200).json({
      dataVoucher: rows[0],
      nameAdmin,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Không hiển thị được trang voucher!" });
  }
};

let updateVoucher = async (req, res) => {
  let { nameVoucher, soluong, giam, toida, nguoitao, idVoucher } = req.body;

  try {
    await pool.execute(
      "update voucher set nameVoucher=?, soluong=?, giam=?, toida=?, nguoitao=? where idVoucher=?",
      [nameVoucher, soluong, giam, toida, nguoitao, idVoucher]
    );

    return res.status(200).json({
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    return res.status(500).json({ error: "Không thể cập nhật voucher!" });
  }
};

let deleteVoucher = async (req, res) => {
  try {
    let idVoucher = req.body.idVoucher;
    await pool.execute("update voucher set dasudung = 1 where idVoucher = ?", [
      idVoucher,
    ]);

    const [rows, fields] = await pool.execute(
      "SELECT *, DATE_FORMAT(ngaytao, '%d/%m/%Y') as formatted_ngaytao, DATE_FORMAT(ngayhethan, '%d/%m/%Y') as formatted_ngayhethan FROM voucher where dasudung = 0 and ngaytao <= ngayhethan and soluong=0 and ngayhethan >= CURDATE()"
    );

    const [rowsAdmin, fieldsAdmin] = await pool.execute("select * from admin");
    const nameAdmin = rowsAdmin[0].nameAdmin;

    return res.status(200).json({
      dataVoucher: rows,
      nameAdmin,
    });
  } catch (error) {
    return res.status(500).json({ error: "Không xóa voucher!" });
  }
};

/* Sinh nhật khách hàng */
let getCustomerBirthday = async (req, res) => {
  const [rows, fields] = await pool.execute(
    "SELECT *, DATE_FORMAT(dateofbirth, '%d/%m/%Y') as formatted_dateofbirth FROM customer where MONTH(dateofbirth)=MONTH(CURDATE()) and trangthai = 1"
  );

  const [rowsAdmin, fieldsAdmin] = await pool.execute(
    "select nameAdmin from admin where idAdmin=0"
  );
  const nameAdmin = rowsAdmin[0].nameAdmin;

  return res.status(200).json({
    dataUser: rows,
    nameAdmin,
  });
};

let updatePointCustomer = async (req, res) => {
  let { point, idKH, addcoin } = req.body;
  try {
    await pool.execute("update customer set point= ? where idKH= ?", [
      addcoin * 1 + point,
      idKH,
    ]);

    return res.status(200).json({
      message: "Thành công",
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không cập nhật được!" });
  }
};

let getGiveVoucher = async (req, res) => {
  const [rowsAdmin, fieldsAdmin] = await pool.execute(
    "select nameAdmin from admin where idAdmin=0"
  );
  const nameAdmin = rowsAdmin[0].nameAdmin;

  const idKH = req.params.idKH;

  try {
    let [rowCus, fieldCus] = await pool.execute(
      "select *, DATE_FORMAT(dateofbirth, '%d/%m/%Y') as formatted_dateofbirth from customer where idKH = ?",
      [idKH]
    );

    const [rowVou, fieldsVou] = await pool.execute(
      "SELECT *, DATE_FORMAT(ngaytao, '%d/%m/%Y') as formatted_ngaytao, DATE_FORMAT(ngayhethan, '%d/%m/%Y') as formatted_ngayhethan FROM voucher where dasudung = 0 and ngaytao <= ngayhethan and soluong > 0 and ngayhethan >= CURDATE()"
    );

    return res.status(200).json({
      dataUser: rowCus[0],
      dataVoucher: rowVou,
      nameAdmin,
    });
  } catch (error) {
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let giveVoucherCustomer = async (req, res) => {
  const { idKH, idVoucher } = req.body;

  // Lấy ngày hiện tại trong mã JavaScript
  const currentDate = new Date();

  const [rowVou, fieldsVou] = await pool.execute(
    "SELECT soluong FROM voucher where idVoucher= ?", [idVoucher]
  );
  var sl = rowVou[0].soluong;
  console.log(sl)
  try {

    if(sl > 0) {
      await pool.execute(
        "INSERT INTO usedvoucher(idVoucher, ngayTang, idKH) VALUES (?, ?, ?)",
        [idVoucher, currentDate, idKH]
      );
  
      await pool.execute(
        "UPDATE voucher SET soluong= ? WHERE idVoucher= ?",
        [sl - 1, idVoucher]
      );
  
      return res.status(200).json({
        message: "Tặng Voucher thành công!",
      });
    } else {
      return res.status(500).json({ error: "Hết voucher!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Có lỗi xảy ra!" });
  }
};

/* Admin */
let getInfoAdmin = async (req, res) => {
  try {
    const [rowsAdmin, fieldsAdmin] = await pool.execute(
      "select * from admin where idAdmin=0"
    );
    return res.status(200).json({
      dataAdmin: rowsAdmin[0],
    });
  } catch (error) {
    console.log("Không thể hiển thị!", error);
    return res.status(500).json({ error: "Không thể hiển thị!" });
  }
};

let updateAdmin = async (req, res) => {
  try {
    let { nameAdmin, email } = req.body;

    await pool.execute(
      "update admin set nameAdmin=? , email= ? where idAdmin=0",
      [nameAdmin, email]
    );

    const [rows, fields] = await pool.execute(
      "select * from admin where idAdmin=0"
    );
    return res.status(200).json({
      dataAdmin: rows[0],
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không cập nhật được!" });
  }
};

let updateNewPassword = async (req, res) => {
  let { currentPassword, newPassword } = req.body;
  const [rows, fields] = await pool.execute(
    "select passAdmin from admin where idAdmin=0"
  );
  const passAdminValue = rows[0].passAdmin;

  if (passAdminValue == currentPassword) {
    await pool.execute("update admin set passAdmin = ? where idAdmin=0", [
      newPassword,
    ]);
    let [admin, fields] = await pool.execute("select * from admin");
    return res.status(200).json({
      dataAdmin: admin[0],
    });
  } else {
    return res.status(500).json({ error: "\n Mật khẩu hiện tại không đúng!" });
  }
};

/* Khách hàng */
let loginCustomer = async (req, res) => {


  try {
let { email, password } = req.body;

  const [rows, fields] = await pool.execute(
    "select email, password from customer where email= ? and password= ? and trangthai=1",
    [email, password]
  );

      if (rows && rows.length > 0) {
        const emailValue = rows[0].email;
        const passValue = rows[0].password;
  
        if (emailValue == email && password == passValue) {
          console.log("Đăng nhập thành công!");
          return res.status(200).json({
            dataUser: rows[0],
          });
        } else {
          console.log("Đăng nhập không thành công 1!");
          return res
            .status(400)
            .json({ error: "\n Đăng nhập không thành công 1!" });
        }
      } else {
        console.log("Đăng nhập không thành công 2!");
        return res
          .status(500)
          .json({ error: "\n Đăng nhập không thành công 2!" });
      }


  } catch (error) {
        console.log("Đăng nhập không thành công 3!");
    return res.status(500).json({ error: "\n Đăng nhập không thành công 3!" });
  }
};

let registerCustomer = async (req, res) => {
  let { username, password, address, email, phonenumber, dateofbirth } =
    req.body;

  try {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM customer WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      // Nếu đã tồn tại email trong CSDL, trả về thông báo lỗi
      return res.status(400).json({
        message: "Email đã tồn tại trong hệ thống.",
      });
    }

    await pool.execute(
      "insert into customer(username, password, address, email, phonenumber, dateofbirth) values (?, ?, ?, ?, ?, ?)",
      [username, password, address, email, phonenumber, dateofbirth]
    );

    return res.status(200).json({
      message: "Đăng ký thành công!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Đăng ký không thành công!",
    });
  }
};

let getCustomer = async (req, res) => {
  let email = req.params.email;

  try {
    let [rows, fields] = await pool.execute(
      "SELECT *, DATE_FORMAT(dateofbirth, '%d/%m/%Y') as formatted_dateofbirth from customer where email = ?",
      [email]
    );

    return res.status(200).json({
      dataUser: rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Không thể hiển thị người dùng!",
    });
  }
};

let updateInfo = async (req, res) => {
  let { username, address, email, phonenumber, emailOld } = req.body;

  try {
    await pool.execute(
      "update customer set username= ?, address= ?, email= ?, phonenumber= ? where email= ?",
      [username, address, email, phonenumber, emailOld]
    );

    return res.status(200).json({
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    console.log("Không cập nhật được!", error);
    return res.status(500).json({ error: "Không hiển thị được!" });
  }
};

let getMyVoucher = async (req, res) => {
  let email = req.params.email;

  try {
    let [rowsCus, fieldsCus] = await pool.execute(
      "SELECT *, DATE_FORMAT(dateofbirth, '%d/%m/%Y') as formatted_dateofbirth from customer where email = ?",
      [email]
    );
    let idKH = rowsCus[0].idKH;

    const [usedVou, fieldsUsed] = await pool.execute(
      "SELECT v.idVoucher, v.nameVoucher, v.giam, v.toida, DATE_FORMAT(uv.ngayTang, '%d/%m/%Y') as formatted_ngayTang, DATE_FORMAT(v.ngayhethan, '%d/%m/%Y') as formatted_ngayhethan FROM voucher v INNER JOIN usedVoucher uv ON v.idVoucher = uv.idVoucher WHERE uv.idKH = ? and v.ngayhethan >= CURDATE() and uv.vcTrangThai = 1",
      [idKH]
    );

    // Lặp qua mảng usedVou để truy cập các thuộc tính
    const vouchersData = usedVou.map(voucher => ({
      idVoucher: voucher.idVoucher,
      nameVoucher: voucher.nameVoucher,
      giam: voucher.giam,
      toida:voucher.toida,
      ngayTang: voucher.formatted_ngayTang,
      ngayhethan: voucher.formatted_ngayhethan
    }));

    // console.log(vouchersData)

    return res.status(200).json({
      dataUser: rowsCus[0],
      dataVoucher: vouchersData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Không thể hiển thị voucher!",
    });
  }
};

let usedVoucher = async (req, res) => {
  let idVoucher = req.body.idVoucher;

  try {
    await pool.execute(
      "update usedVoucher set vcTrangThai=0 where idVoucher=?",
      [idVoucher]
    );

    return res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    return res.status(500).json({ error: "Không thể xóa voucher!" });
  }
};

let updatePasswordCustomer = async (req, res) => {
  let { currentPassword, newPassword, email} = req.body;
  const [rows, fields] = await pool.execute(
    "select password from customer where email= ?", [email]
  );
  const passValue = rows[0].password;

  if (passValue == currentPassword) {
    await pool.execute("update customer set password = ? where email=?", [
      newPassword, email
    ]);
  
    return res.status(200).json({
      message: "Cập nhật mật khẩu thành công!"
    });
  } else {

    console.log("Cập nhật mật khẩu thành công!")
    return res.status(500).json({ error: "\n Mật khẩu hiện tại không đúng!" });
  }
};

module.exports = {
  loginAdmin,
  getHomeAdmin,
  createCustomer,
  getAllCustomer,
  getSearch,
  deleteCustomer,
  getDetailCustomer,
  getCustomerBirthday,
  updateCustomer,
  updateCoinsCustomer,
  updatePointCustomer,
  getAllVoucher,
  getVoucherSearch,
  createVoucher,
  getUpdateVoucher,
  updateVoucher,
  deleteVoucher,
  getGiveVoucher,
  giveVoucherCustomer,
  getInfoAdmin,
  updateAdmin,
  updateNewPassword,
  /* Khách hàng */
  loginCustomer,
  registerCustomer,
  getCustomer,
  updateInfo,
  getMyVoucher,
  usedVoucher,
  updatePasswordCustomer
};
