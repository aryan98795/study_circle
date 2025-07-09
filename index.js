const obj = [
  { name: "Abhishek", age: 22 },
  { name: "beenu", age: 22 },
];

obj.forEach((e) => {
  if (e.name === "Abhishek") {
    e.age = 23;
}
console.log(e);
});
