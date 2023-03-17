const findCoefficents = (unknowns, eqn) => {
  const unknownValues = [];

  const lhsCoeffs = unknowns.map((unknown) => {
    const matches = eqn.match(new RegExp(`[+-]?\\d*${unknown}`, "g"));
    matches && unknownValues.push(...matches);

    if (matches) {
      return matches.reduce((acc, match) => {
        if (match === unknown) {
          return acc + 1;
        } else if (match === `+${unknown}`) {
          return acc + 1;
        } else if (match === `-${unknown}`) {
          return acc - 1;
        } else {
          return acc + parseInt(match.slice(0, -1));
        }
      }, 0);
    } else {
      return 0;
    }
  });

  const coefficientsMappedToUnknowns = unknowns.reduce((acc, unknown, i) => {
    acc[unknown] = lhsCoeffs[i];
    return acc;
  }, {});

  // A variable that has all unknowns removed from the equation
  let constant = eqn;
  let index = unknownValues.length;
  while (index--) {
    constant = constant.replace(unknownValues[index], "");
  }
  constant = eval(constant);

  return { ...coefficientsMappedToUnknowns, constant: constant ? constant : 0 };
};

function parse(eqn) {
  // Remove all spaces from the equation
  eqn = eqn.replace(/\s/g, "");
  let unknowns = Array.from(new Set(eqn.match(/[+-]?[a-z]/g))).sort();

  // Map through the unknowns and if the unknown length is greater than 1, then replace it with the first character and recursively call the function again
  unknowns.map((unknown) => {
    if (unknown.length > 1) {
      eqn = eqn.replace(unknown, unknown[0] + 1 + unknown[1]);
      unknowns[unknowns.indexOf(unknown)] = unknown[1];
      return parse(eqn);
    }
  });

  unknowns = Array.from(new Set(unknowns)).sort();

  const lhsEqn = eqn.split("=")[0];
  const rhsEqn = eqn.split("=")[1];

  // find all coefficients of unknowns in the LHS
  const lhsCoeffs = findCoefficents(unknowns, lhsEqn);

  // find all coefficients of unknowns in the RHS
  const rhsCoeffs = findCoefficents(unknowns, rhsEqn);

  let parsedEqn = {};

  unknowns.map((unknown) => {
    parsedEqn[unknown] = lhsCoeffs[unknown] - rhsCoeffs[unknown];
    parsedEqn["constant"] = lhsCoeffs["constant"] - rhsCoeffs["constant"];
  });

  let coefficients = [];
  for (const key of unknowns) {
    coefficients.push(parsedEqn[key]);
  }
  coefficients.push(parsedEqn["constant"]);

  return { unknowns, coefficients };
}

function solveSimultaneousEquations(eqn1, eqn2) {
  let eqn1Coefficients = parse(eqn1).coefficients;
  let eqn2Coefficients = parse(eqn2).coefficients;
  let unknown = Array.from(
    new Set(parse(eqn1).unknowns.concat(parse(eqn2).unknowns))
  ).sort();

  let a11 = eqn1Coefficients[0];
  let a12 = eqn1Coefficients[1];
  let b1 = eqn1Coefficients[2] * -1;
  let a21 = eqn2Coefficients[0];
  let a22 = eqn2Coefficients[1];
  let b2 = eqn2Coefficients[2] * -1;

  // Create matrix A
  const A = [
    [a11, a12],
    [a21, a22],
  ];

  // Create matrix B
  const B = [[b1], [b2]];

  // Calculate the inverse of A
  const A_inv = [
    [A[1][1], -A[0][1]],
    [-A[1][0], A[0][0]],
  ];
  const det_A = A[0][0] * A[1][1] - A[0][1] * A[1][0];

  // Multiply the inverse of A by B to get the solution
  const solution = [
    [(A_inv[0][0] * B[0][0] + A_inv[0][1] * B[1][0]) / det_A],
    [(A_inv[1][0] * B[0][0] + A_inv[1][1] * B[1][0]) / det_A],
  ];

  return { unknown, solution };
}
