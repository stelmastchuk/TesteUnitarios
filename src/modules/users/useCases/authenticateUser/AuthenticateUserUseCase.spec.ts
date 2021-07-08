import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";



let inMemoryUserRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe("Authenticate User", () => {

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  })

  it("Should a be able to authenticate user", async () => {

    const user = await createUserUseCase.execute({ name: "vitor", email: "vitor@gmail.com", password: "1234" });

    const usertoken = await authenticateUserUseCase.execute({ email: "vitor@gmail.com", password: "1234" });

    expect(usertoken).toHaveProperty("token");

  })


  it("Not be able to create a new token with passwors is incorrect ", () => {

    expect(async () => {

      const user = ({ name: "vitor", email: "vitor@gmail.com", password: "1234" });

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });

      await authenticateUserUseCase.execute({ email: "vitor@gmail.com", password: "12345" });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);


  })


  it("Not be able to create a new token with email is not exists ", () => {

    expect(async () => {

      const user = ({ name: "vitor", email: "vitor@gmail.com", password: "1234" });

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      });

      await authenticateUserUseCase.execute({ email: "vitorstelmastchuk@gmail.com", password: "1234" });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);


  })








});
