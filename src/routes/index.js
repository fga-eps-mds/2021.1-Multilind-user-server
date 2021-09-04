export function setUpRoutes(app) {
  app.use("/api/auth", (req, res) => {
    return res.send("server is up!!");
  });
}
