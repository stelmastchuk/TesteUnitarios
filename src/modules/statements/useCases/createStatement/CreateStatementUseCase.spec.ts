import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"


let createStatementUseCase: CreateStatementUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {

  beforeEach(() => {

    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

  })


  it("Should be able to create a new steatement", async () => {


    const user = await createUserUseCase.execute({ name: "vitor", email: "vitor@gmail.com", password: "1234" });

    const statement = await createStatementUseCase.execute({ user_id: user.id!, type: OperationType.DEPOSIT, amount: 500, description: "primeiro deposito" });

    expect(statement).toHaveProperty("id");


  })


  it("Should be able to create a new steatement", async () => {


    const user = await createUserUseCase.execute({ name: "vitor", email: "vitor@gmail.com", password: "1234" });

    await createStatementUseCase.execute({ user_id: user.id!, type: OperationType.DEPOSIT, amount: 500, description: "primeiro deposito" });

    const statement2 = await createStatementUseCase.execute({ user_id: user.id!, type: OperationType.WITHDRAW, amount: 500, description: "primeiro saque" });

    expect(statement2).toHaveProperty("id");


  })


  it("Should not be able to create a new steatement with id not exists", () => {

    expect(async () => {

      await createStatementUseCase.execute({ user_id: "32532875239shdus", type: OperationType.DEPOSIT, amount: 500, description: "primeiro deposito" });


    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);


  });


  it("Should not be able to create a new steatement (type : withdraw) with amount > banlance", async () => {


    const user = await createUserUseCase.execute({ name: "vitor", email: "vitor@gmail.com", password: "1234" });

    await createStatementUseCase.execute({ user_id: user.id!, type: OperationType.DEPOSIT, amount: 500, description: "primeiro deposito" });

    expect(async () => {

      await createStatementUseCase.execute({ user_id: user.id!, type: OperationType.WITHDRAW, amount: 1000, description: "primeiro deposito" });

    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);


  });






})
