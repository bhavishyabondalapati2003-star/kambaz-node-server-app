export default function QueryParameters(app) {
  const calculator = (req, res) => {
    const { a, b, operation } = req.query;

    const numA = parseInt(a);
    const numB = parseInt(b);

    let result = 0;

    switch (operation) {
      case "add":
        result = numA + numB;
        break;
      case "subtract":
        result = numA - numB;
        break;
      case "multiply":
        result = numA * numB;
        break;
      case "divide":
        if (numB === 0) {
          result = "Cannot divide by zero";
        } else {
          result = numA / numB;
        }
        break;
      default:
        result = "Invalid operation";
    }

    res.send(result.toString());
  };

  app.get("/lab5/calculator", calculator);
}
