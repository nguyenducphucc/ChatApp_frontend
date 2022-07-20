const Bt1 = (string) => {
  const lowerCaseString = string.toLowerCase();
  const characters = new Array(26);

  for (var i = 0; i < lowerCaseString.length; i++) {
    const intoCode = lowerCaseString[i].charCodeAt(0) - 97;
    if (characters[intoCode] === undefined) characters[intoCode] = 1;
    else characters[intoCode] += 1;
  }

  for (var j = 0; j < 26; j++) {
    if (characters[j] !== undefined)
      console.log(String.fromCharCode(j + 97), characters[j]);
  }
};

const Bt2a = (A, B) => {
  const numbers = Array(B + 1);
  const soNguyenTo = [];

  for (var i = 2; i <= B; i++) {
    if (numbers[i] === undefined) {
      if (i >= A) soNguyenTo.push(i);
      for (var j = 1; i * j <= B; j++) {
        numbers[i * j] = true;
      }
    }
  }

  console.log(soNguyenTo);
};

const Helper = (A, B) => {
  if (A === 0) return B;
  else if (A < B) return Helper(B % A, A);
  return Helper(B, A);
};
const Bt2b = (A, B) => {
  console.log("Uoc chung lon nhat la:", Helper(A, B));
};

const Bt3 = (time) => {
  const fabonacci = [1, 1];
  while (fabonacci.length <= time) {
    fabonacci.push(
      fabonacci[fabonacci.length - 1] + fabonacci[fabonacci.length - 2]
    );
  }
  console.log(fabonacci);
};

export default { Bt1, Bt2a, Bt2b, Bt3 };
