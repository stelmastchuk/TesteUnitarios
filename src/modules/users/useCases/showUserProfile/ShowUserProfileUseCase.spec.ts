import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";



let inMemoryUserRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Create a user", () => {

  beforeEach(() => {

    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);

  });

  it("Should a be able to list a profile", async () => {

    const user = await createUserUseCase.execute({ name: "vitor", email: "vitor@gmail.com", password: "1234" });

    const listProfile = await showUserProfileUseCase.execute(user.id!);

    expect(listProfile).toEqual(user);


  });



  it("Not be able to listprofile with id not exists", () => {

    expect(async () => {

      await showUserProfileUseCase.execute("2e58705d-3c14-4a00-bfc6-561e16b9378134");


    }).rejects.toBeInstanceOf(ShowUserProfileError);


  })


});

