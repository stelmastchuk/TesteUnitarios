import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "../createStatement/CreateStatementError"
import { CreateStatementeTransferUseCase } from "./CreateStatementeTransferUseCase"




let createStatementeTransferUseCase: CreateStatementeTransferUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository


describe("Test Use Case", () => {

  beforeEach(() => {

    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementeTransferUseCase = new CreateStatementeTransferUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

  })



it("Should a be able to create statement tranfer for user destiny", async () => {

  const user1 =  await inMemoryUsersRepository.create({
    name: "teste1",
    email: "teste1@gmail.com",
    password: "teste123"
  })

  const user2 = await inMemoryUsersRepository.create({
    name: "teste2",
    email: "teste2@gmail.com",
    password: "teste123"
  })

  await inMemoryStatementsRepository.create({
    user_id: user1.id!,
    amount: 300,
    description: "teste deposito",
    type: OperationType.DEPOSIT,
  });

  const statemente  = await createStatementeTransferUseCase.execute({ user_id: user2.id!, amount : 100 , sender_id : user1.id, type: OperationType.TRANSFER , description : "Teste transfer"})

  expect(statemente.type).toEqual(OperationType.TRANSFER);

})


  it("Should not be able to create statement tranfer if users is invalid", () => {

    expect(async () => {


      const user1 = await inMemoryUsersRepository.create({
        name: "teste1",
        email: "teste1@gmail.com",
        password: "teste123"
      })

      const user2 = await inMemoryUsersRepository.create({
        name: "teste2",
        email: "teste2@gmail.com",
        password: "teste123"
      })

      await inMemoryStatementsRepository.create({
        user_id: user1.id!,
        amount: 300,
        description: "teste deposito",
        type: OperationType.DEPOSIT,
      });

       await createStatementeTransferUseCase.execute({
        user_id: "0b13c729-e2da-4b89-bba2-48f842c53478", amount: 100, sender_id: user1.id, type: OperationType.TRANSFER, description: "Teste transfer"
      })

    }).rejects.toBeInstanceOf(CreateStatementError);

  })

  it("Should not be able to create statement tranfer if users-sender is invalid", () => {

    expect(async () => {


      const user1 = await inMemoryUsersRepository.create({
        name: "teste1",
        email: "teste1@gmail.com",
        password: "teste123"
      })

      const user2 = await inMemoryUsersRepository.create({
        name: "teste2",
        email: "teste2@gmail.com",
        password: "teste123"
      })

      await inMemoryStatementsRepository.create({
        user_id: user1.id!,
        amount: 300,
        description: "teste deposito",
        type: OperationType.DEPOSIT,
      });

      await createStatementeTransferUseCase.execute({
        user_id: user2.id!, amount: 100, sender_id: "0b13c729-e2da-4b89-bba2-48f842c53478", type: OperationType.TRANSFER, description: "Teste transfer" })

    }).rejects.toBeInstanceOf(CreateStatementError);

  })


  it("Should not be able to create statement tranfer if users-sender have insuffienct funds", () => {

    expect(async () => {


      const user1 = await inMemoryUsersRepository.create({
        name: "teste1",
        email: "teste1@gmail.com",
        password: "teste123"
      })

      const user2 = await inMemoryUsersRepository.create({
        name: "teste2",
        email: "teste2@gmail.com",
        password: "teste123"
      })

      await inMemoryStatementsRepository.create({
        user_id: user1.id!,
        amount: 300,
        description: "teste deposito",
        type: OperationType.DEPOSIT,
      });

      await createStatementeTransferUseCase.execute({
        user_id: user2.id!, amount: 400, sender_id: user1.id, type: OperationType.TRANSFER, description: "Teste transfer"
      })

    }).rejects.toBeInstanceOf(CreateStatementError);

  })


})





