function allowMethods(allowedMethods) {
    return (req, res, next) => {
      if (!allowedMethods.includes(req.method)) {
        return res.status(405).json({ error: "Method Not Allowed" });
      }
      next();
    };
  }
  
  module.exports = allowMethods;
  