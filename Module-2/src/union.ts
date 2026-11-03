const greeting = () => {
  return console.log("Hey there union...");
};

// greeting();

type Admin = { id: number; role: "admin"; privileges: string[] };
type Member = { id: number; role: "member"; plan: string[] };

type User = Admin | Member;

const user: User = { id: 123, role: "member", plan: ["hey", "member"] };

console.log(user);
