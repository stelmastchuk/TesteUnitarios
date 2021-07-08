import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"



let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getStatementOperationUseCase: GetStatementOperationUseCase


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {

  beforeEach(() => {

    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

  })


  it("Should be able to get balance from user", async () => {


    const user = await createUserUseCase.execute({ name: "vitor", email: "vitor@gmail.com", password: "1234" });

    const statement = await createStatementUseCase.execute({ user_id: user.id!, type: OperationType.DEPOSIT, amount: 500, description: "primeiro deposito" });


    const statement2 = await getStatementOperationUseCase.execute({ user_id: user.id!, statement_id: statement.id! });


    expect(statement2).toEqual(statement);


  })



  it("Should not be get statement from user with id not exists ", async () => {

    const user = await createUserUseCase.execute({ name: "vitor", email: "vitor@gmail.com", password: "1234" });

    const statement = await createStatementUseCase.execute({ user_id: user.id!, type: OperationType.DEPOSIT, amount: 500, description: "primeiro deposito" });

    expect(async () => {

      await getStatementOperationUseCase.execute({ user_id: "23523523532dssdgsdg", statement_id: statement.id! });

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);


  });


  it("Should not be get statement from user with no have statement ID ", async () => {

    const user = await createUserUseCase.execute({ name: "vitor", email: "vitor@gmail.com", password: "1234" });

    await createStatementUseCase.execute({ user_id: user.id!, type: OperationType.DEPOSIT, amount: 500, description: "primeiro deposito" });

    expect(async () => {

      await getStatementOperationUseCase.execute({ user_id: user.id!, statement_id: "324234235sdfsdfd" });

    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);


  });









})
