// 6x + 2y = 16
// 3x - y = 1

// 3a + 4b = 43
// -2a + 3b = 11

document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();

  const equation = document
    .querySelector("textarea")
    .value.split("\n")
    .map((line) => line.trim());

  const result = solveSimultaneousEquations(equation[0], equation[1]);

  let resultMessage = ``;
  result.unknown.forEach((value, index) => {
    resultMessage += `${value} = ${result.solution[index]}<br/>`;
  });

  document.querySelector("#result").innerHTML = resultMessage;

  if (equation.length)
    document.querySelector("#calculator").style.display = "block";

  // Clear inital initial expression
  calculator.setBlank();

  let equation1Plot = equation[0]
    .replace(result.unknown[0], "x")
    .replace(result.unknown[1], "y");
  let equation2Plot = equation[1]
    .replace(result.unknown[0], "x")
    .replace(result.unknown[1], "y");

  calculator.setExpressions([
    { id: "graph1", latex: equation1Plot, color: Desmos.Colors.RED },
    { id: "graph2", latex: equation2Plot, color: Desmos.Colors.BLUE },
  ]);
});
