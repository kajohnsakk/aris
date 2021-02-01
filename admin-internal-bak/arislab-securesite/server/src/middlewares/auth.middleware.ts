module.exports = () => {
  return (req: any, res: any, next: any) => {
    if (!req.cookies.isAuth) {
      res.render("login");
      return;
    }
    next();
  };
};
