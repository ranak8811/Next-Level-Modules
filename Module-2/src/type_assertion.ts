type Status = "pending" | "approved" | "rejected";

const someStatus: string = "hello";

const showStatus = (status: Status) => {
  console.log("Your status: ", status);
};

showStatus(someStatus as Status);

interface Config {
  port?: number;
}

const config: Config = {
  port: 5000,
};

// const currentPort: number = config.port!
const currentPort: number = config.port as number;

console.log(currentPort);

const configuration = {
  port: 8080,
  prefix: "/api/v1",
} as const;

// configuration.port = 4000
