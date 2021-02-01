import * as Express from "express";

const router = Express.Router();
const CONFIG = {
  USERNAME: "arislab",
  PASSWORD: "arislab@admin",
};

router.get("/", (req: any, res: any) => {
  if (req.cookies.isAuth) {
    res.redirect("/reports");
    return;
  }
  res.render("login");
});

router.get("/process", (req: any, res: any) => {
  const { username, password } = req.query;

  if (CONFIG.USERNAME !== username && CONFIG.PASSWORD !== password) {
    res
      .status(400)
      .send({ success: false, message: "Username or password incorrect!" });
    return;
  }

  res.cookie("isAuth", true);
  res.status(200).send({ success: true });
});

module.exports = router;
