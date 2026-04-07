const auth = (req, res, next) => {
  const adminSecret = req.header('x-admin-password');
  if (adminSecret === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized: Admin access only" });
  }
};

module.exports = auth;