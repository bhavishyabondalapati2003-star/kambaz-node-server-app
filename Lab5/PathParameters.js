export default function PathParameters(app) {
  // ADD: a + b
  const add = (req, res) => {
    const { a, b } = req.params;
    const sum = parseInt(a) + parseInt(b);
    res.send(sum.toString());
  };

  // SUBTRACT: a - b
  const subtract = (req, res) => {
    const { a, b } = req.params;
    const difference = parseInt(a) - parseInt(b);
    res.send(difference.toString());
  };

  // MULTIPLY: a * b
  const multiply = (req, res) => {
    const { a, b } = req.params;
    const product = parseInt(a) * parseInt(b);
    res.send(product.toString());
  };

  // DIVIDE: a / b
  const divide = (req, res) => {
    const { a, b } = req.params;
    if (parseInt(b) === 0) {
      res.send("Cannot divide by zero");
      return;
    }
    const result = parseInt(a) / parseInt(b);
    res.send(result.toString());
  };

  // Route definitions
  app.get("/lab5/add/:a/:b", add);
  app.get("/lab5/subtract/:a/:b", subtract);
  app.get("/lab5/multiply/:a/:b", multiply);
  app.get("/lab5/divide/:a/:b", divide);
}
