type User = {
  name: string;
  address?: {
    street: string;
  };
} | null;

const loggedInUser: User = {
  name: "Anwar",
  address: {
    street: "Dhaka",
  },
};

const showUser = (user: User) => {
  if (user && user.address) {
    console.log(user.address.street);

    return;
  }

  throw new Error("User not found");
};
