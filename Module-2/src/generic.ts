const wrapInArray = <T>(value: T) => {
  return [value];
};

const stringArr = wrapInArray<string>("abc");
const numberArr = wrapInArray<number>(123);

const stringUpperArr = stringArr.map((item) => item.toUpperCase());
console.log(stringUpperArr);

console.log(numberArr);

interface User {
  name: string;
  role: string;
}

interface Blog {
  title: string;
  description: string;
  date: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  statusCode: number;
}

type UserResponse = ApiResponse<User>;
// type BlogResponse = ApiResponse<Blog>;

const userRes: UserResponse = {
  data: {
    name: "Rana",
    role: "Normal User",
  },
  success: true,
  statusCode: 200,
};

const blogRes: ApiResponse<Blog> = {
  data: {
    title: "Rana is learning",
    description: "Learning typescript",
    date: "16-12-2026",
  },
  success: true,
  statusCode: 200,
};

console.log(userRes);
console.log(blogRes);
