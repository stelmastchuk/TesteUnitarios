import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"


let inMemoryUserRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create a user", () => {

  beforeEach(() => {

    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);

  });

  it("Should a be able to create a new user", async () => {

    const user = await createUserUseCase.execute({ name: "vitor", email: "vitor@gmail.com", password: "1234" });

    expect(user).toHaveProperty("id");

  })


  it("Not be able to create a new user with email already exists", () => {

    expect(async () => {

      const user = ({ name: "vitor", email: "vitor@gmail.com", password: "1234" });

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });
    }).rejects.toBeInstanceOf(CreateUserError);


  })












})
